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

const NAV_BTN = 'flex items-center gap-3 font-sans text-[15px] font-semibold text-body no-underline';
const FAB = 'grid h-10 w-10 place-items-center rounded-full border-none bg-transparent cursor-pointer';

export function ReaderScreen({ story, chapter, blocks, prev, next, world = null }) {
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
    <div className="relative" style={{ background: themePreset.bg }}>
      {/* fixed progress bar */}
      <div className="sticky top-0 z-10">
        <ReadingProgress value={progress} height={3} />
      </div>

      <div id="reader-scroll">
        <article className="mx-auto max-w-prose px-6 pt-10" style={themePreset.vars}>
          {/* chapter header */}
          <Link to="/words/$storyId" params={{ storyId: story.id }} className="mb-7 inline-flex items-center gap-[7px] font-code text-xs uppercase tracking-[0.08em] text-faint no-underline">
            <Icon name="chevron-left" size={14} color="var(--text-faint)" /> {story.title}
          </Link>
          <div className="mb-3.5 flex items-center gap-3">
            <span className="font-code text-[13px] tracking-[0.12em] text-magenta-400">CHAPTER {chapter.index}</span>
            <Badge tone="complete">{chapter.words} words · {c.readTime}</Badge>
          </div>
          <h1 className="m-0 mb-9 font-heading text-[46px] font-bold leading-[1.04] text-strong">{chapter.title}</h1>

          <ChapterBody blocks={blocks} fontSize={size} world={world} storyId={story.id} />

          {/* chapter nav */}
          <nav className="my-12 flex justify-between gap-4 border-t border-line-faint pt-7">
            {prev ? (
              <Link to="/words/$storyId/$chapterId" params={{ storyId: story.id, chapterId: String(prev.index) }} className={NAV_BTN}>
                <Icon name="chevron-left" size={16} color="var(--text-muted)" />
                <span><small>{c.prevLabel}</small><br/>{prev.title}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link to="/words/$storyId/$chapterId" params={{ storyId: story.id, chapterId: String(next.index) }} className={`${NAV_BTN} flex-row-reverse text-right`}>
                <Icon name="chevron-right" size={16} color="var(--magenta-400)" />
                <span><small>{c.nextLabel}</small><br/>{next.title}</span>
              </Link>
            ) : <span />}
          </nav>
        </article>
      </div>

      {/* floating type controls */}
      <div className="fixed bottom-6 right-6 z-30 flex items-center gap-1.5 rounded-pill border border-glass-line bg-glass p-1.5 shadow-lg backdrop-blur-[14px]">
        <button className={FAB} title={c.smallerTitle} onClick={smaller}><span className="font-heading text-[13px] text-muted">A</span></button>
        <button className={FAB} title={c.largerTitle} onClick={larger}><span className="font-heading text-[19px] text-strong">A</span></button>
        <div className="h-[22px] w-px bg-line" />
        <button className={FAB} title={c.themeTitle} onClick={toggleTheme}><Icon name={themePreset.icon} size={17} color="var(--cyan-400)" /></button>
        <button
          className={FAB}
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
