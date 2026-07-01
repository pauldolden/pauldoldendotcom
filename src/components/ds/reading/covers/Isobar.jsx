import React from 'react';

/**
 * Isobar — a field of fine flowing contour lines (banknote engraving / topo
 * map) bending around a hidden peak, with the story's initial engraved into
 * them as an outlined glyph. A second line family in a different accent adds a
 * moiré shimmer. Deterministic from a hash of (id || title): SSR-safe.
 */

function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HUES = ['var(--accent)', 'var(--accent-2)', 'var(--accent-3)'];

export function Isobar({ title = '', id, tags = [], coverColor = 'var(--accent)', status }) {
  const seed = hashStr(String(id || title || 'story'));
  const r = rng(seed);
  const uid = 'gl' + seed.toString(36);

  // Two-tone guilloche: base = coverColor, moiré family = a different theme accent
  let moire = HUES[seed % 3];
  if (moire === coverColor) moire = HUES[(seed + 1) % 3];

  // Height-field parameters — everything below drifts per story
  const H = 100, N = 16, gap = H / (N - 1);
  const f1 = 1.3 + r() * 1.7, f2 = 2.4 + r() * 2.6;
  const p1 = r() * 6.283, p2 = r() * 6.283;
  const a1 = 3.5 + r() * 4.5, a2 = 1.6 + r() * 2.6;
  const tilt = (r() - 0.5) * 9;
  const px = 22 + r() * 56, py = 16 + r() * 44;  // focal "peak" of the contours
  const pa = 7 + r() * 11, pr = 20 + r() * 20;
  const initial = (title || '?').trim().charAt(0).toUpperCase() || '?';

  const field = (x, y0, ph) => {
    const dx = (x - px) / pr, dy = (y0 - py) / pr;
    const bump = pa * Math.exp(-(dx * dx + dy * dy));
    return a1 * Math.sin(f1 * x * 0.0628 + p1 + ph)
      + a2 * Math.sin(f2 * x * 0.0628 + y0 * 0.05 + p2 + ph)
      + tilt * (x / 100) - bump;
  };
  const path = (i, ph) => {
    const y0 = i * gap;
    let d = '';
    for (let x = -6; x <= 106; x += 4) {
      d += (x < -5 ? 'M' : 'L') + x.toFixed(1) + ' ' + (y0 + field(x, y0, ph)).toFixed(2) + ' ';
    }
    return d.trim();
  };
  const idx = Array.from({ length: N }, (_, i) => i);

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden', background: 'var(--night-900)' }}>
      <style>{`@keyframes ${uid}{to{transform:translateX(2.4px)}}
.${uid}m{animation:${uid} 26s ease-in-out infinite alternate}
@media(prefers-reduced-motion:reduce){.${uid}m{animation:none}}`}</style>
      {/* depth: a soft light welling up at the focal peak */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(58% 52% at ${px}% ${py}%, color-mix(in srgb, ${coverColor} 30%, transparent), transparent 72%)` }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 55%, var(--night-950) 100%)', opacity: 0.6 }} />

      {/* contour field — stroke stays hairline at any size */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%" style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <g fill="none" stroke={coverColor} strokeWidth="1" vectorEffect="non-scaling-stroke">
          {idx.map((i) => <path key={i} d={path(i, 0)} opacity={i % 5 === 0 ? 0.72 : 0.4} />)}
        </g>
        <g className={`${uid}m`} fill="none" stroke={moire} strokeWidth="0.75" vectorEffect="non-scaling-stroke" opacity="0.3">
          {idx.map((i) => <path key={i} d={path(i, 0.85)} />)}
        </g>
      </svg>

      {/* engraved initial — proportional, kept clear of the bottom scrim */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <text x="50" y="45" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-display)"
          fontWeight="700" fontSize="46" letterSpacing="-2" fill="none" stroke={coverColor}
          strokeWidth="0.45" opacity="0.9" vectorEffect="non-scaling-stroke">{initial}</text>
      </svg>
    </div>
  );
}
