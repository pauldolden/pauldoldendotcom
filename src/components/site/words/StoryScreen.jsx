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
      <section className="relative mb-0.5 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.32]" style={{ background: story.coverColor }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,8,23,0.5),var(--bg-base)_92%)]" />
        <div className="relative mx-auto grid max-w-content grid-cols-[300px_1fr] gap-10 px-7 pt-16 max-[860px]:grid-cols-1">
          <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-night-800 shadow-[var(--shadow-xl),var(--glow-purple)] max-[860px]:aspect-auto max-[860px]:h-[280px] max-[860px]:max-w-[360px]">
            <StoryCover coverStyle={story.coverStyle} id={story.id} title={story.title} tags={story.tags} coverColor={story.coverColor} status={story.status} />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(7,5,14,0.7))]" />
            <div className="absolute bottom-[18px] left-[18px] font-heading text-[30px] font-bold text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.5)]">{story.title}</div>
          </div>
          <div className="pt-2">
            <div className="mb-4 flex gap-2">
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
            <h1 className="m-0 font-heading text-[56px] font-bold leading-none text-strong">{story.title}</h1>
            <p className="mt-2.5 font-code text-sm tracking-wide text-cyan-400">{story.logline}</p>
            <p className="mt-5 max-w-[540px] font-serif text-[20px] leading-[1.6] text-prose">{story.blurb}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {story.tags.map((t) => <Tag key={t}>{t}</Tag>)}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
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
      <div className="mx-auto my-0.5 max-w-content px-7 pt-7">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="m-0 font-heading text-[28px] font-bold text-heading">{c.tocTitle}</h2>
          <button className="inline-flex cursor-pointer items-center gap-[7px] rounded-pill border border-line bg-none px-[14px] py-1.5 font-sans text-[13px] text-muted">
            <Icon name="arrow-down-up" size={14} color="var(--text-muted)" /> {c.sort}
          </button>
        </div>
        <div className="overflow-hidden rounded-lg border border-line bg-raised">
          {chapters.length ? chapters.map((ch) => (
            <ChapterRow key={ch.index} index={ch.index} title={ch.title} date={ch.date} words={ch.words} isNew={ch.isNew} read={ch.read} onClick={() => navigate({ to: '/words/$storyId/$chapterId', params: { storyId: story.id, chapterId: String(ch.index) } })} />
          )) : (
            <div className="px-4 py-7 font-sans text-faint">{c.noChapters}</div>
          )}
        </div>
      </div>
    </div>
  );
}
