// ============================================================
// CONTENT — Developer portfolio ( /code )
// Real content sourced from the current site
// (github.com/pauldolden/pauldoldendotcom-v6). Edit here.
// ============================================================
export const code = {
  meta: { title: 'Paul Dolden — pauldolden.com/code' },

  brand: { name: 'Paul', nameBold: 'Dolden', tag: '/code', mark: '/assets/mark-code.svg' },

  nav: [
    ['About', 'about'],
    ['Experience', 'experience'],
    ['Work', 'work'],
    ['Skills', 'skills'],
    ['Contact', 'contact'],
  ],

  wordsLink: { label: '/words', href: '/words' },
  resume: { label: 'Résumé', href: '#' },

  dev: {
    name: 'Paul Dolden',
    role: 'Senior Software Engineer',
    tagline:
      'Senior Software Engineer at The Football Association, building applications that help the England teams succeed. In my spare time I’m building trove.ink, a local-first writing app for novelists.',
    location: 'South East England',
    availability: 'Building at the FA · hacking on trove.ink',
    email: 'paul@dolden.co.uk',
    handle: '@pauldolden',
    stackLine: 'TypeScript · Svelte · Go · Rust · TailwindCSS',
  },

  socials: [
    { id: 'github', label: 'GitHub', icon: 'github', href: 'https://github.com/pauldolden' },
    { id: 'linkedin', label: 'LinkedIn', icon: 'linkedin', href: 'https://linkedin.com/in/pauldolden' },
  ],
  emailLabel: 'Email',

  hero: { ctaPrimary: 'View my work', ctaSecondary: 'Get in touch' },

  terminal: {
    title: '~/paul — zsh',
    whoamiName: 'paul',
    whoamiRole: 'senior software engineer',
    now: 'FA · England teams + trove.ink',
  },

  about: {
    eyebrow: '// About',
    html:
      "Hi, I'm Paul Dolden — a developer based in the South East of England, currently a Senior Software Engineer at <a href=\"https://thefa.com\" style=\"color:var(--cyan-400);text-decoration:none\">The Football Association</a>, building applications that help the England teams succeed. I like writing code and experimenting with new tools, technologies, and paradigms — lately Svelte, TypeScript, Go and Tailwind, and exploring Rust, WebAssembly, and local-first software. Outside work I'm building <a href=\"https://trove.ink\" style=\"color:var(--cyan-400);text-decoration:none\">trove.ink</a>, a local-first writing app for novelists — and writing the fiction it's built for.",
    facts: [
      { icon: 'briefcase', label: 'Currently', value: 'Senior Software Engineer @ The Football Association' },
      { icon: 'hammer', label: 'Building', value: 'trove.ink — a local-first writing app' },
      { icon: 'map-pin', label: 'Based in', value: 'South East England' },
      { icon: 'feather', label: 'Also', value: 'Writing fiction at /words' },
    ],
  },

  experience: {
    eyebrow: '// Experience',
    title: "Where I've worked",
    bullet: '▹',
    roles: [
      {
        role: 'Senior Full-Stack Developer',
        company: 'The Football Association',
        period: 'Aug 2023 – Present',
        location: 'Wembley Stadium, London',
        current: true,
        summary:
          'Building software that helps England teams win. My focus is on driving engineering excellence — championing modern tools, technologies, and practices to tackle our unique challenges in the most effective ways.',
        bullets: [],
        tech: ['React', 'Node.js', 'TypeScript', 'Terraform', 'GCP'],
      },
      {
        role: 'Full-Stack Developer',
        company: 'Comic Relief',
        period: 'May 2022 – Aug 2023',
        location: 'London',
        summary:
          'Maintained and enhanced a React front-end and Node.js back-end, managing infrastructure with AWS CloudFormation and the Serverless framework. Testing with Cypress, Jest, and Mocha kept things robust through peak campaigns like Red Nose Day, and I helped drive the migration from JavaScript to TypeScript.',
        bullets: [],
        tech: ['React', 'Node.js', 'TypeScript', 'AWS', 'Serverless'],
      },
      {
        role: 'Lead Mobile Developer',
        company: '2D Media',
        period: 'Mar 2021 – May 2022',
        location: 'Witham',
        summary:
          'Led the move into mobile with React Native — custom apps including a social network for the health & social care sector, plus native ports of internal CRM, project-management, and e-commerce tools. Handled Play Store / App Store distribution end to end.',
        bullets: [],
        tech: ['React Native', 'Node.js', 'TypeScript'],
      },
      {
        role: 'Web Developer',
        company: '2D Media',
        period: 'Jan 2021 – Mar 2021',
        location: 'Witham',
        summary:
          'Built and maintained e-commerce sites on an internal CMS/platform, setting them up and optimising for performance and user experience to meet specific business needs.',
        bullets: [],
        tech: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'PHP'],
      },
    ],
  },

  work: {
    eyebrow: '// Selected work',
    title: "Things I've built",
    sourceLabel: 'Source',
    visitLabel: 'Visit',
    projects: [
      {
        name: 'trove.ink',
        blurb: 'A local-first writing app for novelists and worldbuilders — manuscripts live as plain Markdown in a folder you own. My main side project; currently pre-launch.',
        stack: ['TypeScript', 'Svelte', 'Tauri', 'Rust'],
        status: 'Pre-launch', tone: 'ongoing', accent: 'magenta',
        source: 'https://github.com/pauldolden/trove',
        visit: 'https://trove.ink',
      },
    ],
  },

  skills: {
    eyebrow: '// Toolbox',
    title: 'What I work with',
    groups: [
      { group: 'Languages', items: ['TypeScript', 'JavaScript', 'Go', 'Rust', 'PHP'] },
      { group: 'Frontend', items: ['React', 'Svelte', 'React Native', 'Tailwind CSS', 'WebAssembly'] },
      { group: 'Backend & Cloud', items: ['Node.js', 'Serverless', 'Docker', 'Terraform', 'AWS', 'GCP'] },
      { group: 'Practice', items: ['DevOps', 'Testing', 'Local-first', 'System design', 'Mentoring'] },
    ],
  },

  contact: {
    eyebrow: '// Contact',
    headingLead: 'Building something that needs a ',
    headingAccent: 'careful pair of hands?',
    blurb: "I'm always happy to talk about interesting work. The fastest way to reach me is email, or find me on LinkedIn.",
    resumeLabel: 'Download résumé',
  },

  footer: {
    domain: 'pauldolden.com/code',
    wordsLabel: 'Read my fiction →',
    copyright: '© 2026 Paul Dolden',
  },
} as const
