// ============================================================
// Trove → world model. Dependency-free (Workers-safe), same ethos as
// markdown.ts. Trove is a local writing app that stores worldbuilding as
// Markdown files with YAML frontmatter (characters, locations, factions…)
// plus `_meta.toml` per entity type and denormalised relationship files.
// This site consumes those files AS-IS — Trove knows nothing about it.
//
// Spoiler model: reveals are a simple boolean flag, unveiled client-side by a
// single "show spoilers" toggle (no reading-progress tracking). An author flags
// a spoiler in Trove three ways, all passed through untouched:
//   - whole entity:        `spoiler: true`  (frontmatter)
//   - whole relationship:  `spoiler: true`  (frontmatter)
//   - a passage in a bio:  a `:::spoiler … :::` fence in the Markdown body
// A relationship pointing at a spoiler entity inherits spoiler (else the edge
// would leak that the hidden entity exists).
//
// We parse a supported SUBSET of YAML/TOML (documented in parseFrontmatter).
// ============================================================

// ── Relationship vocabulary (mirrors Trove's built-in predicates) ──
export type PredicateCategory = 'family' | 'social' | 'org' | 'possession' | 'spatial'

type PredicateDef = { label: string; inverse: string; category: PredicateCategory }

export const PREDICATES: Record<string, PredicateDef> = {
  parent_of: { label: 'parent of', inverse: 'child_of', category: 'family' },
  child_of: { label: 'child of', inverse: 'parent_of', category: 'family' },
  sibling_of: { label: 'sibling of', inverse: 'sibling_of', category: 'family' },
  partner_of: { label: 'partner of', inverse: 'partner_of', category: 'family' },
  married_to: { label: 'married to', inverse: 'married_to', category: 'family' },
  friend_of: { label: 'friend of', inverse: 'friend_of', category: 'social' },
  ally_of: { label: 'ally of', inverse: 'ally_of', category: 'social' },
  rival_of: { label: 'rival of', inverse: 'rival_of', category: 'social' },
  enemy_of: { label: 'enemy of', inverse: 'enemy_of', category: 'social' },
  mentor_of: { label: 'mentor of', inverse: 'mentee_of', category: 'social' },
  mentee_of: { label: 'mentee of', inverse: 'mentor_of', category: 'social' },
  member_of: { label: 'member of', inverse: 'has_member', category: 'org' },
  has_member: { label: 'has member', inverse: 'member_of', category: 'org' },
  serves: { label: 'serves', inverse: 'served_by', category: 'org' },
  served_by: { label: 'served by', inverse: 'serves', category: 'org' },
  owns: { label: 'owns', inverse: 'owned_by', category: 'possession' },
  owned_by: { label: 'owned by', inverse: 'owns', category: 'possession' },
  located_in: { label: 'located in', inverse: 'contains', category: 'spatial' },
  contains: { label: 'contains', inverse: 'located_in', category: 'spatial' },
}

/** Predicates that build a family tree. */
export const FAMILY_PREDICATES = new Set(
  Object.entries(PREDICATES)
    .filter(([, d]) => d.category === 'family')
    .map(([k]) => k),
)

// ── Types ──────────────────────────────────────────────────

/** A run of bio Markdown, flagged if it came from a `:::spoiler` fence. */
export type BioSegment = { text: string; spoiler: boolean }

export type WorldEntity = {
  type: string // entity-type dir name, e.g. 'characters'
  slug: string
  id: string | null
  name: string
  role: string
  icon: string // lucide icon name (DS <Icon/> takes these directly)
  description: string
  avatar: string // data URL / path / '' (author-owned)
  surname: string
  middleName: string
  aliases: string[]
  spoiler: boolean // whole entity is a spoiler
  fields: Record<string, string | number | boolean> // custom frontmatter
  bio: BioSegment[] // body split into (non-)spoiler runs
}

export type WorldRelationship = {
  from: string // slug
  to: string // slug
  fromName: string
  toName: string
  predicate: string
  inverse: string
  label: string
  category: PredicateCategory | 'other'
  intensity: string
  spoiler: boolean
  note: string // markdown body
}

export type WorldEntityType = {
  name: string
  displayName: string
  icon: string
  color: string
  description: string
}

export type World = {
  schemaVersion: 1
  storyId: string
  generatedAt: string
  entityTypes: WorldEntityType[]
  entities: WorldEntity[]
  relationships: WorldRelationship[]
}

export type TroveFile = { path: string; text: string }

// ── YAML-frontmatter subset parser ─────────────────────────

function unquote(v: string): string {
  const t = v.trim()
  if (
    (t.startsWith('"') && t.endsWith('"') && t.length >= 2) ||
    (t.startsWith("'") && t.endsWith("'") && t.length >= 2)
  ) {
    return t.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '\n')
  }
  return t
}

/** Coerce an unquoted scalar to number/bool where unambiguous, else string. */
function coerceScalar(raw: string): string | number | boolean {
  const t = raw.trim()
  if (t === 'true') return true
  if (t === 'false') return false
  if (/^-?\d+$/.test(t)) return parseInt(t, 10)
  if (/^-?\d+\.\d+$/.test(t)) return parseFloat(t)
  return unquote(t)
}

/** Indentation (spaces) of a line. */
function indentOf(line: string): number {
  const m = line.match(/^( *)/)
  return m ? m[1].length : 0
}

/**
 * Split leading `---` frontmatter from body and parse the frontmatter subset.
 * Returns `{ data, body }`; `data` is `{}` when there is no frontmatter.
 *
 * Supported:
 *   key: "quoted"   key: unquoted   key: 28   key: true
 *   key:                        ← block string list
 *     - item
 *   key: [inline, list]         ← inline flow list
 */
export function parseFrontmatter(md: string): {
  data: Record<string, any>
  body: string
} {
  const src = md.replace(/\r\n/g, '\n')
  if (!src.startsWith('---\n')) return { data: {}, body: src.trim() }

  const end = src.indexOf('\n---', 3)
  if (end === -1) return { data: {}, body: src.trim() }
  const fmText = src.slice(4, end)
  const afterNl = src.indexOf('\n', end + 1)
  const body = (afterNl !== -1 ? src.slice(afterNl + 1) : '').trim()

  const data: Record<string, any> = {}
  const lines = fmText.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim() || line.trim().startsWith('#')) continue
    if (indentOf(line) !== 0) continue

    const m = line.match(/^([A-Za-z0-9_][A-Za-z0-9_ -]*?):\s*(.*)$/)
    if (!m) continue
    const key = m[1].trim()
    const rest = m[2]

    if (rest !== '') {
      const flow = rest.trim()
      if (flow.startsWith('[') && flow.endsWith(']')) {
        data[key] = flow
          .slice(1, -1)
          .split(',')
          .map((s) => unquote(s))
          .filter((s) => s !== '')
      } else {
        data[key] = coerceScalar(rest)
      }
      continue
    }

    const block: string[] = []
    let j = i + 1
    while (j < lines.length && (lines[j].trim() === '' || indentOf(lines[j]) > 0)) {
      if (lines[j].trim() !== '') block.push(lines[j])
      j++
    }
    i = j - 1

    if (block.length === 0) {
      data[key] = ''
      continue
    }
    const base = indentOf(block[0])
    if (block[0].trim().startsWith('-')) {
      data[key] = block
        .filter((l) => indentOf(l) === base && l.trim().startsWith('-'))
        .map((l) => unquote(l.trim().replace(/^-\s*/, '')))
        .filter((s) => s !== '')
    } else {
      const obj: Record<string, any> = {}
      for (const l of block) {
        const mm = l.trim().match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
        if (mm && mm[2] !== '') obj[mm[1]] = coerceScalar(mm[2])
      }
      data[key] = obj
    }
  }

  return { data, body }
}

// ── flat TOML (_meta.toml, trove.toml top-level scalars) ───

/** Parse flat `key = value` TOML lines. Ignores tables/arrays-of-tables. */
export function parseFlatToml(text: string): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {}
  for (const raw of text.replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#') || line.startsWith('[')) continue
    const m = line.match(/^([A-Za-z0-9_-]+)\s*=\s*(.+?)\s*(?:#.*)?$/)
    if (!m) continue
    out[m[1]] = coerceScalar(m[2])
  }
  return out
}

// ── bio segmentation (`:::spoiler … :::`) ──────────────────

/** Split a bio body into runs, flagging the ones inside a `:::spoiler` fence. */
export function parseBio(md: string): BioSegment[] {
  const src = (md ?? '').replace(/\r\n/g, '\n')
  if (!src.trim()) return []
  const lines = src.split('\n')
  const segs: BioSegment[] = []
  let buf: string[] = []
  const flush = () => {
    const t = buf.join('\n').trim()
    if (t) segs.push({ text: t, spoiler: false })
    buf = []
  }
  for (let i = 0; i < lines.length; i++) {
    if (/^:::\s*spoiler\b/i.test(lines[i].trim())) {
      flush()
      const body: string[] = []
      i++
      while (i < lines.length && lines[i].trim() !== ':::') {
        body.push(lines[i])
        i++
      }
      const t = body.join('\n').trim()
      if (t) segs.push({ text: t, spoiler: true })
      continue
    }
    buf.push(lines[i])
  }
  flush()
  return segs
}

// ── World assembly ─────────────────────────────────────────

const RESERVED_ENTITY_KEYS = new Set([
  'name',
  'icon',
  'description',
  'role',
  'avatar',
  'surname',
  'middle_name',
  'id',
  'aliases',
  'spoiler',
])

const SKIP_TOP_DIRS = new Set(['documents', 'tome', '_templates', '.trash', '.snapshots'])

function baseName(path: string): string {
  const p = path.split('/').filter(Boolean)
  return p[p.length - 1] ?? ''
}

function topDir(path: string): string {
  const p = path.split('/').filter(Boolean)
  return p.length > 1 ? p[0] : ''
}

function slugFromFile(path: string): string {
  return baseName(path).replace(/\.md$/i, '')
}

function titleize(slug: string): string {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function isIngestibleMd(path: string): boolean {
  const name = baseName(path)
  if (!/\.md$/i.test(name)) return false
  if (name.startsWith('_')) return false
  if (/\.draft-/.test(name)) return false
  if (/\.(notes|comments)\./.test(name)) return false
  return true
}

function toBool(v: unknown): boolean {
  return v === true || v === 'true' || v === 1 || v === 'yes'
}

function parseEntity(type: string, path: string, text: string): WorldEntity {
  const { data, body } = parseFrontmatter(text)
  const slug = slugFromFile(path)
  const fields: Record<string, string | number | boolean> = {}
  for (const [k, v] of Object.entries(data)) {
    if (RESERVED_ENTITY_KEYS.has(k)) continue
    if (v == null || typeof v === 'object') continue
    fields[k] = v as string | number | boolean
  }
  const aliases = Array.isArray(data.aliases)
    ? data.aliases.map((a: any) => String(a)).filter(Boolean)
    : []
  return {
    type,
    slug,
    id: data.id != null ? String(data.id) : null,
    name: data.name ? String(data.name) : titleize(slug),
    role: data.role ? String(data.role) : '',
    icon: data.icon ? String(data.icon) : '',
    description: data.description ? String(data.description) : '',
    avatar: data.avatar ? String(data.avatar) : '',
    surname: data.surname ? String(data.surname) : '',
    middleName: data.middle_name ? String(data.middle_name) : '',
    aliases,
    spoiler: toBool(data.spoiler),
    fields,
    bio: parseBio(body),
  }
}

function parseRelationship(text: string): WorldRelationship {
  const { data, body } = parseFrontmatter(text)
  const from =
    (data.from_entity_slug && String(data.from_entity_slug)) ||
    (data.from_entity_path && slugFromFile(String(data.from_entity_path))) ||
    ''
  const to =
    (data.to_entity_slug && String(data.to_entity_slug)) ||
    (data.to_entity_path && slugFromFile(String(data.to_entity_path))) ||
    (data.to_entity_name && slugify(String(data.to_entity_name))) ||
    ''
  const predicate = data.predicate ? String(data.predicate) : ''
  const def = PREDICATES[predicate]
  return {
    from,
    to,
    fromName: data.from_entity_name ? String(data.from_entity_name) : titleize(from),
    toName: data.to_entity_name ? String(data.to_entity_name) : titleize(to),
    predicate,
    inverse: data.inverse ? String(data.inverse) : def?.inverse ?? predicate,
    label: def?.label ?? predicate.replace(/_/g, ' '),
    category: def?.category ?? 'other',
    intensity: data.intensity ? String(data.intensity) : '',
    spoiler: toBool(data.spoiler),
    note: body,
  }
}

/**
 * Build the normalised World from a flat list of uploaded Trove files
 * (paths relative to a manuscript root, e.g. `characters/aria-stone.md`,
 * `characters/_meta.toml`, `relationships/aria-corin.md`).
 */
export function buildWorld(storyId: string, files: TroveFile[], generatedAt: string): World {
  const entities: WorldEntity[] = []
  const relationships: WorldRelationship[] = []
  const metaByType = new Map<string, Record<string, string | number | boolean>>()
  const typesSeen = new Set<string>()

  for (const f of files) {
    const dir = topDir(f.path)
    const name = baseName(f.path)
    if (!dir || SKIP_TOP_DIRS.has(dir)) continue

    if (dir === 'relationships') {
      if (isIngestibleMd(f.path)) relationships.push(parseRelationship(f.text))
      continue
    }

    if (name === '_meta.toml') {
      metaByType.set(dir, parseFlatToml(f.text))
      typesSeen.add(dir)
      continue
    }

    if (isIngestibleMd(f.path)) {
      entities.push(parseEntity(dir, f.path, f.text))
      typesSeen.add(dir)
    }
  }

  // A relationship whose endpoint entity is itself a spoiler is a spoiler too
  // (else the edge leaks the hidden entity). Drop dangling edges.
  const spoilerBySlug = new Map(entities.map((e) => [e.slug, e.spoiler]))
  const resolved = relationships
    .filter((r) => r.from && r.to)
    .map((r) => {
      r.spoiler = r.spoiler || !!spoilerBySlug.get(r.from) || !!spoilerBySlug.get(r.to)
      return r
    })

  const entityTypes: WorldEntityType[] = [...typesSeen]
    .filter((t) => entities.some((e) => e.type === t))
    .sort()
    .map((t) => {
      const meta = metaByType.get(t) ?? {}
      return {
        name: t,
        displayName: titleize(t),
        icon: meta.icon ? String(meta.icon) : '',
        color: meta.color ? String(meta.color) : '',
        description: meta.description ? String(meta.description) : '',
      }
    })

  entities.sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name))

  return {
    schemaVersion: 1,
    storyId,
    generatedAt,
    entityTypes,
    entities,
    relationships: resolved,
  }
}
