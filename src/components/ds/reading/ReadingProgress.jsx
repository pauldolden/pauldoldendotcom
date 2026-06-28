import React from 'react';

/**
 * ReadingProgress — a thin gradient progress bar with optional percent label.
 * Use fixed at the top of the reader, or inline under a chapter title.
 */
export function ReadingProgress({ value = 0, showLabel = false, height = 4 }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
      <div style={{
        position: 'relative',
        flex: 1,
        height,
        borderRadius: 'var(--r-pill)',
        background: 'var(--night-600)',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, right: `${100 - pct}%`,
          background: 'var(--grad-sunset)',
          boxShadow: '0 0 12px -1px rgba(255,46,151,0.6)',
          transition: 'right var(--dur-slow) var(--ease-out)',
        }} />
      </div>
      {showLabel && (
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums',
          minWidth: 36, textAlign: 'right',
        }}>{Math.round(pct)}%</span>
      )}
    </div>
  );
}
