// WorldScreen — /words/:storyId/world. The full relationship graph for a story.
import React from 'react'
import { Link } from '@tanstack/react-router'
import { RelationshipGraph } from './RelationshipGraph.jsx'
import { SpoilerToggle } from './Spoiler.jsx'
import { words } from '../../../../content/words'

function Empty({ story, message }) {
  return (
    <div style={{ maxWidth: 'var(--width-prose)', margin: '0 auto', padding: '72px 28px', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 34, color: 'var(--text-strong)', margin: 0 }}>{story.title}</h1>
      <p style={{ marginTop: 12, fontFamily: 'var(--font-prose)', fontSize: 18, color: 'var(--text-muted)' }}>{message}</p>
      <div style={{ marginTop: 24 }}>
        <Link to="/words/$storyId/cast" params={{ storyId: story.id }} style={{ color: 'var(--cyan-400)', fontFamily: 'var(--font-ui)', textDecoration: 'none' }}>
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
    <div style={{ maxWidth: 'var(--width-content)', margin: '0 auto', padding: '48px 28px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.08em', color: 'var(--accent)', textTransform: 'uppercase' }}>{c.mapEyebrow}</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 44, color: 'var(--text-strong)', margin: '6px 0 0', lineHeight: 1 }}>{story.title}</h1>
          <p style={{ margin: '12px 0 0', maxWidth: 560, fontFamily: 'var(--font-prose)', fontSize: 17, lineHeight: 1.55, color: 'var(--text-muted)' }}>{c.mapIntro}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
          {hasSpoilers && <SpoilerToggle />}
          <Link to="/words/$storyId/cast" params={{ storyId: story.id }} style={{ color: 'var(--cyan-400)', fontFamily: 'var(--font-ui)', fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            {c.backToCast}
          </Link>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        {hasEdges ? (
          <RelationshipGraph storyId={story.id} world={world} />
        ) : (
          <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-faint)', textAlign: 'center', padding: '40px 0' }}>{c.mapEmpty}</p>
        )}
      </div>
    </div>
  )
}
