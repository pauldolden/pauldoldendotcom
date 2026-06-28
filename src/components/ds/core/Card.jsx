import React from 'react';

/**
 * Card — the base surface container. Variants control the edge treatment.
 * `glow` adds a neon ring, `glass` is translucent for use over splash/gradient art.
 */
export function Card({
  children,
  variant = 'raised',
  glow = null,
  padding = 'var(--gutter)',
  as = 'div',
  ...rest
}) {
  const variants = {
    raised: {
      background: 'var(--bg-raised)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-md), var(--edge-light)',
    },
    flat: {
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-faint)',
    },
    glass: {
      background: 'var(--glass)',
      border: '1px solid var(--glass-border)',
      backdropFilter: 'blur(var(--blur-md))',
      WebkitBackdropFilter: 'blur(var(--blur-md))',
    },
    outline: {
      background: 'transparent',
      border: '1.5px solid var(--border-strong)',
    },
  };
  const glows = {
    magenta: 'var(--glow-magenta)',
    cyan: 'var(--glow-cyan)',
    purple: 'var(--glow-purple)',
  };
  const Tag = as;

  return (
    <Tag
      style={{
        borderRadius: 'var(--r-lg)',
        padding,
        color: 'var(--text-body)',
        ...(variants[variant] || variants.raised),
        ...(glow ? { boxShadow: glows[glow] } : null),
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
