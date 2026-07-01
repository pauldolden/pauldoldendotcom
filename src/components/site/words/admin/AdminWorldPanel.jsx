// AdminWorldPanel — import Trove worldbuilding for a story. Drop the Trove
// manuscript folder (or its characters/ locations/ relationships/ … folders);
// the panel reads every .md/.toml (see ./trove-upload), normalises paths, and
// posts them to adminUploadWorld, which parses them into <storyId>/world.json.
// Trove is never modified.
import React from 'react';
import { useRouter } from '@tanstack/react-router';
import { Badge, Button } from '../../../ds/index.js';
import { adminUploadWorld, adminGetWorld, adminDeleteWorld } from '../../../../server/admin';
import { entriesFromDrop, normalize, toPayload, summarize } from './trove-upload.js';

export function AdminWorldPanel({ storyId }) {
  const router = useRouter();
  const [world, setWorld] = React.useState(undefined); // undefined=loading, null=none
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [dragging, setDragging] = React.useState(false);
  const dirInput = React.useRef(null);

  // <input webkitdirectory> isn't a standard React prop; set it on the node.
  React.useEffect(() => {
    const el = dirInput.current;
    if (el) { el.setAttribute('webkitdirectory', ''); el.setAttribute('directory', ''); }
  }, []);

  const load = React.useCallback(async () => {
    try { setWorld(await adminGetWorld({ data: { storyId } })); }
    catch { setWorld(null); }
  }, [storyId]);
  React.useEffect(() => { load(); }, [load]);

  const upload = async (collected) => {
    const norm = normalize(collected);
    if (!norm.length) {
      setError('No .md / .toml files found. Drop your Trove manuscript folder (characters/, relationships/, …).');
      return;
    }
    setBusy(true); setError(''); setResult(null);
    try {
      const files = await toPayload(norm);
      setResult(await adminUploadWorld({ data: { storyId, files } }));
      await load();
      await router.invalidate();
    } catch (e) {
      setError(e?.message ?? 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  const onDrop = async (e) => {
    e.preventDefault();
    setDragging(false);
    upload(await entriesFromDrop(e.dataTransfer));
  };
  const onPick = (e) => {
    const collected = [...e.target.files].map((f) => ({ file: f, path: f.webkitRelativePath || f.name }));
    e.target.value = '';
    upload(collected);
  };

  const del = async () => {
    if (!window.confirm('Delete all worldbuilding for this story? The chapters and metadata stay.')) return;
    setBusy(true); setError('');
    try {
      await adminDeleteWorld({ data: { storyId } });
      setResult(null);
      await load();
      await router.invalidate();
    } catch (e) {
      setError(e?.message ?? 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  const counts = world ? summarize(world) : null;

  return (
    <section style={{ marginTop: 40 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 6 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--text-heading)', margin: 0 }}>Worldbuilding</h2>
        {counts && (counts.entities > 0 || counts.relationships > 0) && (
          <Button variant="ghost" size="sm" disabled={busy} onClick={del}>Delete world</Button>
        )}
      </div>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text-faint)', margin: '0 0 16px', maxWidth: 640 }}>
        Import cast, places, factions and relationships straight from Trove. Names and descriptions show;
        every other detail (role, traits, backstory, relationships, family) hides behind a “show spoilers”
        toggle. Hide a whole entity with <code>spoiler: true</code> (or a type via its <code>_meta.toml</code>).
      </p>

      {error && <div style={{ color: 'var(--accent)', marginBottom: 14, fontFamily: 'var(--font-ui)' }}>{error}</div>}

      {/* current state */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', background: 'var(--bg-raised)', padding: '14px 16px', marginBottom: 16 }}>
        {world === undefined ? (
          <span style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-faint)' }}>Loading…</span>
        ) : counts && counts.entities > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {counts.types.map((t) => (
              <Badge key={t.name} tone="neutral">{t.count} {t.name}</Badge>
            ))}
            <Badge tone="magenta">{counts.relationships} relationships</Badge>
            {counts.spoilers > 0 && <Badge tone="hiatus">{counts.spoilers} spoiler{counts.spoilers === 1 ? '' : 's'}</Badge>}
          </div>
        ) : (
          <span style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-faint)' }}>No worldbuilding uploaded yet.</span>
        )}
      </div>

      {/* drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => dirInput.current?.click()}
        style={{
          border: `1.5px dashed ${dragging ? 'var(--border-neon)' : 'var(--border)'}`,
          borderRadius: 'var(--r-lg)',
          background: dragging ? 'rgba(255,46,151,0.06)' : 'var(--bg-raised)',
          padding: '26px 22px', textAlign: 'center', cursor: 'pointer',
          transition: 'var(--t-control)',
        }}
      >
        <input ref={dirInput} type="file" multiple style={{ display: 'none' }} onChange={onPick} />
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 16, color: 'var(--text-prose)' }}>
          {busy ? 'Parsing…' : world && counts?.entities > 0 ? 'Drop your Trove folder again to re-import' : 'Drop your Trove manuscript folder, or click to choose'}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-faint)', marginTop: 8 }}>
          Reads <code>characters/</code>, <code>locations/</code>, <code>factions/</code>, <code>relationships/</code> and each <code>_meta.toml</code>. Ignores <code>documents/</code> and drafts.
        </div>
      </div>

      {result && (
        <div style={{ marginTop: 14, fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--status-ongoing)' }}>
          Imported {result.entities} {result.entities === 1 ? 'entity' : 'entities'} and {result.relationships} relationships
          {result.spoilers ? ` · ${result.spoilers} spoiler-flagged` : ''}.
        </div>
      )}
    </section>
  );
}
