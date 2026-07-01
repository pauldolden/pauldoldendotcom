import { describe, it, expect } from 'vitest'

import { normalize, summarize } from './trove-upload.js'

const f = (path: string) => ({ path, file: { name: path.split('/').pop() } })

describe('normalize', () => {
  const paths = (arr: any[]) => normalize(arr).map((x: any) => x.path)

  it('strips a manuscript root down to <typeDir>/<file>', () => {
    expect(paths([f('the-hollow/characters/elara.md')])).toEqual(['characters/elara.md'])
  })

  it('leaves an already type-rooted path alone', () => {
    expect(paths([f('characters/elara.md')])).toEqual(['characters/elara.md'])
  })

  it('handles any nesting depth (keeps the last two segments)', () => {
    expect(paths([f('trove/the-hollow/relationships/x.md')])).toEqual(['relationships/x.md'])
  })

  it('keeps _meta.toml', () => {
    expect(paths([f('the-hollow/characters/_meta.toml')])).toEqual(['characters/_meta.toml'])
  })

  it('drops documents/, snapshots, drafts, hidden and non-text files', () => {
    expect(
      paths([
        f('the-hollow/documents/ch1.md'),
        f('the-hollow/documents/.snapshots/doc/2026.md'),
        f('the-hollow/.DS_Store'),
        f('the-hollow/characters/pic.png'),
        f('loose.md'), // no parent dir
      ]),
    ).toEqual([])
  })

  it('keeps a real mix intact', () => {
    expect(
      paths([
        f('the-hollow/characters/_meta.toml'),
        f('the-hollow/characters/elara.md'),
        f('the-hollow/relationships/a-b.md'),
        f('the-hollow/documents/ch1.md'),
      ]),
    ).toEqual(['characters/_meta.toml', 'characters/elara.md', 'relationships/a-b.md'])
  })
})

describe('summarize', () => {
  it('counts entities by type, relationships, and spoilers', () => {
    const world = {
      entityTypes: [
        { name: 'characters', displayName: 'Characters' },
        { name: 'locations', displayName: 'Locations' },
      ],
      entities: [
        { type: 'characters', spoiler: false },
        { type: 'characters', spoiler: true },
        { type: 'locations', spoiler: false },
      ],
      relationships: [{ spoiler: true }, { spoiler: false }],
    }
    expect(summarize(world)).toEqual({
      entities: 3,
      relationships: 2,
      spoilers: 2, // 1 entity + 1 relationship
      types: [
        { name: 'Characters', count: 2 },
        { name: 'Locations', count: 1 },
      ],
    })
  })
})
