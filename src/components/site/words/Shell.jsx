// Shell — /words header + footer. Copy from src/content/words.ts.
// Ember (grimoire) theme via `theme-ember`; nav is real Router Links.
import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Icon } from '../../ds/index.js';
import { SearchOverlay } from './SearchOverlay.jsx';
import { MobileDrawer } from '../MobileDrawer.jsx';
import { SpoilerProvider } from './world/Spoiler.jsx';
import { words } from '../../../content/words';

const NAV_ITEM = 'relative rounded-sm px-3 py-2 font-sans text-sm font-medium text-muted no-underline';
const ICON_BTN = 'h-[38px] w-[38px] place-items-center rounded-sm border border-transparent bg-transparent cursor-pointer';
const DRAWER_ROW = 'flex items-center gap-[11px] rounded-md px-3 py-[13px] font-sans text-base font-medium text-body no-underline';

function NavLink({ to, params, exact, children }) {
  return (
    <Link
      to={to}
      params={params}
      activeOptions={exact ? { exact: true } : undefined}
      className={NAV_ITEM}
      activeProps={{ className: 'text-strong' }}
    >
      {({ isActive }) => (
        <>
          {children}
          {isActive && (
            <span className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-[2px] bg-grad-sunset" />
          )}
        </>
      )}
    </Link>
  );
}

export function Shell({ children, isAdmin = false }) {
  const { shell, author } = words;
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="theme-ember words-app flex min-h-full flex-col bg-canvas">
      <div className="pointer-events-none fixed inset-0 z-0 bg-grad-glow" />

      <header className="sticky top-0 z-20 flex h-[var(--header-h)] items-center gap-6 border-b border-line-faint bg-[rgba(11,8,23,0.72)] px-7 backdrop-blur-[14px]">
        <Link to="/words" className="flex items-center gap-[11px] no-underline">
          <img src={shell.brand.mark} alt="" className="h-[34px] w-[34px]" />
          {/* Dual-voice wordmark: mono "paul" + serif-italic "dolden".
              --accent resolves to oxblood here under .theme-ember. */}
          <span className="inline-flex items-baseline whitespace-nowrap">
            <span className="font-code text-[17px] font-medium tracking-[-0.01em] text-strong">{shell.brand.codeWord}</span>
            <span className="ml-px font-serif text-[21px] font-medium italic text-accent">{shell.brand.wordsWord}</span>
          </span>
        </Link>
        <nav className="ml-2 flex gap-1 max-[900px]:hidden">
          {shell.nav.map((n) => (
            <NavLink key={n.label} to={n.to} params={n.params} exact={n.exact}>{n.label}</NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2.5 max-[900px]:hidden">
          <button title="Search" onClick={() => setSearchOpen(true)} className={`grid ${ICON_BTN}`}><Icon name="search" color="var(--text-muted)" /></button>
          <a href="/words/rss.xml" title="RSS feed" className={`grid no-underline ${ICON_BTN}`}><Icon name="rss" color="var(--text-muted)" /></a>
          <Link to="/words/library" className="inline-flex h-[38px] items-center gap-[7px] rounded-pill border-[1.5px] border-line-neon bg-[rgba(255,46,151,0.06)] px-4 font-sans text-sm font-semibold text-magenta-300 no-underline">
            <Icon name="heart" size={15} color="var(--magenta-400)" /> {shell.follow}
          </Link>
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          title="Menu"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className={`hidden max-[900px]:grid ${ICON_BTN}`}
        >
          <Icon name="menu" color="var(--text-strong)" />
        </button>
      </header>

      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} label="Menu">
        {shell.nav.map((n) => (
          <Link
            key={n.label}
            to={n.to}
            params={n.params}
            activeOptions={n.exact ? { exact: true } : undefined}
            onClick={() => setMenuOpen(false)}
            className={DRAWER_ROW}
            activeProps={{ className: 'text-strong bg-raised' }}
          >
            {n.label}
          </Link>
        ))}
        <span className="mx-1 my-2 h-px bg-line-faint" />
        <button
          onClick={() => { setMenuOpen(false); setSearchOpen(true); }}
          className={`w-full cursor-pointer border-none bg-transparent text-left ${DRAWER_ROW}`}
        >
          <Icon name="search" size={17} color="var(--text-muted)" /> {shell.search?.label ?? 'Search'}
        </button>
        <a href="/words/rss.xml" className={DRAWER_ROW}>
          <Icon name="rss" size={17} color="var(--text-muted)" /> RSS feed
        </a>
        <Link to="/words/library" onClick={() => setMenuOpen(false)} className={`text-magenta-300 ${DRAWER_ROW}`}>
          <Icon name="heart" size={17} color="var(--magenta-400)" /> {shell.follow}
        </Link>
      </MobileDrawer>

      <main className="relative z-[1] flex-1">
        <SpoilerProvider>{children}</SpoilerProvider>
      </main>

      <footer className="relative z-[1] mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-line-faint px-7 py-9">
        <Link to={shell.codeHref} className="flex items-center gap-[11px] no-underline">
          <img src={shell.brand.mark} alt="" className="h-7 w-7" />
          <span className="font-code text-xs uppercase tracking-wider text-faint">{author.domain}</span>
        </Link>
        <div className="flex items-center gap-[18px] font-sans text-[13px] text-faint">
          {isAdmin && (
            <Link to="/words/admin" className="font-semibold text-cyan-400 no-underline">Admin</Link>
          )}
          {shell.footerLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="text-faint no-underline"
            >
              {l.label}
            </a>
          ))}
          <span>{shell.copyright}</span>
        </div>
      </footer>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
