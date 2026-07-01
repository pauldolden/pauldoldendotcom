// EntityCard — one entity in the cast grid. Shows only the spoiler-safe stub
// (avatar + name + description); role, aliases and the rest live behind the
// spoiler gate on the profile. A whole entity flagged `spoiler` blurs here.
import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { EntityAvatar } from './WorldIcon.jsx'
import { Spoiler } from './Spoiler.jsx'

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
          {entity.description && (
            <p
              style={{
                margin: '9px 0 0',
                fontFamily: 'var(--font-prose)',
                fontSize: 14,
                lineHeight: 1.5,
                color: 'var(--text-muted)',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {entity.description}
            </p>
          )}
        </div>
      </Link>
    </Spoiler>
  )
}
