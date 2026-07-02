import React from 'react';

/**
 * Button — the primary interactive control.
 * Variants: neon (filled pink), solid (flat magenta), outline (neon ring),
 * ghost (text only), cyan (cool alt). Sizes: sm | md | lg.
 * Hard-edged "prism" silhouette: corners are chamfered, never rounded.
 * Pass `tech` for the uppercase display-font treatment used on the /code side.
 *
 * The `theme-ember:` utilities revert the chamfer + neon glow to the grimoire's
 * matte squared treatment on the words side (was styles/theme-overrides.css).
 */

// chamfer top-left + bottom-right for the angular tech silhouette (per size)
const SIZES = {
  sm: 'h-[34px] gap-1.5 px-4 text-sm [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]',
  md: 'h-[44px] gap-2 px-[22px] text-base [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)]',
  lg: 'h-[54px] gap-2.5 px-8 text-md [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]',
};

// glow rides on `filter` (drop-shadow), not box-shadow — clip-path would crop a box-shadow
const VARIANTS = {
  neon: 'bg-grad-sunset text-on-neon font-bold [filter:drop-shadow(0_0_16px_rgba(255,46,151,0.55))]',
  solid: 'bg-magenta-500 text-on-neon [filter:drop-shadow(0_0_13px_rgba(255,46,151,0.45))]',
  cyan: 'bg-cyan-500 text-[#062028] [filter:drop-shadow(0_0_13px_rgba(34,211,238,0.45))]',
  outline: 'bg-[rgba(255,46,151,0.06)] text-magenta-300 border-line-neon',
  ghost: 'bg-transparent text-muted border-transparent',
};

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
  style,
  ...rest
}) {
  const Tag = as;
  const cls = [
    'items-center justify-center font-semibold leading-none whitespace-nowrap select-none',
    'border-[1.5px] border-transparent transition-control',
    'theme-ember:[clip-path:none] theme-ember:rounded-md theme-ember:[filter:none]',
    full ? 'flex w-full' : 'inline-flex',
    tech ? 'font-heading uppercase tracking-[0.09em]' : 'font-sans tracking-[0.01em]',
    disabled ? 'cursor-not-allowed opacity-[0.45]' : 'cursor-pointer',
    SIZES[size] || SIZES.md,
    VARIANTS[variant] || VARIANTS.neon,
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag
      className={cls}
      style={style}
      disabled={as === 'button' ? disabled : undefined}
      {...rest}
    >
      {iconLeft && <span className="inline-flex text-[1.1em]">{iconLeft}</span>}
      {children}
      {iconRight && <span className="inline-flex text-[1.1em]">{iconRight}</span>}
    </Tag>
  );
}
