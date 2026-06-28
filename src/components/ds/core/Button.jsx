import React from 'react';

/**
 * Button — the primary interactive control.
 * Variants: neon (filled gradient), solid (flat magenta), outline (neon ring),
 * ghost (text only), cyan (cool alt). Sizes: sm | md | lg.
 */
export function Button({
  children,
  variant = 'neon',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  disabled = false,
  full = false,
  as = 'button',
  ...rest
}) {
  const sizes = {
    sm: { padding: '0 14px', height: 34, fontSize: 'var(--text-sm)', gap: 6, radius: 'var(--r-sm)' },
    md: { padding: '0 20px', height: 44, fontSize: 'var(--text-base)', gap: 8, radius: 'var(--r-md)' },
    lg: { padding: '0 30px', height: 54, fontSize: 'var(--text-md)', gap: 10, radius: 'var(--r-md)' },
  };
  const s = sizes[size] || sizes.md;

  const base = {
    display: full ? 'flex' : 'inline-flex',
    width: full ? '100%' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    height: s.height,
    padding: s.padding,
    borderRadius: s.radius,
    fontFamily: 'var(--font-ui)',
    fontSize: s.fontSize,
    fontWeight: 'var(--fw-semibold)',
    letterSpacing: '0.01em',
    lineHeight: 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: '1.5px solid transparent',
    transition: 'var(--t-control)',
    whiteSpace: 'nowrap',
    opacity: disabled ? 0.45 : 1,
    userSelect: 'none',
  };

  const variants = {
    neon: {
      background: 'var(--grad-sunset)',
      color: 'var(--text-on-neon)',
      boxShadow: '0 0 22px -4px rgba(255,46,151,0.6)',
      fontWeight: 'var(--fw-bold)',
    },
    solid: {
      background: 'var(--magenta-500)',
      color: 'var(--text-on-neon)',
      boxShadow: '0 0 18px -6px rgba(255,46,151,0.55)',
    },
    cyan: {
      background: 'var(--cyan-500)',
      color: '#062028',
      boxShadow: '0 0 18px -6px rgba(34,211,238,0.55)',
    },
    outline: {
      background: 'rgba(255,46,151,0.06)',
      color: 'var(--magenta-300)',
      borderColor: 'var(--border-neon)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-muted)',
      borderColor: 'transparent',
    },
  };

  const Tag = as;
  return (
    <Tag
      style={{ ...base, ...(variants[variant] || variants.neon) }}
      disabled={as === 'button' ? disabled : undefined}
      {...rest}
    >
      {iconLeft && <span style={{ display: 'inline-flex', fontSize: '1.1em' }}>{iconLeft}</span>}
      {children}
      {iconRight && <span style={{ display: 'inline-flex', fontSize: '1.1em' }}>{iconRight}</span>}
    </Tag>
  );
}
