import React from 'react';

/**
 * BigTop — a striped circus tent: stripes radiating from a pennant-topped peak,
 * clipped to a bell silhouette (curved roof, flared and scalloped skirt), with
 * flag garlands and a monogram medallion. Deterministic from a hash of
 * (id || title): SSR-safe.
 */

function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

// Accent pool — every entry is re-pointed by .theme-ember, so it stays on-brand.
const ACCENTS = ['var(--gold-500)', 'var(--cyan-500)', 'var(--magenta-500)', 'var(--purple-500)'];

const PEAK_X = 100, PEAK_Y = 46;

export function BigTop({ title = '', id, tags = [], coverColor = 'var(--accent)', status }) {
  let s = hashStr(String(id || title || 'untitled')) || 1;
  const rnd = () => { s = Math.imul(s ^ (s >>> 15), 2246822519) >>> 0; return s / 4294967296; };
  const uid = 'bt' + hashStr(String(id || title)).toString(36);
  const clip = `${uid}clip`;

  const flag = ACCENTS[Math.floor(rnd() * ACCENTS.length)];
  let bunt = ACCENTS[Math.floor(rnd() * ACCENTS.length)];
  if (bunt === flag) bunt = ACCENTS[(ACCENTS.indexOf(flag) + 1) % ACCENTS.length];

  const words = String(title).trim().split(/\s+/).filter(Boolean);
  const mono = ((words[0]?.[0] || '') + (words.length > 1 ? words[1][0] : '')).toUpperCase() || '.';

  // Stripes fan downward from the peak, over-long so the clip does the shaping.
  const a0 = 56, a1 = 124, stripes = 16, far = 230;
  const pt = (deg) => [
    +(PEAK_X + far * Math.cos((deg * Math.PI) / 180)).toFixed(1),
    +(PEAK_Y + far * Math.sin((deg * Math.PI) / 180)).toFixed(1),
  ];
  const step = (a1 - a0) / stripes;
  const wedges = Array.from({ length: stripes }, (_, i) => {
    const [x1, y1] = pt(a0 + i * step), [x2, y2] = pt(a0 + (i + 1) * step);
    return { pts: `${PEAK_X},${PEAK_Y} ${x1},${y1} ${x2},${y2}`, lit: i % 2 === 0 };
  });

  // Bell silhouette: curved roof + flared skirt, scalloped along the hem.
  const scallops = 10, hx0 = 30, hx1 = 170, hemY = 150, sw = (hx1 - hx0) / scallops;
  let hem = '';
  for (let i = 0; i < scallops; i++) hem += ` A ${(sw / 2).toFixed(1)} 5 0 0 0 ${(hx0 + sw * (i + 1)).toFixed(1)} ${hemY}`;
  const tent =
    `M ${PEAK_X} ${PEAK_Y} C 76 56 48 82 40 116 C 39 126 36 134 ${hx0} ${hemY}` +
    hem +
    ` C 164 134 161 126 160 116 C 152 82 124 56 ${PEAK_X} ${PEAK_Y} Z`;

  // Flag garlands from the peak down each side.
  const bez = (p, c, q, t) => { const u = 1 - t; return [u * u * p[0] + 2 * u * t * c[0] + t * t * q[0], u * u * p[1] + 2 * u * t * c[1] + t * t * q[1]]; };
  const garland = (p, q, n) => {
    const c = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + 14];
    const d = `M ${p[0]} ${p[1]} Q ${c[0]} ${c[1]} ${q[0]} ${q[1]}`;
    const fl = Array.from({ length: n }, (_, i) => { const [x, y] = bez(p, c, q, (i + 0.5) / n); return { x, y, fill: i % 2 === 0 ? flag : bunt }; });
    return { d, fl };
  };
  const garlands = [garland([PEAK_X, 44], [24, 104], 6), garland([PEAK_X, 44], [176, 104], 6)];

  return (
    <div style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden',
      background: 'radial-gradient(120% 80% at 50% 30%, var(--night-800), var(--night-950))',
    }}>
      <style>{`@keyframes ${uid}{0%{transform:translateX(-1.3px)}100%{transform:translateX(1.3px)}}` +
        `@media(prefers-reduced-motion:reduce){.${uid}{animation:none!important}}`}</style>

      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
        <defs><clipPath id={clip}><path d={tent} /></clipPath></defs>

        {/* striped canopy, shaped by the bell clip */}
        <g clipPath={`url(#${clip})`}>
          {wedges.map((w, i) => (
            <polygon key={i} points={w.pts} fill={w.lit ? coverColor : 'var(--night-950)'} fillOpacity={w.lit ? 0.92 : 0.9} />
          ))}
        </g>
        {/* tent outline (curved sides + scalloped hem) */}
        <path d={tent} fill="none" stroke={coverColor} strokeWidth={1.6} strokeOpacity={0.9} />

        {/* flag garlands */}
        {garlands.map((g, gi) => (
          <g key={gi}>
            <path d={g.d} fill="none" stroke="color-mix(in srgb, var(--text-strong) 28%, transparent)" strokeWidth={0.8} />
            {g.fl.map((f, i) => (
              <polygon key={i} points={`${(f.x - 4).toFixed(1)},${f.y.toFixed(1)} ${(f.x + 4).toFixed(1)},${f.y.toFixed(1)} ${f.x.toFixed(1)},${(f.y + 8).toFixed(1)}`}
                fill={f.fill} fillOpacity={0.9} />
            ))}
          </g>
        ))}

        {/* pennant (sways) */}
        <g className={uid} style={{ animation: `${uid} 4s ease-in-out infinite alternate` }}>
          <line x1={PEAK_X} y1={PEAK_Y} x2={PEAK_X} y2={24} stroke="var(--text-strong)" strokeOpacity={0.5} strokeWidth={1.2} />
          <polygon points={`${PEAK_X},24 ${PEAK_X + 20},29 ${PEAK_X},34`} fill={flag} />
        </g>

        {/* monogram medallion */}
        <circle cx={PEAK_X} cy={108} r={21} fill="var(--night-900)" stroke={flag} strokeWidth={1.4} />
        <circle cx={PEAK_X} cy={108} r={16.5} fill="none" stroke="color-mix(in srgb, var(--text-strong) 30%, transparent)" strokeWidth={0.6} />
        <text x={PEAK_X} y={108} fill="var(--text-strong)" fontFamily="var(--font-display)"
          fontWeight="700" fontSize={mono.length > 1 ? 18 : 23} letterSpacing="1"
          textAnchor="middle" dominantBaseline="central">{mono}</text>
      </svg>

      {/* bottom calm scrim (parent paints its own title scrim on top) */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 54%, var(--night-900) 100%)' }} />
    </div>
  );
}
