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
      className="pointer-events-none fixed z-[60] flex max-w-[calc(100vw-24px)] gap-3 rounded-lg border border-line-strong bg-raised p-3.5 shadow-xl"
      style={{ top, left, width }}
    >
      <EntityAvatar entity={entity} size={46} radius={isPerson ? '50%' : 'var(--r-sm)'} />
      <div className="min-w-0">
        <div className="font-heading text-base font-bold leading-[1.1] text-strong">{entity.name}</div>
        {entity.description && (
          <p className="mb-0 mt-[7px] line-clamp-3 font-serif text-[13px] leading-[1.45] text-muted">{entity.description}</p>
        )}
      </div>
    </div>
  )
}
