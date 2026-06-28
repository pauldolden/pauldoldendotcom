import React from 'react';

/**
 * SystemMessage — the LitRPG "System" notification box that interrupts prose.
 * Monospace, neon-bordered, with a bracketed header. Tones map to event type.
 */
export function SystemMessage({ children, title = 'SYSTEM', tone = 'cyan', icon = '◈' }) {
  const tones = {
    cyan:    { c: 'var(--cyan-400)',    bg: 'rgba(34,211,238,0.07)',  glow: 'rgba(34,211,238,0.5)' },
    magenta: { c: 'var(--magenta-400)', bg: 'rgba(255,46,151,0.07)',  glow: 'rgba(255,46,151,0.5)' },
    purple:  { c: 'var(--purple-400)',  bg: 'rgba(168,85,247,0.08)',  glow: 'rgba(168,85,247,0.5)' },
    gold:    { c: 'var(--gold-500)',    bg: 'rgba(255,206,79,0.07)',  glow: 'rgba(255,206,79,0.5)' },
    danger:  { c: 'var(--red-500)',     bg: 'rgba(255,77,109,0.07)',  glow: 'rgba(255,77,109,0.5)' },
  };
  const t = tones[tone] || tones.cyan;
  return (
    <aside
      role="note"
      style={{
        position: 'relative',
        margin: '1.8em 0',
        borderRadius: 'var(--r-md)',
        border: `1.5px solid ${t.c}`,
        background: t.bg,
        boxShadow: `0 0 26px -8px ${t.glow}, inset 0 0 30px -16px ${t.glow}`,
        fontFamily: 'var(--font-mono)',
        overflow: 'hidden',
      }}
    >
      {/* corner ticks */}
      <span aria-hidden style={cornerTick(t.c, { top: -1, left: -1, bt: true, bl: true })} />
      <span aria-hidden style={cornerTick(t.c, { top: -1, right: -1, bt: true, br: true })} />
      <span aria-hidden style={cornerTick(t.c, { bottom: -1, left: -1, bb: true, bl: true })} />
      <span aria-hidden style={cornerTick(t.c, { bottom: -1, right: -1, bb: true, br: true })} />

      <div style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '8px 14px',
        borderBottom: `1px solid ${t.c}`,
        color: t.c,
        fontSize: 'var(--text-xs)',
        letterSpacing: 'var(--tracking-wider)',
        fontWeight: 'var(--fw-bold)',
        textTransform: 'uppercase',
        background: `linear-gradient(90deg, ${t.bg}, transparent)`,
      }}>
        <span aria-hidden style={{ textShadow: `0 0 10px ${t.glow}` }}>{icon}</span>
        <span>[ {title} ]</span>
      </div>
      <div style={{
        padding: '14px 16px',
        color: 'var(--text-body)',
        fontSize: 'var(--text-sm)',
        lineHeight: 1.65,
      }}>{children}</div>
    </aside>
  );
}

function cornerTick(c, pos) {
  const { bt, bb, bl, br, ...placement } = pos;
  return {
    position: 'absolute', width: 9, height: 9, ...placement,
    borderTop: bt ? `2px solid ${c}` : undefined,
    borderBottom: bb ? `2px solid ${c}` : undefined,
    borderLeft: bl ? `2px solid ${c}` : undefined,
    borderRight: br ? `2px solid ${c}` : undefined,
  };
}
