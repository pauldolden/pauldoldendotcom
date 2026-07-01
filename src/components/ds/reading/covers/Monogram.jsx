import React from 'react';

/**
 * Monogram — "Ex Libris": one colossal cropped display initial, outlined and
 * shadowed by a drifting ghost echo, on faint ruled ledger lines with a margin
 * spine and a mono catalogue number. Editorial index-card energy. Deterministic
 * from a hash of (id || title): SSR-safe.
 */

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

const STOP = new Set(['the', 'a', 'an', 'of', 'and', 'to', 'in', 'on', 'for', 'at', 'my']);

export function Monogram({ title = '', id, tags = [], coverColor = 'var(--accent)', status }) {
  const seed = hashStr(String(id || title || 'untitled'));

  const words = String(title).trim().split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));
  const sig = words.filter((w) => !STOP.has(w.toLowerCase()));
  const pick = sig.length ? sig : words.length ? words : ['?'];
  const hero = (pick[0][0] || '?').toUpperCase();
  const inits = pick.slice(0, 2).map((w) => w[0].toUpperCase()).join(' ');
  const cat = String(100 + (seed % 899));

  const left = (seed & 1) === 0;                 // crop side
  const gx = left ? 6 : 294;
  const anchor = left ? 'start' : 'end';
  const dx = left ? 7 : -7;                       // ghost offset
  const dy = 5 + ((seed >>> 5) & 3);
  const ghostHue = seed % 360;
  const spineX = left ? 272 : 28;                 // margin rule, opposite the glyph
  const baseY = 150;

  const c = (a) => `color-mix(in srgb, ${coverColor} ${a}%, transparent)`;
  const ledgers = [40, 72, 104, 136, 168];
  const glyphFont = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 220 };
  const labelSide = { textAnchor: left ? 'end' : 'start' };
  const lx = left ? 288 : 12;

  return (
    <div
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden',
        background:
          `radial-gradient(130% 95% at ${left ? 78 : 22}% 4%, ${c(26)}, transparent 58%),` +
          'linear-gradient(158deg, var(--night-800), var(--night-900))',
      }}
    >
      <style>{
        '@keyframes sc-drift{0%,100%{opacity:.12;transform:translate(0,0)}50%{opacity:.2;transform:translate(1px,-1px)}}' +
        '@media(prefers-reduced-motion:reduce){.sc-echo{animation:none!important;opacity:.16!important}}'
      }</style>
      <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" width="100%" height="100%"
        style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
        {/* ruled ledger lines — emphasised baseline under the glyph */}
        {ledgers.map((y, i) => (
          <line key={y} x1="0" x2="300" y1={y} y2={y}
            stroke={c(i === 3 ? 30 : 12)} strokeWidth={i === 3 ? 1 : 0.6} />
        ))}
        {/* margin spine + baseline node */}
        <line x1={spineX} x2={spineX} y1="14" y2="186" stroke={c(22)} strokeWidth="0.8" />
        <circle cx={spineX} cy={baseY} r="2.4" fill={c(70)} />
        {/* ghost echo — offset duplicate, hash-hued, gently drifting */}
        <g className="sc-echo" style={{ animation: 'sc-drift 9s ease-in-out infinite' }}>
          <text x={gx + dx} y={baseY + dy} textAnchor={anchor}
            fill={`hsla(${ghostHue},68%,62%,0.18)`} style={glyphFont}>{hero}</text>
        </g>
        {/* hero glyph — outlined, faint tinted fill, cropped by the frame */}
        <text x={gx} y={baseY} textAnchor={anchor} fill={c(9)} stroke={c(80)} strokeWidth="1.3"
          style={glyphFont}>{hero}</text>
        {/* editorial catalogue label — opposite the glyph, upper area */}
        <text x={lx} y="26" {...labelSide} fill={c(60)}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 1.5 }}>№{cat}</text>
        <text x={lx} y="40" {...labelSide} fill="rgba(255,255,255,0.32)"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: 2 }}>{inits}</text>
      </svg>
    </div>
  );
}
