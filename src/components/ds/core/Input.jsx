import React from 'react';

/**
 * Input — text field with optional label, leading icon and hint/error.
 * Dark surface, cyan focus glow.
 */
export function Input({
  label,
  hint,
  error,
  iconLeft = null,
  id,
  full = true,
  ...rest
}) {
  const inputId = id || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return (
    <label htmlFor={inputId} style={{ display: full ? 'block' : 'inline-block', width: full ? '100%' : undefined }}>
      {label && (
        <span style={{
          display: 'block',
          marginBottom: 7,
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}>{label}</span>
      )}
      <span style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        height: 46,
        padding: '0 14px',
        borderRadius: 'var(--r-md)',
        background: 'var(--bg-surface)',
        border: `1.5px solid ${error ? 'var(--status-danger)' : 'var(--border)'}`,
        transition: 'var(--t-control)',
      }}>
        {iconLeft && <span style={{ color: 'var(--text-faint)', display: 'inline-flex' }}>{iconLeft}</span>}
        <input
          id={inputId}
          style={{
            flex: 1,
            minWidth: 0,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-body)',
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-base)',
          }}
          {...rest}
        />
      </span>
      {(hint || error) && (
        <span style={{
          display: 'block',
          marginTop: 6,
          fontSize: 'var(--text-sm)',
          color: error ? 'var(--status-danger)' : 'var(--text-faint)',
        }}>{error || hint}</span>
      )}
    </label>
  );
}
