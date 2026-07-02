// EntityCard — one entity in the cast grid. Shows only the spoiler-safe stub
// (avatar + name + description); role, aliases and the rest live behind the
// spoiler gate on the profile. A whole entity flagged `spoiler` blurs here.
import React from 'react'
import { Link } from '@tanstack/react-router'
import { EntityAvatar } from './WorldIcon.jsx'
import { Spoiler } from './Spoiler.jsx'

export function EntityCard({ storyId, entity }) {
  const isPerson = entity.type === 'characters' || entity.type === 'people'
  return (
    <Spoiler active={entity.spoiler} label="Hidden">
      <Link
        to="/words/$storyId/cast/$slug"
        params={{ storyId, slug: entity.slug }}
        className="flex h-full items-start gap-3.5 rounded-lg border border-line bg-raised p-4 no-underline shadow-edge transition-control hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--shadow-md),var(--edge-light)]"
      >
        <EntityAvatar entity={entity} size={56} radius={isPerson ? '50%' : 'var(--r-md)'} />
        <div className="min-w-0">
          <div className="font-heading text-[18px] font-bold leading-[1.15] text-strong">
            {entity.name}
          </div>
          {entity.description && (
            <p className="mb-0 mt-[9px] line-clamp-3 font-serif text-sm leading-[1.5] text-muted">
              {entity.description}
            </p>
          )}
        </div>
      </Link>
    </Spoiler>
  )
}
