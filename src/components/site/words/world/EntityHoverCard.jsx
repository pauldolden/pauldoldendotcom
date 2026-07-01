// EntityHoverCard — floating mini-profile shown when hovering an in-text
// character mention. Purely informational (pointer-events: none) so it never
// steals the click; the mention's own anchor handles navigation.
import React from 'react'
import { EntityAvatar } from './WorldIcon.jsx'

export function EntityHoverCard({ entity, rect }) {
  if (!entity || !rect) return null
  const isPerson = entity.type === 'characters' || entity.type === 'people'
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const width = 280
  const left = Math.max(12, Math.min(rect.left, vw - width - 12))
  const top = rect.bottom + 8

  return (
    <div
      role="tooltip"
      style={{
        position: 'fixed',
        top,
        left,
        zIndex: 60,
        width,
        maxWidth: 'calc(100vw - 24px)',
        pointerEvents: 'none',
        background: 'var(--bg-raised)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--r-lg)',
        boxShadow: 'var(--shadow-xl)',
        padding: 14,
        display: 'flex',
        gap: 12,
      }}
    >
      <EntityAvatar entity={entity} size={46} radius={isPerson ? '50%' : 'var(--r-sm)'} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-strong)', lineHeight: 1.1 }}>{entity.name}</div>
        {entity.description && (
          <p style={{ margin: '7px 0 0', fontFamily: 'var(--font-prose)', fontSize: 13, lineHeight: 1.45, color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{entity.description}</p>
        )}
      </div>
    </div>
  )
}
