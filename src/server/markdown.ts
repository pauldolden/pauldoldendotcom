// ============================================================
// Chapter Markdown → block document. Dependency-free (Workers-safe).
// Authors write chapters as Markdown with `:::` directives for the
// LitRPG interludes; this turns them into the same block model the
// reader (ChapterBody) already renders, so nothing downstream changes.
//
// Supported:
//   - paragraphs (blank-line separated); first one gets a drop cap
//   - inline: **bold**, *italic* / _italic_, `code`, [text](url)
//   - :::system tone=gold icon=▲ title="LEVEL UP"   …body…   :::
//   - :::quote cite="Rue, ch. 42"                    …text…   :::
//   - :::skill name="Emberstep" kind="Active · Hex" rarity=legendary
//             tier="Tier I" cost="40 MP" cooldown="12s"  …desc… :::
//   - leading YAML frontmatter (--- … ---) is stripped (chapter meta
//     comes from catalog.json, not the body)
// ============================================================

type Block = Record<string, unknown>

const ATTR_RE = /(\w+)=(?:"([^"]*)"|(\S+))/g

function parseAttrs(s: string): Record<string, string> {
  const out: Record<string, string> = {}
  let m: RegExpExecArray | null
  ATTR_RE.lastIndex = 0
  while ((m = ATTR_RE.exec(s))) out[m[1]] = m[2] ?? m[3]
  return out
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Inline Markdown → a small, safe HTML subset (content is author-owned).
function inline(s: string): string {
  let t = escapeHtml(s)
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>')
  t = t.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
  t = t.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>')
  t = t.replace(/_([^_\n]+)_/g, '<em>$1</em>')
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  return t
}

export function mdToBlocks(md: string): { blocks: Block[] } {
  let src = md.replace(/\r\n/g, '\n')

  // strip leading YAML frontmatter
  if (src.startsWith('---\n')) {
    const end = src.indexOf('\n---', 3)
    if (end !== -1) {
      const after = src.indexOf('\n', end + 1)
      src = after !== -1 ? src.slice(after + 1) : ''
    }
  }

  const lines = src.split('\n')
  const blocks: Block[] = []
  let para: string[] = []
  let firstPara = true

  const flushPara = () => {
    const text = para.join(' ').trim()
    para = []
    if (!text) return
    if (firstPara) {
      firstPara = false
      blocks.push({ type: 'p', dropcap: true, dropLetter: text.charAt(0), html: inline(text.slice(1)) })
    } else {
      blocks.push({ type: 'p', html: inline(text) })
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const fence = line.match(/^:::\s*([a-z]+)\s*(.*)$/i)
    if (fence) {
      flushPara()
      const name = fence[1].toLowerCase()
      const attrs = parseAttrs(fence[2])
      const body: string[] = []
      i++
      while (i < lines.length && lines[i].trim() !== ':::') {
        body.push(lines[i])
        i++
      }
      const content = body.join('\n').trim()
      if (name === 'system') {
        blocks.push({ type: 'system', title: attrs.title || 'SYSTEM', tone: attrs.tone || 'cyan', icon: attrs.icon || '◈', html: inline(content) })
      } else if (name === 'quote') {
        blocks.push({ type: 'pullquote', cite: attrs.cite || '', text: content })
      } else if (name === 'skill') {
        blocks.push({
          type: 'skill',
          name: attrs.name,
          kind: attrs.kind,
          rarity: attrs.rarity || 'rare',
          tier: attrs.tier,
          description: content,
          cost: attrs.cost,
          cooldown: attrs.cooldown,
        })
      }
      continue
    }

    if (line.trim() === '') {
      flushPara()
      continue
    }
    // ignore markdown heading markers inside a chapter body (title is in the catalog)
    para.push(line.replace(/^#{1,6}\s+/, ''))
  }
  flushPara()

  return { blocks }
}
