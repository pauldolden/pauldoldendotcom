import React from 'react';

/**
 * Tag — a genre / topic chip. Lower-key than Badge, sentence-case,
 * for filtering and labeling (e.g. "LitRPG", "Cyberpunk", "Slow burn").
 * Interactive when `onClick`/`active` are passed.
 */
export function Tag({ children, active = false, accent = 'purple', onClick, ...rest }) {
  const accents = {
    purple:  'var(--purple-400)',
    magenta: 'var(--magenta-400)',
    cyan:    'var(--cyan-400)',
  };
  const c = accents[accent] || accents.purple;
  const interactive = !!onClick;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 30,
        padding: '0 13px',
        borderRadius: 'var(--r-pill)',
        border: `1.5px solid ${active ? c : 'var(--border)'}`,
        background: active ? 'rgba(168,85,247,0.16)' : 'var(--bg-raised)',
        color: active ? 'var(--paper-100)' : 'var(--mist-300)',
        fontFamily: 'var(--font-ui)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-medium)',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'var(--t-control)',
        whiteSpace: 'nowrap',
        boxShadow: active ? `0 0 16px -6px ${c}` : 'none',
      }}
      {...rest}
    >
      <span aria-hidden style={{ color: c, fontSize: '0.8em', opacity: active ? 1 : 0.7 }}>#</span>
      {children}
    </button>
  );
}
