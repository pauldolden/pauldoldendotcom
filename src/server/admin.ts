// ============================================================
// Admin write API for /words content. Every function is gated by
// requireAdmin() (Cloudflare Access JWT — see ./access). Mutations are POST.
//
// Catalog is the single source of truth for story + chapter METADATA; chapter
// BODIES live as <storyId>/<index>.md in R2. Saves are read-modify-write on
// catalog.json (single author, low concurrency). Story/chapter ids are
// validated to a strict slug / integer so they can't escape their R2 prefix.
// ============================================================
import { createServerFn } from '@tanstack/react-start'

import { requireAdmin } from './access'
import {
  loadCatalogRaw,
  putCatalog,
  loadChapterMd,
  putChapterMd,
  deleteObject,
} from './stories-data'

const STATUSES = ['ongoing', 'complete', 'hiatus', 'drafting', 'planned']
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function assertSlug(id: string): string {
  if (!SLUG_RE.test(id)) throw new Error('Bad story id — use lowercase letters, numbers, dashes.')
  return id
}

function assertIndex(n: unknown): number {
  const i = Number(n)
  if (!Number.isInteger(i) || i < 1 || i > 100000) throw new Error('Bad chapter index.')
  return i
}

function str(v: unknown, max: number): string {
  return String(v ?? '').slice(0, max)
}

/** Whitelist + clamp story metadata. `toc` is managed separately, never trusted from client. */
function cleanStoryMeta(input: any) {
  const id = assertSlug(String(input?.id ?? '').trim())
  return {
    id,
    title: str(input?.title, 200),
    logline: str(input?.logline, 400),
    blurb: str(input?.blurb, 4000),
    coverColor: str(input?.coverColor || 'var(--accent)', 100),
    status: STATUSES.includes(input?.status) ? input.status : 'drafting',
    tags: Array.isArray(input?.tags)
      ? input.tags.map((t: unknown) => str(t, 40)).filter(Boolean).slice(0, 12)
      : [],
    words: str(input?.words, 40),
    progress: str(input?.progress, 120),
    published: input?.published === true,
  }
}

/** Whitelist + clamp a TOC (chapter metadata) entry. */
function cleanChapterMeta(input: any) {
  return {
    index: assertIndex(input?.index),
    title: str(input?.title, 200),
    words: str(input?.words, 40),
    date: str(input?.date, 40),
    isNew: input?.isNew === true,
    published: input?.published === true,
  }
}

/** Full catalog incl. drafts. */
export const adminGetCatalog = createServerFn({ method: 'POST' }).handler(async () => {
  await requireAdmin()
  return await loadCatalogRaw()
})

/** Create or update story metadata. Preserves the existing TOC. */
export const adminSaveStory = createServerFn({ method: 'POST' })
  .validator((d: { story: any }) => ({ story: d.story }))
  .handler(async ({ data }) => {
    await requireAdmin()
    const meta = cleanStoryMeta(data.story)
    const cat = await loadCatalogRaw()
    const stories = Array.isArray(cat.stories) ? [...cat.stories] : []
    const i = stories.findIndex((s: any) => s.id === meta.id)
    if (i >= 0) stories[i] = { ...meta, toc: stories[i].toc ?? [] }
    else stories.push({ ...meta, toc: [] })
    await putCatalog({ ...cat, stories })
    return { ok: true, id: meta.id }
  })

/** Delete a story + best-effort delete its chapter bodies. */
export const adminDeleteStory = createServerFn({ method: 'POST' })
  .validator((d: { id: string }) => ({ id: String(d.id) }))
  .handler(async ({ data }) => {
    await requireAdmin()
    const id = assertSlug(data.id)
    const cat = await loadCatalogRaw()
    const story = (cat.stories ?? []).find((s: any) => s.id === id)
    const stories = (cat.stories ?? []).filter((s: any) => s.id !== id)
    await putCatalog({ ...cat, stories })
    for (const c of story?.toc ?? []) {
      try {
        await deleteObject(`${id}/${c.index}.md`)
      } catch {
        /* body may not exist — ignore */
      }
    }
    return { ok: true }
  })

/** Raw Markdown body for one chapter (for the editor). */
export const adminGetChapter = createServerFn({ method: 'POST' })
  .validator((d: { storyId: string; chapterId: string }) => ({
    storyId: String(d.storyId),
    chapterId: String(d.chapterId),
  }))
  .handler(async ({ data }) => {
    await requireAdmin()
    assertSlug(data.storyId)
    assertIndex(data.chapterId)
    const markdown = await loadChapterMd(data.storyId, data.chapterId)
    return { markdown: markdown ?? '' }
  })

/**
 * Create or update a chapter. Always upserts the TOC entry (structure/metadata).
 * Writes the .md body ONLY when `markdown` is a string — pass null to change
 * structure (order, publish, title) without touching an already-uploaded body.
 */
export const adminSaveChapter = createServerFn({ method: 'POST' })
  .validator((d: { storyId: string; chapter: any; markdown?: string | null }) => ({
    storyId: String(d.storyId),
    chapter: d.chapter,
    markdown: d.markdown == null ? null : String(d.markdown),
  }))
  .handler(async ({ data }) => {
    await requireAdmin()
    const storyId = assertSlug(data.storyId)
    const chapter = cleanChapterMeta(data.chapter)
    const cat = await loadCatalogRaw()
    const stories = [...(cat.stories ?? [])]
    const si = stories.findIndex((s: any) => s.id === storyId)
    if (si < 0) throw new Error('Unknown story.')
    const story = { ...stories[si] }
    const toc = [...(story.toc ?? [])]
    const ci = toc.findIndex((c: any) => Number(c.index) === chapter.index)
    if (ci >= 0) toc[ci] = chapter
    else toc.push(chapter)
    toc.sort((a: any, b: any) => Number(a.index) - Number(b.index))
    story.toc = toc
    stories[si] = story
    if (data.markdown != null) await putChapterMd(storyId, String(chapter.index), data.markdown)
    await putCatalog({ ...cat, stories })
    return { ok: true, index: chapter.index }
  })

/** Delete a chapter: removes the TOC entry + the .md body. */
export const adminDeleteChapter = createServerFn({ method: 'POST' })
  .validator((d: { storyId: string; chapterId: string }) => ({
    storyId: String(d.storyId),
    chapterId: String(d.chapterId),
  }))
  .handler(async ({ data }) => {
    await requireAdmin()
    const storyId = assertSlug(data.storyId)
    const idx = assertIndex(data.chapterId)
    const cat = await loadCatalogRaw()
    const stories = [...(cat.stories ?? [])]
    const si = stories.findIndex((s: any) => s.id === storyId)
    if (si >= 0) {
      const story = { ...stories[si] }
      story.toc = (story.toc ?? []).filter((c: any) => Number(c.index) !== idx)
      stories[si] = story
      await putCatalog({ ...cat, stories })
    }
    try {
      await deleteObject(`${storyId}/${idx}.md`)
    } catch {
      /* body may not exist — ignore */
    }
    return { ok: true }
  })
