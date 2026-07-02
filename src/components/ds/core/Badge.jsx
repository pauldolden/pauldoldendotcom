import React from 'react';

/**
 * Badge — a small status pill. Tuned for serial states:
 * ongoing, complete, hiatus, plus neutral / neon tones.
 * Set `dot` for a leading status dot.
 *
 * The `theme-ember:` utilities revert the chamfer + dot glow to the grimoire's
 * squared matte treatment on the words side (was styles/theme-overrides.css).
 */
const TONES = {
  ongoing:  { fg: 'text-status-ongoing',  bg: 'bg-[rgba(46,230,160,0.12)]', bd: 'border-[rgba(46,230,160,0.4)]', dot: 'bg-status-ongoing shadow-[0_0_8px_var(--status-ongoing)]' },
  complete: { fg: 'text-status-complete', bg: 'bg-[rgba(34,211,238,0.12)]', bd: 'border-[rgba(34,211,238,0.4)]', dot: 'bg-status-complete shadow-[0_0_8px_var(--status-complete)]' },
  hiatus:   { fg: 'text-status-hiatus',   bg: 'bg-[rgba(255,206,79,0.12)]', bd: 'border-[rgba(255,206,79,0.4)]', dot: 'bg-status-hiatus shadow-[0_0_8px_var(--status-hiatus)]' },
  danger:   { fg: 'text-status-danger',   bg: 'bg-[rgba(255,77,109,0.12)]', bd: 'border-[rgba(255,77,109,0.4)]', dot: 'bg-status-danger shadow-[0_0_8px_var(--status-danger)]' },
  magenta:  { fg: 'text-magenta-300',     bg: 'bg-[rgba(255,46,151,0.12)]', bd: 'border-[rgba(255,46,151,0.4)]', dot: 'bg-magenta-300 shadow-[0_0_8px_var(--magenta-300)]' },
  purple:   { fg: 'text-purple-300',      bg: 'bg-[rgba(168,85,247,0.14)]', bd: 'border-[rgba(168,85,247,0.4)]', dot: 'bg-purple-300 shadow-[0_0_8px_var(--purple-300)]' },
  neutral:  { fg: 'text-mist-300',        bg: 'bg-[rgba(93,65,150,0.16)]',  bd: 'border-line',                   dot: 'bg-mist-300 shadow-[0_0_8px_var(--mist-300)]' },
};

const SIZES = {
  sm: 'h-5 gap-[5px] px-[9px] text-[0.6875rem] [clip-path:polygon(5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%,0_5px)]',
  md: 'h-6 gap-1.5 px-[11px] text-xs [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]',
};

export function Badge({ children, tone = 'neutral', dot = false, size = 'md', overlay = false, className = '', ...rest }) {
  const t = TONES[tone] || TONES.neutral;

  // `overlay`: sitting on a procedural cover of unknown brightness — swap the tone
  // wash for a dark scrim pill so the status stays legible on any art.
  const surface = overlay
    ? 'bg-[rgba(8,5,16,0.72)] backdrop-blur-[3px] shadow-[0_2px_8px_rgba(0,0,0,0.5)]'
    : t.bg;

  const cls = [
    'inline-flex items-center whitespace-nowrap border font-code font-medium uppercase leading-none tracking-wide',
    'theme-ember:[clip-path:none] theme-ember:rounded-pill',
    SIZES[size] || SIZES.md,
    t.fg, t.bd, surface, className,
  ].filter(Boolean).join(' ');

  return (
    <span className={cls} {...rest}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full theme-ember:shadow-none ${t.dot}`} />}
      {children}
    </span>
  );
}
