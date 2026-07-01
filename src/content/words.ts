// ============================================================
// CONTENT — Fiction site ( /words ) static copy
// All the grimoire-site UI copy. Story + chapter CONTENT is NOT
// here — that comes from R2 (see src/server/stories.ts), with a
// local sample in src/content/stories.sample.ts.
//
// Voice: laconic, warm under the wit — fantasy mysteries + real-world
// satire (Pratchett-adjacent). "The gods mean well, the systems don’t."
// NOT LitRPG. Keep copy short; observation over explanation.
// ============================================================
export const words = {
  author: {
    name: 'Paul Dolden',
    tagline:
      'Fantasy mysteries and real-world satire — the people caught in the gears.',
    domain: 'pauldolden.com/words',
  },

  shell: {
    brand: { codeWord: 'paul', wordsWord: 'dolden', mark: '/assets/mark-words.svg' },
    nav: [
      { to: '/words', label: 'Home', exact: true },
      { to: '/words/library', label: 'Library' },
      { to: '/words/about', label: 'About' },
    ],
    follow: 'Follow',
    codeHref: '/code',
    // Footer links. RSS is the live feed route; Patreon is the support link.
    // (No newsletter for now — re-add a signup link here when there's a provider.)
    footerLinks: [
      { label: 'RSS', href: '/words/rss.xml' },
      { label: 'Patreon', href: 'https://www.patreon.com/pauldolden', external: true },
    ],
    copyright: '© 2026 Paul Dolden',
  },

  home: {
    meta: 'Paul Dolden — words.pauldolden.com',
    hero: {
      eyebrow: '§ Writer · fantasy, mystery & quiet satire',
      titleLead: 'The gods mean well. ',
      titleAccent: 'The systems don’t.',
      taglineSuffix: ' Warm under the wit. Free to read, start to finish.',
      ctaPrimary: 'Start reading', // featured story title is appended in markup
      ctaPreview: 'Read about', // used when the featured work has no chapters yet
      ctaSecondary: 'Browse the library',
      empty: 'No stories are posted yet — follow along and you’ll get chapter one when it lands.',
    },
    featured: { eyebrow: 'Currently writing', title: 'What I’m writing now', cta: 'Read the premise' },
    shelf: { eyebrow: 'The shelf', title: 'Also in the works', allWorks: 'All works →' },
    latest: { eyebrow: 'Hot off the press', title: 'Latest chapters' },
  },

  library: {
    meta: 'The Library — words.pauldolden.com',
    eyebrow: '§ The Library',
    titleLead: 'Everything, ',
    titleAccent: 'all at once.',
    intro:
      'Free to read from chapter one — when there’s a chapter one. Most of these are still being written; here’s the whole shelf, finished or not.',
    allLabel: 'All',
    empty: 'Nothing under that tag — yet.',
  },

  story: {
    tocTitle: 'Table of contents',
    sort: 'Newest',
    start: 'Start from chapter 1',
    noChaptersBtn: 'No chapters yet',
    addToLibrary: 'Add to library',
    noChapters: 'This one’s still being written. Follow along and you’ll get chapter one when it lands.',
  },

  about: {
    meta: 'About — words.pauldolden.com',
    eyebrow: '§ About',
    titleLead: "Hi, I'm ",
    titleAccent: 'Paul.',
    paragraphs: [
      'I wanted to be a writer before anything else. I studied it at UEA; I’ve spent my career writing code. Turns out they’re the same craft in different clothes: make it work, make it clear, make it land.',
      'So this is where I write the fiction. Free to read.',
    ],
  },

  // Worldbuilding (characters / places / relationships) — sourced from Trove,
  // spoiler-gated by reading progress. See src/server/world.ts.
  world: {
    castEyebrow: '§ Who’s who',
    castTitle: 'Cast & world',
    castIntro:
      'The people and places caught in the gears. You get a name and a line each — flip “show spoilers” for roles, ties and backstory.',
    mapLink: 'Relationships map',
    empty: 'No cast is posted for this story yet.',
    emptyGated: 'No one’s been introduced yet — keep reading and they’ll appear here as you meet them.',
    backToStory: '← Back to the story',
    backToCast: '← All cast',
    aka: 'a.k.a.',
    relationships: 'Relationships',
    details: 'Details',
    familyTitle: 'Family',
    treeRows: { parents: 'Parents', siblings: 'Siblings', partners: 'Partners', children: 'Children' },
    // /words/:storyId/world — the full relationship graph
    mapEyebrow: '§ The web',
    mapTitle: 'How it all connects',
    mapIntro: 'Everyone and everything, and the lines between them. Colour marks the kind of tie.',
    mapEmpty: 'No connections mapped for this story yet.',
    // Section titles for grouped relationships (by predicate category).
    relGroups: {
      family: 'Family',
      social: 'Ties',
      org: 'Allegiances',
      possession: 'Holdings',
      spatial: 'Place',
      other: 'Other',
    } as Record<string, string>,
  },

  notFound: {
    storyTitle: 'No such story',
    storyBody: (id: string) => `Nothing in the library is called “${id}”.`,
    chapterTitle: 'Chapter not found',
    chapterBody: 'That chapter isn’t posted yet.',
    entityTitle: 'Not in the cast — yet',
    entityBody: 'Either there’s no one here by that name, or you haven’t met them so far.',
  },

  search: {
    placeholder: 'Search stories…',
    hint: 'Search by title, premise, or tag',
    empty: 'No stories match that.',
  },

  reader: {
    prevLabel: 'Previous',
    nextLabel: 'Next chapter',
    readTime: '14 min',
    themeTitle: 'Reading theme',
    bookmarkTitle: 'Bookmark this chapter',
    bookmarkedTitle: 'Bookmarked',
    smallerTitle: 'Smaller text',
    largerTitle: 'Larger text',
  },

  // RSS feed metadata (/words/rss.xml)
  feed: {
    title: 'Paul Dolden — words',
    description: 'Fantasy mysteries and real-world satire. New chapters most weeks.',
  },
} as const
