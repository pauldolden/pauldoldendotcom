// Pure browser-side helpers for the Trove worldbuilding uploader (no React /
// server imports, so they're unit-testable). Read a dropped/selected folder,
// normalise paths to `<typeDir>/<file>`, drop Trove's non-entity trees.

const TEXT_RE = /\.(md|markdown|toml)$/i;
// Trove structural dirs / sidecar trees that are never entity types.
const SKIP_SEG = new Set(['documents', 'tome', '_templates', '.trash', '.snapshots', '.seal']);

// Recursively pull { file, path } out of a directory entry (drag-drop).
export function walkEntry(entry, prefix, out) {
  return new Promise((resolve) => {
    if (entry.isFile) {
      entry.file(
        (file) => { out.push({ file, path: prefix + entry.name }); resolve(); },
        () => resolve(),
      );
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      const batch = () =>
        reader.readEntries((entries) => {
          if (!entries.length) return resolve();
          Promise.all(entries.map((e) => walkEntry(e, `${prefix}${entry.name}/`, out))).then(batch);
        }, () => resolve());
      batch();
    } else resolve();
  });
}

export async function entriesFromDrop(dataTransfer) {
  const roots = [...dataTransfer.items]
    .map((i) => (i.webkitGetAsEntry ? i.webkitGetAsEntry() : null))
    .filter(Boolean);
  const out = [];
  await Promise.all(roots.map((r) => walkEntry(r, '', out)));
  return out;
}

/**
 * Keep only entity/relationship/_meta text files and reduce each path to
 * `<parentDir>/<filename>`, so a Trove manuscript root at any depth drops away
 * while `<typeDir>/<file>` survives. Skips documents/, drafts, snapshots, etc.
 */
export function normalize(collected) {
  const out = [];
  for (const c of collected) {
    const segs = (c.path || c.file?.name || '').split('/').filter(Boolean);
    if (segs.length < 2) continue; // need a parent dir to be a type
    if (segs.some((s) => SKIP_SEG.has(s) || s.startsWith('.'))) continue;
    if (!TEXT_RE.test(segs[segs.length - 1])) continue;
    out.push({ file: c.file, path: segs.slice(-2).join('/') });
  }
  return out;
}

export async function toPayload(normalized) {
  return Promise.all(normalized.map(async (n) => ({ path: n.path, text: await n.file.text() })));
}

export function summarize(world) {
  const entities = world?.entities ?? [];
  const rels = world?.relationships ?? [];
  const types = (world?.entityTypes ?? []).map((t) => ({
    name: t.displayName || t.name,
    count: entities.filter((e) => e.type === t.name).length,
  }));
  const spoilers = entities.filter((e) => e.spoiler).length + rels.filter((r) => r.spoiler).length;
  return { entities: entities.length, relationships: rels.length, spoilers, types };
}
