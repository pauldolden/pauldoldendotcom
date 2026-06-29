// ============================================================
// SAMPLE / fallback catalog for the R2-backed story layer
// (src/server/stories.ts). When R2 has no catalog.json this is what
// /words renders, so it doubles as the pre-launch "what I'm writing"
// shelf. A real catalog.json in R2 overrides everything here.
//
// R2 shape this mirrors:
//   <STORIES_R2_BASE_URL>/catalog.json             -> { stories: [...] }
//   <STORIES_R2_BASE_URL>/<storyId>/<chapterId>.md -> Markdown (+ ::: directives)
//
// A "story" carries display metadata + a `toc` (chapter list). Works in
// progress have an empty toc + a `progress` line instead of chapter counts.
// status: 'ongoing' | 'complete' | 'hiatus' | 'drafting' | 'planned'
// Chapter Markdown is parsed into the reader's block model by markdown.ts.
// ============================================================

// Works in progress — the Side of Desk universe (the Thirteen + the Twelve:
// a divine accident with real consequences). Nothing is published yet, so
// these are loglines + premises, not chapter lists. stories[0] is featured.
export const sampleCatalog: { stories: Array<Record<string, unknown>> } = {
  stories: [
    {
      id: 'circus-murder',
      title: 'Circus Murder',
      logline: 'A god-touched ringmaster, dead in the town his blessing built.',
      blurb:
        'When the impossibly charismatic ringmaster is murdered in the circus-town his blessing raised, the job of finding the killer falls to the one man too tired to want it — a former soldier hiding from his own past behind a security badge. Solve it fast, or watch the whole place come apart at the seams.',
      coverColor: 'var(--accent)',
      status: 'drafting',
      tags: ['Mystery', 'Fantasy'],
      chapters: 0,
      words: '~60k',
      progress: 'Drafting · Act II',
      toc: [],
    },
    {
      id: 'the-fixed-race',
      title: 'The Fixed Race',
      logline: 'One lame horse, one divine favour, one ruined economy.',
      blurb:
        'A washed-up jockey calls in a favour from a minor god, and a horse that should never win does. Trouble is, an entire city-state runs on the betting — and the books do not balance when the impossible pays out.',
      coverColor: 'var(--purple-500)',
      status: 'planned',
      tags: ['Satire', 'Fantasy'],
      chapters: 0,
      words: '~60k',
      progress: 'Planned',
      toc: [],
    },
    {
      id: 'the-blessed-isle',
      title: 'The Blessed Isle',
      logline: 'Paradise, it turns out, is a target.',
      blurb:
        'Shipwreck survivors wash up on an island so fertile it can only be a blessing. Word travels. Empires notice. The survivors learn the oldest lesson in the Thirteen’s universe: no good deed goes unpunished.',
      coverColor: 'var(--cyan-500)',
      status: 'planned',
      tags: ['Fantasy', 'Satire'],
      chapters: 0,
      words: '~70k',
      progress: 'Planned',
      toc: [],
    },
    {
      id: 'wreckers',
      title: 'Wreckers',
      logline: 'The Twelve finally notice the universe Thirteen built without asking.',
      blurb:
        'Thirteen made a universe off the books. It held together for a while. Now the Twelve have found the paperwork, the machinery of heaven has opened a case — and someone mortal is going to have to answer for it.',
      coverColor: 'var(--accent-press)',
      status: 'planned',
      tags: ['Fantasy', 'Mystery'],
      chapters: 0,
      words: '~80k',
      progress: 'In development',
      toc: [],
    },
  ],
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
