// SearchOverlay — library search modal opened from the header. Pulls the
// catalog via the getCatalog server fn (R2/sample) and filters client-side
// by title / blurb / tag. Esc or backdrop click closes.
import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { Icon } from '../../ds/index.js';
import { getCatalog } from '../../../server/stories';
import { words } from '../../../content/words';

export function SearchOverlay({ open, onClose }) {
  const fetchCatalog = useServerFn(getCatalog);
  const [stories, setStories] = useState(null);
  const [q, setQ] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setQ('');
    if (!stories) fetchCatalog().then((c) => setStories(c.stories)).catch(() => setStories([]));
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const query = q.trim().toLowerCase();
  const results = (stories ?? []).filter((s) => {
    if (!query) return true;
    return (
      s.title.toLowerCase().includes(query) ||
      s.blurb.toLowerCase().includes(query) ||
      s.tags.some((t) => t.toLowerCase().includes(query))
    );
  });

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'var(--bg-overlay)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '14vh 20px 20px' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="theme-ember"
        style={{ width: '100%', maxWidth: 560, background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
          <Icon name="search" size={18} color="var(--text-muted)" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={words.search.placeholder}
            style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-body)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-md)' }}
          />
          <button onClick={onClose} title="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>ESC</button>
        </div>

        <div style={{ maxHeight: '52vh', overflowY: 'auto' }}>
          {stories === null && (
            <div style={{ padding: '24px 16px', color: 'var(--text-faint)', fontFamily: 'var(--font-ui)' }}>Loading…</div>
          )}
          {stories !== null && results.length === 0 && (
            <div style={{ padding: '24px 16px', color: 'var(--text-faint)', fontFamily: 'var(--font-ui)' }}>{words.search.empty}</div>
          )}
          {results.map((s) => (
            <Link
              key={s.id}
              to="/words/$storyId"
              params={{ storyId: s.id }}
              onClick={onClose}
              style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', borderBottom: '1px solid var(--border-faint)' }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--text-strong)' }}>{s.title}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-faint)' }}>{s.status}</span>
              </div>
              <div style={{ marginTop: 3, fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.blurb}</div>
            </Link>
          ))}
        </div>

        <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.04em', color: 'var(--text-faint)' }}>{words.search.hint}</div>
      </div>
    </div>
  );
}
