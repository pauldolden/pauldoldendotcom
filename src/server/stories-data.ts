// ============================================================
// Story data loaders + writers — plain server-side functions (no TanStack
// imports), shared by the createServerFn layers (stories.ts public reads,
// admin.ts writes) and the RSS server route.
//
// Source of truth: the `STORIES` R2 binding (wrangler.jsonc r2_buckets).
//   1. R2 binding `STORIES` — private, native, the only writable source.
//   2. STORIES_R2_BASE_URL — optional public-URL READ fallback (no writes).
//   3. In-repo sample — empty by design → /words shows true empty states.
//
// R2 object layout (bucket: pauldoldendotcom-cdn):
//   catalog.json                 -> { stories: [...] }
//   <storyId>/<chapterId>.md     -> chapter Markdown (+ ::: directives)
//
// Publish model: a story/chapter is PUBLIC only when `published === true`.
// loadCatalog() (public) filters to published; loadCatalogRaw() (admin) does
// not. Always read INSIDE these functions, never at module scope.
// ============================================================
import { sampleCatalog, sampleChapterBody } from '../content/stories.sample'
import { mdToBlocks } from './markdown'

// The `STORIES` R2 binding, or null when not running on Workers (node tests,
// or no binding configured). `cloudflare:workers` only resolves in the Worker
// runtime, so the import is dynamic + guarded.
async function getBucket(): Promise<any> {
  try {
    const mod: any = await import('cloudflare:workers')
    return mod?.env?.STORIES ?? null
  } catch {
    return null
  }
}

async function requireBucket(): Promise<any> {
  const bucket = await getBucket()
  if (!bucket) {
    throw new Error('R2 binding STORIES is required for writes (run on Workers or `vite dev`).')
  }
  return bucket
}

function trimBase(base: string) {
  return base.replace(/\/$/, '')
}

// ── Reads ──────────────────────────────────────────────────

/** Full catalog, drafts included. Admin-only — never expose to public pages. */
export async function loadCatalogRaw(): Promise<{ stories: any[] }> {
  const bucket = await getBucket()
  if (bucket) {
    try {
      const obj = await bucket.get('catalog.json')
      if (obj) return JSON.parse(await obj.text())
      console.warn('[stories] catalog.json missing in R2 — using sample')
      return sampleCatalog
    } catch (err) {
      console.warn('[stories] R2 catalog read failed — using sample', err)
      return sampleCatalog
    }
  }

  const base = process.env.STORIES_R2_BASE_URL
  if (base) {
    try {
      const res = await fetch(`${trimBase(base)}/catalog.json`)
      if (res.ok) return await res.json()
      console.warn(`[stories] catalog.json ${res.status} from R2 URL — using sample`)
    } catch (err) {
      console.warn('[stories] R2 URL catalog fetch failed — using sample', err)
    }
  }

  return sampleCatalog
}

/**
 * Public catalog: only published stories, and within each, only published
 * chapters. `chapters` is recomputed from the visible TOC so counts never
 * leak drafts. WIP stories (published, empty/zero published chapters) still
 * show as shelf cards.
 */
export async function loadCatalog(): Promise<{ stories: any[] }> {
  const raw = await loadCatalogRaw()
  const stories = (raw.stories ?? [])
    .filter((s: any) => s && s.published === true)
    .map((s: any) => {
      const toc = (s.toc ?? []).filter((c: any) => c && c.published === true)
      return { ...s, toc, chapters: toc.length }
    })
  return { stories }
}

/** Parsed chapter body (block model) for the reader. Falls back per source-priority. */
export async function loadChapterBody(storyId: string, chapterId: string, title?: string) {
  const key = `${storyId}/${chapterId}.md`

  const bucket = await getBucket()
  if (bucket) {
    try {
      const obj = await bucket.get(key)
      if (obj) return mdToBlocks(await obj.text())
      console.warn(`[stories] ${key} missing in R2 — using sample`)
      return sampleChapterBody(storyId, chapterId, title)
    } catch (err) {
      console.warn('[stories] R2 chapter read failed — using sample', err)
      return sampleChapterBody(storyId, chapterId, title)
    }
  }

  const base = process.env.STORIES_R2_BASE_URL
  if (base) {
    try {
      const res = await fetch(`${trimBase(base)}/${key}`)
      if (res.ok) return mdToBlocks(await res.text())
      console.warn(`[stories] ${key} ${res.status} from R2 URL — using sample`)
    } catch (err) {
      console.warn('[stories] R2 URL chapter fetch failed — using sample', err)
    }
  }

  return sampleChapterBody(storyId, chapterId, title)
}

/** Raw chapter Markdown (for the admin editor). Null when absent. */
export async function loadChapterMd(storyId: string, chapterId: string): Promise<string | null> {
  const key = `${storyId}/${chapterId}.md`

  const bucket = await getBucket()
  if (bucket) {
    const obj = await bucket.get(key)
    return obj ? await obj.text() : null
  }

  const base = process.env.STORIES_R2_BASE_URL
  if (base) {
    const res = await fetch(`${trimBase(base)}/${key}`)
    return res.ok ? await res.text() : null
  }

  return null
}

// ── Writes (R2 binding required) ───────────────────────────

export async function putCatalog(catalog: { stories: any[] }): Promise<void> {
  const bucket = await requireBucket()
  await bucket.put('catalog.json', JSON.stringify(catalog, null, 2), {
    httpMetadata: { contentType: 'application/json; charset=utf-8' },
  })
}

export async function putChapterMd(storyId: string, chapterId: string, md: string): Promise<void> {
  const bucket = await requireBucket()
  await bucket.put(`${storyId}/${chapterId}.md`, md, {
    httpMetadata: { contentType: 'text/markdown; charset=utf-8' },
  })
}

export async function deleteObject(key: string): Promise<void> {
  const bucket = await requireBucket()
  await bucket.delete(key)
}
