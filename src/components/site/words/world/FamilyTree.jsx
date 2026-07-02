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
        className="flex w-[100px] flex-col items-center gap-1.5 no-underline"
      >
        <EntityAvatar entity={{ name: link.otherName, avatar: link.otherAvatar, icon: link.otherIcon, type: link.otherType }} size={size} radius={isPerson ? '50%' : 'var(--r-sm)'} />
        <span className="text-center font-sans text-[12.5px] font-semibold leading-[1.2] text-body">{link.otherName}</span>
      </Link>
    </Spoiler>
  )
}

function EgoChip({ ego }) {
  const isPerson = ego.type === 'characters' || ego.type === 'people'
  return (
    <div className="flex w-[108px] flex-col items-center gap-1.5">
      <div className="rounded-full border-2 border-accent p-[3px]">
        <EntityAvatar entity={ego} size={50} radius={isPerson ? '50%' : 'var(--r-sm)'} />
      </div>
      <span className="text-center font-heading text-[13px] font-bold leading-[1.2] text-strong">{ego.name}</span>
    </div>
  )
}

const Row = ({ children }) => (
  <div className="flex flex-wrap items-start justify-center gap-5">{children}</div>
)

const Connector = () => <div className="h-[22px] w-0.5 bg-line-strong" />

export function FamilyTree({ storyId, ego, links = [] }) {
  const pick = (keys) => links.filter((l) => keys.includes(l.predicate))
  const parents = pick(FAMILY_POV.parents)
  const children = pick(FAMILY_POV.children)
  const siblings = pick(FAMILY_POV.siblings)
  const partners = pick(FAMILY_POV.partners)
  if (!parents.length && !children.length && !siblings.length && !partners.length) return null

  return (
    <section className="mt-9">
      <h2 className="mb-[18px] mt-0 font-heading text-[18px] font-bold text-heading">
        {words.world.familyTitle}
      </h2>
      <div className="flex flex-col items-center gap-1.5 py-2">
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
