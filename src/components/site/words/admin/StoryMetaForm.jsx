// Story metadata form — shared by create (admin index) and edit (story editor).
// `id` is locked after creation: it's the R2 key prefix for chapter bodies, so
// renaming would orphan them.
import React from 'react';
import { Button, Input, COVER_STYLES, DEFAULT_COVER_STYLE } from '../../../ds/index.js';

const STATUSES = ['drafting', 'planned', 'ongoing', 'hiatus', 'complete'];
const COVERS = [
  'var(--accent)',
  'var(--purple-500)',
  'var(--cyan-500)',
  'var(--accent-press)',
  'var(--magenta-400)',
];

const label = {
  display: 'block', marginBottom: 7,
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
  letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--text-muted)',
};
const control = {
  width: '100%', boxSizing: 'border-box', padding: '11px 13px',
  background: 'var(--bg-raised)', color: 'var(--text-strong)',
  border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
  fontFamily: 'var(--font-ui)', fontSize: 15,
};

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function StoryMetaForm({ initial, mode = 'edit', onSave, onCancel, busy }) {
  const [f, setF] = React.useState(() => ({
    id: initial?.id ?? '',
    title: initial?.title ?? '',
    logline: initial?.logline ?? '',
    blurb: initial?.blurb ?? '',
    coverColor: initial?.coverColor ?? 'var(--accent)',
    coverStyle: initial?.coverStyle ?? DEFAULT_COVER_STYLE,
    status: initial?.status ?? 'drafting',
    tags: (initial?.tags ?? []).join(', '),
    words: initial?.words ?? '',
    progress: initial?.progress ?? '',
    published: initial?.published === true,
  }));
  const [err, setErr] = React.useState('');

  const set = (k) => (e) => {
    const v = e?.target?.type === 'checkbox' ? e.target.checked : e.target.value;
    setF((s) => ({ ...s, [k]: v }));
  };

  const submit = () => {
    const id = (f.id || slugify(f.title)).trim();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      setErr('Story id must be lowercase letters, numbers and dashes (derived from title if blank).');
      return;
    }
    if (!f.title.trim()) { setErr('Title is required.'); return; }
    setErr('');
    onSave({
      ...f,
      id,
      tags: f.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
  };

  return (
    <div style={{ display: 'grid', gap: 18, maxWidth: 720 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Input label="Title" value={f.title} onChange={set('title')} placeholder="Circus Murder" />
        <div>
          <span style={label}>Story id (URL slug)</span>
          {mode === 'create' ? (
            <input
              style={control}
              value={f.id}
              onChange={set('id')}
              onBlur={() => !f.id && f.title && setF((s) => ({ ...s, id: slugify(s.title) }))}
              placeholder="circus-murder (auto from title)"
            />
          ) : (
            <input style={{ ...control, opacity: 0.6 }} value={f.id} readOnly />
          )}
        </div>
      </div>

      <Input label="Logline" value={f.logline} onChange={set('logline')} placeholder="A god-touched ringmaster, dead in the town his blessing built." />

      <div>
        <span style={label}>Blurb</span>
        <textarea style={{ ...control, minHeight: 110, resize: 'vertical', lineHeight: 1.55 }} value={f.blurb} onChange={set('blurb')} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <div>
          <span style={label}>Status</span>
          <select style={control} value={f.status} onChange={set('status')}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <Input label="Words (display)" value={f.words} onChange={set('words')} placeholder="~60k" />
        <Input label="Progress line" value={f.progress} onChange={set('progress')} placeholder="Drafting · Act II" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 14 }}>
        <Input label="Tags (comma-separated)" value={f.tags} onChange={set('tags')} placeholder="Mystery, Fantasy" />
        <div>
          <span style={label}>Cover colour</span>
          <select style={{ ...control, color: f.coverColor }} value={f.coverColor} onChange={set('coverColor')}>
            {COVERS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <span style={label}>Cover style</span>
          <select style={control} value={f.coverStyle} onChange={set('coverStyle')}>
            {COVER_STYLES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </div>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-prose)', cursor: 'pointer' }}>
        <input type="checkbox" checked={f.published} onChange={set('published')} style={{ width: 18, height: 18 }} />
        Published (visible on the public site)
      </label>

      {err && <div style={{ color: 'var(--accent)', fontSize: 14, fontFamily: 'var(--font-ui)' }}>{err}</div>}

      <div style={{ display: 'flex', gap: 12 }}>
        <Button onClick={submit} variant="neon" disabled={busy}>{busy ? 'Saving…' : mode === 'create' ? 'Create story' : 'Save story'}</Button>
        {onCancel && <Button onClick={onCancel} variant="outline" disabled={busy}>Cancel</Button>}
      </div>
    </div>
  );
}
