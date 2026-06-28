import React from 'react';

/**
 * StatPanel — a character status sheet. Renders a name/title header, level,
 * and a list of stats. Each stat can show a bar (value/max) or a flat figure.
 */
export function StatPanel({ name, title, level, stats = [], hp }) {
  return (
    <div style={{
      borderRadius: 'var(--r-lg)',
      border: '1.5px solid var(--border-cyan)',
      background: 'linear-gradient(180deg, rgba(34,211,238,0.05), rgba(13,10,24,0.6))',
      boxShadow: 'var(--glow-cyan)',
      fontFamily: 'var(--font-mono)',
      overflow: 'hidden',
      maxWidth: 360,
    }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-black)', fontSize: 'var(--text-lg)', color: 'var(--text-strong)', lineHeight: 1.1 }}>{name}</div>
          {title && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--cyan-400)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 3 }}>{title}</div>}
        </div>
        {level != null && (
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.16em' }}>LVL</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-black)', fontSize: 'var(--text-2xl)', lineHeight: 1, background: 'var(--grad-text)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{level}</div>
          </div>
        )}
      </div>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {hp && <StatBar label={hp.label || 'HP'} value={hp.value} max={hp.max} color="var(--magenta-500)" />}
        {stats.map((s) => (
          s.max != null
            ? <StatBar key={s.label} label={s.label} value={s.value} max={s.max} color={s.color || 'var(--cyan-500)'} />
            : (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px dashed var(--border-faint)', paddingBottom: 7 }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</span>
                <span style={{ fontSize: 'var(--text-md)', color: 'var(--text-strong)', fontWeight: 'var(--fw-bold)', fontVariantNumeric: 'tabular-nums' }}>{s.value}</span>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 'var(--text-xs)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        <span style={{ color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ color: 'var(--text-body)', fontVariantNumeric: 'tabular-nums' }}>{value} / {max}</span>
      </div>
      <div style={{ height: 7, borderRadius: 'var(--r-pill)', background: 'var(--night-600)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, boxShadow: `0 0 10px -1px ${color}`, borderRadius: 'var(--r-pill)', transition: 'width var(--dur-slow) var(--ease-out)' }} />
      </div>
    </div>
  );
}
