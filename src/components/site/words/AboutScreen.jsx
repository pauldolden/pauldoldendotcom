// AboutScreen — author bio. Copy from content/words.about.
import React from 'react';
import { words } from '../../../content/words';

export function AboutScreen() {
  const c = words.about;
  return (
    <div style={{ maxWidth: 'var(--width-prose)', margin: '0 auto', padding: '64px 28px 0' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cyan-400)', marginBottom: 14 }}>{c.eyebrow}</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 52, letterSpacing: '0', color: 'var(--text-strong)', margin: 0 }}>{c.titleLead}<span className="pd-grad-text">{c.titleAccent}</span></h1>
      <div className="pd-prose" style={{ marginTop: 26 }}>
        {c.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </div>
  );
}
