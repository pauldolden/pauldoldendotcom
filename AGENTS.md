<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `pnpm dlx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

---

# Project Context

> Read the Skill Loading block above first. Before any architectural or library-specific
> change, run `pnpm dlx @tanstack/intent@latest list`, then `... load <package>#<skill>` for
> the matching skill, and follow the shipped guidance instead of guessing.

## What this is

Blank **TanStack Start** app (React + file-based routing + SSR). No add-on integrations
(no TanStack Query add-on, no auth provider, no DB, no ORM). Default CLI toolchain.

## Scaffolding (exact commands used)

```bash
# 1. Scaffold (run from the parent dir). --tailwind is now deprecated/ignored:
#    Tailwind is always enabled in TanStack Start scaffolds.
#    NOTE: CLI was actually run as `create my-tanstack-app ...`, then the dir +
#    package name were renamed to `pauldolden`. To reproduce in one step, just
#    pass the final name directly:
npx @tanstack/cli@latest create pauldolden --agent --package-manager pnpm --tailwind

# 2. TanStack Intent follow-ups (run inside the project dir):
npx @tanstack/intent@latest install   # wired the intent-skills block into this file
npx @tanstack/intent@latest list      # lists every loadable skill + its load command
```

## Stack / integrations

- **Framework:** React 19 + TanStack Start (`@tanstack/react-start`)
- **Router:** TanStack Router, file-based (`src/routes/`), `autoCodeSplitting` via router plugin
- **Build:** Vite 8 (`@vitejs/plugin-react`)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) + `@tailwindcss/typography`
- **Devtools:** `@tanstack/react-devtools` + `@tanstack/devtools-vite` (stripped from prod build)
- **Icons:** `lucide-react`
- **Tests:** Vitest 4 + Testing Library + jsdom
- **Package manager:** pnpm

## Scripts

| Command | Action |
|---|---|
| `pnpm dev` | Dev server on **port 3000** |
| `pnpm build` | Production build (client + SSR) → `dist/` |
| `pnpm preview` | Preview the production build |
| `pnpm test` | Run Vitest |
| `pnpm generate-routes` | Regenerate `src/routeTree.gen.ts` (`tsr generate`) |

## Project structure

```
src/
  router.tsx          # getRouter() factory + Register module declaration
  routes/             # /, /code, /words (+ nested) — see Design System Integration below
  content/            # IN-CODE CMS — all editable copy + sample story data (see below)
  server/stories.ts   # R2-backed story data layer (createServerFn)
  components/
    ds/               # ported design-system component library
    site/             # page components (hub + words)
  styles/             # design-system tokens, split.css, words.css
  styles.css          # Tailwind entry (preflight + body utilities only)
  routeTree.gen.ts    # GENERATED — do not edit by hand
vite.config.ts        # devtools() → tailwindcss() → tanstackStart() → viteReact()
tsr.config.json       # TanStack Router generator config
```

> **Editing copy?** All user-facing text lives in `src/content/` — you should rarely need to
> touch markup to change wording. See the "Content / CMS" section below.

## Environment variables

- **`STORIES_R2_BASE_URL`** (optional, server-only) — base URL of the R2 bucket serving the
  `/words` writing projects over HTTPS. **Unset → the app falls back to the in-repo sample**
  (`src/content/stories.sample.ts`), so dev/build work with zero config. See `.env.example`
  for the expected object layout. Read **inside** the server-fn handlers (never at module
  scope) per `start-core/execution-model`.
- No `VITE_`-prefixed vars yet. Rule: client-exposed vars must be `VITE_`; server-only secrets
  stay unprefixed and live only inside `createServerFn` handlers.

## Deployment — Cloudflare Workers

- Configured via **`@cloudflare/vite-plugin`** (`cloudflare({ viteEnvironment: { name: 'ssr' } })`
  in `vite.config.ts`, after `devtools()`) + **`wrangler.jsonc`** (`main:
  "@tanstack/react-start/server-entry"`, `nodejs_compat`). `vite build` emits the Worker
  (`dist/server/index.js`) + client assets (`dist/client/`).
- **Deploy:** `pnpm deploy` (= `vite build && wrangler deploy`). First time: `wrangler login`.
  Validate without shipping: `npx wrangler deploy --dry-run`.
- `pnpm dev` / `pnpm preview` now run in the Workers (workerd) runtime via the plugin.
- **Env on Workers:** Worker env is per-request — `process.env.X` at module scope is
  `undefined`. The story layer already reads `process.env.STORIES_R2_BASE_URL` **inside** the
  server-fn handlers (with `nodejs_compat`), so it works. Set it via `vars` in `wrangler.jsonc`
  (it's a public URL, not a secret) or `wrangler secret put`. Unset → empty `/words`.
- To bind the R2 bucket directly instead of fetching a public URL, add an `r2_buckets` binding
  (stub in `wrangler.jsonc`) and read `env.STORIES` via `cloudflare:workers` in `stories-data.ts`.
- `.wrangler` / `.output` / `dist` are gitignored. `workerd` is in pnpm `onlyBuiltDependencies`.

## Key decisions

- Blank starter on purpose — no data/auth/db add-ons. Add them via intent-guided steps, not ad hoc.
- `--tailwind` flag is a no-op in current CLI (Tailwind always on); kept in the command for the record.
- Devtools live in `__root.tsx` and are tree-shaken out of production builds by `@tanstack/devtools-vite`.

## Gotchas

- `src/routeTree.gen.ts` is generated. Don't hand-edit; run `pnpm generate-routes` (the dev server
  and build regenerate it automatically).
- `intent list` notice: `intent.skills` allowlist is not set, so all sources surface. A future
  intent version will require an explicit allowlist — add one to pin sources when that lands.
- Path alias: import from `#/*` → `./src/*` (defined in `package.json` `imports`).

## Next steps

1. `pnpm dev` → open http://localhost:3000
2. Delete any `demo`-prefixed files once you don't need the examples (none present in this blank scaffold).
3. Before adding a feature (auth, data loading, server fns, deployment target), load the matching
   intent skill and follow its pattern.

---

# Design System Integration

## Source

Imported from the Claude Design project **"Paul Dolden — Synthwave Reading System"**
(`d4da682e-2749-4b83-bafd-ad3ac0a0d68b`) via the `DesignSync` MCP (auth: `/design-login`).
Re-sync tokens/components with the `DesignSync` tool / `/design-sync` skill — do not hand-edit
ported tokens; pull them again so local stays faithful to the design source.

## What was implemented

Three routes, all ported from the design project's `ui_kits`:

- **`/` — split front door** (`ui_kits/split`). Full-bleed split: left = **synthwave / "the
  code"** (neon gradient, Chakra Petch, glow CTA → `/code`); right = **grimoire / "the words"**
  (`.theme-ember`: matte warm near-black, gold-foil Cormorant serif, oxblood CTA → `/words`).
  CSS `:has` hover-to-expand.
- **`/code` — developer portfolio** (`ui_kits/hub`). Synthwave. Hero + `$ whoami` terminal,
  about, experience timeline, work cards, skills, contact glass card.
- **`/words` — fiction reading site** (`ui_kits/website`). Ember/grimoire. The design kit's
  in-memory screen router was **promoted to real nested TanStack file routes** with URLs,
  loaders, `notFound()`, per-route `<title>`, and SPA `Link`/`useNavigate`:
  `/words` (layout: ember Shell + `<Outlet/>`), `/words/` (home), `/words/library`,
  `/words/about`, `/words/$storyId` (serial landing), `/words/$storyId/$chapterId` (reader).

The design's component library (`components/core`, `reading`, `litrpg`) and both kits' screens
were ported from the source `.jsx`. The kit files used a browser-only pattern (UMD React +
Babel + a compiled `_ds_bundle.js`, components on `window.*`); the port converts them to real
ESM modules and swaps the Lucide-UMD helper for an `<Icon>` backed by the installed
`lucide-react`.

## Files added / changed

```
public/assets/{splash-bg,logo-mark,mark-code,mark-words}.svg   # ported art
src/styles/design-system.css       # @import index (linked globally)
src/styles/design-system/          # ported tokens, 1:1 with the design project:
  typography.css colors.css spacing.css effects.css motion.css base.css themes.css
src/styles/split.css               # / page styles (:has(.split-screen) scoped)
src/styles/words.css               # /words page styles (:has(.words-app) scoped)
src/components/ds/                  # ported component library (ESM, verbatim source):
  core/{Button,Badge,Tag,Card,Input}.jsx
  reading/{StoryCard,ChapterRow,ReadingProgress,PullQuote,FollowSignup}.jsx
  litrpg/{SystemMessage,StatPanel,SkillCard}.jsx
  Icon.jsx                         # NEW: kebab-name → lucide-react map (UMD shim replacement)
  index.js                         # barrel (mirrors the design's bundle namespace)
src/components/site/hub/           # /code: HubLanding.jsx + data.js
src/components/site/words/         # /words: Shell + {Home,Library,Story,Reader,About}Screen + data.js
src/routes/index.tsx               # / (split front door)
src/routes/code.tsx                # /code
src/routes/words/                  # nested /words routes (loaders + notFound on the param routes):
  route.tsx index.tsx library.tsx about.tsx  $storyId/index.tsx  $storyId/$chapterId.tsx
src/routes/__root.tsx              # body = .pd-root; links design-system.css then styles.css
src/styles.css                     # TRIMMED to just the Tailwind entry (see gotcha below)
- src/routes/about.tsx             # deleted (orphaned, off-theme starter demo)
- src/components/{Header,Footer,ThemeToggle}.tsx  # deleted (starter demo chrome)
```

## How styling is wired

- `design-system.css` is linked **globally** in `__root.tsx`; `<body>` carries `.pd-root`, so
  the synthwave tokens + Google Fonts apply app-wide. `/words` adds `.theme-ember` on its Shell
  root to flip the whole subtree to the grimoire palette.
- `split.css` / `words.css` are linked only on their route via the route `head`; their
  `body:has(.split-screen)` / `body:has(.words-app)` rules apply per-page only.
- `src/styles.css` is now just `@import "tailwindcss"` (preflight + the `antialiased` /
  `overflow-wrap` body utilities). All component color comes from the design system.
- **Responsive:** component layout is authored **inline for desktop**. `src/styles/responsive.css`
  (linked globally in `__root` after `styles.css`) holds the breakpoints. Pattern:
  - Card grids (work / skills / more-to-read) use `repeat(auto-fit, minmax(…))` **inline** —
    fluid, no media query needed.
  - Asymmetric two-column grids + the sticky headers carry classes (`hub-hero`, `hub-about`,
    `words-featured`, `story-hero`, `story-cover`, `story-body`, `hub-header`/`hub-nav`,
    `words-header`/`words-nav`); responsive.css collapses them to one column / wraps the
    headers with `!important` (needed to beat the inline grid styles). Verified at 375px, no
    horizontal overflow. **When adding new multi-column layout, follow this pattern** — either
    auto-fit inline, or add a class + a rule in responsive.css.

## Content / CMS + data (where the words live)

All user-facing copy is collocated in **`src/content/`** — edit text here, not in markup:

- `content/split.ts` — the `/` front-door copy.
- `content/code.ts` — everything on `/code` (portfolio data + section labels + terminal +
  about bio + contact + footer).
- `content/words.ts` — all `/words` static copy (shell nav/footer, home/library/about copy,
  story-page + reader chrome labels, follow block, notFound messages).
- `content/stories.sample.ts` — sample story catalog + a placeholder chapter-body fallback
  (currently empty; R2 is the real source).
- `content/index.ts` — barrel.
- `src/server/markdown.ts` — chapter Markdown → block model (`mdToBlocks`); tested in
  `src/server/markdown.test.ts` (run `pnpm test`, node env via `vitest.config.ts`).

**Story/chapter content is R2-backed**, because it grows too large for the repo:

- `src/server/stories.ts` exposes three `createServerFn`s — `getCatalog`, `getStoryBundle`,
  `getChapter` — called from the `/words` route loaders (thin wrappers over the pure loaders in
  `src/server/stories-data.ts`). They read `STORIES_R2_BASE_URL` **inside the handler** and
  `fetch()` from R2; on any miss they fall back to the sample. R2 access stays server-side even
  though loaders are isomorphic.
- R2 object layout (see `.env.example`): `<base>/catalog.json` → `{ stories: [...] }` (each
  story carries metadata + a `toc`); `<base>/<storyId>/<chapterId>.md` → the chapter, authored
  in **Markdown**.
- **Chapters are Markdown with `:::` directives.** `src/server/markdown.ts` (`mdToBlocks`,
  dependency-free, Workers-safe, unit-tested in `markdown.test.ts`) parses md → the reader's
  block model, so `ChapterBody.jsx` is unchanged. Supported: paragraphs (first gets a drop
  cap), `**bold**` / `*italic*` / `` `code` `` / `[links](url)`, and `:::system` / `:::quote` /
  `:::skill` directives for the LitRPG interludes (syntax in `.env.example`). The `catalog.json`
  index stays JSON (a `fetch`-able bucket can't be listed, so the chapter list lives there).
- **Going live with R2:** set `STORIES_R2_BASE_URL` to a public bucket / custom domain / CDN
  (or a signing proxy for a private bucket); upload `catalog.json` + per-chapter `.md`. No code
  change needed.
- **XSS note:** `ChapterBody` and the `/code` about bio use `dangerouslySetInnerHTML` on
  block/bio HTML. That content is **author-owned** (your repo + your R2 bucket), not user
  input. If chapters ever become multi-author, sanitize (DOMPurify) in `ChapterBody` first.

## Gotchas (design)

- **Token-name collision (fixed — do not reintroduce):** the original starter `styles.css`
  `:root` defined `--bg-base` (light `#e7f3ec`), the SAME name the design system uses for the
  dark canvas. Loaded after design-system.css, it tinted every `var(--bg-base)` light and
  washed out whole pages. Fix was to strip the starter's teal theme from `styles.css`. If you
  re-add app-level `:root` custom properties, **don't shadow design-system token names.**
- **`/code` and `/words` own their full chrome** (sticky headers); that's why `__root.tsx`
  renders no global Header/Footer. `/code` is a single in-page scroller (anchor nav);
  `/words` is a layout route (`words/route.tsx` = ember Shell + `<Outlet/>`) with real nested
  child routes.
- `/words` now uses **real URLs + loaders** (`$storyId` / `$chapterId` validated, `throw
  notFound()` on a bad slug → proper SSR 404). Story/chapter data is read in route loaders and
  passed to screens as props; screens navigate with typed `Link`/`useNavigate` (never
  interpolate params into `to`). Only **Emberline** has a real chapter list in the sample data;
  other serials render an empty TOC.
- **Site chrome is functional** (was visual-only): **Search** = catalog overlay
  (`SearchOverlay.jsx`, opened from the header, fetches via `getCatalog`); **RSS** = real feed
  at `/words/rss.xml` (server route `routes/words/rss[.]xml.ts` + `<link rel=alternate>` in the
  words layout head); **reading prefs** = font size + dark/sepia theme persisted to
  localStorage (`useReaderPrefs.js`, keys `pd.reader.size` / `pd.reader.theme`); **bookmark** =
  per-chapter toggle persisted (`useBookmarks.js`, key `pd.bookmarks`). The reader's scroll
  progress bar is still mostly static (the kit's `#reader-scroll` doesn't actually scroll).
  Sepia theme works by applying CSS-var overrides to the `<article>` only (chrome + the
  floating controls keep their dark styling); persistence hooks use functional state updaters
  so a click is correct even before the mount-load effect commits (no stale-closure clobber).
- Before router/architecture changes, load the TanStack Intent skills first — these routes
  were built from `router-core` + `router-core/{path-params,navigation,not-found-and-errors}`
  (`pnpm dlx @tanstack/intent@latest load <id>`).
- `themes.css` re-declares semantic aliases as literals inside `.theme-ember` because
  `colors.css` resolves ramp `var()`s at `:root`; re-pointing ramps alone won't reach them.
- Component `.jsx` files are intentionally untyped JS-in-JSX (verbatim from the design source);
  `vite build` does not run `tsc`, so they bundle fine. Re-sync them via `DesignSync`.
- Fonts come from Google Fonts via `@import` in `typography.css` — needs network.
- **Sample stories removed** — `src/content/stories.sample.ts` ships an empty catalog, so
  `/words` renders empty states (graceful: hero + Browse only; library shows the empty msg;
  dead story routes → 404; RSS has no items) until `STORIES_R2_BASE_URL` serves a real catalog.
- `/code` content is **real**, ported from the current site
  (github.com/pauldolden/pauldoldendotcom-v6): bio, the 4 real jobs (FA · Comic Relief · 2D
  Media ×2), toolbox, email **paul@dolden.co.uk**, GitHub + LinkedIn. Projects = **trove.ink
  only** (real Source/Visit links). `/words` has no real content yet (R2-fed).
- **Voice:** the author writes **novels + short fiction**, NOT "serials" — keep copy in that
  voice (no "serial" wording).
- Edit `/code` + `/words` copy in `src/content/`.

## Next steps (design)

1. Real copy/links: edit `src/content/{split,code,words}.ts` (real job history, projects,
   bio); point résumé / social / project links at real URLs.
2. ~~Promote `/words` to nested routes~~ — **DONE**. ~~Collocate copy + move story content to
   a data source~~ — **DONE** (in-code CMS in `src/content/`; R2-backed story layer in
   `src/server/stories.ts` with sample fallback). To go live: set `STORIES_R2_BASE_URL` and
   upload `catalog.json` + per-chapter JSON (see `.env.example`).
   ~~make search/RSS/bookmark/theme-toggle functional~~ — **DONE** (catalog search overlay,
   `/words/rss.xml` feed, persisted reading prefs + bookmarks). Remaining: a "saved/continue
   reading" view that consumes `pd.bookmarks`; wire the Follow form to a real list.
3. Port more of the design system (e.g. unused `Card`, more litrpg pieces) with `DesignSync`
   as new screens get built.
