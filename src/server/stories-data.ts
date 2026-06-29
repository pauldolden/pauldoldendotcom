// ============================================================
// Story data loaders — plain server-side functions (no TanStack
// imports), so both the createServerFn layer (stories.ts) and the
// RSS server route can share them. Reads R2 over HTTPS when
// STORIES_R2_BASE_URL is set; falls back to the in-repo sample.
// Always read env INSIDE these functions, never at module scope.
// ============================================================
import { sampleCatalog, sampleChapterBody } from '../content/stories.sample'
import { mdToBlocks } from './markdown'

export async function loadCatalog() {
  const base = process.env.STORIES_R2_BASE_URL
  if (base) {
    try {
      const res = await fetch(`${base.replace(/\/$/, '')}/catalog.json`)
      if (res.ok) return await res.json()
      console.warn(`[stories] catalog.json ${res.status} from R2 — using sample`)
    } catch (err) {
      console.warn('[stories] R2 catalog fetch failed — using sample', err)
    }
  }
  return sampleCatalog
}

export async function loadChapterBody(storyId: string, chapterId: string, title?: string) {
  const base = process.env.STORIES_R2_BASE_URL
  if (base) {
    try {
      // Chapters are authored as Markdown (with `:::` directives) and parsed
      // into the block model the reader renders. See ./markdown.
      const res = await fetch(`${base.replace(/\/$/, '')}/${storyId}/${chapterId}.md`)
      if (res.ok) return mdToBlocks(await res.text())
      console.warn(`[stories] ${storyId}/${chapterId}.md ${res.status} from R2 — using sample`)
    } catch (err) {
      console.warn('[stories] R2 chapter fetch failed — using sample', err)
    }
  }
  return sampleChapterBody(storyId, chapterId, title)
}
