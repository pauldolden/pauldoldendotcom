import React from 'react';

/**
 * Riso — "Misregister Press": two or three flat ink shapes and a giant title
 * initial, printed slightly out of register on dark paper and bitten by a
 * rotated halftone dot screen, so the cover looks silk-screened by a moody
 * indie press. Deterministic from a hash of (id || title): SSR-safe.
 */

function hashStr(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

export function Riso({ title = '', id, tags = [], coverColor = 'var(--accent)', status }) {
  const seed = String(id || title || 'untitled');
  const h = hashStr(seed);
  const uid = 'sc' + (h % 1000000).toString(36);
  const pick = (shift, mod) => (h >>> shift) % mod;

  // Two overprint inks derived as theme-agnostic HSL; primary shape keeps coverColor.
  const hueB = pick(0, 360);
  const hueC = (hueB + 120 + pick(5, 100)) % 360;
  const inkB = `hsl(${hueB} 82% 62%)`;
  const inkC = `hsl(${hueC} 78% 56%)`;

  // Halftone screen: tile size, dot radius, rotation.
  const tile = 6 + pick(8, 4);              // 6..9
  const dotR = 1.1 + pick(11, 9) / 10;      // 1.1..2.0
  const ang = pick(3, 40) - 20;             // -20..20

  // Ink shape geometry (viewBox 300x200) — detail kept in upper ~65%.
  const ax = 55 + pick(2, 110), ay = 42 + pick(4, 34);
  const bx = 150 + pick(6, 120), by = 30 + pick(7, 45);
  const rA = 66 + pick(9, 38), rB = 52 + pick(13, 40);
  const off = 3 + pick(14, 5);              // misregistration

  const initials = (title.trim().match(/\p{L}/gu) || ['?']).slice(0, 2).join('').toUpperCase();

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
      <style>{`@keyframes ${uid}reg{0%,100%{transform:translate(0,0)}50%{transform:translate(1.4px,-1px)}}
@media(prefers-reduced-motion:reduce){.${uid}reg{animation:none!important}}`}</style>
      <svg width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
        <defs>
          <pattern id={`${uid}dot`} width={tile} height={tile} patternUnits="userSpaceOnUse" patternTransform={`rotate(${ang})`}>
            <circle cx={tile / 2} cy={tile / 2} r={dotR} fill="var(--night-900)" />
          </pattern>
          <pattern id={`${uid}ln`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform={`rotate(${ang + 48})`}>
            <rect width="2" height="5" fill="var(--night-900)" />
          </pattern>
          <linearGradient id={`${uid}fade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.55" stopColor="var(--night-900)" stopOpacity="0" />
            <stop offset="1" stopColor="var(--night-900)" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {/* paper */}
        <rect width="300" height="200" fill="var(--night-800)" />

        {/* overprinting ink shapes — screen blend mixes overlaps into a third hue */}
        <g style={{ mixBlendMode: 'screen' }}>
          <circle className={`${uid}reg`} style={{ animation: `${uid}reg 9s ease-in-out infinite` }}
            cx={ax} cy={ay} r={rA} fill={coverColor} />
          <circle cx={bx + off} cy={by + off} r={rB} fill={inkB} opacity="0.95" />
          <rect x={ax - off} y={ay - 6} width={rA} height={rB}
            transform={`rotate(${ang} ${ax} ${ay})`} fill={inkC} opacity="0.85" />
        </g>

        {/* giant story initial(s) as printed art, upper block */}
        <text x="16" y="126" fontFamily="var(--font-display)" fontWeight="700" fontSize="128"
          letterSpacing="-6" fill={inkB} opacity="0.92" style={{ mixBlendMode: 'screen' }}>{initials}</text>

        {/* halftone screens — multiply keeps it matte & only bites over ink */}
        <rect width="300" height="200" fill={`url(#${uid}dot)`} style={{ mixBlendMode: 'multiply' }} />
        <rect width="300" height="200" fill={`url(#${uid}ln)`} opacity="0.3" style={{ mixBlendMode: 'multiply' }} />

        {/* keep lower third calm for the parent's scrim + title */}
        <rect width="300" height="200" fill={`url(#${uid}fade)`} />
      </svg>
    </div>
  );
}
