// CastScreen — the /words/:storyId/cast page. Groups revealed entities by type
// (characters, locations, factions…) into responsive card grids. Everything
// here is already spoiler-gated by the server (see server/world.ts).
import React from 'react'
import { Link } from '@tanstack/react-router'
import { EntityCard } from './EntityCard.jsx'
import { WorldIcon } from './WorldIcon.jsx'
import { SpoilerToggle } from './Spoiler.jsx'
import { words } from '../../../../content/words'

function EmptyState({ story, message }) {
  return (
    <div style={{ maxWidth: 'var(--width-prose)', margin: '0 auto', padding: '72px 28px', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 34, color: 'var(--text-strong)', margin: 0 }}>
        {story.title}
      </h1>
      <p style={{ marginTop: 12, fontFamily: 'var(--font-prose)', fontSize: 18, color: 'var(--text-muted)' }}>{message}</p>
      <div style={{ marginTop: 24 }}>
        <Link to="/words/$storyId" params={{ storyId: story.id }} style={{ color: 'var(--cyan-400)', fontFamily: 'var(--font-ui)', textDecoration: 'none' }}>
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
    <div style={{ maxWidth: 'var(--width-content)', margin: '0 auto', padding: '48px 28px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.08em', color: 'var(--accent)', textTransform: 'uppercase' }}>
            {c.castEyebrow}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 44, color: 'var(--text-strong)', margin: '6px 0 0', lineHeight: 1 }}>
            {story.title}
          </h1>
          <p style={{ margin: '12px 0 0', maxWidth: 560, fontFamily: 'var(--font-prose)', fontSize: 17, lineHeight: 1.55, color: 'var(--text-muted)' }}>
            {c.castIntro}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
          {hasSpoilers && <SpoilerToggle />}
          {hasEdges && (
            <Link to="/words/$storyId/world" params={{ storyId: story.id }} style={{ color: 'var(--cyan-400)', fontFamily: 'var(--font-ui)', fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              {words.world.mapLink} →
            </Link>
          )}
          <Link to="/words/$storyId" params={{ storyId: story.id }} style={{ color: 'var(--cyan-400)', fontFamily: 'var(--font-ui)', fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            {words.world.backToStory}
          </Link>
        </div>
      </div>

      {/* Grouped grids */}
      {types.map((type) => {
        const items = entities.filter((e) => e.type === type.name)
        return (
          <section key={type.name} style={{ marginTop: 44 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              {type.icon && <WorldIcon name={type.icon} size={18} color="var(--text-muted)" />}
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: 'var(--text-heading)', margin: 0 }}>
                {type.displayName}
              </h2>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-faint)' }}>{items.length}</span>
            </div>
            <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
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
