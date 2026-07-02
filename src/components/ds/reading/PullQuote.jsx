import React from 'react';

/**
 * PullQuote — an inset emphasis quote for chapters and essays.
 * Big serif, gradient bar, optional attribution.
 */
const BAR = {
  magenta: 'shadow-[0_0_16px_-2px_var(--magenta-500)]',
  cyan: 'shadow-[0_0_16px_-2px_var(--cyan-500)]',
  purple: 'shadow-[0_0_16px_-2px_var(--purple-500)]',
};

export function PullQuote({ children, cite, accent = 'magenta' }) {
  return (
    <figure className="my-[2.2em] flex gap-[22px]">
      <span className={`w-1 shrink-0 rounded-pill bg-grad-sunset ${BAR[accent] || BAR.magenta}`} />
      <div>
        <blockquote className="m-0 text-balance font-serif text-2xl italic leading-[1.32] text-strong">{children}</blockquote>
        {cite && (
          <figcaption className="mt-3 font-code text-sm uppercase tracking-[0.06em] text-muted">— {cite}</figcaption>
        )}
      </div>
    </figure>
  );
}
