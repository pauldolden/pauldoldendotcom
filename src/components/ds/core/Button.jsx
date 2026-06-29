import React from 'react';

/**
 * Button — the primary interactive control.
 * Variants: neon (filled pink), solid (flat magenta), outline (neon ring),
 * ghost (text only), cyan (cool alt). Sizes: sm | md | lg.
 * Hard-edged "prism" silhouette: corners are chamfered, never rounded.
 * Pass `tech` for the uppercase display-font treatment used on the /code side.
 *
 * Carries the `pd-btn` hook class so the .theme-ember (words / grimoire) side
 * can revert the chamfer + neon glow to its matte squared treatment — see
 * styles/theme-overrides.css. The button restyle is a CODE-side change only.
 */
export function Button({
  children,
  variant = 'neon',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  disabled = false,
  full = false,
  tech = false,
  as = 'button',
  className = '',
  style: styleOverride,
  ...rest
}) {
  const sizes = {
    sm: { padding: '0 16px', height: 34, fontSize: 'var(--text-sm)', gap: 6, chamfer: 8 },
    md: { padding: '0 22px', height: 44, fontSize: 'var(--text-base)', gap: 8, chamfer: 10 },
    lg: { padding: '0 32px', height: 54, fontSize: 'var(--text-md)', gap: 10, chamfer: 12 },
  };
  const s = sizes[size] || sizes.md;
  const c = s.chamfer;
  // Chamfer top-left + bottom-right for an angular, tech silhouette.
  const clip = `polygon(${c}px 0, 100% 0, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, 0 100%, 0 ${c}px)`;

  const base = {
    display: full ? 'flex' : 'inline-flex',
    width: full ? '100%' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    height: s.height,
    padding: s.padding,
    clipPath: clip,
    WebkitClipPath: clip,
    fontFamily: tech ? 'var(--font-display)' : 'var(--font-ui)',
    fontSize: s.fontSize,
    fontWeight: 'var(--fw-semibold)',
    letterSpacing: tech ? '0.09em' : '0.01em',
    textTransform: tech ? 'uppercase' : 'none',
    lineHeight: 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: '1.5px solid transparent',
    transition: 'var(--t-control)',
    whiteSpace: 'nowrap',
    opacity: disabled ? 0.45 : 1,
    userSelect: 'none',
  };

  // Glow rides on `filter` (drop-shadow), not box-shadow — clip-path would
  // otherwise crop a box-shadow to the chamfered silhouette.
  const variants = {
    neon: {
      background: 'var(--grad-sunset)',
      color: 'var(--text-on-neon)',
      filter: 'drop-shadow(0 0 16px rgba(255,46,151,0.55))',
      fontWeight: 'var(--fw-bold)',
    },
    solid: {
      background: 'var(--magenta-500)',
      color: 'var(--text-on-neon)',
      filter: 'drop-shadow(0 0 13px rgba(255,46,151,0.45))',
    },
    cyan: {
      background: 'var(--cyan-500)',
      color: '#062028',
      filter: 'drop-shadow(0 0 13px rgba(34,211,238,0.45))',
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
      className={['pd-btn', className].filter(Boolean).join(' ')}
      style={{ ...base, ...(variants[variant] || variants.neon), ...styleOverride }}
      disabled={as === 'button' ? disabled : undefined}
      {...rest}
    >
      {iconLeft && <span style={{ display: 'inline-flex', fontSize: '1.1em' }}>{iconLeft}</span>}
      {children}
      {iconRight && <span style={{ display: 'inline-flex', fontSize: '1.1em' }}>{iconRight}</span>}
    </Tag>
  );
}
