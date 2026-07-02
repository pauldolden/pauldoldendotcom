import React from 'react';

/**
 * ReadingProgress — a thin gradient progress bar with optional percent label.
 * Use fixed at the top of the reader, or inline under a chapter title.
 */
export function ReadingProgress({ value = 0, showLabel = false, height = 4 }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex w-full items-center gap-3">
      <div className="relative flex-1 overflow-hidden rounded-pill bg-night-600" style={{ height }}>
        <div
          className="absolute inset-0 bg-grad-sunset shadow-[0_0_12px_-1px_rgba(255,46,151,0.6)] [transition:right_var(--dur-slow)_var(--ease-out)]"
          style={{ right: `${100 - pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="min-w-[36px] text-right font-code text-xs tabular-nums text-muted">{Math.round(pct)}%</span>
      )}
    </div>
  );
}
