// AboutScreen — author bio. Copy from content/words.about.
import React from 'react';
import { words } from '../../../content/words';

export function AboutScreen() {
  const c = words.about;
  return (
    <div className="mx-auto max-w-prose px-7 pt-16">
      <div className="mb-3.5 font-code text-xs uppercase tracking-[0.2em] text-cyan-400">{c.eyebrow}</div>
      <h1 className="m-0 font-heading text-[52px] font-bold text-strong">{c.titleLead}<span className="pd-grad-text">{c.titleAccent}</span></h1>
      <div className="pd-prose mt-[26px]">
        {c.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </div>
  );
}
