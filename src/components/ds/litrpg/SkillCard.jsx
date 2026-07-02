import React from 'react';

/**
 * SkillCard — an ability / skill block. Rarity drives the accent color and glow.
 * Shows name, type line, description and an optional cost/cooldown footer.
 * Rarity colour rides a single CSS var (--rc) so utilities can reference it.
 */
const RARITIES = {
  common:    { c: 'var(--mist-300)',    label: 'Common' },
  rare:      { c: 'var(--cyan-400)',    label: 'Rare' },
  epic:      { c: 'var(--purple-400)',  label: 'Epic' },
  legendary: { c: 'var(--magenta-400)', label: 'Legendary' },
  mythic:    { c: 'var(--gold-500)',    label: 'Mythic' },
};

export function SkillCard({ name, type, description, rarity = 'rare', tier, cost, cooldown, icon = '✦' }) {
  const r = RARITIES[rarity] || RARITIES.rare;
  return (
    <div
      style={{ '--rc': r.c }}
      className="relative w-[268px] overflow-hidden rounded-lg border-[1.5px] border-[var(--rc)] bg-[linear-gradient(180deg,var(--bg-raised),var(--bg-surface))] font-sans shadow-[0_0_24px_-10px_var(--rc),var(--shadow-md)]"
    >
      <div className="h-[3px] bg-[var(--rc)] shadow-[0_0_12px_var(--rc)]" />
      <div className="px-4 pb-[14px] pt-4">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-[var(--rc)] bg-night-800 text-[20px] text-[var(--rc)] [text-shadow:0_0_12px_var(--rc)]">{icon}</div>
          <div className="min-w-0">
            <div className="font-heading text-lg font-bold leading-[1.12] text-strong">{name}</div>
            <div className="mt-1 font-code text-xs uppercase tracking-[0.06em] text-[var(--rc)]">
              {r.label}{type ? ` · ${type}` : ''}{tier ? ` · ${tier}` : ''}
            </div>
          </div>
        </div>
        {description && (
          <p className="mb-0 mt-[13px] text-sm leading-[1.55] text-muted">{description}</p>
        )}
        {(cost || cooldown) && (
          <div className="mt-3.5 flex gap-[18px] border-t border-line-faint pt-3 font-code text-xs uppercase tracking-[0.06em]">
            {cost && <span className="text-faint">Cost <b className="font-bold text-cyan-400">{cost}</b></span>}
            {cooldown && <span className="text-faint">CD <b className="font-bold text-magenta-400">{cooldown}</b></span>}
          </div>
        )}
      </div>
    </div>
  );
}
