import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

// Admin layout for /words/admin*. Cloudflare Access protects this path at the
// edge in prod; the write server functions re-verify the Access JWT (see
// src/server/access.ts). noindex so the editor never lands in search results.
export const Route = createFileRoute('/words/admin')({
  head: () => ({
    meta: [
      { title: 'Admin — words' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminLayout,
  errorComponent: AdminError,
})

function AdminLayout() {
  return (
    <div style={{ maxWidth: 'var(--width-content)', margin: '0 auto', padding: '40px 28px 96px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--magenta-400)' }}>
          § Admin · /words
        </div>
        <Link to="/words" style={{ color: 'var(--cyan-400)', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontSize: 14 }}>
          View site →
        </Link>
      </div>
      <Outlet />
    </div>
  )
}

function AdminError({ error }: { error: Error }) {
  return (
    <div style={{ maxWidth: 'var(--width-content)', margin: '0 auto', padding: '80px 28px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color: 'var(--text-strong)', margin: 0 }}>Not authorized</h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 17, color: 'var(--text-muted)', marginTop: 14, maxWidth: 560 }}>
        This area is gated by Cloudflare Access. Sign in with an allowed account, or check the Access configuration.
      </p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-faint)', marginTop: 18 }}>{error?.message}</p>
    </div>
  )
}
