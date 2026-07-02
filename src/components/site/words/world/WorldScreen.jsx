// WorldScreen — /words/:storyId/world. The full relationship graph for a story.
import React from 'react'
import { Link } from '@tanstack/react-router'
import { RelationshipGraph } from './RelationshipGraph.jsx'
import { SpoilerToggle } from './Spoiler.jsx'
import { words } from '../../../../content/words'

function Empty({ story, message }) {
  return (
    <div className="mx-auto max-w-prose px-7 py-[72px] text-center">
      <h1 className="m-0 font-heading text-[34px] text-strong">{story.title}</h1>
      <p className="mt-3 font-serif text-[18px] text-muted">{message}</p>
      <div className="mt-6">
        <Link to="/words/$storyId/cast" params={{ storyId: story.id }} className="font-sans text-cyan-400 no-underline">
          {words.world.backToCast}
        </Link>
      </div>
    </div>
  )
}

export function WorldScreen({ story, world }) {
  const c = words.world
  const hasEntities = !!world && (world.entities?.length ?? 0) > 0
  if (!hasEntities) return <Empty story={story} message={c.empty} />

  const hasEdges = (world.relationships?.length ?? 0) > 0
  // Edges are all gated → the toggle matters whenever there are any.
  const hasSpoilers = hasEdges || world.entities.some((e) => e.spoiler)

  return (
    <div className="mx-auto max-w-content px-7 pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-code text-[13px] uppercase tracking-[0.08em] text-accent">{c.mapEyebrow}</div>
          <h1 className="mb-0 mt-1.5 font-heading text-[44px] font-bold leading-none text-strong">{story.title}</h1>
          <p className="mb-0 mt-3 max-w-[560px] font-serif text-[17px] leading-[1.55] text-muted">{c.mapIntro}</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          {hasSpoilers && <SpoilerToggle />}
          <Link to="/words/$storyId/cast" params={{ storyId: story.id }} className="font-sans text-sm text-cyan-400 no-underline whitespace-nowrap">
            {c.backToCast}
          </Link>
        </div>
      </div>

      <div className="mt-8">
        {hasEdges ? (
          <RelationshipGraph storyId={story.id} world={world} />
        ) : (
          <p className="py-10 text-center font-sans text-faint">{c.mapEmpty}</p>
        )}
      </div>
    </div>
  )
}
