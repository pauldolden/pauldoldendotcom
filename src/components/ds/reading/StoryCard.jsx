import React from 'react';
import { Badge } from '../core/Badge.jsx';
import { Tag } from '../core/Tag.jsx';

/**
 * StoryCard — a serial/work cover card for library grids and featured rails.
 * Cover art goes in the `cover` slot (an <img> or a gradient placeholder).
 */
export function StoryCard({
  title,
  blurb,
  cover = null,
  coverColor = 'var(--grad-sunset)',
  status = 'ongoing',
  statusLabel,
  tags = [],
  meta,
  onClick,
}) {
  const statusText = statusLabel || ({ ongoing: 'Ongoing', complete: 'Complete', hiatus: 'Hiatus' }[status] || status);
  return (
    <article
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-raised)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md), var(--edge-light)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'var(--t-control)',
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '3 / 2', background: cover ? 'var(--night-800)' : coverColor }}>
        {cover}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(7,5,14,0) 45%, rgba(7,5,14,0.78) 100%)' }} />
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <Badge tone={status} dot>{statusText}</Badge>
        </div>
      </div>
      <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-xl)', color: 'var(--text-heading)', lineHeight: 1.15, margin: 0 }}>{title}</h3>
        {blurb && <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.55, fontFamily: 'var(--font-ui)' }}>{blurb}</p>}
        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 2 }}>
            {tags.slice(0, 3).map((t) => <Tag key={t}>{t}</Tag>)}
          </div>
        )}
        {meta && (
          <div style={{ marginTop: 4, paddingTop: 12, borderTop: '1px solid var(--border-faint)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.04em', color: 'var(--text-faint)', textTransform: 'uppercase' }}>{meta}</div>
        )}
      </div>
    </article>
  );
}
