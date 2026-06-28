import React from 'react';

/**
 * SkillCard — an ability / skill block. Rarity drives the accent color and glow.
 * Shows name, type line, description and an optional cost/cooldown footer.
 */
export function SkillCard({ name, type, description, rarity = 'rare', tier, cost, cooldown, icon = '✦' }) {
  const rarities = {
    common:    { c: 'var(--mist-300)',     label: 'Common' },
    rare:      { c: 'var(--cyan-400)',     label: 'Rare' },
    epic:      { c: 'var(--purple-400)',   label: 'Epic' },
    legendary: { c: 'var(--magenta-400)',  label: 'Legendary' },
    mythic:    { c: 'var(--gold-500)',     label: 'Mythic' },
  };
  const r = rarities[rarity] || rarities.rare;
  return (
    <div style={{
      position: 'relative',
      width: 268,
      borderRadius: 'var(--r-lg)',
      border: `1.5px solid ${r.c}`,
      background: 'linear-gradient(180deg, var(--bg-raised), var(--bg-surface))',
      boxShadow: `0 0 24px -10px ${r.c}, var(--shadow-md)`,
      overflow: 'hidden',
      fontFamily: 'var(--font-ui)',
    }}>
      <div style={{ height: 3, background: r.c, boxShadow: `0 0 12px ${r.c}` }} />
      <div style={{ padding: '16px 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{
            width: 44, height: 44, flexShrink: 0,
            display: 'grid', placeItems: 'center',
            borderRadius: 'var(--r-md)',
            border: `1px solid ${r.c}`,
            background: 'var(--night-800)',
            color: r.c, fontSize: 20,
            textShadow: `0 0 12px ${r.c}`,
          }}>{icon}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-lg)', color: 'var(--text-strong)', lineHeight: 1.12 }}>{name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em', textTransform: 'uppercase', color: r.c, marginTop: 4 }}>
              {r.label}{type ? ` · ${type}` : ''}{tier ? ` · ${tier}` : ''}
            </div>
          </div>
        </div>
        {description && (
          <p style={{ margin: '13px 0 0', fontSize: 'var(--text-sm)', lineHeight: 1.55, color: 'var(--text-muted)' }}>{description}</p>
        )}
        {(cost || cooldown) && (
          <div style={{
            display: 'flex', gap: 18, marginTop: 14, paddingTop: 12,
            borderTop: '1px solid var(--border-faint)',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {cost && <span style={{ color: 'var(--text-faint)' }}>Cost <b style={{ color: 'var(--cyan-400)', fontWeight: 700 }}>{cost}</b></span>}
            {cooldown && <span style={{ color: 'var(--text-faint)' }}>CD <b style={{ color: 'var(--magenta-400)', fontWeight: 700 }}>{cooldown}</b></span>}
          </div>
        )}
      </div>
    </div>
  );
}
