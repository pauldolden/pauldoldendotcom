// ============================================================
// CONTENT — Fiction site ( /words ) static copy
// All the grimoire-site UI copy. Story + chapter CONTENT is NOT
// here — that comes from R2 (see src/server/stories.ts), with a
// local sample in src/content/stories.sample.ts.
// ============================================================
export const words = {
  author: {
    name: 'Paul Dolden',
    tagline: 'I write neon-lit dark fantasy and the occasional quiet short story.',
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
    footerLinks: ['RSS', 'Newsletter', 'Patreon'],
    copyright: '© 2026 Paul Dolden',
  },

  home: {
    meta: 'Paul Dolden — words.pauldolden.com',
    hero: {
      eyebrow: '§ Writer · dark fantasy & short fiction',
      titleLead: 'Stories that level up ',
      titleAccent: 'in the dark.',
      taglineSuffix: ' New chapters most weeks. Free to read, start to finish.',
      ctaPrimary: 'Start reading', // featured story title is appended in markup
      ctaSecondary: 'Browse the library',
      empty: 'No stories are posted yet — check back soon.',
    },
    featured: { eyebrow: 'Currently writing', title: 'The latest story', cta: 'Open the table of contents' },
    shelf: { eyebrow: 'The shelf', title: 'More to read', allWorks: 'All works →' },
    latest: { eyebrow: 'Hot off the press', title: 'Latest chapters' },
  },

  library: {
    meta: 'The Library — words.pauldolden.com',
    eyebrow: '§ The Library',
    titleLead: 'Everything, ',
    titleAccent: 'all at once.',
    intro: 'Every story is free to read from chapter one. New novels and short fiction go up here as they’re written.',
    filters: ['All', 'LitRPG', 'Fantasy', 'Sci-fi', 'Horror', 'Complete'],
    empty: 'Nothing under that tag — yet.',
  },

  story: {
    tocTitle: 'Table of contents',
    sort: 'Newest',
    start: 'Start from chapter 1',
    noChaptersBtn: 'No chapters yet',
    addToLibrary: 'Add to library',
    noChapters: 'Chapters for this story aren’t posted here yet.',
    following: "§ Who you're following",
    // sidebar character panel (placeholder; swap per-story later)
    stat: {
      name: 'Rue Ashe',
      title: 'Protagonist · Runecaster',
      level: 24,
      resolveLabel: 'Resolve',
      resolveValue: 180,
      resolveMax: 240,
      arc: 'III of V',
      chaptersLiveLabel: 'Chapters live',
      arcLabel: 'Arc',
      wyrdLabel: 'Wyrd',
      wyrdValue: 38,
      wyrdMax: 100,
    },
  },

  about: {
    meta: 'About — words.pauldolden.com',
    eyebrow: '§ About',
    titleLead: "Hi, I'm ",
    titleAccent: 'Paul.',
    paragraphs: [
      'I write stories where the menus are real and the stakes still hurt — novels and the occasional quiet short. Mostly LitRPG: neon towers, broken Systems, people trying to level out of grief.',
      'Everything here is free to read. If you want to keep me writing, you can follow by email or back the work on Patreon. That’s the whole business model: write the next chapter, post the next chapter.',
    ],
  },

  follow: {
    title: 'Never miss a chapter',
    blurb: 'New chapters land most weeks. Drop your email and I’ll send each one straight to your inbox — no spam, unsubscribe anytime.',
    cta: 'Follow',
    placeholder: 'you@domain.com',
  },

  notFound: {
    storyTitle: 'No such story',
    storyBody: (id: string) => `Nothing in the library is called “${id}”.`,
    chapterTitle: 'Chapter not found',
    chapterBody: 'That chapter isn’t posted yet.',
  },

  search: {
    placeholder: 'Search stories…',
    hint: 'Search by title, blurb, or tag',
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
    description: 'Neon-lit dark fantasy and short fiction. New chapters most weeks.',
  },
} as const
