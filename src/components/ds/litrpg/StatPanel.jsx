import React from 'react';

/**
 * StatPanel — a character status sheet. Renders a name/title header, level,
 * and a list of stats. Each stat can show a bar (value/max) or a flat figure.
 */
export function StatPanel({ name, title, level, stats = [], hp }) {
  return (
    <div className="max-w-[360px] overflow-hidden rounded-lg border-[1.5px] border-line-cyan bg-[linear-gradient(180deg,rgba(34,211,238,0.05),rgba(13,10,24,0.6))] font-code shadow-glow-cyan">
      <div className="flex items-center justify-between gap-3 border-b border-line-cyan px-4 py-[14px]">
        <div>
          <div className="font-heading text-lg font-bold leading-[1.1] text-strong">{name}</div>
          {title && <div className="mt-[3px] text-xs uppercase tracking-[0.08em] text-cyan-400">{title}</div>}
        </div>
        {level != null && (
          <div className="shrink-0 text-center">
            <div className="text-[10px] tracking-[0.16em] text-faint">LVL</div>
            <div className="pd-grad-text font-heading text-2xl font-bold leading-none">{level}</div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 px-4 py-[14px]">
        {hp && <StatBar label={hp.label || 'HP'} value={hp.value} max={hp.max} color="var(--magenta-500)" />}
        {stats.map((s) => (
          s.max != null
            ? <StatBar key={s.label} label={s.label} value={s.value} max={s.max} color={s.color || 'var(--cyan-500)'} />
            : (
              <div key={s.label} className="flex items-baseline justify-between border-b border-dashed border-line-faint pb-[7px]">
                <span className="text-sm uppercase tracking-wide text-muted">{s.label}</span>
                <span className="text-md font-bold tabular-nums text-strong">{s.value}</span>
              </div>
            )
        ))}
      </div>
    </div>
  );
}

function StatBar({ label, value, max, color }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div className="mb-[5px] flex justify-between text-xs uppercase tracking-[0.06em]">
        <span className="text-muted">{label}</span>
        <span className="tabular-nums text-body">{value} / {max}</span>
      </div>
      <div className="h-[7px] overflow-hidden rounded-pill bg-night-600">
        <div
          className="h-full rounded-pill [transition:width_var(--dur-slow)_var(--ease-out)]"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 10px -1px ${color}` }}
        />
      </div>
    </div>
  );
}
