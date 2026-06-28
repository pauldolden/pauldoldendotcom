// HomeScreen — hero, featured serial, more-to-read, latest chapters, follow.
// Copy from content/words; `stories` (catalog) from the route loader.
import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Badge, Button, ChapterRow, FollowSignup, Icon, StoryCard } from '../../ds/index.js';
import { words } from '../../../content/words';

export function HomeScreen({ stories }) {
  const c = words.home;
  const navigate = useNavigate();
  const featured = stories[0];
  const latest = featured?.toc ?? [];
  const more = stories.slice(1, 4);

  return (
    <div>
      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border-faint)' }}>
        <img className="brand-splash" src="/assets/splash-bg.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,8,23,0.4) 0%, rgba(11,8,23,0.82) 70%, var(--bg-base) 100%)' }} />
        <div style={{ position: 'relative', maxWidth: 'var(--width-content)', margin: '0 auto', padding: '88px 28px 76px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--cyan-400)', marginBottom: 20 }}>{c.hero.eyebrow}</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(44px, 7vw, 84px)', lineHeight: 0.98, letterSpacing: '0', color: 'var(--text-strong)', margin: 0, maxWidth: 880 }}>
            {c.hero.titleLead}<span className="pd-grad-text">{c.hero.titleAccent}</span>
          </h1>
          <p style={{ marginTop: 22, maxWidth: 560, fontFamily: 'var(--font-ui)', fontSize: 19, lineHeight: 1.55, color: 'var(--text-muted)' }}>
            {words.author.tagline}{c.hero.taglineSuffix}
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
            {featured && (
              <Button as={Link} to="/words/$storyId" params={{ storyId: featured.id }} variant="neon" size="lg" iconRight={<Icon name="arrow-right" size={18} color="#1a0a14" />}>{c.hero.ctaPrimary} {featured.title}</Button>
            )}
            <Button as={Link} to="/words/library" variant="outline" size="lg">{c.hero.ctaSecondary}</Button>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 'var(--width-content)', margin: '0 auto', padding: '0 28px' }}>
        {!featured && (
          <p style={{ paddingTop: 'var(--space-11)', fontFamily: 'var(--font-ui)', fontSize: 18, color: 'var(--text-faint)' }}>{c.empty}</p>
        )}

        {/* FEATURED */}
        {featured && (
          <section style={{ paddingTop: 'var(--space-11)' }}>
            <SectionHead eyebrow={c.featured.eyebrow} title={c.featured.title} />
            <div className="words-featured" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 28, alignItems: 'center', marginTop: 28 }}>
              <article style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ height: 260, background: featured.coverColor, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(7,5,14,0) 40%, rgba(7,5,14,0.7))' }} />
                  <div style={{ position: 'absolute', left: 18, top: 18 }}><Badge tone="ongoing" dot>Ongoing</Badge></div>
                </div>
              </article>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, letterSpacing: '0', color: 'var(--text-strong)', margin: 0 }}>{featured.title}</h3>
                <p style={{ marginTop: 14, fontFamily: 'var(--font-prose)', fontSize: 19, lineHeight: 1.6, color: 'var(--text-prose)' }}>{featured.blurb}</p>
                <div style={{ display: 'flex', gap: 18, marginTop: 18, fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
                  <span>{featured.chapters} chapters</span><span>{featured.words} words</span><span style={{ color: 'var(--cyan-400)' }}>{featured.updated}</span>
                </div>
                <div style={{ marginTop: 24 }}>
                  <Button as={Link} to="/words/$storyId" params={{ storyId: featured.id }} variant="solid" iconRight={<Icon name="chevron-right" size={16} color="#1a0a14" />}>{c.featured.cta}</Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* MORE WORK */}
        {more.length > 0 && (
          <section style={{ paddingTop: 'var(--space-11)' }}>
            <SectionHead eyebrow={c.shelf.eyebrow} title={c.shelf.title} action={<Link to="/words/library" style={linkBtn}>{c.shelf.allWorks}</Link>} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 22, marginTop: 28 }}>
              {more.map((s) => (
                <StoryCard key={s.id} title={s.title} blurb={s.blurb} coverColor={s.coverColor} status={s.status} tags={s.tags} meta={`${s.chapters} ch · ${s.words}`} onClick={() => navigate({ to: '/words/$storyId', params: { storyId: s.id } })} />
              ))}
            </div>
          </section>
        )}

        {/* LATEST CHAPTERS */}
        {latest.length > 0 && (
          <section style={{ paddingTop: 'var(--space-11)' }}>
            <SectionHead eyebrow={c.latest.eyebrow} title={c.latest.title} />
            <div style={{ marginTop: 22, border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden', background: 'var(--bg-raised)' }}>
              {latest.slice().reverse().map((ch) => (
                <ChapterRow key={ch.index} index={ch.index} title={ch.title} date={ch.date} words={ch.words} isNew={ch.isNew} read={ch.read} onClick={() => navigate({ to: '/words/$storyId/$chapterId', params: { storyId: featured.id, chapterId: String(ch.index) } })} />
              ))}
            </div>
          </section>
        )}

        {/* FOLLOW */}
        <section style={{ paddingTop: 'var(--space-11)' }}>
          <FollowSignup title={words.follow.title} blurb={words.follow.blurb} cta={words.follow.cta} onSubmit={() => {}} />
        </section>
      </div>
    </div>
  );
}

function SectionHead({ eyebrow, title, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--magenta-400)', marginBottom: 8 }}>{eyebrow}</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, letterSpacing: '0', color: 'var(--text-heading)', margin: 0 }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

const linkBtn = {
  color: 'var(--cyan-400)', textDecoration: 'none',
  fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600,
};
