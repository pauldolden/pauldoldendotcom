import React from 'react';

/**
 * Astrolabe — a faint occult sigil suspended in a slow-turning astrolabe ring
 * over a starfield, with the story's initials ghosted at its heart. A star-map
 * unique to each title. Deterministic from a hash of (id || title): SSR-safe.
 */

function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SECONDARY = ['var(--accent-2)', 'var(--accent-3)', 'var(--gold-500)', 'var(--accent-warm)'];
const P = (n) => n.toFixed(1);
const STOP = /^(the|a|an|of|and|to|in|on)$/i;

export function Astrolabe({ title = '', id, tags = [], coverColor = 'var(--accent)', status }) {
  const seed = hashStr(String(id || title || 'untitled'));
  const rnd = mulberry32(seed);
  const secondary = SECONDARY[seed % SECONDARY.length];
  const words = String(title).split(/\s+/).filter((w) => w && !STOP.test(w));
  const initials = ((words.length ? words : [String(title || '?')]).slice(0, 2).map((w) => w[0]).join('') || '?').toUpperCase();

  const cx = 50, cy = 42, R = 30;
  const N = 5 + (seed % 4); // 5..8 nodes on the ring
  const a0 = rnd() * Math.PI * 2;
  const nodes = Array.from({ length: N }, (_, i) => {
    const a = a0 + (i / N) * Math.PI * 2 + (rnd() - 0.5) * 0.55;
    const r = R * (0.68 + rnd() * 0.5);
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
  const order = nodes.map((_, i) => i); // seeded shuffle => the glyph's stroke order
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = order[i]; order[i] = order[j]; order[j] = t; }
  const sigil = order.map((n, i) => `${i ? 'L' : 'M'}${P(nodes[n][0])} ${P(nodes[n][1])}`).join(' ') + ' Z';
  const stars = Array.from({ length: 24 }, () => [rnd() * 100, rnd() * 64, 0.3 + rnd() * 1.0, rnd() > 0.55]);
  const ticks = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2, lng = i % 4 === 0, r1 = R + (lng ? 6 : 4);
    return [cx + Math.cos(a) * (R + 3), cy + Math.sin(a) * (R + 3), cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, lng];
  });
  const uid = 'sc' + (seed % 100000);

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden',
      background: `radial-gradient(115% 100% at 50% 36%, color-mix(in srgb, ${coverColor} 20%, var(--bg-surface)) 0%, var(--bg-base) 72%)` }}>
      <style>{`@keyframes ${uid}tw{0%,100%{opacity:.2}50%{opacity:.85}}@keyframes ${uid}orb{to{transform:rotate(360deg)}}.${uid}-o{transform-box:fill-box;transform-origin:center;animation:${uid}orb 120s linear infinite}.${uid}-t{animation:${uid}tw 5s ease-in-out infinite}@media(prefers-reduced-motion:reduce){.${uid}-o,.${uid}-t{animation:none}}`}</style>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true"
        style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <defs>
          <radialGradient id={uid + 'h'} cx="50%" cy="42%" r="50%">
            <stop offset="0%" stopColor={coverColor} stopOpacity="0.3" />
            <stop offset="55%" stopColor={coverColor} stopOpacity="0.06" />
            <stop offset="100%" stopColor={coverColor} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill={`url(#${uid}h)`} />
        {stars.map((s, i) => (
          <circle key={i} cx={P(s[0])} cy={P(s[1])} r={P(s[2])} fill={i % 3 ? coverColor : secondary}
            opacity={0.35 + (i % 5) * 0.1} className={s[3] ? `${uid}-t` : undefined}
            style={s[3] ? { animationDelay: `${((seed % 50) / 12 + i * 0.31).toFixed(2)}s` } : undefined} />
        ))}
        <g className={`${uid}-o`} stroke={secondary} strokeWidth="0.4">
          {ticks.map((t, i) => (
            <line key={i} x1={P(t[0])} y1={P(t[1])} x2={P(t[2])} y2={P(t[3])} opacity={t[4] ? 0.85 : 0.38} />
          ))}
        </g>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={coverColor} strokeWidth="0.5" opacity="0.55" />
        <circle cx={cx} cy={cy} r={R - 4} fill="none" stroke={coverColor} strokeWidth="0.3" opacity="0.22" strokeDasharray="1 2" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill={coverColor} opacity="0.16"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '34px', letterSpacing: '2px' }}>{initials}</text>
        <path d={sigil} fill="none" stroke={secondary} strokeWidth="0.55" strokeLinejoin="round" opacity="0.8" />
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={P(n[0])} cy={P(n[1])} r="1.6" fill="none" stroke={secondary} strokeWidth="0.4" opacity="0.6" />
            <circle cx={P(n[0])} cy={P(n[1])} r="0.9" fill={coverColor} />
          </g>
        ))}
      </svg>
    </div>
  );
}
