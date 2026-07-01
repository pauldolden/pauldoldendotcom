import { describe, it, expect } from 'vitest'

import { renderProse, fieldLabel } from './prose.js'

describe('renderProse', () => {
  it('renders paragraphs with inline emphasis', () => {
    const html = renderProse('She was *usually* right, and **never** late.')
    expect(html).toContain('<em>usually</em>')
    expect(html).toContain('<strong>never</strong>')
    expect(html.startsWith('<p>')).toBe(true)
  })

  it('renders headings and bullet lists', () => {
    const html = renderProse('## Background\n\n- born north\n- knight')
    expect(html).toContain('<h3>Background</h3>')
    expect(html).toContain('<ul><li>born north</li><li>knight</li></ul>')
  })

  it('allows safe links with rel', () => {
    const html = renderProse('see [trove](https://trove.ink)')
    expect(html).toContain('<a href="https://trove.ink" rel="noopener noreferrer">trove</a>')
  })

  it('neutralises a quote-breakout in a link URL (XSS)', () => {
    const html = renderProse('[x](http://evil"onmouseover=alert(1))')
    // the " must be entity-encoded so it cannot escape the href attribute
    expect(html).not.toMatch(/href="http:\/\/evil"/)
    expect(html).toContain('&quot;')
  })

  it('blocks javascript: URLs', () => {
    const html = renderProse('[x](javascript:alert(1))')
    expect(html).toContain('href="#"')
    expect(html).not.toContain('javascript:')
  })

  it('escapes raw HTML in body text', () => {
    const html = renderProse('a <script>alert(1)</script> b')
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })
})

describe('fieldLabel', () => {
  it('humanises snake/kebab keys', () => {
    expect(fieldLabel('eye_colour')).toBe('Eye Colour')
    expect(fieldLabel('home-town')).toBe('Home Town')
  })
})
