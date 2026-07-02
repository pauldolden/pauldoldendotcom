import React from 'react';

/**
 * Card — the base surface container. Variants control the edge treatment.
 * `glow` adds a neon ring, `glass` is translucent for use over splash/gradient art.
 */
const VARIANTS = {
  raised: 'bg-raised border border-line',
  flat: 'bg-surface border border-line-faint',
  glass: 'bg-glass border border-glass-line backdrop-blur-[var(--blur-md)]',
  outline: 'bg-transparent border-[1.5px] border-line-strong',
};
const VARIANT_SHADOW = { raised: 'shadow-[var(--shadow-md),var(--edge-light)]' };
const GLOW = { magenta: 'shadow-glow-magenta', cyan: 'shadow-glow-cyan', purple: 'shadow-glow-purple' };

export function Card({
  children,
  variant = 'raised',
  glow = null,
  padding = 'var(--gutter)',
  as = 'div',
  className = '',
  style,
  ...rest
}) {
  const Tag = as;
  const cls = [
    'rounded-lg text-body',
    VARIANTS[variant] || VARIANTS.raised,
    glow ? (GLOW[glow] || '') : (VARIANT_SHADOW[variant] || ''),
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag className={cls} style={{ padding, ...style }} {...rest}>
      {children}
    </Tag>
  );
}
