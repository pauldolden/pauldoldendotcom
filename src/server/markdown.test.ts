import { describe, it, expect } from 'vitest'

import { mdToBlocks } from './markdown'

const md = `---
title: What the System Wanted
words: 3.8k
---

The chapel had been dead for years, but the wards still *dreamed* in colour.

She'd mapped eleven floors. The contract said **survey only**.

:::system tone=gold icon=▲ title="LEVEL UP"
You reached **Level 24**. New skill unlocked: **Emberstep**.
:::

:::quote cite="Rue, ch. 42"
The System doesn't care what you wanted.
:::

:::skill name="Emberstep" kind="Active · Hex" rarity=legendary tier="Tier I" cost="40 MP" cooldown="12s"
Step through the veil for 4 seconds.
:::

Read more at [trove](https://trove.ink).
`

describe('mdToBlocks', () => {
  const { blocks } = mdToBlocks(md)

  it('strips frontmatter and drop-caps the first paragraph', () => {
    expect(blocks[0]).toMatchObject({ type: 'p', dropcap: true, dropLetter: 'T' })
    expect(blocks[0].html).toContain('<em>dreamed</em>')
    expect(blocks[0].html).not.toContain('title:')
  })

  it('renders inline bold', () => {
    expect(blocks[1].html).toContain('<b>survey only</b>')
  })

  it('parses a :::system directive', () => {
    const sys = blocks.find((b) => b.type === 'system')
    expect(sys).toMatchObject({ tone: 'gold', icon: '▲', title: 'LEVEL UP' })
    expect(sys?.html).toContain('<b>Level 24</b>')
  })

  it('parses a :::quote directive', () => {
    const q = blocks.find((b) => b.type === 'pullquote')
    expect(q).toMatchObject({ cite: 'Rue, ch. 42' })
    expect(q?.text).toBe("The System doesn't care what you wanted.")
  })

  it('parses a :::skill directive', () => {
    const sk = blocks.find((b) => b.type === 'skill')
    expect(sk).toMatchObject({
      name: 'Emberstep',
      kind: 'Active · Hex',
      rarity: 'legendary',
      tier: 'Tier I',
      cost: '40 MP',
      cooldown: '12s',
    })
  })

  it('parses links', () => {
    const link = blocks.find((b) => b.type === 'p' && String(b.html).includes('href'))
    expect(link?.html).toContain('<a href="https://trove.ink">trove</a>')
  })
})
