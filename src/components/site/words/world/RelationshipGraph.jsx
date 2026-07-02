// RelationshipGraph — the /world centrepiece. A dependency-free circular
// SVG graph: every entity is a node on the ring, every relationship an edge
// coloured by category. Spoiler-aware: hidden nodes render masked ("???") and
// spoiler edges aren't drawn until the reader flips "show spoilers".
import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useSpoilers } from './Spoiler.jsx'
import { CATEGORY_COLOR } from './relationships.js'
import { words } from '../../../../content/words'

export function RelationshipGraph({ storyId, world }) {
  const { show } = useSpoilers()
  const navigate = useNavigate()

  const entities = world?.entities ?? []
  const rels = world?.relationships ?? []
  if (entities.length === 0) return null

  const W = 760
  const H = 640
  const cx = W / 2
  const cy = H / 2
  const R = Math.min(W, H) / 2 - 150
  const n = entities.length

  const pos = new Map()
  entities.forEach((e, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2
    pos.set(e.slug, { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), cos: Math.cos(a) })
  })

  // Relationships are all spoilers — the ring of names shows, but the lines
  // between them only appear once the reader flips "show spoilers".
  const edges = show ? rels.filter((r) => pos.has(r.from) && pos.has(r.to)) : []
  const cats = [...new Set(edges.map((r) => r.category))]

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto max-h-[640px] w-full" role="img" aria-label="Relationship graph">
        {edges.map((r, i) => {
          const a = pos.get(r.from)
          const b = pos.get(r.to)
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              strokeWidth={1.5}
              style={{ stroke: CATEGORY_COLOR[r.category] ?? CATEGORY_COLOR.other, strokeOpacity: 0.5 }}
            />
          )
        })}

        {entities.map((e) => {
          const p = pos.get(e.slug)
          const masked = e.spoiler && !show
          const right = p.cos >= 0
          return (
            <g
              key={e.slug}
              className={masked ? 'cursor-default' : 'cursor-pointer'}
              onClick={() => !masked && navigate({ to: '/words/$storyId/cast/$slug', params: { storyId, slug: e.slug } })}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={7}
                strokeWidth={1.5}
                style={{ fill: masked ? 'var(--bg-surface)' : 'var(--accent)', stroke: 'var(--border-strong)' }}
              />
              <text
                x={p.x + (right ? 12 : -12)}
                y={p.y + 4}
                textAnchor={right ? 'start' : 'end'}
                fontSize={12}
                style={{ fontFamily: 'var(--font-ui)', fill: masked ? 'var(--text-faint)' : 'var(--text-body)' }}
              >
                {masked ? '???' : e.name}
              </text>
            </g>
          )
        })}
      </svg>

      {cats.length > 0 && (
        <div className="mt-2 flex flex-wrap justify-center gap-4">
          {cats.map((cat) => (
            <span key={cat} className="inline-flex items-center gap-[7px] font-code text-xs text-muted">
              <span className="h-[3px] w-3.5 rounded-[2px]" style={{ background: CATEGORY_COLOR[cat] ?? CATEGORY_COLOR.other }} />
              {words.world.relGroups[cat] ?? cat}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
