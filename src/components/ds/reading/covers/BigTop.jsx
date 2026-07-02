import React from 'react';

/**
 * BigTop — a circus tent read as three parts: a striped roof (stripes radiating
 * from a pennant-topped peak, clipped to a gently domed canopy), a scalloped
 * valance at the eaves, and vertical striped walls below, with a monogram
 * medallion. Deterministic from a hash of (id || title): SSR-safe.
 */

function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

const ACCENTS = ['var(--gold-500)', 'var(--cyan-500)', 'var(--magenta-500)', 'var(--purple-500)'];

const PEAK_X = 100, PEAK_Y = 40;
const EAVE_Y = 108, EAVE_L = 44, EAVE_R = 156; // roof edge / valance line
const WALL_L = 54, WALL_R = 146, WALL_TOP = 112, WALL_BOT = 198; // walls run to the frame base

export function BigTop({ title = '', id, tags = [], coverColor = 'var(--accent)', status }) {
  let s = hashStr(String(id || title || 'untitled')) || 1;
  const rnd = () => { s = Math.imul(s ^ (s >>> 15), 2246822519) >>> 0; return s / 4294967296; };
  const uid = 'bt' + hashStr(String(id || title)).toString(36);
  const clip = `${uid}c`;

  const flag = ACCENTS[Math.floor(rnd() * ACCENTS.length)];
  let bunt = ACCENTS[Math.floor(rnd() * ACCENTS.length)];
  if (bunt === flag) bunt = ACCENTS[(ACCENTS.indexOf(flag) + 1) % ACCENTS.length];

  const words = String(title).trim().split(/\s+/).filter(Boolean);
  const mono = ((words[0]?.[0] || '') + (words.length > 1 ? words[1][0] : '')).toUpperCase() || '.';

  // Roof stripes radiate from the peak; clip trims them to the domed canopy.
  const a0 = 49, a1 = 131, stripes = 14, far = 200;
  const pt = (deg) => [
    +(PEAK_X + far * Math.cos((deg * Math.PI) / 180)).toFixed(1),
    +(PEAK_Y + far * Math.sin((deg * Math.PI) / 180)).toFixed(1),
  ];
  const step = (a1 - a0) / stripes;
  const roofWedges = Array.from({ length: stripes }, (_, i) => {
    const [x1, y1] = pt(a0 + i * step), [x2, y2] = pt(a0 + (i + 1) * step);
    return { pts: `${PEAK_X},${PEAK_Y} ${x1},${y1} ${x2},${y2}`, lit: i % 2 === 0 };
  });
  const roof = `M ${PEAK_X} ${PEAK_Y} C 86 60 64 86 ${EAVE_L} ${EAVE_Y} L ${EAVE_R} ${EAVE_Y} C 136 86 114 60 ${PEAK_X} ${PEAK_Y} Z`;

  // Scalloped valance hanging from the eave line.
  const vn = 9, vw = (EAVE_R - EAVE_L) / vn;
  let valance = `M ${EAVE_L} ${EAVE_Y} L ${EAVE_R} ${EAVE_Y} L ${EAVE_R} ${EAVE_Y + 2}`;
  for (let i = 0; i < vn; i++) valance += ` A ${(vw / 2).toFixed(1)} 7 0 0 1 ${(EAVE_R - vw * (i + 1)).toFixed(1)} ${EAVE_Y + 2}`;
  valance += ' Z';

  // Vertical wall stripes.
  const wn = 12, ww = (WALL_R - WALL_L) / wn;
  const wallStripes = Array.from({ length: wn }, (_, i) => ({ x: WALL_L + i * ww, lit: i % 2 === 0 }));

  // Flag garlands draping the roof shoulders.
  const bez = (p, c, q, t) => { const u = 1 - t; return [u * u * p[0] + 2 * u * t * c[0] + t * t * q[0], u * u * p[1] + 2 * u * t * c[1] + t * t * q[1]]; };
  const garland = (p, q, n) => {
    const c = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + 12];
    const d = `M ${p[0]} ${p[1]} Q ${c[0]} ${c[1]} ${q[0]} ${q[1]}`;
    const fl = Array.from({ length: n }, (_, i) => { const [x, y] = bez(p, c, q, (i + 0.5) / n); return { x, y, fill: i % 2 === 0 ? flag : bunt }; });
    return { d, fl };
  };
  const garlands = [garland([PEAK_X, 40], [EAVE_L - 2, EAVE_Y], 5), garland([PEAK_X, 40], [EAVE_R + 2, EAVE_Y], 5)];

  return (
    <div style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden',
      background: 'radial-gradient(120% 80% at 50% 32%, var(--night-800), var(--night-950))',
    }}>
      <style>{`@keyframes ${uid}{0%{transform:translateX(-1.3px)}100%{transform:translateX(1.3px)}}` +
        `@media(prefers-reduced-motion:reduce){.${uid}{animation:none!important}}`}</style>

      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
        <defs><clipPath id={clip}><path d={roof} /></clipPath></defs>

        {/* ground shadow */}
        <ellipse cx={PEAK_X} cy={WALL_BOT + 1} rx={62} ry={5} fill="var(--night-950)" fillOpacity={0.6} />

        {/* walls */}
        <g>
          {wallStripes.map((w, i) => (
            <rect key={i} x={w.x} y={WALL_TOP} width={ww + 0.4} height={WALL_BOT - WALL_TOP}
              fill={w.lit ? coverColor : 'var(--night-950)'} fillOpacity={w.lit ? 0.8 : 0.9} />
          ))}
          <rect x={WALL_L} y={WALL_TOP} width={WALL_R - WALL_L} height={WALL_BOT - WALL_TOP}
            fill="none" stroke="color-mix(in srgb, var(--text-strong) 16%, transparent)" strokeWidth={0.8} />
        </g>

        {/* striped roof, shaped by the dome clip */}
        <g clipPath={`url(#${clip})`}>
          {roofWedges.map((w, i) => (
            <polygon key={i} points={w.pts} fill={w.lit ? coverColor : 'var(--night-950)'} fillOpacity={w.lit ? 0.94 : 0.9} />
          ))}
        </g>
        <path d={roof} fill="none" stroke={coverColor} strokeWidth={1.4} strokeOpacity={0.85} />

        {/* scalloped valance */}
        <path d={valance} fill={coverColor} fillOpacity={0.95} stroke="color-mix(in srgb, var(--text-strong) 20%, transparent)" strokeWidth={0.6} />

        {/* flag garlands */}
        {garlands.map((g, gi) => (
          <g key={gi}>
            <path d={g.d} fill="none" stroke="color-mix(in srgb, var(--text-strong) 26%, transparent)" strokeWidth={0.8} />
            {g.fl.map((f, i) => (
              <polygon key={i} points={`${(f.x - 4).toFixed(1)},${f.y.toFixed(1)} ${(f.x + 4).toFixed(1)},${f.y.toFixed(1)} ${f.x.toFixed(1)},${(f.y + 8).toFixed(1)}`}
                fill={f.fill} fillOpacity={0.9} />
            ))}
          </g>
        ))}

        {/* pennant (sways) */}
        <g className={uid} style={{ animation: `${uid} 4s ease-in-out infinite alternate` }}>
          <line x1={PEAK_X} y1={PEAK_Y} x2={PEAK_X} y2={20} stroke="var(--text-strong)" strokeOpacity={0.5} strokeWidth={1.2} />
          <polygon points={`${PEAK_X},20 ${PEAK_X + 20},25 ${PEAK_X},30`} fill={flag} />
        </g>

        {/* monogram medallion on the wall */}
        <circle cx={PEAK_X} cy={148} r={20} fill="var(--night-900)" stroke={flag} strokeWidth={1.4} />
        <circle cx={PEAK_X} cy={148} r={15.5} fill="none" stroke="color-mix(in srgb, var(--text-strong) 30%, transparent)" strokeWidth={0.6} />
        <text x={PEAK_X} y={148} fill="var(--text-strong)" fontFamily="var(--font-display)"
          fontWeight="700" fontSize={mono.length > 1 ? 17 : 22} letterSpacing="1"
          textAnchor="middle" dominantBaseline="central">{mono}</text>
      </svg>

      {/* bottom calm scrim (parent paints its own title scrim on top) */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 58%, var(--night-900) 100%)' }} />
    </div>
  );
}
