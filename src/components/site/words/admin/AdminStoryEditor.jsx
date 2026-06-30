// Story organizer — edit story metadata, then upload + structure chapters.
// Chapters are authored elsewhere as Markdown; here you UPLOAD the .md files
// (bulk drop or per-chapter) and arrange the structure (index order, titles,
// publish toggles). Bodies are stored in R2 as <storyId>/<index>.md.
import React from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { Badge, Button } from '../../../ds/index.js';
import { StoryMetaForm } from './StoryMetaForm.jsx';
import { adminSaveStory, adminSaveChapter, adminDeleteChapter } from '../../../../server/admin';

const label = {
  display: 'block', marginBottom: 7,
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
  letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--text-muted)',
};
const control = {
  width: '100%', boxSizing: 'border-box', padding: '11px 13px',
  background: 'var(--bg-base)', color: 'var(--text-strong)',
  border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
  fontFamily: 'var(--font-ui)', fontSize: 15,
};
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
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 17, color: 'var(--text-faint)' }}>
          No story with id <code>{storyId}</code>.
        </p>
        <Link to="/words/admin" style={{ color: 'var(--cyan-400)' }}>← All stories</Link>
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
      <div style={{ marginBottom: 8 }}>
        <Link to="/words/admin" style={{ color: 'var(--cyan-400)', fontFamily: 'var(--font-ui)', fontSize: 14, textDecoration: 'none' }}>← All stories</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 34, color: 'var(--text-strong)', margin: 0 }}>{story.title || story.id}</h1>
        <Badge tone={story.published ? 'ongoing' : 'neutral'} dot>{story.published ? 'Published' : 'Draft'}</Badge>
      </div>

      {error && <div style={{ color: 'var(--accent)', marginBottom: 16, fontFamily: 'var(--font-ui)' }}>{error}</div>}

      <section style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', background: 'var(--bg-raised)', padding: 24, marginBottom: 32 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text-heading)', margin: '0 0 18px' }}>Details</h2>
        <StoryMetaForm initial={story} mode="edit" onSave={saveMeta} busy={busy} />
      </section>

      <section>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--text-heading)', margin: 0 }}>Chapters</h2>
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
          style={{
            border: `1.5px dashed ${dragging ? 'var(--border-neon)' : 'var(--border)'}`,
            borderRadius: 'var(--r-lg)',
            background: dragging ? 'rgba(255,46,151,0.06)' : 'var(--bg-raised)',
            padding: '26px 22px', textAlign: 'center', cursor: 'pointer', marginBottom: 24,
            transition: 'var(--t-control)',
          }}
        >
          <input
            ref={bulkInput}
            type="file"
            accept=".md,.markdown,.txt"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => { onBulk(e.target.files); e.target.value = ''; }}
          />
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 16, color: 'var(--text-prose)' }}>
            {progress ? `Uploading… ${progress.done}/${progress.total}` : 'Drop Markdown files here, or click to choose'}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-faint)', marginTop: 8 }}>
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
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 16, color: 'var(--text-faint)' }}>No chapters yet — drop some files above.</p>
        )}

        <div style={{ display: 'grid', gap: 10 }}>
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
    </div>
  );
}

function ChapterRow({ chapter: c, busy, onTogglePublish, onReplaceBody, onEdit, onDelete }) {
  const fileRef = React.useRef(null);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px solid var(--border)', borderRadius: 'var(--r-md)', background: 'var(--bg-raised)', padding: '12px 16px' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-faint)', width: 28 }}>{c.index}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 16, color: 'var(--text-strong)' }}>{c.title || `Chapter ${c.index}`}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>
          {[c.date, c.words].filter(Boolean).join(' · ') || '—'}
        </div>
      </div>
      <Badge tone={c.published ? 'ongoing' : 'neutral'} dot>{c.published ? 'Live' : 'Draft'}</Badge>
      <input ref={fileRef} type="file" accept=".md,.markdown,.txt" style={{ display: 'none' }} onChange={(e) => { onReplaceBody(e.target.files?.[0]); e.target.value = ''; }} />
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
    <div style={{ border: '1px solid var(--border-neon)', borderRadius: 'var(--r-lg)', background: 'var(--bg-raised)', padding: 24, marginBottom: 24 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-heading)', margin: '0 0 18px' }}>
        {isNew ? 'New chapter' : `Edit chapter ${chapter.index}`}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 1fr 140px', gap: 14, marginBottom: 16 }}>
        <div><span style={label}>Index</span><input style={control} type="number" min="1" value={meta.index} onChange={set('index')} /></div>
        <div><span style={label}>Title</span><input style={control} value={meta.title} onChange={set('title')} placeholder="The Body in Ring Three" /></div>
        <div><span style={label}>Date (display)</span><input style={control} value={meta.date} onChange={set('date')} placeholder="Jun 30, 2026" /></div>
        <div><span style={label}>Words (display)</span><input style={control} value={meta.words} onChange={set('words')} placeholder="3.2k" /></div>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-prose)', cursor: 'pointer' }}>
          <input type="checkbox" checked={meta.isNew} onChange={set('isNew')} style={{ width: 18, height: 18 }} /> Mark “new”
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-prose)', cursor: 'pointer' }}>
          <input type="checkbox" checked={meta.published} onChange={set('published')} style={{ width: 18, height: 18 }} /> Published
        </label>
      </div>

      <div>
        <span style={label}>Body file (.md){isNew ? '' : ' — leave empty to keep current'}</span>
        <input type="file" accept=".md,.markdown,.txt" onChange={(e) => setFile(e.target.files?.[0] ?? null)} style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-prose)' }} />
      </div>

      {err && <div style={{ color: 'var(--accent)', marginTop: 14, fontFamily: 'var(--font-ui)' }}>{err}</div>}

      <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
        <Button variant="neon" onClick={submit} disabled={busy}>{busy ? 'Saving…' : 'Save chapter'}</Button>
        <Button variant="outline" onClick={onCancel} disabled={busy}>Cancel</Button>
      </div>
    </div>
  );
}
