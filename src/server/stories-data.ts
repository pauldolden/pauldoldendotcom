// ============================================================
// Story data loaders — plain server-side functions (no TanStack
// imports), shared by the createServerFn layer (stories.ts) and the
// RSS server route.
//
// Source priority (always read INSIDE these functions, never at module scope):
//   1. R2 binding `STORIES` (wrangler.jsonc r2_buckets) — private, native, prod.
//   2. STORIES_R2_BASE_URL — optional public-URL fetch fallback.
//   3. In-repo sample (currently empty → /words shows empty states).
//
// R2 object layout (bucket: pauldoldendotcom-cdn):
//   catalog.json                 -> { stories: [...] }
//   <storyId>/<chapterId>.md     -> chapter Markdown (+ ::: directives)
// ============================================================
import { sampleCatalog, sampleChapterBody } from '../content/stories.sample'
import { mdToBlocks } from './markdown'

// The `STORIES` R2 binding, or null when not running on Workers (dev node,
// tests, or no binding configured). `cloudflare:workers` only resolves in the
// Worker runtime, so the import is dynamic + guarded.
async function getBucket(): Promise<any> {
  try {
    const mod: any = await import('cloudflare:workers')
    return mod?.env?.STORIES ?? null
  } catch {
    return null
  }
}

function trimBase(base: string) {
  return base.replace(/\/$/, '')
}

export async function loadCatalog() {
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
