import React from 'react';

/**
 * ChapterRow — a single chapter line in a table-of-contents list.
 * Shows index, title, date, optional "new" + read states.
 */
export function ChapterRow({ index, title, date, words, isNew = false, read = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        width: '100%',
        textAlign: 'left',
        padding: '14px 16px',
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid var(--border-faint)',
        cursor: 'pointer',
        transition: 'var(--t-control)',
        color: 'inherit',
        fontFamily: 'var(--font-ui)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-inset)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
        color: 'var(--mist-500)', width: 34, flexShrink: 0, textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
      }}>{String(index).padStart(2, '0')}</span>
      <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          fontSize: 'var(--text-md)', fontWeight: 'var(--fw-medium)',
          color: read ? 'var(--text-faint)' : 'var(--text-body)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{title}</span>
        {isNew && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--text-on-neon)',
            background: 'var(--cyan-500)', borderRadius: 'var(--r-pill)',
            padding: '2px 7px', flexShrink: 0, fontWeight: 600,
          }}>New</span>
        )}
      </span>
      {words && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--mist-500)', flexShrink: 0 }}>{words}</span>}
      {date && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-faint)', flexShrink: 0, width: 92, textAlign: 'right' }}>{date}</span>}
    </button>
  );
}
