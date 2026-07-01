// Minimal Markdown → HTML for entity bios + relationship notes. Author-owned
// content (same trust model as chapter bodies), so the output is dropped in via
// dangerouslySetInnerHTML. Dependency-free; a trimmed cousin of server/markdown.
// Supports: paragraphs, #-headings, -/* bullet lists, and inline
// **bold** / *italic* / _italic_ / `code` / [links](url).

// Encode quotes too, not just &<> — link URLs land inside a quoted href
// attribute, so an un-encoded " would break out of the attribute (XSS).
function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Only allow benign link schemes (content is author-owned, but the parser mints
// the href, so block javascript:/data: etc. as defence-in-depth).
function safeHref(url) {
  const u = url.trim()
  if (/^(https?:\/\/|mailto:|\/|#)/i.test(u) && !/^\s*javascript:/i.test(u)) return u
  if (/^[^:/?#]+$/.test(u) || /^[^:]+\.[^:]+/.test(u)) return u // relative, no scheme
  return '#'
}

function inline(s) {
  let t = escapeHtml(s)
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>')
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  t = t.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>')
  t = t.replace(/_([^_\n]+)_/g, '<em>$1</em>')
  t = t.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    // url is already escapeHtml'd (quotes → entities) before this runs, so it
    // is safe inside the quoted href; safeHref additionally vets the scheme.
    (_m, text, url) => `<a href="${safeHref(url)}" rel="noopener noreferrer">${text}</a>`,
  )
  return t
}

export function renderProse(md) {
  if (!md) return ''
  const lines = String(md).replace(/\r\n/g, '\n').split('\n')
  const out = []
  let para = []
  let list = []
  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${inline(para.join(' ').trim())}</p>`)
      para = []
    }
  }
  const flushList = () => {
    if (list.length) {
      out.push(`<ul>${list.map((li) => `<li>${inline(li)}</li>`).join('')}</ul>`)
      list = []
    }
  }
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      flushPara()
      flushList()
      continue
    }
    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      flushPara()
      flushList()
      out.push(`<h3>${inline(h[2])}</h3>`)
      continue
    }
    const li = line.match(/^[-*]\s+(.*)$/)
    if (li) {
      flushPara()
      list.push(li[1])
      continue
    }
    flushList()
    para.push(line)
  }
  flushPara()
  flushList()
  return out.join('\n')
}

/** Turn a custom-field key (snake/kebab) into a display label. */
export function fieldLabel(key) {
  return String(key)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
