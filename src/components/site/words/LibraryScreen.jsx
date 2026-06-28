// LibraryScreen — filterable grid of all works.
// Copy from content/words; `stories` (catalog) from the route loader.
import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { StoryCard, Tag } from '../../ds/index.js';
import { words } from '../../../content/words';

export function LibraryScreen({ stories }) {
  const c = words.library;
  const navigate = useNavigate();
  const [active, setActive] = useState('All');

  const shown = stories.filter((s) => {
    if (active === 'All') return true;
    if (active === 'Complete') return s.status === 'complete';
    return s.tags.includes(active);
  });

  return (
    <div style={{ maxWidth: 'var(--width-wide)', margin: '0 auto', padding: '56px 28px 0' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cyan-400)', marginBottom: 12 }}>{c.eyebrow}</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(40px,6vw,64px)', letterSpacing: '0', color: 'var(--text-strong)', margin: 0 }}>
        {c.titleLead}<span className="pd-grad-text">{c.titleAccent}</span>
      </h1>
      <p style={{ marginTop: 16, maxWidth: 520, fontFamily: 'var(--font-ui)', fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.55 }}>
        {c.intro}
      </p>

      <div style={{ display: 'flex', gap: 9, marginTop: 32, flexWrap: 'wrap' }}>
        {c.filters.map((f) => (
          <Tag key={f} active={active === f} accent="cyan" onClick={() => setActive(f)}>{f}</Tag>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24, marginTop: 32 }}>
        {shown.map((s) => (
          <StoryCard key={s.id} title={s.title} blurb={s.blurb} coverColor={s.coverColor} status={s.status} tags={s.tags} meta={`${s.chapters} ch · ${s.words}`} onClick={() => navigate({ to: '/words/$storyId', params: { storyId: s.id } })} />
        ))}
      </div>
      {shown.length === 0 && (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-faint)', fontFamily: 'var(--font-ui)' }}>{c.empty}</div>
      )}
    </div>
  );
}
