import React from 'react';
import { Badge } from '../core/Badge.jsx';
import { Tag } from '../core/Tag.jsx';
import { StoryCover } from './StoryCover.jsx';

/**
 * StoryCard — a serial/work cover card for library grids and featured rails.
 * Cover art goes in the `cover` slot (an <img> or a gradient placeholder).
 */
const STATUS_LABEL = { ongoing: 'Ongoing', complete: 'Complete', hiatus: 'Hiatus', drafting: 'Drafting', planned: 'Planned' };
const STATUS_TONE = { ongoing: 'ongoing', complete: 'complete', hiatus: 'hiatus', drafting: 'hiatus', planned: 'neutral' };

export function StoryCard({
  id,
  title,
  blurb,
  cover = null,
  coverColor = 'var(--accent)',
  coverStyle,
  status = 'ongoing',
  statusLabel,
  tags = [],
  meta,
  onClick,
}) {
  const statusText = statusLabel || STATUS_LABEL[status] || status;
  const statusTone = STATUS_TONE[status] || 'neutral';
  return (
    <article
      onClick={onClick}
      className={`flex flex-col overflow-hidden rounded-lg border border-line bg-raised shadow-[var(--shadow-md),var(--edge-light)] transition-control ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className="relative aspect-[3/2] bg-night-800">
        {cover || <StoryCover coverStyle={coverStyle} id={id} title={title} tags={tags} coverColor={coverColor} status={status} />}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,5,14,0)_45%,rgba(7,5,14,0.78)_100%)]" />
        <div className="absolute left-3 top-3">
          <Badge tone={statusTone} dot overlay>{statusText}</Badge>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 p-5">
        <h3 className="m-0 font-heading text-xl font-bold leading-[1.15] text-heading">{title}</h3>
        {blurb && <p className="m-0 font-sans text-sm leading-[1.55] text-muted">{blurb}</p>}
        {tags.length > 0 && (
          <div className="mt-0.5 flex flex-wrap gap-[7px]">
            {tags.slice(0, 3).map((t) => <Tag key={t}>{t}</Tag>)}
          </div>
        )}
        {meta && (
          <div className="mt-1 border-t border-line-faint pt-3 font-code text-xs uppercase tracking-wide text-faint">{meta}</div>
        )}
      </div>
    </article>
  );
}
