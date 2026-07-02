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
    <section className="mt-10">
      <div className="mb-1.5 flex items-end justify-between gap-4">
        <h2 className="m-0 font-heading text-[26px] text-heading">Worldbuilding</h2>
        {counts && (counts.entities > 0 || counts.relationships > 0) && (
          <Button variant="ghost" size="sm" disabled={busy} onClick={del}>Delete world</Button>
        )}
      </div>
      <p className="mb-4 mt-0 max-w-[640px] font-sans text-sm text-faint">
        Import cast, places, factions and relationships straight from Trove. Names and descriptions show;
        every other detail (role, traits, backstory, relationships, family) hides behind a “show spoilers”
        toggle. Hide a whole entity with <code>spoiler: true</code> (or a type via its <code>_meta.toml</code>).
      </p>

      {error && <div className="mb-3.5 font-sans text-accent">{error}</div>}

      {/* current state */}
      <div className="mb-4 rounded-md border border-line bg-raised px-4 py-[14px]">
        {world === undefined ? (
          <span className="font-sans text-faint">Loading…</span>
        ) : counts && counts.entities > 0 ? (
          <div className="flex flex-wrap items-center gap-2.5">
            {counts.types.map((t) => (
              <Badge key={t.name} tone="neutral">{t.count} {t.name}</Badge>
            ))}
            <Badge tone="magenta">{counts.relationships} relationships</Badge>
            {counts.spoilers > 0 && <Badge tone="hiatus">{counts.spoilers} spoiler{counts.spoilers === 1 ? '' : 's'}</Badge>}
          </div>
        ) : (
          <span className="font-sans text-faint">No worldbuilding uploaded yet.</span>
        )}
      </div>

      {/* drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => dirInput.current?.click()}
        className={`cursor-pointer rounded-lg border-[1.5px] border-dashed px-[22px] py-[26px] text-center transition-control ${dragging ? 'border-line-neon bg-[rgba(255,46,151,0.06)]' : 'border-line bg-raised'}`}
      >
        <input ref={dirInput} type="file" multiple className="hidden" onChange={onPick} />
        <div className="font-sans text-base text-prose">
          {busy ? 'Parsing…' : world && counts?.entities > 0 ? 'Drop your Trove folder again to re-import' : 'Drop your Trove manuscript folder, or click to choose'}
        </div>
        <div className="mt-2 font-code text-xs text-faint">
          Reads <code>characters/</code>, <code>locations/</code>, <code>factions/</code>, <code>relationships/</code> and each <code>_meta.toml</code>. Ignores <code>documents/</code> and drafts.
        </div>
      </div>

      {result && (
        <div className="mt-3.5 font-sans text-[15px] text-status-ongoing">
          Imported {result.entities} {result.entities === 1 ? 'entity' : 'entities'} and {result.relationships} relationships
          {result.spoilers ? ` · ${result.spoilers} spoiler-flagged` : ''}.
        </div>
      )}
    </section>
  );
}
