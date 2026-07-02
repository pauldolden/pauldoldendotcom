// Story organizer — edit story metadata, then upload + structure chapters.
// Chapters are authored elsewhere as Markdown; here you UPLOAD the .md files
// (bulk drop or per-chapter) and arrange the structure (index order, titles,
// publish toggles). Bodies are stored in R2 as <storyId>/<index>.md.
import React from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { Badge, Button } from '../../../ds/index.js';
import { StoryMetaForm } from './StoryMetaForm.jsx';
import { AdminWorldPanel } from './AdminWorldPanel.jsx';
import { adminSaveStory, adminSaveChapter, adminDeleteChapter } from '../../../../server/admin';

const LABEL = 'mb-[7px] block font-code text-xs uppercase tracking-wide text-muted';
const CONTROL = 'w-full box-border rounded-md border border-line bg-canvas px-[13px] py-[11px] font-sans text-[15px] text-strong';
const MD_RE = /\.(md|markdown|txt)$/i;

// "01-the-body.md" / "1. The Body.md" / "12_chapter.md" -> { index, title }
function parseFilename(name, fallbackIndex) {
  const base = name.replace(MD_RE, '');
  const m = base.match(/^\s*(\d+)\b[\s._)\-.]*(.*)$/);
  const index = m ? Number(m[1]) : fallbackIndex;
  const raw = (m ? m[2] : base).replace(/[._-]+/g, ' ').trim();
  const title = raw.replace(/\b\w/g, (ch) => ch.toUpperCase());
  return { index, title };
}

export function AdminStoryEditor({ story, storyId }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const [editing, setEditing] = React.useState(null); // chapter meta being edited, or null
  const [progress, setProgress] = React.useState(null);
  const [dragging, setDragging] = React.useState(false);
  const bulkInput = React.useRef(null);

  if (!story) {
    return (
      <div>
        <p className="font-sans text-[17px] text-faint">
          No story with id <code>{storyId}</code>.
        </p>
        <Link to="/words/admin" className="text-cyan-400">← All stories</Link>
      </div>
    );
  }

  const toc = (story.toc ?? []).slice().sort((a, b) => Number(a.index) - Number(b.index));
  const nextIndex = toc.reduce((m, c) => Math.max(m, Number(c.index)), 0) + 1;

  const saveMeta = async (meta) => {
    setBusy(true); setError('');
    try {
      await adminSaveStory({ data: { story: meta } });
      await router.invalidate();
    } catch (e) {
      setError(e?.message ?? 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  // Save one chapter. markdown=null keeps the existing body (structure-only).
  const saveChapter = async (chapter, markdown = null) => {
    await adminSaveChapter({ data: { storyId, chapter, markdown } });
  };

  const togglePublish = async (c) => {
    setBusy(true); setError('');
    try {
      await saveChapter({ ...c, published: !c.published }, null);
      await router.invalidate();
    } catch (e) {
      setError(e?.message ?? 'Update failed');
    } finally {
      setBusy(false);
    }
  };

  const removeChapter = async (index, title) => {
    if (!window.confirm(`Delete chapter ${index} “${title}”? This cannot be undone.`)) return;
    setBusy(true); setError('');
    try {
      await adminDeleteChapter({ data: { storyId, chapterId: String(index) } });
      await router.invalidate();
    } catch (e) {
      setError(e?.message ?? 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  // Replace just the body of an existing chapter (keeps its metadata).
  const replaceBody = async (c, file) => {
    if (!file) return;
    setBusy(true); setError('');
    try {
      await saveChapter({ ...c }, await file.text());
      await router.invalidate();
    } catch (e) {
      setError(e?.message ?? 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  // Bulk: each .md becomes a chapter. Leading number in the filename = index
  // (else sequential). New chapters land as drafts; existing indices get their
  // body replaced, metadata untouched. Then you flip publish.
  const onBulk = async (fileList) => {
    const files = [...fileList].filter((f) => MD_RE.test(f.name));
    if (files.length === 0) { setError('Drop Markdown files (.md / .markdown / .txt).'); return; }
    setBusy(true); setError(''); setProgress({ done: 0, total: files.length });
    let fallback = nextIndex;
    try {
      const items = files
        .map((f) => ({ f, ...parseFilename(f.name, fallback++) }))
        .sort((a, b) => a.index - b.index);
      for (const it of items) {
        const text = await it.f.text();
        const existing = toc.find((c) => Number(c.index) === it.index);
        const meta = existing
          ? { ...existing }
          : { index: it.index, title: it.title, words: '', date: '', isNew: true, published: false };
        await saveChapter(meta, text);
        setProgress((p) => ({ ...p, done: p.done + 1 }));
      }
      await router.invalidate();
    } catch (e) {
      setError(e?.message ?? 'Upload failed');
    } finally {
      setBusy(false); setProgress(null);
    }
  };

  return (
    <div>
      <div className="mb-2">
        <Link to="/words/admin" className="font-sans text-sm text-cyan-400 no-underline">← All stories</Link>
      </div>
      <div className="mb-6 flex items-center gap-3">
        <h1 className="m-0 font-heading text-[34px] font-bold text-strong">{story.title || story.id}</h1>
        <Badge tone={story.published ? 'ongoing' : 'neutral'} dot>{story.published ? 'Published' : 'Draft'}</Badge>
      </div>

      {error && <div className="mb-4 font-sans text-accent">{error}</div>}

      <section className="mb-8 rounded-lg border border-line bg-raised p-6">
        <h2 className="mb-[18px] mt-0 font-heading text-[22px] text-heading">Details</h2>
        <StoryMetaForm initial={story} mode="edit" onSave={saveMeta} busy={busy} />
      </section>

      <section>
        <div className="mb-3.5 flex items-end justify-between gap-4">
          <h2 className="m-0 font-heading text-[26px] text-heading">Chapters</h2>
          {!editing && (
            <Button variant="outline" onClick={() => setEditing({ index: nextIndex, title: '', words: '', date: '', isNew: true, published: false, _new: true })}>
              Add chapter manually
            </Button>
          )}
        </div>

        {/* BULK UPLOAD */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); onBulk(e.dataTransfer.files); }}
          onClick={() => bulkInput.current?.click()}
          className={`mb-6 cursor-pointer rounded-lg border-[1.5px] border-dashed px-[22px] py-[26px] text-center transition-control ${dragging ? 'border-line-neon bg-[rgba(255,46,151,0.06)]' : 'border-line bg-raised'}`}
        >
          <input
            ref={bulkInput}
            type="file"
            accept=".md,.markdown,.txt"
            multiple
            className="hidden"
            onChange={(e) => { onBulk(e.target.files); e.target.value = ''; }}
          />
          <div className="font-sans text-base text-prose">
            {progress ? `Uploading… ${progress.done}/${progress.total}` : 'Drop Markdown files here, or click to choose'}
          </div>
          <div className="mt-2 font-code text-xs text-faint">
            Filename leads with the chapter number → index &amp; title. e.g. <code>1-the-body-in-ring-three.md</code> → ch.1 “The Body In Ring Three”. Uploaded as drafts; publish when ready.
          </div>
        </div>

        {editing && (
          <ChapterMetaForm
            key={editing.index + (editing._new ? '-new' : '')}
            chapter={editing}
            isNew={!!editing._new}
            onCancel={() => setEditing(null)}
            onSave={async ({ meta, file }) => {
              setBusy(true); setError('');
              try {
                await saveChapter(meta, file ? await file.text() : null);
                setEditing(null);
                await router.invalidate();
              } catch (e) {
                setError(e?.message ?? 'Save failed');
              } finally {
                setBusy(false);
              }
            }}
            busy={busy}
          />
        )}

        {toc.length === 0 && !editing && (
          <p className="font-sans text-base text-faint">No chapters yet — drop some files above.</p>
        )}

        <div className="grid gap-2.5">
          {toc.map((c) => (
            <ChapterRow
              key={c.index}
              chapter={c}
              busy={busy}
              onTogglePublish={() => togglePublish(c)}
              onReplaceBody={(file) => replaceBody(c, file)}
              onEdit={() => setEditing({ ...c })}
              onDelete={() => removeChapter(c.index, c.title || `Chapter ${c.index}`)}
            />
          ))}
        </div>
      </section>

      <AdminWorldPanel storyId={storyId} />
    </div>
  );
}

function ChapterRow({ chapter: c, busy, onTogglePublish, onReplaceBody, onEdit, onDelete }) {
  const fileRef = React.useRef(null);
  return (
    <div className="flex items-center gap-3.5 rounded-md border border-line bg-raised px-4 py-3">
      <span className="w-7 font-code text-[13px] text-faint">{c.index}</span>
      <div className="min-w-0 flex-1">
        <div className="font-sans text-base text-strong">{c.title || `Chapter ${c.index}`}</div>
        <div className="mt-0.5 font-code text-[11px] text-faint">
          {[c.date, c.words].filter(Boolean).join(' · ') || '—'}
        </div>
      </div>
      <Badge tone={c.published ? 'ongoing' : 'neutral'} dot>{c.published ? 'Live' : 'Draft'}</Badge>
      <input ref={fileRef} type="file" accept=".md,.markdown,.txt" className="hidden" onChange={(e) => { onReplaceBody(e.target.files?.[0]); e.target.value = ''; }} />
      <Button variant="ghost" size="sm" disabled={busy} onClick={() => fileRef.current?.click()}>Replace .md</Button>
      <Button variant={c.published ? 'ghost' : 'outline'} size="sm" disabled={busy} onClick={onTogglePublish}>{c.published ? 'Unpublish' : 'Publish'}</Button>
      <Button variant="ghost" size="sm" disabled={busy} onClick={onEdit}>Edit</Button>
      <Button variant="ghost" size="sm" disabled={busy} onClick={onDelete}>Delete</Button>
    </div>
  );
}

function ChapterMetaForm({ chapter, isNew, onSave, onCancel, busy }) {
  const [meta, setMeta] = React.useState({
    index: chapter.index,
    title: chapter.title ?? '',
    words: chapter.words ?? '',
    date: chapter.date ?? '',
    isNew: chapter.isNew === true,
    published: chapter.published === true,
  });
  const [file, setFile] = React.useState(null);
  const [err, setErr] = React.useState('');

  const set = (k) => (e) => {
    const v = e?.target?.type === 'checkbox' ? e.target.checked : e.target.value;
    setMeta((s) => ({ ...s, [k]: v }));
  };

  const submit = () => {
    const index = Number(meta.index);
    if (!Number.isInteger(index) || index < 1) { setErr('Index must be a positive whole number.'); return; }
    setErr('');
    onSave({ meta: { ...meta, index }, file });
  };

  return (
    <div className="mb-6 rounded-lg border border-line-neon bg-raised p-6">
      <h3 className="mb-[18px] mt-0 font-heading text-xl text-heading">
        {isNew ? 'New chapter' : `Edit chapter ${chapter.index}`}
      </h3>

      <div className="mb-4 grid grid-cols-[90px_1fr_1fr_140px] gap-3.5">
        <div><span className={LABEL}>Index</span><input className={CONTROL} type="number" min="1" value={meta.index} onChange={set('index')} /></div>
        <div><span className={LABEL}>Title</span><input className={CONTROL} value={meta.title} onChange={set('title')} placeholder="The Body in Ring Three" /></div>
        <div><span className={LABEL}>Date (display)</span><input className={CONTROL} value={meta.date} onChange={set('date')} placeholder="Jun 30, 2026" /></div>
        <div><span className={LABEL}>Words (display)</span><input className={CONTROL} value={meta.words} onChange={set('words')} placeholder="3.2k" /></div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-6">
        <label className="flex cursor-pointer items-center gap-2 font-sans text-[15px] text-prose">
          <input type="checkbox" checked={meta.isNew} onChange={set('isNew')} className="h-[18px] w-[18px]" /> Mark “new”
        </label>
        <label className="flex cursor-pointer items-center gap-2 font-sans text-[15px] text-prose">
          <input type="checkbox" checked={meta.published} onChange={set('published')} className="h-[18px] w-[18px]" /> Published
        </label>
      </div>

      <div>
        <span className={LABEL}>Body file (.md){isNew ? '' : ' — leave empty to keep current'}</span>
        <input type="file" accept=".md,.markdown,.txt" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="font-sans text-prose" />
      </div>

      {err && <div className="mt-3.5 font-sans text-accent">{err}</div>}

      <div className="mt-[18px] flex gap-3">
        <Button variant="neon" onClick={submit} disabled={busy}>{busy ? 'Saving…' : 'Save chapter'}</Button>
        <Button variant="outline" onClick={onCancel} disabled={busy}>Cancel</Button>
      </div>
    </div>
  );
}
