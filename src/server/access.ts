// ============================================================
// Cloudflare Access guard for the /words admin write endpoints.
//
// In prod, CF Access sits in FRONT of /words/admin* and the admin server
// functions — every authenticated request carries a signed JWT in the
// `Cf-Access-Jwt-Assertion` header (and a `CF_Authorization` cookie).
// We verify that JWT here (signature against the team JWKS, plus aud / iss /
// exp / email-allowlist) so the write fns can't be called by forging the
// header — defence-in-depth behind the edge policy.
//
// Config (non-secret — set as wrangler `vars`, see wrangler.jsonc):
//   CF_ACCESS_TEAM_DOMAIN  e.g. https://pauldolden.cloudflareaccess.com
//   CF_ACCESS_AUD          the Access application's AUD (Audience) tag
//   ADMIN_EMAILS           comma-separated allowlist (e.g. pauldolden@gmail.com)
//
// Dev (vite/workerd, no Access in front) is bypassed via import.meta.env.DEV,
// which Vite statically replaces with `false` in the deployed Worker bundle —
// so the bypass cannot exist in production.
// ============================================================
import { getRequestHeader } from '@tanstack/react-start/server'

const JWKS_PATH = '/cdn-cgi/access/certs'

/** Read vars from the Worker env (cloudflare:workers), falling back to process.env. */
async function accessEnv() {
  let cf: Record<string, string | undefined> = {}
  try {
    const mod: any = await import('cloudflare:workers')
    cf = mod?.env ?? {}
  } catch {
    /* not on Workers (node test) — fall through to process.env */
  }
  const pick = (k: string) => cf[k] ?? process.env[k]
  return {
    teamDomain: (pick('CF_ACCESS_TEAM_DOMAIN') ?? '').replace(/\/$/, ''),
    aud: pick('CF_ACCESS_AUD') ?? '',
    emails: (pick('ADMIN_EMAILS') ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  }
}

function b64urlToBytes(s: string): Uint8Array {
  const norm = s.replace(/-/g, '+').replace(/_/g, '/')
  const pad = norm.length % 4 ? '='.repeat(4 - (norm.length % 4)) : ''
  const bin = atob(norm + pad)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

function b64urlToJson(s: string): any {
  return JSON.parse(new TextDecoder().decode(b64urlToBytes(s)))
}

// kid -> imported RSA verify key. JWKS keys rotate rarely; cache and refetch
// only when a token references an unknown kid.
const keyCache = new Map<string, CryptoKey>()

async function getVerifyKey(teamDomain: string, kid: string): Promise<CryptoKey | null> {
  const cached = keyCache.get(kid)
  if (cached) return cached

  const res = await fetch(`${teamDomain}${JWKS_PATH}`)
  if (!res.ok) throw new Error(`Access JWKS fetch failed: ${res.status}`)
  const { keys } = (await res.json()) as { keys: Array<JsonWebKey & { kid: string }> }

  for (const jwk of keys ?? []) {
    if (!jwk.kid) continue
    const key = await crypto.subtle.importKey(
      'jwk',
      { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify'],
    )
    keyCache.set(jwk.kid, key)
  }
  return keyCache.get(kid) ?? null
}

function readToken(): string | undefined {
  const header = getRequestHeader('cf-access-jwt-assertion')
  if (header) return header
  // Browser navigations carry the JWT as the CF_Authorization cookie instead.
  const cookie = getRequestHeader('cookie') ?? ''
  const m = cookie.match(/(?:^|;\s*)CF_Authorization=([^;]+)/)
  return m?.[1]
}

export class NotAuthorizedError extends Error {
  constructor(msg = 'Not authorized') {
    super(msg)
    this.name = 'NotAuthorizedError'
  }
}

/**
 * Verify the current request is an authenticated Access user on the allowlist.
 * Returns the verified email. Throws NotAuthorizedError otherwise.
 * Bypassed in dev (no Access edge in front of localhost).
 */
export async function requireAdmin(): Promise<string> {
  if (import.meta.env.DEV) return 'dev@localhost'

  const { teamDomain, aud, emails } = await accessEnv()
  if (!teamDomain || !aud || emails.length === 0) {
    throw new NotAuthorizedError('Access not configured (CF_ACCESS_* / ADMIN_EMAILS missing)')
  }

  const token = readToken()
  if (!token) throw new NotAuthorizedError('Missing Access token')

  const parts = token.split('.')
  if (parts.length !== 3) throw new NotAuthorizedError('Malformed Access token')
  const [h, p, sig] = parts

  let head: any
  let payload: any
  try {
    head = b64urlToJson(h)
    payload = b64urlToJson(p)
  } catch {
    throw new NotAuthorizedError('Unreadable Access token')
  }

  if (head.alg !== 'RS256' || !head.kid) throw new NotAuthorizedError('Unexpected token alg')

  const key = await getVerifyKey(teamDomain, head.kid)
  if (!key) throw new NotAuthorizedError('Unknown signing key')

  const ok = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    b64urlToBytes(sig),
    new TextEncoder().encode(`${h}.${p}`),
  )
  if (!ok) throw new NotAuthorizedError('Bad token signature')

  // Claims. `aud` may be a string or array.
  const auds: string[] = Array.isArray(payload.aud) ? payload.aud : [payload.aud]
  if (!auds.includes(aud)) throw new NotAuthorizedError('Token aud mismatch')
  if (payload.iss !== teamDomain) throw new NotAuthorizedError('Token iss mismatch')
  const nowSec = Math.floor(Date.now() / 1000)
  if (typeof payload.exp === 'number' && payload.exp < nowSec) {
    throw new NotAuthorizedError('Token expired')
  }

  const email = String(payload.email ?? '').toLowerCase()
  if (!email || !emails.includes(email)) throw new NotAuthorizedError('Email not allowed')

  return email
}
