import React from 'react';

/**
 * Deco — "Radiant Dossier": a symmetrical Art-Deco sunburst fanning out behind
 * a ringed medallion that holds the story's monogram, framed by a poster-style
 * double border with stepped chevrons. Vintage detective-novel energy.
 * Deterministic from a hash of (id || title): SSR-safe.
 */

function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

// Accent pool — every entry is re-pointed by .theme-ember, so it stays on-brand in both themes.
const ACCENTS = ['var(--purple-500)', 'var(--cyan-500)', 'var(--gold-500)', 'var(--magenta-500)'];
const FX = 100, FY = 86; // focal point inside the 200x200 poster field (~43% up => reads under any crop)
const polar = (a, r) => [
  +(FX + r * Math.cos((a * Math.PI) / 180)).toFixed(1),
  +(FY + r * Math.sin((a * Math.PI) / 180)).toFixed(1),
];

export function Deco({ title = '', id, tags = [], coverColor = 'var(--accent)', status }) {
  let s = hashStr(String(id || title || 'untitled')) || 1;
  const rnd = () => { s = Math.imul(s ^ (s >>> 15), 2246822519) >>> 0; return s / 4294967296; };

  const rays = 20 + Math.floor(rnd() * 4) * 2;   // 20/22/24/26 — always even => symmetric fan
  const rot = rnd() * (360 / rays);
  const sec = ACCENTS[Math.floor(rnd() * ACCENTS.length)];
  const ter = ACCENTS[Math.floor(rnd() * ACCENTS.length)];
  const rings = 2 + Math.floor(rnd() * 2);
  const chevs = 2 + Math.floor(rnd() * 2);
  const gid = 'sc' + hashStr(String(id || title)).toString(36);

  const words = String(title).trim().split(/\s+/).filter(Boolean);
  const mono = ((words[0]?.[0] || '') + (words.length > 1 ? words[1][0] : '')).toUpperCase() || '.';

  const step = 360 / rays, half = step * 0.3;
  const wedges = Array.from({ length: rays }, (_, i) => {
    const a = i * step + rot;
    const [x1, y1] = polar(a - half, 300), [x2, y2] = polar(a + half, 300);
    const lit = i % 2 === 0;
    return {
      pts: `${FX},${FY} ${x1},${y1} ${x2},${y2}`,
      fill: lit ? (i % 6 === 0 ? ter : coverColor) : 'var(--night-950)',
      op: lit ? 0.9 : 0.82,
    };
  });

  return (
    <div style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden',
      background: 'radial-gradient(120% 80% at 50% 34%, var(--night-800), var(--night-950))',
    }}>
      <style>{`@keyframes ${gid}p{0%{opacity:.72}100%{opacity:1}}` +
        `@media(prefers-reduced-motion:reduce){.${gid}{animation:none!important}}`}</style>

      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
        <g>{wedges.map((w, i) => (
          <polygon key={i} points={w.pts} fill={w.fill} fillOpacity={w.op} />
        ))}</g>

        <g className={gid} style={{ animation: `${gid}p 7s ease-in-out infinite alternate` }}>
          {Array.from({ length: rings }, (_, i) => (
            <circle key={i} cx={FX} cy={FY} r={30 + i * 15} fill="none"
              stroke={ter} strokeOpacity={0.45} strokeWidth={0.8} />
          ))}
          {Array.from({ length: chevs }, (_, k) => {
            const y = 50 - k * 8, w = 30 - k * 7;
            return (
              <polyline key={k} fill="none" stroke={sec} strokeOpacity={0.85}
                strokeWidth={2} strokeLinejoin="round"
                points={`${FX - w},${y + w * 0.5} ${FX},${y} ${FX + w},${y + w * 0.5}`} />
            );
          })}
        </g>

        <circle cx={FX} cy={FY} r={22} fill="var(--night-900)" stroke={coverColor} strokeWidth={1.4} />
        <circle cx={FX} cy={FY} r={17.5} fill="none" stroke={ter} strokeOpacity={0.6} strokeWidth={0.6} />
        <text x={FX} y={FY} fill="var(--text-strong)" fontFamily="var(--font-display)"
          fontWeight="700" fontSize={mono.length > 1 ? 19 : 24} letterSpacing="1"
          textAnchor="middle" dominantBaseline="central">{mono}</text>
      </svg>

      {/* poster double frame — CSS so it hugs the real visible edges at ANY aspect */}
      <div style={{ position: 'absolute', inset: '5.5%', border: '1px solid',
        borderColor: 'color-mix(in srgb, var(--text-strong) 22%, transparent)' }} />
      <div style={{ position: 'absolute', inset: '7.5%', border: '1px solid',
        borderColor: `color-mix(in srgb, ${coverColor} 40%, transparent)` }} />

      {/* deco corner brackets — top only, so the lower zone stays calm */}
      {['left', 'right'].map((side) => (
        <div key={side} style={{
          position: 'absolute', top: '5.5%', [side]: '5.5%', width: 16, height: 16,
          borderTop: `2px solid ${coverColor}`,
          [side === 'left' ? 'borderLeft' : 'borderRight']: `2px solid ${coverColor}`,
          opacity: 0.7,
        }} />
      ))}

      {/* bottom calm scrim (parent paints its own title scrim on top of this) */}
      <div style={{ position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, transparent 54%, var(--night-900) 100%)' }} />
    </div>
  );
}
