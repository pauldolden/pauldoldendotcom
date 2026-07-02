import React from 'react';

/**
 * ChapterRow — a single chapter line in a table-of-contents list.
 * Shows index, title, date, optional "new" + read states.
 */
export function ChapterRow({ index, title, date, words, isNew = false, read = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 border-b border-line-faint bg-transparent px-4 py-[14px] text-left font-sans text-inherit transition-control hover:bg-inset"
    >
      <span className="w-[34px] shrink-0 text-right font-code text-sm tabular-nums text-mist-500">{String(index).padStart(2, '0')}</span>
      <span className="flex min-w-0 flex-1 items-center gap-2.5">
        <span className={`truncate text-md font-medium ${read ? 'text-faint' : 'text-body'}`}>{title}</span>
        {isNew && (
          <span className="shrink-0 rounded-pill bg-cyan-500 px-[7px] py-0.5 font-code text-[10px] font-semibold uppercase tracking-[0.1em] text-on-neon">New</span>
        )}
      </span>
      {words && <span className="shrink-0 font-code text-xs text-mist-500">{words}</span>}
      {date && <span className="w-[92px] shrink-0 text-right text-sm text-faint">{date}</span>}
    </button>
  );
}
