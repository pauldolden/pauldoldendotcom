// EntityCard — one entity in the cast grid. Links to its profile.
import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { EntityAvatar } from './WorldIcon.jsx'
import { Spoiler } from './Spoiler.jsx'
import { words } from '../../../../content/words'

export function EntityCard({ storyId, entity }) {
  const [hover, setHover] = useState(false)
  const isPerson = entity.type === 'characters' || entity.type === 'people'
  return (
    <Spoiler active={entity.spoiler} label="Hidden">
    <Link
      to="/words/$storyId/cast/$slug"
      params={{ storyId, slug: entity.slug }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
        padding: 16,
        borderRadius: 'var(--r-lg)',
        background: 'var(--bg-raised)',
        border: `1px solid ${hover ? 'var(--border-strong)' : 'var(--border)'}`,
        boxShadow: hover ? 'var(--shadow-md), var(--edge-light)' : 'var(--edge-light)',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'var(--t-control)',
        textDecoration: 'none',
        height: '100%',
      }}
    >
      <EntityAvatar entity={entity} size={56} radius={isPerson ? '50%' : 'var(--r-md)'} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text-strong)', lineHeight: 1.15 }}>
          {entity.name}
        </div>
        {entity.role && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, letterSpacing: '0.05em', color: 'var(--accent)', marginTop: 3, textTransform: 'uppercase' }}>
            {entity.role}
          </div>
        )}
        {entity.description && (
          <p
            style={{
              margin: '9px 0 0',
              fontFamily: 'var(--font-prose)',
              fontSize: 14,
              lineHeight: 1.5,
              color: 'var(--text-muted)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {entity.description}
          </p>
        )}
        {entity.aliases?.length > 0 && (
          <div style={{ marginTop: 8, fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-faint)' }}>
            {words.world.aka} {entity.aliases.join(', ')}
          </div>
        )}
      </div>
    </Link>
    </Spoiler>
  )
}
