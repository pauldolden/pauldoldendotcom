import React from 'react';

/**
 * PullQuote — an inset emphasis quote for chapters and essays.
 * Big serif, gradient bar, optional attribution.
 */
export function PullQuote({ children, cite, accent = 'magenta' }) {
  const bar = { magenta: 'var(--magenta-500)', cyan: 'var(--cyan-500)', purple: 'var(--purple-500)' }[accent] || 'var(--magenta-500)';
  return (
    <figure style={{ margin: '2.2em 0', display: 'flex', gap: 22 }}>
      <span style={{
        width: 4, flexShrink: 0, borderRadius: 'var(--r-pill)',
        background: 'var(--grad-sunset)',
        boxShadow: `0 0 16px -2px ${bar}`,
      }} />
      <div>
        <blockquote style={{
          margin: 0,
          fontFamily: 'var(--font-prose)',
          fontStyle: 'italic',
          fontSize: 'var(--text-2xl)',
          lineHeight: 1.32,
          color: 'var(--text-strong)',
          textWrap: 'balance',
        }}>{children}</blockquote>
        {cite && (
          <figcaption style={{
            marginTop: 12,
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}>— {cite}</figcaption>
        )}
      </div>
    </figure>
  );
}
