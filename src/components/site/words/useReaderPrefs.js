// Reader preferences — font size + reading theme, persisted to localStorage.
// SSR-safe: starts from defaults, hydrates from storage after mount.
import { useEffect, useState } from 'react';

const SIZE_KEY = 'pd.reader.size';
const THEME_KEY = 'pd.reader.theme';

const MIN = 16;
const MAX = 24;
const DEFAULT_SIZE = 19;

// Reading-surface themes. `bg` paints the reading page; `vars` are CSS custom
// property overrides applied to the <article> only (so the floating controls
// keep their dark styling). Embedded LitRPG cards carry their own styling and
// sit as dark insets on either surface. `dark` = inherit the ember palette.
export const READER_THEMES = {
  dark: {
    icon: 'moon',
    bg: 'var(--bg-reader)',
    vars: {},
  },
  sepia: {
    icon: 'sun',
    bg: '#efe6d2',
    vars: {
      '--text-prose': '#3a2f22',
      '--text-strong': '#241c12',
      '--text-heading': '#241c12',
      '--text-body': '#3a2f22',
      '--text-muted': '#6b5a44',
      '--text-faint': '#8a7a5e',
      '--border-faint': 'rgba(58,47,34,0.18)',
    },
  },
};

export function useReaderPrefs() {
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    try {
      const s = parseInt(localStorage.getItem(SIZE_KEY) || '', 10);
      if (!Number.isNaN(s)) setSize(Math.min(MAX, Math.max(MIN, s)));
      const t = localStorage.getItem(THEME_KEY);
      if (t && READER_THEMES[t]) setTheme(t);
    } catch {
      /* private mode / no storage — keep defaults */
    }
  }, []);

  // Functional updaters so a click is correct even if it fires before the
  // mount-load effect has committed the persisted value (no stale closure).
  // Persisting inside the updater also means we never write on mount, so the
  // loaded value is never clobbered.
  const adjust = (delta) =>
    setSize((prev) => {
      const v = Math.min(MAX, Math.max(MIN, prev + delta));
      try { localStorage.setItem(SIZE_KEY, String(v)); } catch { /* ignore */ }
      return v;
    });

  const toggleTheme = () =>
    setTheme((prev) => {
      const next = prev === 'dark' ? 'sepia' : 'dark';
      try { localStorage.setItem(THEME_KEY, next); } catch { /* ignore */ }
      return next;
    });

  return {
    size,
    smaller: () => adjust(-1),
    larger: () => adjust(1),
    theme,
    themePreset: READER_THEMES[theme],
    toggleTheme,
  };
}
