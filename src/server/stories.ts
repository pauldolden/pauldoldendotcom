// ============================================================
// Story data layer — server functions over the R2-backed loaders
// (see ./stories-data). R2 access + env reads stay on the server
// even though route loaders are isomorphic.
// ============================================================
import { createServerFn } from '@tanstack/react-start'

import { loadCatalog, loadChapterBody } from './stories-data'

/** Full catalog (story metadata + per-story TOC). */
export const getCatalog = createServerFn().handler(async () => {
  return await loadCatalog()
})

/** One serial + its chapter list. Null when the slug is unknown. */
export const getStoryBundle = createServerFn()
  .validator((d: { storyId: string }) => ({ storyId: String(d.storyId) }))
  .handler(async ({ data }) => {
    const catalog = await loadCatalog()
    const story = catalog.stories.find((s: { id: string }) => s.id === data.storyId)
    if (!story) return null
    return { story, chapters: story.toc ?? [] }
  })

/** One chapter: story meta + chapter meta + body blocks + prev/next. Null when missing. */
export const getChapter = createServerFn()
  .validator((d: { storyId: string; chapterId: string }) => ({
    storyId: String(d.storyId),
    chapterId: String(d.chapterId),
  }))
  .handler(async ({ data }) => {
    const catalog = await loadCatalog()
    const story = catalog.stories.find((s: { id: string }) => s.id === data.storyId)
    if (!story) return null
    const toc = story.toc ?? []
    const idx = toc.findIndex((c: { index: number }) => String(c.index) === data.chapterId)
    if (idx === -1) return null
    const chapter = toc[idx]
    const body = await loadChapterBody(data.storyId, data.chapterId, chapter.title)
    return {
      story,
      chapter,
      blocks: body.blocks,
      prev: toc[idx - 1] ?? null,
      next: toc[idx + 1] ?? null,
    }
  })
