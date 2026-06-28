// Bookmarks — saved chapters, persisted to localStorage.
// `items` is newest-first: { storyId, chapterId, title, storyTitle }.
import { useEffect, useState } from 'react';

const KEY = 'pd.bookmarks';

export function useBookmarks() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (next) => {
    setItems(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const isSaved = (storyId, chapterId) =>
    items.some((b) => b.storyId === storyId && String(b.chapterId) === String(chapterId));

  const toggle = (entry) => {
    if (isSaved(entry.storyId, entry.chapterId)) {
      persist(items.filter((b) => !(b.storyId === entry.storyId && String(b.chapterId) === String(entry.chapterId))));
    } else {
      persist([entry, ...items]);
    }
  };

  return { items, isSaved, toggle };
}
