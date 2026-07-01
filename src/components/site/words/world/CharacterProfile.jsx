// CharacterProfile — /words/:storyId/cast/:slug. Works for any entity type
// (people, places, factions); "character" is just the common case. Renders the
// Trove entity: header, custom fields, bio prose, and grouped relationships.
// All relationships here are already spoiler-gated by the server.
import React from 'react'
import { Link } from '@tanstack/react-router'
import { EntityAvatar, WorldIcon } from './WorldIcon.jsx'
import { Spoiler, SpoilerToggle } from './Spoiler.jsx'
import { renderProse, fieldLabel } from './prose.js'
import { words } from '../../../../content/words'

const GROUP_ORDER = ['family', 'social', 'org', 'possession', 'spatial', 'other']

function RelRow({ storyId, link }) {
  const other = { name: link.otherName, avatar: link.otherAvatar, icon: link.otherIcon, type: link.otherType }
  const isPerson = link.otherType === 'characters' || link.otherType === 'people'
  return (
    <Spoiler active={link.spoiler} label="Hidden">
    <Link
      to="/words/$storyId/cast/$slug"
      params={{ storyId, slug: link.otherSlug }}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 'var(--r-md)', textDecoration: 'none', border: '1px solid var(--border-faint)', background: 'var(--bg-surface)' }}
    >
      <EntityAvatar entity={other} size={40} radius={isPerson ? '50%' : 'var(--r-sm)'} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 15, color: 'var(--text-strong)' }}>{link.otherName}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-muted)', letterSpacing: '0.03em' }}>
          {link.label}
          {link.intensity ? ` · ${link.intensity}` : ''}
        </div>
      </div>
    </Link>
    </Spoiler>
  )
}

export function CharacterProfile({ story, entity, links = [], entityTypes = [] }) {
  const c = words.world
  const typeMeta = entityTypes.find((t) => t.name === entity.type)
  const isPerson = entity.type === 'characters' || entity.type === 'people'
  const fields = Object.entries(entity.fields ?? {})
  const hasSpoilers = links.some((l) => l.spoiler) || (entity.bio ?? []).some((s) => s.spoiler)

  // Group relationships by predicate category.
  const groups = {}
  for (const l of links) {
    const g = GROUP_ORDER.includes(l.category) ? l.category : 'other'
    ;(groups[g] ||= []).push(l)
  }
  const groupKeys = GROUP_ORDER.filter((g) => groups[g]?.length)

  return (
    <div style={{ maxWidth: 'var(--width-content)', margin: '0 auto', padding: '32px 28px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <Link to="/words/$storyId/cast" params={{ storyId: story.id }} style={{ color: 'var(--cyan-400)', fontFamily: 'var(--font-ui)', fontSize: 14, textDecoration: 'none' }}>
          {c.backToCast}
        </Link>
        {hasSpoilers && <SpoilerToggle />}
      </div>

      {/* Header */}
      <header style={{ display: 'flex', gap: 24, alignItems: 'center', marginTop: 20, flexWrap: 'wrap' }}>
        <EntityAvatar entity={entity} size={112} radius={isPerson ? '50%' : 'var(--r-lg)'} />
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {typeMeta && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {typeMeta.icon && <WorldIcon name={typeMeta.icon} size={13} color="var(--text-muted)" />}
                {typeMeta.displayName}
              </span>
            )}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 46, color: 'var(--text-strong)', margin: '6px 0 0', lineHeight: 1.02 }}>
            {entity.name}
          </h1>
          {entity.role && (
            <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 14, letterSpacing: '0.04em', color: 'var(--accent)' }}>{entity.role}</div>
          )}
          {entity.aliases?.length > 0 && (
            <div style={{ marginTop: 8, fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text-faint)' }}>
              {c.aka} {entity.aliases.join(', ')}
            </div>
          )}
        </div>
      </header>

      {/* Body: bio + side rail */}
      <div className="cast-profile-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 40, marginTop: 40, alignItems: 'start' }}>
        <div>
          {entity.description && (
            <p style={{ fontFamily: 'var(--font-prose)', fontSize: 20, lineHeight: 1.55, color: 'var(--text-prose)', margin: 0 }}>{entity.description}</p>
          )}
          {entity.bio?.length > 0 && (
            <div className="cast-bio" style={{ marginTop: 20, fontFamily: 'var(--font-prose)', fontSize: 17, lineHeight: 1.7, color: 'var(--text-body)', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {entity.bio.map((seg, i) => (
                <Spoiler key={i} active={seg.spoiler} label="Spoiler">
                  <div dangerouslySetInnerHTML={{ __html: renderProse(seg.text) }} />
                </Spoiler>
              ))}
            </div>
          )}
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {(fields.length > 0 || entity.surname) && (
            <section>
              <h2 style={sideHeading}>{c.details}</h2>
              <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 14px' }}>
                {entity.surname && <Row label="Surname" value={entity.surname} />}
                {entity.middleName && <Row label="Middle name" value={entity.middleName} />}
                {fields.map(([k, v]) => (
                  <Row key={k} label={fieldLabel(k)} value={String(v)} />
                ))}
              </dl>
            </section>
          )}

          {groupKeys.length > 0 && (
            <section>
              <h2 style={sideHeading}>{c.relationships}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {groupKeys.map((g) => (
                  <div key={g}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: 8 }}>
                      {c.relGroups[g] ?? g}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {groups[g].map((l, i) => (
                        <RelRow key={`${l.otherSlug}-${i}`} storyId={story.id} link={l} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}

const sideHeading = {
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: 16,
  color: 'var(--text-heading)',
  margin: '0 0 12px',
  paddingBottom: 8,
  borderBottom: '1px solid var(--border-faint)',
}

function Row({ label, value }) {
  return (
    <>
      <dt style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</dt>
      <dd style={{ margin: 0, fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text-body)' }}>{value}</dd>
    </>
  )
}
