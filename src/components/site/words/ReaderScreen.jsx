// ReaderScreen — progress bar, chapter body (block doc from loader/R2),
// chapter nav, floating type controls. Font size + reading theme persist
// (useReaderPrefs); the bookmark toggle persists (useBookmarks).
import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Badge, Icon, ReadingProgress } from '../../ds/index.js';
import { ChapterBody } from './ChapterBody.jsx';
import { useReaderPrefs } from './useReaderPrefs.js';
import { useBookmarks } from './useBookmarks.js';
import { words } from '../../../content/words';

export function ReaderScreen({ story, chapter, blocks, prev, next }) {
  const c = words.reader;
  const { size, smaller, larger, themePreset, toggleTheme } = useReaderPrefs();
  const bookmarks = useBookmarks();
  const saved = bookmarks.isSaved(story.id, chapter.index);
  const [progress, setProgress] = useState(18);

  useEffect(() => {
    const el = document.getElementById('reader-scroll');
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: themePreset.bg, position: 'relative' }}>
      {/* fixed progress bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10 }}>
        <ReadingProgress value={progress} height={3} />
      </div>

      <div id="reader-scroll" style={{ maxHeight: 'none' }}>
        <article style={{ maxWidth: 'var(--width-prose)', margin: '0 auto', padding: '40px 24px 0', ...themePreset.vars }}>
          {/* chapter header */}
          <Link to="/words/$storyId" params={{ storyId: story.id }} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, textDecoration: 'none', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 28 }}>
            <Icon name="chevron-left" size={14} color="var(--text-faint)" /> {story.title}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.12em', color: 'var(--magenta-400)' }}>CHAPTER {chapter.index}</span>
            <Badge tone="complete">{chapter.words} words · {c.readTime}</Badge>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 46, letterSpacing: '0', lineHeight: 1.04, color: 'var(--text-strong)', margin: '0 0 36px' }}>{chapter.title}</h1>

          <ChapterBody blocks={blocks} fontSize={size} />

          {/* chapter nav */}
          <nav style={{ display: 'flex', justifyContent: 'space-between', gap: 16, margin: '48px 0', paddingTop: 28, borderTop: '1px solid var(--border-faint)' }}>
            {prev ? (
              <Link to="/words/$storyId/$chapterId" params={{ storyId: story.id, chapterId: String(prev.index) }} style={navBtn}>
                <Icon name="chevron-left" size={16} color="var(--text-muted)" />
                <span><small>{c.prevLabel}</small><br/>{prev.title}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link to="/words/$storyId/$chapterId" params={{ storyId: story.id, chapterId: String(next.index) }} style={{ ...navBtn, textAlign: 'right', flexDirection: 'row-reverse' }}>
                <Icon name="chevron-right" size={16} color="var(--magenta-400)" />
                <span><small>{c.nextLabel}</small><br/>{next.title}</span>
              </Link>
            ) : <span />}
          </nav>
        </article>
      </div>

      {/* floating type controls */}
      <div style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 30, display: 'flex', alignItems: 'center', gap: 6, padding: 6, borderRadius: 'var(--r-pill)', background: 'var(--glass)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', boxShadow: 'var(--shadow-lg)' }}>
        <button style={fab} title={c.smallerTitle} onClick={smaller}><span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--text-muted)' }}>A</span></button>
        <button style={fab} title={c.largerTitle} onClick={larger}><span style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--text-strong)' }}>A</span></button>
        <div style={{ width: 1, height: 22, background: 'var(--border)' }} />
        <button style={fab} title={c.themeTitle} onClick={toggleTheme}><Icon name={themePreset.icon} size={17} color="var(--cyan-400)" /></button>
        <button
          style={fab}
          title={saved ? c.bookmarkedTitle : c.bookmarkTitle}
          aria-pressed={saved}
          onClick={() => bookmarks.toggle({ storyId: story.id, chapterId: chapter.index, title: chapter.title, storyTitle: story.title })}
        >
          <Icon name="bookmark" size={17} color={saved ? 'var(--magenta-400)' : 'var(--text-muted)'} />
        </button>
      </div>
    </div>
  );
}

const navBtn = {
  display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none',
  color: 'var(--text-body)', fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600,
};
const fab = {
  width: 40, height: 40, display: 'grid', placeItems: 'center', borderRadius: '50%',
  background: 'transparent', border: 'none', cursor: 'pointer',
};
