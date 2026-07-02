import React from 'react';

/**
 * Tag — a genre / topic chip. Lower-key than Badge, sentence-case,
 * for filtering and labeling (e.g. "LitRPG", "Cyberpunk", "Slow burn").
 * Interactive when `onClick`/`active` are passed.
 */
const ACCENTS = {
  purple:  { border: 'border-purple-400',  shadow: 'shadow-[0_0_16px_-6px_var(--purple-400)]',  hash: 'text-purple-400' },
  magenta: { border: 'border-magenta-400', shadow: 'shadow-[0_0_16px_-6px_var(--magenta-400)]', hash: 'text-magenta-400' },
  cyan:    { border: 'border-cyan-400',    shadow: 'shadow-[0_0_16px_-6px_var(--cyan-400)]',    hash: 'text-cyan-400' },
};

export function Tag({ children, active = false, accent = 'purple', onClick, className = '', ...rest }) {
  const a = ACCENTS[accent] || ACCENTS.purple;
  const cls = [
    'inline-flex items-center gap-1.5 h-[30px] px-[13px] rounded-pill border-[1.5px]',
    'font-sans text-sm font-medium whitespace-nowrap transition-control',
    onClick ? 'cursor-pointer' : 'cursor-default',
    active
      ? `${a.border} ${a.shadow} bg-[rgba(168,85,247,0.16)] text-paper-100`
      : 'border-line bg-raised text-mist-300',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button type="button" onClick={onClick} className={cls} {...rest}>
      <span aria-hidden className={`text-[0.8em] ${a.hash} ${active ? 'opacity-100' : 'opacity-70'}`}>#</span>
      {children}
    </button>
  );
}
