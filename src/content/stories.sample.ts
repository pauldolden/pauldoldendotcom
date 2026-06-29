// ============================================================
// SAMPLE story content — local fallback for the R2-backed story
// layer (src/server/stories.ts). Real writing projects live in R2;
// nothing is shipped in the repo.
//
// R2 shape this mirrors:
//   <STORIES_R2_BASE_URL>/catalog.json             -> { stories: [...] }
//   <STORIES_R2_BASE_URL>/<storyId>/<chapterId>.md -> Markdown (+ ::: directives)
//
// A "story" carries display metadata + a `toc` (chapter list). Chapter
// Markdown is parsed into the reader's block model by src/server/markdown.ts.
// This sample fallback returns those blocks directly:
//   { type: 'p', dropcap?, dropLetter?, html }   ← paragraph
//   { type: 'system', title, tone, icon, html }  ← :::system
//   { type: 'pullquote', cite, text }            ← :::quote
//   { type: 'skill', name, kind, rarity, tier, description, cost, cooldown } ← :::skill
// ============================================================

// No sample stories — the catalog is served from R2. With
// STORIES_R2_BASE_URL unset, /words shows empty states. (The author
// writes novels + short fiction, not serials — keep copy in that voice.)
export const sampleCatalog: { stories: Array<Record<string, unknown>> } = {
  stories: [],
}

// Authored chapter bodies, keyed `${storyId}/${chapterId}`. Empty by default;
// real bodies come from R2.
const sampleBodies: Record<string, { blocks: Array<Record<string, unknown>> }> = {}

// Returns the authored body, or a generic placeholder so a chapter that exists
// in the catalog but lacks a body still renders something readable.
export function sampleChapterBody(storyId: string, chapterId: string, title = 'Chapter') {
  const authored = sampleBodies[`${storyId}/${chapterId}`]
  if (authored) return authored
  return {
    blocks: [
      {
        type: 'p',
        dropcap: true,
        dropLetter: title.charAt(0) || '·',
        html: `${title.slice(1)} isn’t available in this build — chapter bodies are served from the R2 bucket. Set <b>STORIES_R2_BASE_URL</b> to serve real content.`,
      },
    ],
  }
}
