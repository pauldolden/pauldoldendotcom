// LibraryScreen — filterable grid of all works.
// Copy from content/words; `stories` (catalog) from the route loader.
import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { StoryCard, Tag } from '../../ds/index.js';
import { words } from '../../../content/words';

export function LibraryScreen({ stories }) {
  const c = words.library;
  const all = c.allLabel;
  const navigate = useNavigate();
  const [active, setActive] = useState(all);

  // Smart tags: derive the filter chips from what's actually on the shelf.
  // Count each genre tag across the catalog, sort by frequency, hide empties.
  const counts = {};
  for (const s of stories) for (const t of s.tags || []) counts[t] = (counts[t] || 0) + 1;
  const genres = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
  const filters = [all, ...genres];

  const shown = active === all ? stories : stories.filter((s) => (s.tags || []).includes(active));

  return (
    <div className="mx-auto max-w-wide px-7 pt-14">
      <div className="mb-3 font-code text-xs uppercase tracking-[0.2em] text-cyan-400">{c.eyebrow}</div>
      <h1 className="m-0 font-heading text-[clamp(40px,6vw,64px)] font-bold text-strong">
        {c.titleLead}<span className="pd-grad-text">{c.titleAccent}</span>
      </h1>
      <p className="mt-4 max-w-[520px] font-sans text-[18px] leading-[1.55] text-muted">
        {c.intro}
      </p>

      <div className="mt-8 flex flex-wrap gap-[9px]">
        {filters.map((f) => (
          <Tag key={f} active={active === f} accent="cyan" onClick={() => setActive(f)}>
            {f} · {f === all ? stories.length : counts[f]}
          </Tag>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        {shown.map((s) => (
          <StoryCard key={s.id} id={s.id} title={s.title} blurb={s.blurb} coverColor={s.coverColor} coverStyle={s.coverStyle} status={s.status} tags={s.tags} meta={s.chapters > 0 ? `${s.chapters} ch · ${s.words}` : `${s.words} planned`} onClick={() => navigate({ to: '/words/$storyId', params: { storyId: s.id } })} />
        ))}
      </div>
      {shown.length === 0 && (
        <div className="py-[60px] text-center font-sans text-faint">{c.empty}</div>
      )}
    </div>
  );
}
