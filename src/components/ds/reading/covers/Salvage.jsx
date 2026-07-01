import React from 'react';

/**
 * Salvage — a wreckers' cover: layered swells under a witch-light rune (the
 * magic they haul up), a broken mast listing to one side, and a brass compass
 * medallion holding the monogram. Deterministic from a hash of (id || title).
 */

function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

const ACCENTS = ['var(--cyan-500)', 'var(--gold-500)', 'var(--purple-500)', 'var(--magenta-500)'];

export function Salvage({ title = '', id, tags = [], coverColor = 'var(--accent)', status }) {
  let s = hashStr(String(id || title || 'untitled')) || 1;
  const rnd = () => { s = Math.imul(s ^ (s >>> 15), 2246822519) >>> 0; return s / 4294967296; };
  const uid = 'sv' + hashStr(String(id || title)).toString(36);
  const glow = ACCENTS[Math.floor(rnd() * ACCENTS.length)];

  const words = String(title).trim().split(/\s+/).filter(Boolean);
  const mono = ((words[0]?.[0] || '') + (words.length > 1 ? words[1][0] : '')).toUpperCase() || '.';

  // three swells, drifting per story
  const amp = 6 + rnd() * 4;
  const phase = rnd() * 6.283;
  const mastTilt = -16 + rnd() * 9;
  const crest = (top, ph, a) => {
    let d = `M -4 ${(top + Math.sin(-4 * 0.05 + ph) * a).toFixed(1)}`;
    for (let x = 0; x <= 204; x += 8) d += ` L ${x} ${(top + Math.sin(x * 0.05 + ph) * a).toFixed(1)}`;
    return d;
  };
  const wave = (top, ph, a) => `${crest(top, ph, a)} L 204 200 L -4 200 Z`;

  const CX = 100, CY = 100, R = 24;
  const ticks = Array.from({ length: 8 }, (_, i) => i * 45);
  const rays = Array.from({ length: 6 }, (_, i) => (i * 60 * Math.PI) / 180);

  return (
    <div style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden',
      background: 'radial-gradient(120% 90% at 50% 24%, var(--night-800), var(--night-950))',
    }}>
      <style>{`@keyframes ${uid}{0%{opacity:.6}100%{opacity:1}}` +
        `@media(prefers-reduced-motion:reduce){.${uid}{animation:none!important}}`}</style>

      {/* witch-light glow welling from the wreck */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(38% 32% at 50% 30%, color-mix(in srgb, ${glow} 45%, transparent), transparent 70%)` }} />

      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
        {/* broken mast + tattered sail (silhouette) */}
        <g transform={`rotate(${mastTilt.toFixed(1)} 60 152)`} opacity={0.5}>
          <line x1="60" y1="152" x2="60" y2="38" stroke="var(--night-950)" strokeWidth="4" strokeLinecap="round" />
          <line x1="38" y1="64" x2="94" y2="58" stroke="var(--night-950)" strokeWidth="2.5" />
          <path d="M60 60 L90 64 L82 96 L72 88 L64 98 L60 90 Z" fill="var(--night-950)" fillOpacity="0.85" />
        </g>

        {/* the discovered magic — witch-light rune */}
        <g className={uid} style={{ animation: `${uid} 5s ease-in-out infinite alternate` }}>
          <circle cx="100" cy="56" r="6.5" fill={glow} fillOpacity="0.9" />
          <circle cx="100" cy="56" r="12" fill="none" stroke={glow} strokeOpacity="0.5" strokeWidth="1" />
          {rays.map((a, i) => (
            <line key={i} x1={100 + Math.cos(a) * 9} y1={56 + Math.sin(a) * 9}
              x2={100 + Math.cos(a) * 15} y2={56 + Math.sin(a) * 15} stroke={glow} strokeOpacity="0.7" strokeWidth="1" />
          ))}
        </g>

        {/* swells, back → front */}
        <path d={wave(122, phase, amp)} fill={coverColor} fillOpacity="0.26" />
        <path d={wave(142, phase + 1.6, amp * 0.9)} fill={coverColor} fillOpacity="0.5" />
        <path d={crest(142, phase + 1.6, amp * 0.9)} fill="none" stroke="color-mix(in srgb, var(--text-strong) 30%, transparent)" strokeWidth="0.8" />
        <path d={wave(164, phase + 3.1, amp * 0.8)} fill="var(--night-950)" fillOpacity="0.88" />

        {/* compass medallion */}
        <circle cx={CX} cy={CY} r={R} fill="var(--night-900)" stroke={coverColor} strokeWidth="1.6" />
        <circle cx={CX} cy={CY} r={R - 4} fill="none" stroke={glow} strokeOpacity="0.5" strokeWidth="0.7" />
        {ticks.map((deg, i) => {
          const a = (deg * Math.PI) / 180, r0 = R - 3, r1 = i % 2 ? R - 6 : R - 9;
          return <line key={i} x1={CX + Math.cos(a) * r0} y1={CY + Math.sin(a) * r0} x2={CX + Math.cos(a) * r1} y2={CY + Math.sin(a) * r1}
            stroke="color-mix(in srgb, var(--text-strong) 40%, transparent)" strokeWidth="0.8" />;
        })}
        <text x={CX} y={CY} fill="var(--text-strong)" fontFamily="var(--font-display)" fontWeight="700"
          fontSize={mono.length > 1 ? 18 : 23} letterSpacing="1" textAnchor="middle" dominantBaseline="central">{mono}</text>
      </svg>

      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 54%, var(--night-900) 100%)' }} />
    </div>
  );
}
