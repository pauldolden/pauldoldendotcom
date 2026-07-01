// StoryScreen — serial landing: cover hero, blurb, chapter list.
// Copy from content/words; `story` + `chapters` from the route loader.
import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Badge, Button, ChapterRow, Icon, Tag, StoryCover } from '../../ds/index.js';
import { words } from '../../../content/words';

const STATUS_LABEL = { ongoing: 'Ongoing', complete: 'Complete', hiatus: 'Hiatus', drafting: 'Drafting', planned: 'Planned' };
const STATUS_TONE = { ongoing: 'ongoing', complete: 'complete', hiatus: 'hiatus', drafting: 'hiatus', planned: 'neutral' };

export function StoryScreen({ story, chapters = [], world = null }) {
  const c = words.story;
  const navigate = useNavigate();
  const first = chapters[0];
  // Badge shows only the openly-visible (non-spoiler) count so it never hints
  // at hidden cast; the link itself shows whenever there's any cast at all.
  const entityCount = world?.entities?.length ?? 0;
  const castCount = world?.entities?.filter((e) => !e.spoiler).length ?? 0;
  const statusLabel = STATUS_LABEL[story.status] || story.status;
  const statusTone = STATUS_TONE[story.status] || 'neutral';

  return (
    <div>
      {/* COVER HERO */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: story.coverColor, opacity: 0.32 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,8,23,0.5), var(--bg-base) 92%)' }} />
        <div className="story-hero" style={{ position: 'relative', maxWidth: 'var(--width-content)', margin: '0 auto', padding: '64px 28px 0', display: 'grid', gridTemplateColumns: '300px 1fr', gap: 40 }}>
          <div className="story-cover" style={{ aspectRatio: '2 / 3', borderRadius: 'var(--r-xl)', background: 'var(--night-800)', boxShadow: 'var(--shadow-xl), var(--glow-purple)', position: 'relative', overflow: 'hidden' }}>
            <StoryCover id={story.id} title={story.title} tags={story.tags} coverColor={story.coverColor} status={story.status} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 55%, rgba(7,5,14,0.7))' }} />
            <div style={{ position: 'absolute', left: 18, bottom: 18, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 30, color: '#fff', letterSpacing: '0', textShadow: '0 2px 14px rgba(0,0,0,0.5)' }}>{story.title}</div>
          </div>
          <div style={{ paddingTop: 8 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <Badge tone={statusTone} dot>{statusLabel}</Badge>
              {story.chapters > 0 ? (
                <>
                  <Badge tone="magenta">{story.chapters} chapters</Badge>
                  <Badge tone="neutral">{story.words} words</Badge>
                </>
              ) : (
                <Badge tone="neutral">{story.progress || 'In progress'}</Badge>
              )}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 56, letterSpacing: '0', color: 'var(--text-strong)', margin: 0, lineHeight: 1 }}>{story.title}</h1>
            <p style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 14, letterSpacing: '0.04em', color: 'var(--cyan-400)' }}>{story.logline}</p>
            <p style={{ marginTop: 20, maxWidth: 540, fontFamily: 'var(--font-prose)', fontSize: 20, lineHeight: 1.6, color: 'var(--text-prose)' }}>{story.blurb}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
              {story.tags.map((t) => <Tag key={t}>{t}</Tag>)}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              {first ? (
                <Button as={Link} to="/words/$storyId/$chapterId" params={{ storyId: story.id, chapterId: String(first.index) }} variant="neon" size="lg" iconRight={<Icon name="book-open" size={17} color="#1a0a14" />}>{c.start}</Button>
              ) : (
                <Button variant="neon" size="lg" disabled>{c.noChaptersBtn}</Button>
              )}
              <Button variant="outline" size="lg" iconLeft={<Icon name="bookmark" size={16} color="var(--magenta-400)" />}>{c.addToLibrary}</Button>
              {entityCount > 0 && (
                <Button as={Link} to="/words/$storyId/cast" params={{ storyId: story.id }} variant="outline" size="lg" iconLeft={<Icon name="feather" size={16} color="var(--magenta-400)" />}>
                  {castCount > 0 ? `${words.world.castTitle} (${castCount})` : words.world.castTitle}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BODY: TOC */}
      <div className="story-body" style={{ maxWidth: 'var(--width-content)', margin: '0 auto', padding: '56px 28px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--text-heading)', margin: 0 }}>{c.tocTitle}</h2>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--r-pill)', padding: '6px 14px', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 13 }}>
            <Icon name="arrow-down-up" size={14} color="var(--text-muted)" /> {c.sort}
          </button>
        </div>
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden', background: 'var(--bg-raised)' }}>
          {chapters.length ? chapters.map((ch) => (
            <ChapterRow key={ch.index} index={ch.index} title={ch.title} date={ch.date} words={ch.words} isNew={ch.isNew} read={ch.read} onClick={() => navigate({ to: '/words/$storyId/$chapterId', params: { storyId: story.id, chapterId: String(ch.index) } })} />
          )) : (
            <div style={{ padding: '28px 16px', fontFamily: 'var(--font-ui)', color: 'var(--text-faint)' }}>{c.noChapters}</div>
          )}
        </div>
      </div>
    </div>
  );
}
