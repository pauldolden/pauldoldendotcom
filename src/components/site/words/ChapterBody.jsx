// ChapterBody — renders a chapter's block document (from R2 / sample) into
// prose + embedded LitRPG components. Keeps rich interludes while letting the
// big text live in storage as portable JSON.
//
// It also links character mentions in the prose to their /cast profiles, with
// a hover-card. Linking is a client-side, post-render DOM pass (the block html
// is trusted, author-owned) and is spoiler-safe: only NON-spoiler entities are
// ever linked, so a hidden character's name stays plain text.
//
// SECURITY: `p`/`system` block `html` is rendered via dangerouslySetInnerHTML.
// This is trusted, author-owned content (your own R2 bucket / this repo's
// sample), NOT user-submitted input. If chapter sources ever become
// multi-author / user-supplied, sanitize block html (e.g. DOMPurify) here.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PullQuote, SkillCard, SystemMessage } from '../../ds/index.js';
import { EntityHoverCard } from './world/EntityHoverCard.jsx';

const DROP_CAP = 'pd-grad-text float-left pr-[0.12em] pt-[0.04em] font-heading text-[3.4em] font-bold leading-[0.86]';

function Block({ b }) {
  switch (b.type) {
    case 'p':
      return (
        <p className="mb-[1.35em]">
          {b.dropcap && <span data-dropcap="1" className={DROP_CAP}>{b.dropLetter}</span>}
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
        <div className="my-[2em] flex justify-center">
          <SkillCard name={b.name} type={b.kind} rarity={b.rarity} tier={b.tier} description={b.description} cost={b.cost} cooldown={b.cooldown} />
        </div>
      );
    default:
      return null;
  }
}

// Non-spoiler entities become linkable mentions (name + aliases). Spoiler
// entities are omitted so the reader never gets a hover-card that spoils.
function buildMentions(world) {
  const list = [];
  for (const e of world?.entities ?? []) {
    if (e.spoiler) continue;
    const names = [e.name, ...(e.aliases ?? [])].filter(Boolean);
    if (names.length) list.push({ slug: e.slug, names, name: e.name, role: e.role, description: e.description, avatar: e.avatar, icon: e.icon, type: e.type });
  }
  return list;
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function ChapterBody({ blocks = [], fontSize, world = null, storyId }) {
  const ref = useRef(null);
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const mentions = useMemo(() => buildMentions(world), [world]);
  const bySlug = useMemo(() => new Map(mentions.map((m) => [m.slug, m])), [mentions]);

  // Link the first mention of each entity in the rendered prose. Runs
  // client-side after hydration; unwraps any prior pass first so it's
  // idempotent (Strict Mode double-invoke, re-renders).
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll('a.entity-mention').forEach((a) => a.replaceWith(document.createTextNode(a.textContent)));
    root.normalize();
    if (!mentions.length) return;

    const byName = new Map();
    const names = [];
    for (const m of mentions) {
      for (const nm of m.names) {
        const k = nm.toLowerCase();
        if (!byName.has(k)) { byName.set(k, m); names.push(nm); }
      }
    }
    names.sort((a, b) => b.length - a.length); // longest first: "Elara Voss" before "Elara"
    const re = new RegExp(`\\b(${names.map(escapeRe).join('|')})\\b`, 'gi');

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        for (let p = n.parentElement; p && p !== root; p = p.parentElement) {
          const t = p.tagName;
          if (t === 'A' || t === 'CODE') return NodeFilter.FILTER_REJECT;
          if (p.dataset && p.dataset.dropcap) return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n);

    const linked = new Set();
    const makeAnchor = (ent, matched) => {
      const a = document.createElement('a');
      a.className = 'entity-mention';
      a.dataset.slug = ent.slug;
      a.href = `/words/${storyId}/cast/${ent.slug}`;
      a.textContent = matched;
      a.style.cssText = 'color:var(--accent);text-decoration:none;border-bottom:1px dotted var(--accent);cursor:pointer';
      return a;
    };
    for (const tn of nodes) {
      const text = tn.nodeValue;
      re.lastIndex = 0;
      const parts = [];
      let lastIdx = 0;
      let changed = false;
      let m;
      while ((m = re.exec(text))) {
        const ent = byName.get(m[0].toLowerCase());
        if (!ent || linked.has(ent.slug)) continue; // one link per entity per chapter; keep scanning
        if (m.index > lastIdx) parts.push(document.createTextNode(text.slice(lastIdx, m.index)));
        parts.push(makeAnchor(ent, m[0]));
        linked.add(ent.slug);
        lastIdx = m.index + m[0].length;
        changed = true;
      }
      if (!changed) continue;
      if (lastIdx < text.length) parts.push(document.createTextNode(text.slice(lastIdx)));
      const frag = document.createDocumentFragment();
      for (const p of parts) frag.appendChild(p);
      tn.parentNode.replaceChild(frag, tn);
    }
  }, [blocks, mentions, storyId]);

  // Hover-card + SPA click, delegated on the container.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const over = (e) => {
      const a = e.target.closest?.('.entity-mention');
      if (!a) return;
      const ent = bySlug.get(a.dataset.slug);
      if (ent) setCard({ ent, rect: a.getBoundingClientRect() });
    };
    const out = (e) => {
      if (e.target.closest?.('.entity-mention')) setCard(null);
    };
    const click = (e) => {
      const a = e.target.closest?.('.entity-mention');
      if (!a) return;
      e.preventDefault();
      setCard(null);
      navigate({ to: '/words/$storyId/cast/$slug', params: { storyId, slug: a.dataset.slug } });
    };
    root.addEventListener('mouseover', over);
    root.addEventListener('mouseout', out);
    root.addEventListener('click', click);
    return () => {
      root.removeEventListener('mouseover', over);
      root.removeEventListener('mouseout', out);
      root.removeEventListener('click', click);
    };
  }, [bySlug, storyId, navigate]);

  return (
    <div ref={ref} className="font-serif leading-[1.72] text-prose" style={{ fontSize }}>
      {blocks.map((b, i) => <Block key={i} b={b} />)}
      <EntityHoverCard entity={card?.ent} rect={card?.rect} />
    </div>
  );
}
