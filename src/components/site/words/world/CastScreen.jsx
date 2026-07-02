// CastScreen — the /words/:storyId/cast page. Groups revealed entities by type
// (characters, locations, factions…) into responsive card grids. Everything
// here is already spoiler-gated by the server (see server/world.ts).
import React from 'react'
import { Link } from '@tanstack/react-router'
import { EntityCard } from './EntityCard.jsx'
import { WorldIcon } from './WorldIcon.jsx'
import { SpoilerToggle } from './Spoiler.jsx'
import { words } from '../../../../content/words'

const QUIET_LINK = 'font-sans text-sm text-cyan-400 no-underline whitespace-nowrap'

function EmptyState({ story, message }) {
  return (
    <div className="mx-auto max-w-prose px-7 py-[72px] text-center">
      <h1 className="m-0 font-heading text-[34px] text-strong">
        {story.title}
      </h1>
      <p className="mt-3 font-serif text-[18px] text-muted">{message}</p>
      <div className="mt-6">
        <Link to="/words/$storyId" params={{ storyId: story.id }} className="font-sans text-cyan-400 no-underline">
          {words.world.backToStory}
        </Link>
      </div>
    </div>
  )
}

export function CastScreen({ story, world }) {
  const c = words.world
  if (!world) return <EmptyState story={story} message={c.empty} />
  const entities = world.entities ?? []
  if (entities.length === 0) return <EmptyState story={story} message={c.emptyGated} />

  const types = (world.entityTypes ?? []).filter((t) => entities.some((e) => e.type === t.name))
  // Every entity carries a gated dossier (role/bio/relationships/…), so the
  // reveal toggle is always relevant once there's a cast.
  const hasSpoilers = entities.length > 0
  const hasEdges = (world.relationships ?? []).length > 0

  return (
    <div className="mx-auto max-w-content px-7 pt-12">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-code text-[13px] uppercase tracking-[0.08em] text-accent">
            {c.castEyebrow}
          </div>
          <h1 className="mb-0 mt-1.5 font-heading text-[44px] font-bold leading-none text-strong">
            {story.title}
          </h1>
          <p className="mb-0 mt-3 max-w-[560px] font-serif text-[17px] leading-[1.55] text-muted">
            {c.castIntro}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          {hasSpoilers && <SpoilerToggle />}
          {hasEdges && (
            <Link to="/words/$storyId/world" params={{ storyId: story.id }} className={QUIET_LINK}>
              {words.world.mapLink} →
            </Link>
          )}
          <Link to="/words/$storyId" params={{ storyId: story.id }} className={QUIET_LINK}>
            {words.world.backToStory}
          </Link>
        </div>
      </div>

      {/* Grouped grids */}
      {types.map((type) => {
        const items = entities.filter((e) => e.type === type.name)
        return (
          <section key={type.name} className="mt-11">
            <div className="mb-4 flex items-center gap-2.5">
              {type.icon && <WorldIcon name={type.icon} size={18} color="var(--text-muted)" />}
              <h2 className="m-0 font-heading text-xl font-bold text-heading">
                {type.displayName}
              </h2>
              <span className="font-code text-[13px] text-faint">{items.length}</span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3.5">
              {items.map((entity) => (
                <EntityCard key={entity.slug} storyId={story.id} entity={entity} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
