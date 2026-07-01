import React from 'react';

/**
 * StoryCover — procedural "Foil Volume" placeholder cover.
 *
 * Each story is rendered as a stylised bound hardback: a `coverColor` cloth
 * face, a darkened spine with raised cords, a double-rule foil frame with
 * corner studs, and a stamped emblem cartouche holding the title's monogram
 * and a "VOL · N" mark. Everything is derived deterministically from a hash of
 * (id || title), so it is SSR-safe (no Math.random / Date / window) and every
 * story looks distinct even when several share one `coverColor`.
 *
 * Fills whatever aspect ratio the parent card gives it (3:2 grid card, 2:3
 * portrait hero, wide featured band). The parent draws the badge + bottom
 * scrim + title on top, so the lower third is left calm.
 */

function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const SHAPES = [
  'M50 8 L90 50 L50 92 L10 50 Z',                                                  // diamond
  'M16 14 H84 V50 Q84 82 50 94 Q16 82 16 50 Z',                                    // shield
  'M50 8 L87 30 V70 L50 92 L13 70 V30 Z',                                          // hexagon
  'M22 12 H78 Q88 12 88 22 V78 Q88 88 78 88 H22 Q12 88 12 78 V22 Q12 12 22 12 Z',  // panel
];

export function StoryCover({ title, id, tags = [], coverColor = 'var(--accent)', status }) {
  const h = hashStr(String(id || title || 'untitled'));
  const b = (n) => (h >>> (n * 5)) & 31;

  // Foil: a warm metallic arc (copper → bronze → gold → champagne), so it reads
  // as stamped leaf in the ember grimoire and as gold-on-neon in synthwave.
  const foilH = 22 + (b(0) % 17) * 2;   // 22–54
  const foilS = 46 + (b(1) % 26);       // 46–71
  const foilL = 56 + (b(2) % 14);       // 56–69
  const foil = (l) => `hsl(${foilH} ${foilS}% ${l}%)`;
  const F = foil(foilL);
  const foilGrad = `linear-gradient(135deg, ${foil(foilL + 15)}, ${foil(foilL - 8)} 42%, ${foil(foilL + 9)} 54%, ${foil(foilL - 11)})`;

  const spineW = 13 + (b(3) % 7);       // 13–19 %
  const shape = SHAPES[b(4) % SHAPES.length];
  const vol = ROMAN[b(5) % 12];

  const words = String(title || '').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));
  const initials = (words.slice(0, 2).map((w) => w[0]).join('') || 'PD').toUpperCase().slice(0, 2);

  const weave = 'repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 1px, rgba(255,255,255,0.02) 1px 2px)';
  const gid = `pdfoil-${h.toString(36)}`;
  const cords = [24, 31, 61, 68];

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden', background: coverColor }}>
      {/* cloth face: sheen + vignette + weave over coverColor */}
      <div style={{ position: 'absolute', inset: 0, background:
        'radial-gradient(120% 85% at 32% 10%, rgba(255,255,255,0.12), rgba(255,255,255,0) 55%),'
        + 'radial-gradient(140% 130% at 50% 118%, rgba(0,0,0,0.55), rgba(0,0,0,0) 62%),' + weave }} />

      {/* bound spine with raised cords */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: `${spineW}%`,
        background: `linear-gradient(90deg, rgba(0,0,0,0.46), rgba(0,0,0,0.12)),${weave}`,
        borderRight: `1px solid ${foil(foilL - 8)}`, boxShadow: 'inset -4px 0 6px -4px rgba(0,0,0,0.6)' }}>
        {cords.map((t) => (
          <div key={t} style={{ position: 'absolute', left: 0, right: 0, top: `${t}%`, height: '2.4%',
            minHeight: 2, background: foilGrad, opacity: 0.82, boxShadow: '0 1px 0 rgba(0,0,0,0.45)' }} />
        ))}
      </div>

      {/* double-rule foil frame + corner studs */}
      <div style={{ position: 'absolute', top: '7%', bottom: '7%', left: `calc(${spineW}% + 7%)`, right: '7%',
        boxShadow: `0 0 0 1.5px ${F}, inset 0 0 0 3px rgba(0,0,0,0.30), inset 0 0 0 4px ${foil(foilL - 12)}` }}>
        {[['0', '0'], ['100%', '0'], ['0', '100%'], ['100%', '100%']].map(([x, y], i) => (
          <div key={i} style={{ position: 'absolute', left: x, top: y, width: 7, height: 7, background: foilGrad,
            transform: 'translate(-50%,-50%) rotate(45deg)', boxShadow: '0 0 0 1px rgba(0,0,0,0.4)' }} />
        ))}
      </div>

      {/* stamped emblem cartouche */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '13%' }}>
        <svg viewBox="0 0 100 100" width="45%" style={{ maxWidth: 190, minWidth: 88, overflow: 'visible' }} aria-hidden="true">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={foil(foilL + 16)} />
              <stop offset="0.5" stopColor={foil(foilL - 4)} />
              <stop offset="1" stopColor={foil(foilL - 14)} />
            </linearGradient>
          </defs>
          <path d={shape} fill="rgba(0,0,0,0.18)" stroke={`url(#${gid})`} strokeWidth="2" strokeLinejoin="round" />
          <path d={shape} fill="none" stroke={`url(#${gid})`} strokeWidth="0.6" opacity="0.8"
            transform="translate(50 50) scale(0.82) translate(-50 -50)" />
          <line x1="32" y1="33" x2="68" y2="33" stroke={`url(#${gid})`} strokeWidth="0.7" />
          <text x="50" y="61" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="700"
            fontSize="29" letterSpacing="1" fill={`url(#${gid})`}>{initials}</text>
          <text x="50" y="76" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6"
            letterSpacing="2.6" fill={F} opacity="0.85">VOL · {vol}</text>
        </svg>
      </div>

      {/* subtle foil shimmer (keyframe lives in words.css) */}
      <div className="pd-foil-sheen" style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(115deg, transparent 42%, rgba(255,255,255,0.06) 50%, transparent 58%)',
        backgroundSize: '250% 100%' }} />
    </div>
  );
}
