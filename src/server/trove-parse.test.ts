import { describe, it, expect } from 'vitest'

import { parseFrontmatter, parseFlatToml, parseBio, buildWorld } from './trove-parse'

// Real Trove entity file (characters/aria-stone.md) — with a spoiler passage
const ariaMd = `---
name: "Aria Stone"
icon: "user"
description: "A wandering knight from the north"
role: "Protagonist"
surname: "Stone"
middle_name: "Lyra"
id: "ent-aria-0001"
age: 28
eye_colour: "amber"
spoiler: false
aliases:
  - "The Northerner"
  - "Stone-heart"
---

Aria left the village at dawn. She *never* looked back.

:::spoiler
Aria is the lost heir to the Stone throne.
:::

Her blade was cold iron.`

// A whole-entity spoiler (a hidden villain)
const corinMd = `---
name: "Corin Vale"
icon: "user"
role: "Antagonist"
id: "ent-corin-0001"
spoiler: true
---

The betrayer.`

const relMd = `---
id: "rel-aria-corin-0001"
from_entity_slug: "aria-stone"
from_entity_name: "Aria Stone"
from_entity_type: "characters"
to_entity_slug: "corin-vale"
to_entity_name: "Corin Vale"
to_entity_type: "characters"
predicate: "rival_of"
inverse: "rival_of"
intensity: "high"
---

A bond turned to ash.`

const metaToml = `icon = "user"
color = "rose"
template = "character-template"
description = "Protagonists, antagonists, and supporting cast"
`

describe('parseFrontmatter', () => {
  const { data, body } = parseFrontmatter(ariaMd)

  it('parses quoted scalars', () => {
    expect(data.name).toBe('Aria Stone')
    expect(data.role).toBe('Protagonist')
  })
  it('coerces numbers and booleans', () => {
    expect(data.age).toBe(28)
    expect(data.spoiler).toBe(false)
  })
  it('parses a block string list', () => {
    expect(data.aliases).toEqual(['The Northerner', 'Stone-heart'])
  })
  it('separates the markdown body', () => {
    expect(body).toContain('Aria left the village at dawn.')
    expect(body).not.toContain('name:')
  })
  it('returns empty data when there is no frontmatter', () => {
    const r = parseFrontmatter('Just a body.')
    expect(r.data).toEqual({})
    expect(r.body).toBe('Just a body.')
  })
  it('parses an inline flow list', () => {
    const r = parseFrontmatter('---\ntags: [opening, betrayal, "big reveal"]\n---\nbody')
    expect(r.data.tags).toEqual(['opening', 'betrayal', 'big reveal'])
  })
})

describe('parseFlatToml', () => {
  const meta = parseFlatToml(metaToml)
  it('parses flat key = value', () => {
    expect(meta.icon).toBe('user')
    expect(meta.color).toBe('rose')
    expect(meta.description).toBe('Protagonists, antagonists, and supporting cast')
  })
  it('ignores comments and tables', () => {
    const m = parseFlatToml('# a comment\n[table]\nkept = "yes"\n')
    expect(m.kept).toBe('yes')
    expect(m).not.toHaveProperty('table')
  })
})

describe('parseBio', () => {
  const segs = parseBio(parseFrontmatter(ariaMd).body)
  it('splits the body into spoiler / non-spoiler runs in order', () => {
    expect(segs).toHaveLength(3)
    expect(segs[0]).toMatchObject({ spoiler: false })
    expect(segs[0].text).toContain('Aria left the village')
    expect(segs[1]).toEqual({ spoiler: true, text: 'Aria is the lost heir to the Stone throne.' })
    expect(segs[2]).toMatchObject({ spoiler: false })
    expect(segs[2].text).toContain('cold iron')
  })
  it('returns [] for an empty body', () => {
    expect(parseBio('')).toEqual([])
  })
  it('treats a body with no fence as one non-spoiler segment', () => {
    expect(parseBio('just prose')).toEqual([{ text: 'just prose', spoiler: false }])
  })
})

describe('buildWorld', () => {
  const files = [
    { path: 'characters/_meta.toml', text: metaToml },
    { path: 'characters/aria-stone.md', text: ariaMd },
    { path: 'characters/corin-vale.md', text: corinMd },
    { path: 'relationships/aria-corin.md', text: relMd },
    { path: 'documents/chapter-01.md', text: '# not an entity' },
    { path: 'characters/aria-stone.notes.toml', text: 'x = 1' },
    { path: 'characters/aria-stone.draft-v1.md', text: '---\nname: draft\n---' },
  ]
  const world = buildWorld('the-chapel', files, '2026-07-01T00:00:00.000Z')

  it('collects only real entities', () => {
    expect(world.entities.map((e) => e.slug).sort()).toEqual(['aria-stone', 'corin-vale'])
  })
  it('captures custom fields but not reserved keys', () => {
    const aria = world.entities.find((e) => e.slug === 'aria-stone')!
    expect(aria.fields).toMatchObject({ age: 28, eye_colour: 'amber' })
    expect(aria.fields).not.toHaveProperty('name')
    expect(aria.fields).not.toHaveProperty('spoiler')
    expect(aria.middleName).toBe('Lyra')
    expect(aria.aliases).toEqual(['The Northerner', 'Stone-heart'])
  })
  it('parses the bio into segments incl. the spoiler passage', () => {
    const aria = world.entities.find((e) => e.slug === 'aria-stone')!
    expect(aria.bio.some((s) => s.spoiler && s.text.includes('lost heir'))).toBe(true)
    expect(aria.bio.some((s) => !s.spoiler)).toBe(true)
  })
  it('flags a whole-entity spoiler', () => {
    expect(world.entities.find((e) => e.slug === 'corin-vale')!.spoiler).toBe(true)
    expect(world.entities.find((e) => e.slug === 'aria-stone')!.spoiler).toBe(false)
  })
  it('derives an entity type from the folder + _meta.toml', () => {
    expect(world.entityTypes).toHaveLength(1)
    expect(world.entityTypes[0]).toMatchObject({ name: 'characters', displayName: 'Characters', icon: 'user', color: 'rose' })
  })
  it('resolves a relationship with vocabulary label + category', () => {
    expect(world.relationships).toHaveLength(1)
    expect(world.relationships[0]).toMatchObject({
      from: 'aria-stone',
      to: 'corin-vale',
      predicate: 'rival_of',
      label: 'rival of',
      category: 'social',
      intensity: 'high',
    })
  })
  it('inherits spoiler onto an edge that touches a spoiler entity', () => {
    // the rivalry points at corin (spoiler) → the edge is a spoiler too,
    // even though the relationship file itself set no spoiler flag
    expect(world.relationships[0].spoiler).toBe(true)
  })
})

describe('whole-entity spoiler flag', () => {
  const bare = `---\nname: "Nell"\n---\nA face in the crowd.`

  it('leaves an unflagged entity visible (stub shown; details gated in UI)', () => {
    const w = buildWorld('s', [{ path: 'characters/nell.md', text: bare }], 'ts')
    expect(w.entities[0].spoiler).toBe(false)
  })

  it('a file flag hides the whole entity', () => {
    const w = buildWorld('s', [{ path: 'characters/nell.md', text: `---\nname: "Nell"\nspoiler: true\n---\nhi` }], 'ts')
    expect(w.entities[0].spoiler).toBe(true)
  })

  it('a type _meta.toml `spoiler = true` hides the whole type by default', () => {
    const w = buildWorld(
      's',
      [
        { path: 'characters/_meta.toml', text: 'spoiler = true' },
        { path: 'characters/nell.md', text: bare },
      ],
      'ts',
    )
    expect(w.entities[0].spoiler).toBe(true)
  })

  it('a file flag still wins over the type default', () => {
    const w = buildWorld(
      's',
      [
        { path: 'characters/_meta.toml', text: 'spoiler = true' },
        { path: 'characters/vip.md', text: `---\nname: "VIP"\nspoiler: false\n---\nx` },
      ],
      'ts',
    )
    expect(w.entities[0].spoiler).toBe(false)
  })
})
