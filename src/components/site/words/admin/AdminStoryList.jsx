// Admin landing — list every story (drafts included), create new ones, delete.
import React from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { Badge, Button } from '../../../ds/index.js';
import { StoryMetaForm } from './StoryMetaForm.jsx';
import { adminSaveStory, adminDeleteStory } from '../../../../server/admin';

export function AdminStoryList({ catalog }) {
  const router = useRouter();
  const stories = catalog?.stories ?? [];
  const [creating, setCreating] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');

  const create = async (story) => {
    setBusy(true); setError('');
    try {
      await adminSaveStory({ data: { story } });
      setCreating(false);
      await router.invalidate();
    } catch (e) {
      setError(e?.message ?? 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id, title) => {
    if (!window.confirm(`Delete “${title}” and all its chapters? This cannot be undone.`)) return;
    setBusy(true); setError('');
    try {
      await adminDeleteStory({ data: { id } });
      await router.invalidate();
    } catch (e) {
      setError(e?.message ?? 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <h1 className="m-0 font-heading text-[36px] font-bold text-strong">Stories</h1>
        {!creating && <Button onClick={() => setCreating(true)} variant="neon">New story</Button>}
      </div>

      {error && <div className="mb-4 font-sans text-accent">{error}</div>}

      {creating && (
        <div className="mb-7 rounded-lg border border-line bg-raised p-6">
          <h2 className="mb-[18px] mt-0 font-heading text-[22px] text-heading">New story</h2>
          <StoryMetaForm mode="create" onSave={create} onCancel={() => setCreating(false)} busy={busy} />
        </div>
      )}

      {stories.length === 0 && !creating && (
        <p className="font-sans text-[17px] text-faint">No stories yet. Create one — it goes live the moment you publish it.</p>
      )}

      <div className="grid gap-3">
        {stories.map((s) => {
          const chapters = (s.toc ?? []).length;
          const live = (s.toc ?? []).filter((c) => c.published).length;
          return (
            <div key={s.id} className="flex flex-wrap items-center gap-4 rounded-lg border border-line bg-raised px-[18px] py-4">
              <div className="h-11 w-2 shrink-0 rounded-[4px]" style={{ background: s.coverColor }} />
              <div className="min-w-[180px] flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Link to="/words/admin/$storyId" params={{ storyId: s.id }} className="font-heading text-xl font-bold text-strong no-underline">{s.title || s.id}</Link>
                  <Badge tone={s.published ? 'ongoing' : 'neutral'} dot>{s.published ? 'Published' : 'Draft'}</Badge>
                </div>
                <div className="mt-1 font-code text-xs text-faint">
                  {s.id} · {s.status} · {chapters} ch ({live} live)
                </div>
              </div>
              <Button as={Link} to="/words/admin/$storyId" params={{ storyId: s.id }} variant="outline" size="sm">Edit</Button>
              <Button onClick={() => remove(s.id, s.title || s.id)} variant="ghost" size="sm" disabled={busy}>Delete</Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
