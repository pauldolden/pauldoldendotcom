import React from 'react';

/**
 * Badge — a small status pill. Tuned for serial states:
 * ongoing, complete, hiatus, plus neutral / neon tones.
 * Set `dot` for a leading status dot.
 *
 * Carries the `pd-badge` hook class so the .theme-ember (words / grimoire)
 * side can revert the chamfer to its squared treatment — see
 * styles/theme-overrides.css. The badge restyle is a CODE-side change only.
 */
export function Badge({ children, tone = 'neutral', dot = false, size = 'md', overlay = false, className = '', ...rest }) {
  const tones = {
    ongoing:  { fg: 'var(--status-ongoing)',  bg: 'rgba(46,230,160,0.12)',  bd: 'rgba(46,230,160,0.4)' },
    complete: { fg: 'var(--status-complete)', bg: 'rgba(34,211,238,0.12)',  bd: 'rgba(34,211,238,0.4)' },
    hiatus:   { fg: 'var(--status-hiatus)',   bg: 'rgba(255,206,79,0.12)',  bd: 'rgba(255,206,79,0.4)' },
    danger:   { fg: 'var(--status-danger)',   bg: 'rgba(255,77,109,0.12)',  bd: 'rgba(255,77,109,0.4)' },
    magenta:  { fg: 'var(--magenta-300)',     bg: 'rgba(255,46,151,0.12)',  bd: 'rgba(255,46,151,0.4)' },
    purple:   { fg: 'var(--purple-300)',      bg: 'rgba(168,85,247,0.14)',  bd: 'rgba(168,85,247,0.4)' },
    neutral:  { fg: 'var(--mist-300)',        bg: 'rgba(93,65,150,0.16)',   bd: 'var(--border)' },
  };
  const t = tones[tone] || tones.neutral;
  const sm = size === 'sm';
  const ch = sm ? 5 : 6;
  const clip = `polygon(${ch}px 0, 100% 0, 100% calc(100% - ${ch}px), calc(100% - ${ch}px) 100%, 0 100%, 0 ${ch}px)`;

  // `overlay`: sitting on top of a procedural cover of unknown brightness. Swap the
  // translucent tone wash for a dark scrim pill so the status stays legible on any
  // art, while keeping the tone's colour on text + border + dot.
  const bg = overlay ? 'rgba(8,5,16,0.72)' : t.bg;

  return (
    <span
      className={['pd-badge', className].filter(Boolean).join(' ')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sm ? 5 : 6,
        height: sm ? 20 : 24,
        padding: sm ? '0 9px' : '0 11px',
        clipPath: clip,
        WebkitClipPath: clip,
        border: `1px solid ${t.bd}`,
        background: bg,
        ...(overlay ? { backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' } : null),
        color: t.fg,
        fontFamily: 'var(--font-mono)',
        fontSize: sm ? '0.6875rem' : 'var(--text-xs)',
        fontWeight: 'var(--fw-medium)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        lineHeight: 1,
      }}
      {...rest}
    >
      {dot && (
        <span
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: t.fg, boxShadow: `0 0 8px ${t.fg}`,
          }}
        />
      )}
      {children}
    </span>
  );
}
