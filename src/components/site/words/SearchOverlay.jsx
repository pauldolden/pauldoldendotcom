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
      className="fixed inset-0 z-[60] flex items-start justify-center bg-overlay px-5 pb-5 pt-[14vh] backdrop-blur-[6px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="theme-ember w-full max-w-[560px] overflow-hidden rounded-lg border border-glass-line bg-surface shadow-xl"
      >
        <div className="flex items-center gap-2.5 border-b border-line px-4 py-[14px]">
          <Icon name="search" size={18} color="var(--text-muted)" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={words.search.placeholder}
            className="min-w-0 flex-1 border-none bg-transparent font-sans text-md text-body outline-none"
          />
          <button onClick={onClose} title="Close" className="cursor-pointer border-none bg-none font-code text-xs text-faint">ESC</button>
        </div>

        <div className="max-h-[52vh] overflow-y-auto">
          {stories === null && (
            <div className="px-4 py-6 font-sans text-faint">Loading…</div>
          )}
          {stories !== null && results.length === 0 && (
            <div className="px-4 py-6 font-sans text-faint">{words.search.empty}</div>
          )}
          {results.map((s) => (
            <Link
              key={s.id}
              to="/words/$storyId"
              params={{ storyId: s.id }}
              onClick={onClose}
              className="block border-b border-line-faint px-4 py-3 no-underline"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-heading text-md font-bold text-strong">{s.title}</span>
                <span className="font-code text-xs uppercase tracking-[0.06em] text-faint">{s.status}</span>
              </div>
              <div className="mt-[3px] truncate font-sans text-sm text-muted">{s.blurb}</div>
            </Link>
          ))}
        </div>

        <div className="border-t border-line px-4 py-2 font-code text-[11px] tracking-wide text-faint">{words.search.hint}</div>
      </div>
    </div>
  );
}
