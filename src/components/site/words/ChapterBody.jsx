// ChapterBody — renders a chapter's block document (from R2 / sample) into
// prose + embedded LitRPG components. Keeps rich interludes while letting the
// big text live in storage as portable JSON.
//
// SECURITY: `p`/`system` block `html` is rendered via dangerouslySetInnerHTML.
// This is trusted, author-owned content (your own R2 bucket / this repo's
// sample), NOT user-submitted input. If chapter sources ever become
// multi-author / user-supplied, sanitize block html (e.g. DOMPurify) here
// before rendering.
import React from 'react';
import { PullQuote, SkillCard, SystemMessage } from '../../ds/index.js';

const dropCapStyle = {
  fontFamily: 'var(--font-display)', fontWeight: 800, float: 'left',
  fontSize: '3.4em', lineHeight: 0.86, padding: '0.04em 0.12em 0 0',
  background: 'var(--grad-text)', WebkitBackgroundClip: 'text',
  backgroundClip: 'text', WebkitTextFillColor: 'transparent',
};

function Block({ b }) {
  switch (b.type) {
    case 'p':
      return (
        <p style={{ margin: '0 0 1.35em' }}>
          {b.dropcap && <span style={dropCapStyle}>{b.dropLetter}</span>}
          <span dangerouslySetInnerHTML={{ __html: b.html }} />
        </p>
      );
    case 'system':
      return (
        <SystemMessage title={b.title} tone={b.tone} icon={b.icon}>
          <span dangerouslySetInnerHTML={{ __html: b.html }} />
        </SystemMessage>
      );
    case 'pullquote':
      return <PullQuote cite={b.cite}>{b.text}</PullQuote>;
    case 'skill':
      return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2em 0' }}>
          <SkillCard name={b.name} type={b.kind} rarity={b.rarity} tier={b.tier} description={b.description} cost={b.cost} cooldown={b.cooldown} />
        </div>
      );
    default:
      return null;
  }
}

export function ChapterBody({ blocks = [], fontSize }) {
  return (
    <div style={{ fontFamily: 'var(--font-prose)', fontSize, lineHeight: 1.72, color: 'var(--text-prose)' }}>
      {blocks.map((b, i) => <Block key={i} b={b} />)}
    </div>
  );
}
