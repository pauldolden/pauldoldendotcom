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
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 36, color: 'var(--text-strong)', margin: 0 }}>Stories</h1>
        {!creating && <Button onClick={() => setCreating(true)} variant="neon">New story</Button>}
      </div>

      {error && <div style={{ color: 'var(--accent)', marginBottom: 16, fontFamily: 'var(--font-ui)' }}>{error}</div>}

      {creating && (
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', background: 'var(--bg-raised)', padding: 24, marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text-heading)', margin: '0 0 18px' }}>New story</h2>
          <StoryMetaForm mode="create" onSave={create} onCancel={() => setCreating(false)} busy={busy} />
        </div>
      )}

      {stories.length === 0 && !creating && (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 17, color: 'var(--text-faint)' }}>No stories yet. Create one — it goes live the moment you publish it.</p>
      )}

      <div style={{ display: 'grid', gap: 12 }}>
        {stories.map((s) => {
          const chapters = (s.toc ?? []).length;
          const live = (s.toc ?? []).filter((c) => c.published).length;
          return (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 16, border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', background: 'var(--bg-raised)', padding: '16px 18px' }}>
              <div style={{ width: 8, height: 44, borderRadius: 4, background: s.coverColor, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Link to="/words/admin/$storyId" params={{ storyId: s.id }} style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-strong)', textDecoration: 'none' }}>{s.title || s.id}</Link>
                  <Badge tone={s.published ? 'ongoing' : 'neutral'} dot>{s.published ? 'Published' : 'Draft'}</Badge>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-faint)', marginTop: 4 }}>
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
