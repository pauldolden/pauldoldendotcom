// ============================================================
// EMPTY fallback for the R2-backed story layer (src/server/stories.ts).
// R2 is the ONLY source of real content. When R2 has no catalog.json
// (or a chapter .md is missing), /words renders true empty states —
// no dummy/placeholder stories or chapter text.
//
// R2 shape (the real source):
//   catalog.json             -> { stories: [...] }
//   <storyId>/<chapterId>.md -> Markdown (+ ::: directives), parsed by markdown.ts
//
// To show stories, upload catalog.json to the `STORIES` bucket. Story shape:
//   display metadata + a `toc` (chapter list). WIP entries: empty toc +
//   a `progress` line. status: 'ongoing'|'complete'|'hiatus'|'drafting'|'planned'
// ============================================================

// No stories until R2 has a catalog.json.
export const sampleCatalog: { stories: Array<Record<string, unknown>> } = {
  stories: [],
}

// No authored bodies — chapter content is served only from R2. Returns
// empty blocks so a catalog chapter whose R2 .md is missing renders nothing
// (the loader logs a warn for that case) rather than placeholder text.
export function sampleChapterBody(_storyId: string, _chapterId: string, _title = 'Chapter') {
  return { blocks: [] as Array<Record<string, unknown>> }
}
