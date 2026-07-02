// CharacterProfile — /words/:storyId/cast/:slug. Works for any entity type.
// Spoiler model: the "stub" (avatar + name + description) is always shown; the
// whole dossier below (role, aliases, traits, backstory, relationships, family)
// is gated behind the "show spoilers" toggle — each region reveals on click or
// all at once via the toggle.
import React from 'react'
import { Link } from '@tanstack/react-router'
import { EntityAvatar, WorldIcon } from './WorldIcon.jsx'
import { Spoiler, SpoilerToggle } from './Spoiler.jsx'
import { FamilyTree } from './FamilyTree.jsx'
import { FAMILY_POV } from './relationships.js'
import { renderProse, fieldLabel } from './prose.js'
import { words } from '../../../../content/words'

const GROUP_ORDER = ['family', 'social', 'org', 'possession', 'spatial', 'other']
const FAMILY_PREDS = new Set([...FAMILY_POV.parents, ...FAMILY_POV.children, ...FAMILY_POV.siblings, ...FAMILY_POV.partners])
const SIDE_HEADING = 'mb-3 mt-0 border-b border-line-faint pb-2 font-heading text-base font-bold text-heading'

function RelRow({ storyId, link }) {
  const other = { name: link.otherName, avatar: link.otherAvatar, icon: link.otherIcon, type: link.otherType }
  const isPerson = link.otherType === 'characters' || link.otherType === 'people'
  return (
    <Link
      to="/words/$storyId/cast/$slug"
      params={{ storyId, slug: link.otherSlug }}
      className="flex items-center gap-3 rounded-md border border-line-faint bg-surface px-3 py-2.5 no-underline"
    >
      <EntityAvatar entity={other} size={40} radius={isPerson ? '50%' : 'var(--r-sm)'} />
      <div className="min-w-0">
        <div className="font-sans text-[15px] font-semibold text-strong">{link.otherName}</div>
        <div className="font-code text-[11.5px] tracking-[0.03em] text-muted">
          {link.label}
          {link.intensity ? ` · ${link.intensity}` : ''}
        </div>
      </div>
    </Link>
  )
}

export function CharacterProfile({ story, entity, links = [], entityTypes = [] }) {
  const c = words.world
  const typeMeta = entityTypes.find((t) => t.name === entity.type)
  const isPerson = entity.type === 'characters' || entity.type === 'people'
  const fields = Object.entries(entity.fields ?? {})
  const hasFamily = links.some((l) => FAMILY_PREDS.has(l.predicate))
  const hasDetails = fields.length > 0 || !!entity.surname || !!entity.middleName

  // Group relationships by predicate category.
  const groups = {}
  for (const l of links) {
    const g = GROUP_ORDER.includes(l.category) ? l.category : 'other'
    ;(groups[g] ||= []).push(l)
  }
  const groupKeys = GROUP_ORDER.filter((g) => groups[g]?.length)

  // Everything but avatar/name/description is a spoiler → show the toggle
  // whenever there's any gated content at all.
  const hasGated =
    !!entity.role || (entity.aliases?.length ?? 0) > 0 || hasDetails || (entity.bio?.length ?? 0) > 0 || links.length > 0 || hasFamily

  return (
    <div className="mx-auto max-w-content px-7 pt-8">
      <div className="flex items-center justify-between gap-4">
        <Link to="/words/$storyId/cast" params={{ storyId: story.id }} className="font-sans text-sm text-cyan-400 no-underline">
          {c.backToCast}
        </Link>
        {hasGated && <SpoilerToggle />}
      </div>

      {/* Header — stub (avatar + name) is always safe; role/aliases are gated. */}
      <header className="mt-5 flex flex-wrap items-center gap-6">
        <EntityAvatar entity={entity} size={112} radius={isPerson ? '50%' : 'var(--r-lg)'} />
        <div className="min-w-0">
          {typeMeta && (
            <span className="inline-flex items-center gap-1.5 font-code text-xs uppercase tracking-[0.06em] text-muted">
              {typeMeta.icon && <WorldIcon name={typeMeta.icon} size={13} color="var(--text-muted)" />}
              {typeMeta.displayName}
            </span>
          )}
          <h1 className="mb-0 mt-1.5 font-heading text-[46px] font-bold leading-[1.02] text-strong">
            {entity.name}
          </h1>
          {(entity.role || (entity.aliases?.length ?? 0) > 0) && (
            <Spoiler active label="Spoiler">
              {entity.role && <div className="mt-1.5 font-code text-sm tracking-wide text-accent">{entity.role}</div>}
              {entity.aliases?.length > 0 && (
                <div className="mt-1.5 font-sans text-sm text-faint">
                  {c.aka} {entity.aliases.join(', ')}
                </div>
              )}
            </Spoiler>
          )}
        </div>
      </header>

      {/* Body: description (safe) + gated dossier */}
      <div className="mt-10 grid grid-cols-[minmax(0,1fr)_320px] items-start gap-10">
        <div>
          {entity.description && (
            <p className="m-0 font-serif text-[20px] leading-[1.55] text-prose">{entity.description}</p>
          )}
          {entity.bio?.length > 0 && (
            <div className="mt-5">
              <Spoiler active label="Backstory">
                <div className="flex flex-col gap-3.5 font-serif text-[17px] leading-[1.7] text-body">
                  {entity.bio.map((seg, i) => (
                    <div key={i} dangerouslySetInnerHTML={{ __html: renderProse(seg.text) }} />
                  ))}
                </div>
              </Spoiler>
            </div>
          )}
          {hasFamily && (
            <Spoiler active label="Family">
              <FamilyTree storyId={story.id} ego={entity} links={links} />
            </Spoiler>
          )}
        </div>

        <aside className="flex flex-col gap-7">
          {hasDetails && (
            <Spoiler active label="Details">
              <section>
                <h2 className={SIDE_HEADING}>{c.details}</h2>
                <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-2">
                  {entity.surname && <Row label="Surname" value={entity.surname} />}
                  {entity.middleName && <Row label="Middle name" value={entity.middleName} />}
                  {fields.map(([k, v]) => (
                    <Row key={k} label={fieldLabel(k)} value={String(v)} />
                  ))}
                </dl>
              </section>
            </Spoiler>
          )}

          {groupKeys.length > 0 && (
            <Spoiler active label="Relationships">
              <section>
                <h2 className={SIDE_HEADING}>{c.relationships}</h2>
                <div className="flex flex-col gap-[18px]">
                  {groupKeys.map((g) => (
                    <div key={g}>
                      <div className="mb-2 font-code text-[11px] uppercase tracking-[0.08em] text-faint">
                        {c.relGroups[g] ?? g}
                      </div>
                      <div className="flex flex-col gap-2">
                        {groups[g].map((l, i) => (
                          <RelRow key={`${l.otherSlug}-${i}`} storyId={story.id} link={l} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </Spoiler>
          )}
        </aside>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <>
      <dt className="font-code text-xs uppercase tracking-wide text-faint">{label}</dt>
      <dd className="m-0 font-sans text-sm text-body">{value}</dd>
    </>
  )
}
