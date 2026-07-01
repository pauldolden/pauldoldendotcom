// FamilyTree — ego-centric family diagram for a profile. Built from the
// entity's own relationships (POV-resolved), so parents/children/siblings/
// partners read correctly. CSS layout (not SVG) so the <Spoiler> blur wrapper
// works on hidden kin. Renders nothing when the entity has no family ties.
import React from 'react'
import { Link } from '@tanstack/react-router'
import { EntityAvatar } from './WorldIcon.jsx'
import { Spoiler } from './Spoiler.jsx'
import { FAMILY_POV } from './relationships.js'
import { words } from '../../../../content/words'

function Chip({ storyId, link, size = 38 }) {
  const isPerson = link.otherType === 'characters' || link.otherType === 'people'
  return (
    <Spoiler active={link.spoiler} label="Hidden">
      <Link
        to="/words/$storyId/cast/$slug"
        params={{ storyId, slug: link.otherSlug }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 100, textDecoration: 'none' }}
      >
        <EntityAvatar entity={{ name: link.otherName, avatar: link.otherAvatar, icon: link.otherIcon, type: link.otherType }} size={size} radius={isPerson ? '50%' : 'var(--r-sm)'} />
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, fontWeight: 600, color: 'var(--text-body)', textAlign: 'center', lineHeight: 1.2 }}>{link.otherName}</span>
      </Link>
    </Spoiler>
  )
}

function EgoChip({ ego }) {
  const isPerson = ego.type === 'characters' || ego.type === 'people'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 108 }}>
      <div style={{ padding: 3, borderRadius: '50%', border: '2px solid var(--accent)' }}>
        <EntityAvatar entity={ego} size={50} radius={isPerson ? '50%' : 'var(--r-sm)'} />
      </div>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', textAlign: 'center', lineHeight: 1.2 }}>{ego.name}</span>
    </div>
  )
}

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap' }}>{children}</div>
)

const Connector = () => <div style={{ width: 2, height: 22, background: 'var(--border-strong)' }} />

export function FamilyTree({ storyId, ego, links = [] }) {
  const pick = (keys) => links.filter((l) => keys.includes(l.predicate))
  const parents = pick(FAMILY_POV.parents)
  const children = pick(FAMILY_POV.children)
  const siblings = pick(FAMILY_POV.siblings)
  const partners = pick(FAMILY_POV.partners)
  if (!parents.length && !children.length && !siblings.length && !partners.length) return null

  return (
    <section style={{ marginTop: 36 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text-heading)', margin: '0 0 18px' }}>
        {words.world.familyTitle}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '8px 0' }}>
        {parents.length > 0 && (
          <>
            <Row>{parents.map((l, i) => <Chip key={`p-${i}`} storyId={storyId} link={l} />)}</Row>
            <Connector />
          </>
        )}

        <Row>
          {siblings.map((l, i) => <Chip key={`s-${i}`} storyId={storyId} link={l} />)}
          <EgoChip ego={ego} />
          {partners.map((l, i) => <Chip key={`x-${i}`} storyId={storyId} link={l} />)}
        </Row>

        {children.length > 0 && (
          <>
            <Connector />
            <Row>{children.map((l, i) => <Chip key={`c-${i}`} storyId={storyId} link={l} />)}</Row>
          </>
        )}
      </div>
    </section>
  )
}
