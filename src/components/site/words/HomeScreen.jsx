// HomeScreen — hero, featured serial, more-to-read, latest chapters, follow.
// Copy from content/words; `stories` (catalog) from the route loader.
import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Badge, Button, ChapterRow, Icon, StoryCard, StoryCover } from '../../ds/index.js';
import { words } from '../../../content/words';

const LINK_BTN = 'font-sans text-sm font-semibold text-cyan-400 no-underline';

export function HomeScreen({ stories }) {
  const c = words.home;
  const navigate = useNavigate();
  const featured = stories[0];
  const latest = featured?.toc ?? [];
  const more = stories.slice(1, 4);
  const featuredHasChapters = latest.length > 0;
  const STATUS_LABEL = { ongoing: 'Ongoing', complete: 'Complete', hiatus: 'Hiatus', drafting: 'Drafting', planned: 'Planned' };
  const STATUS_TONE = { ongoing: 'ongoing', complete: 'complete', hiatus: 'hiatus', drafting: 'hiatus', planned: 'neutral' };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line-faint">
        <img className="brand-splash absolute inset-0 h-full w-full object-cover opacity-55" src="/assets/splash-bg.svg" alt="" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,8,23,0.4)_0%,rgba(11,8,23,0.82)_70%,var(--bg-base)_100%)]" />
        <div className="relative mx-auto max-w-content px-7 pb-[76px] pt-[88px]">
          <div className="mb-5 font-code text-[13px] uppercase tracking-[0.22em] text-cyan-400">{c.hero.eyebrow}</div>
          <h1 className="m-0 max-w-[880px] font-heading text-[clamp(44px,7vw,84px)] font-bold leading-[0.98] text-strong">
            {c.hero.titleLead}<span className="pd-grad-text">{c.hero.titleAccent}</span>
          </h1>
          <p className="mt-[22px] max-w-[560px] font-sans text-[19px] leading-[1.55] text-muted">
            {words.author.tagline}{c.hero.taglineSuffix}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {featured && (
              <Button as={Link} to="/words/$storyId" params={{ storyId: featured.id }} variant="neon" size="lg" iconRight={<Icon name="arrow-right" size={18} color="#1a0a14" />}>{(featuredHasChapters ? c.hero.ctaPrimary : c.hero.ctaPreview)} {featured.title}</Button>
            )}
            <Button as={Link} to="/words/library" variant="outline" size="lg">{c.hero.ctaSecondary}</Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-7">
        {!featured && (
          <p className="pt-20 font-sans text-[18px] text-faint">{c.empty}</p>
        )}

        {/* FEATURED */}
        {featured && (
          <section className="pt-20">
            <SectionHead eyebrow={c.featured.eyebrow} title={c.featured.title} />
            <div className="mt-7 grid grid-cols-[1.1fr_0.9fr] items-center gap-7 max-[860px]:grid-cols-1">
              <Link to="/words/$storyId" params={{ storyId: featured.id }} aria-label={featured.title} className="block">
                <article className="cursor-pointer overflow-hidden rounded-xl border border-line shadow-lg">
                  <div className="relative h-[260px] overflow-hidden bg-night-800">
                    <StoryCover coverStyle={featured.coverStyle} id={featured.id} title={featured.title} tags={featured.tags} coverColor={featured.coverColor} status={featured.status} />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,5,14,0)_40%,rgba(7,5,14,0.7))]" />
                    <div className="absolute left-[18px] top-[18px]"><Badge tone={STATUS_TONE[featured.status] || 'neutral'} dot overlay>{STATUS_LABEL[featured.status] || featured.status}</Badge></div>
                  </div>
                </article>
              </Link>
              <div>
                <h3 className="m-0 font-heading text-[40px] font-bold text-strong">{featured.title}</h3>
                <p className="mt-3.5 font-serif text-[19px] leading-[1.6] text-prose">{featured.blurb}</p>
                <div className="mt-[18px] flex gap-[18px] font-code text-xs uppercase tracking-[0.06em] text-faint">
                  {featuredHasChapters ? (
                    <>
                      <span>{featured.chapters} chapters</span><span>{featured.words} words</span>
                      {featured.updated && <span className="text-cyan-400">{featured.updated}</span>}
                    </>
                  ) : (
                    <span className="text-cyan-400">{featured.progress || 'In progress'}</span>
                  )}
                </div>
                <div className="mt-6">
                  <Button as={Link} to="/words/$storyId" params={{ storyId: featured.id }} variant="solid" iconRight={<Icon name="chevron-right" size={16} color="#1a0a14" />}>{c.featured.cta}</Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* MORE WORK */}
        {more.length > 0 && (
          <section className="pt-20">
            <SectionHead eyebrow={c.shelf.eyebrow} title={c.shelf.title} action={<Link to="/words/library" className={LINK_BTN}>{c.shelf.allWorks}</Link>} />
            <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[22px]">
              {more.map((s) => (
                <StoryCard key={s.id} id={s.id} title={s.title} blurb={s.blurb} coverColor={s.coverColor} coverStyle={s.coverStyle} status={s.status} tags={s.tags} meta={s.chapters > 0 ? `${s.chapters} ch · ${s.words}` : `${s.words} planned`} onClick={() => navigate({ to: '/words/$storyId', params: { storyId: s.id } })} />
              ))}
            </div>
          </section>
        )}

        {/* LATEST CHAPTERS */}
        {latest.length > 0 && (
          <section className="pt-20">
            <SectionHead eyebrow={c.latest.eyebrow} title={c.latest.title} />
            <div className="mt-[22px] overflow-hidden rounded-lg border border-line bg-raised">
              {latest.slice().reverse().map((ch) => (
                <ChapterRow key={ch.index} index={ch.index} title={ch.title} date={ch.date} words={ch.words} isNew={ch.isNew} read={ch.read} onClick={() => navigate({ to: '/words/$storyId/$chapterId', params: { storyId: featured.id, chapterId: String(ch.index) } })} />
              ))}
            </div>
          </section>
        )}

        {/* (newsletter signup removed — no provider yet) */}
      </div>
    </div>
  );
}

function SectionHead({ eyebrow, title, action }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="mb-2 font-code text-xs uppercase tracking-[0.18em] text-magenta-400">{eyebrow}</div>
        <h2 className="m-0 font-heading text-[32px] font-bold text-heading">{title}</h2>
      </div>
      {action}
    </div>
  );
}
