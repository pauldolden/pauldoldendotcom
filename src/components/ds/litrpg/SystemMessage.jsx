import React from 'react';

/**
 * SystemMessage — the LitRPG "System" notification box that interrupts prose.
 * Monospace, neon-bordered, with a bracketed header. Tones map to event type.
 * The tone drives border/bg/glow via three CSS vars (--sc, --sc-bg, --sc-glow).
 */
const TONES = {
  cyan:    { c: 'var(--cyan-400)',    bg: 'rgba(34,211,238,0.07)', glow: 'rgba(34,211,238,0.5)' },
  magenta: { c: 'var(--magenta-400)', bg: 'rgba(255,46,151,0.07)', glow: 'rgba(255,46,151,0.5)' },
  purple:  { c: 'var(--purple-400)',  bg: 'rgba(168,85,247,0.08)', glow: 'rgba(168,85,247,0.5)' },
  gold:    { c: 'var(--gold-500)',    bg: 'rgba(255,206,79,0.07)', glow: 'rgba(255,206,79,0.5)' },
  danger:  { c: 'var(--red-500)',     bg: 'rgba(255,77,109,0.07)', glow: 'rgba(255,77,109,0.5)' },
};

const TICK = 'absolute h-[9px] w-[9px] border-[var(--sc)]';

export function SystemMessage({ children, title = 'SYSTEM', tone = 'cyan', icon = '◈' }) {
  const t = TONES[tone] || TONES.cyan;
  return (
    <aside
      role="note"
      style={{ '--sc': t.c, '--sc-bg': t.bg, '--sc-glow': t.glow }}
      className="relative my-[1.8em] overflow-hidden rounded-md border-[1.5px] border-[var(--sc)] bg-[var(--sc-bg)] font-code shadow-[0_0_26px_-8px_var(--sc-glow),inset_0_0_30px_-16px_var(--sc-glow)]"
    >
      {/* corner ticks */}
      <span aria-hidden className={`${TICK} left-[-1px] top-[-1px] border-l-2 border-t-2`} />
      <span aria-hidden className={`${TICK} right-[-1px] top-[-1px] border-r-2 border-t-2`} />
      <span aria-hidden className={`${TICK} bottom-[-1px] left-[-1px] border-b-2 border-l-2`} />
      <span aria-hidden className={`${TICK} bottom-[-1px] right-[-1px] border-b-2 border-r-2`} />

      <div className="flex items-center gap-[9px] border-b border-[var(--sc)] bg-[linear-gradient(90deg,var(--sc-bg),transparent)] px-[14px] py-2 text-xs font-bold uppercase tracking-wider text-[var(--sc)]">
        <span aria-hidden className="[text-shadow:0_0_10px_var(--sc-glow)]">{icon}</span>
        <span>[ {title} ]</span>
      </div>
      <div className="px-4 py-[14px] text-sm leading-[1.65] text-body">{children}</div>
    </aside>
  );
}
