// Shell — /words header + footer. Copy from src/content/words.ts.
// Ember (grimoire) theme via `theme-ember`; nav is real Router Links.
import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Icon } from '../../ds/index.js';
import { SearchOverlay } from './SearchOverlay.jsx';
import { words } from '../../../content/words';

const navItemStyle = {
  textDecoration: 'none',
  fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500,
  padding: '8px 12px', borderRadius: 'var(--r-sm)',
  color: 'var(--text-muted)', position: 'relative',
};

function NavLink({ to, params, exact, children }) {
  return (
    <Link
      to={to}
      params={params}
      activeOptions={exact ? { exact: true } : undefined}
      style={navItemStyle}
      activeProps={{ style: { ...navItemStyle, color: 'var(--text-strong)' } }}
    >
      {({ isActive }) => (
        <>
          {children}
          {isActive && (
            <span style={{ position: 'absolute', left: 12, right: 12, bottom: 2, height: 2, borderRadius: 2, background: 'var(--grad-sunset)' }} />
          )}
        </>
      )}
    </Link>
  );
}

export function Shell({ children }) {
  const { shell, author } = words;
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <div className="theme-ember words-app" style={{ minHeight: '100%', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'var(--grad-glow)', pointerEvents: 'none', zIndex: 0 }} />

      <header className="words-header" style={{
        position: 'sticky', top: 0, zIndex: 20,
        height: 'var(--header-h)', display: 'flex', alignItems: 'center',
        padding: '0 28px', gap: 24,
        background: 'rgba(11,8,23,0.72)',
        backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border-faint)',
      }}>
        <Link to="/words" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
          <img src={shell.brand.mark} alt="" style={{ width: 34, height: 34 }} />
          {/* Dual-voice wordmark (brand mark): mono "paul" + serif-italic "dolden".
              --accent resolves to oxblood here under .theme-ember. */}
          <span style={{ display: 'inline-flex', alignItems: 'baseline', whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 17, letterSpacing: '-0.01em', color: 'var(--text-strong)' }}>{shell.brand.codeWord}</span>
            <span style={{ fontFamily: 'var(--font-prose)', fontStyle: 'italic', fontWeight: 500, fontSize: 21, color: 'var(--accent)', marginLeft: 1 }}>{shell.brand.wordsWord}</span>
          </span>
        </Link>
        <nav className="words-nav" style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
          {shell.nav.map((n) => (
            <NavLink key={n.label} to={n.to} params={n.params} exact={n.exact}>{n.label}</NavLink>
          ))}
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button title="Search" onClick={() => setSearchOpen(true)} style={iconBtn}><Icon name="search" color="var(--text-muted)" /></button>
          <a href="/words/rss.xml" title="RSS feed" style={{ ...iconBtn, textDecoration: 'none' }}><Icon name="rss" color="var(--text-muted)" /></a>
          <Link to="/words/library" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, height: 38, padding: '0 16px',
            borderRadius: 'var(--r-pill)', border: '1.5px solid var(--border-neon)',
            background: 'rgba(255,46,151,0.06)', color: 'var(--magenta-300)',
            fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, textDecoration: 'none',
          }}>
            <Icon name="heart" size={15} color="var(--magenta-400)" /> {shell.follow}
          </Link>
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 1, flex: 1 }}>{children}</main>

      <footer style={{
        position: 'relative', zIndex: 1, marginTop: 'var(--space-12)',
        borderTop: '1px solid var(--border-faint)', padding: '36px 28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
      }}>
        <Link to={shell.codeHref} style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
          <img src={shell.brand.mark} alt="" style={{ width: 28, height: 28 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>{author.domain}</span>
        </Link>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-faint)' }}>
          {shell.footerLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              style={{ color: 'var(--text-faint)', textDecoration: 'none' }}
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

const iconBtn = {
  width: 38, height: 38, display: 'grid', placeItems: 'center',
  borderRadius: 'var(--r-sm)', border: '1px solid transparent',
  background: 'transparent', cursor: 'pointer',
};
