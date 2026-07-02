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

const LABEL = 'mb-[7px] block font-code text-xs uppercase tracking-wide text-muted';
const CONTROL = 'w-full box-border rounded-md border border-line bg-raised px-[13px] py-[11px] font-sans text-[15px] text-strong';
// Auto-collapse to a single column on narrow screens. `min(100%, 200px)` keeps
// the minimum from ever exceeding the container, so fields never overflow.
const GRID = 'grid gap-3.5 grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))]';

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
    <div className="grid max-w-[720px] gap-[18px]">
      <div className={GRID}>
        <Input label="Title" value={f.title} onChange={set('title')} placeholder="Circus Murder" />
        <div>
          <span className={LABEL}>Story id (URL slug)</span>
          {mode === 'create' ? (
            <input
              className={CONTROL}
              value={f.id}
              onChange={set('id')}
              onBlur={() => !f.id && f.title && setF((s) => ({ ...s, id: slugify(s.title) }))}
              placeholder="circus-murder (auto from title)"
            />
          ) : (
            <input className={`${CONTROL} opacity-60`} value={f.id} readOnly />
          )}
        </div>
      </div>

      <Input label="Logline" value={f.logline} onChange={set('logline')} placeholder="A god-touched ringmaster, dead in the town his blessing built." />

      <div>
        <span className={LABEL}>Blurb</span>
        <textarea className={`${CONTROL} min-h-[110px] resize-y leading-[1.55]`} value={f.blurb} onChange={set('blurb')} />
      </div>

      <div className={GRID}>
        <div>
          <span className={LABEL}>Status</span>
          <select className={CONTROL} value={f.status} onChange={set('status')}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <Input label="Words (display)" value={f.words} onChange={set('words')} placeholder="~60k" />
        <Input label="Progress line" value={f.progress} onChange={set('progress')} placeholder="Drafting · Act II" />
      </div>

      <div className={GRID}>
        <Input label="Tags (comma-separated)" value={f.tags} onChange={set('tags')} placeholder="Mystery, Fantasy" />
        <div>
          <span className={LABEL}>Cover colour</span>
          <select className={CONTROL} style={{ color: f.coverColor }} value={f.coverColor} onChange={set('coverColor')}>
            {COVERS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <span className={LABEL}>Cover style</span>
          <select className={CONTROL} value={f.coverStyle} onChange={set('coverStyle')}>
            {COVER_STYLES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 font-sans text-[15px] text-prose">
        <input type="checkbox" checked={f.published} onChange={set('published')} className="h-[18px] w-[18px]" />
        Published (visible on the public site)
      </label>

      {err && <div className="font-sans text-sm text-accent">{err}</div>}

      <div className="flex gap-3">
        <Button onClick={submit} variant="neon" disabled={busy}>{busy ? 'Saving…' : mode === 'create' ? 'Create story' : 'Save story'}</Button>
        {onCancel && <Button onClick={onCancel} variant="outline" disabled={busy}>Cancel</Button>}
      </div>
    </div>
  );
}
