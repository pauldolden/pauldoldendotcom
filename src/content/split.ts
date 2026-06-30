// ============================================================
// CONTENT — Split front door ( / )
// Edit copy here; index route reads from it. No strings in markup.
// ============================================================
export const split = {
  meta: { title: 'Paul Dolden — choose a door' },
  brand: {
    // Dual-voice wordmark: "paul" in mono (code), "dolden" in serif-italic (words).
    codeWord: 'paul',
    wordsWord: 'dolden',
    hint: 'choose a door',
    logo: '/assets/logo-mark.svg',
  },
  halves: {
    code: {
      eyebrow: '// the code',
      titleLead: 'I ',
      titleAccent: 'build.',
      line: 'Web tools, CLIs, and reader-respecting infrastructure. Mostly TypeScript and Rust.',
      highlight: 'pauldolden.com/code',
      highlightColor: 'var(--cyan-400)',
      lineEnd: '.',
      cta: 'Enter the workshop →',
      href: '/code',
    },
    words: {
      eyebrow: '§ the words',
      titleLead: 'I ',
      titleAccent: 'write.',
      line: 'Fantasy mysteries and real-world satire, free to read. New chapters most weeks.',
      highlight: 'pauldolden.com/words',
      highlightColor: 'var(--gold-500)',
      lineEnd: '.',
      cta: 'Enter the library →',
      href: '/words',
    },
  },
} as const
