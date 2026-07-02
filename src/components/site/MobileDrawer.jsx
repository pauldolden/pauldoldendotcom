// MobileDrawer — slide-in nav panel for the sticky site headers on narrow
// screens. Presentational only: the caller owns open state and supplies the
// links as children (so /code can pass anchors and /words can pass Router
// Links). Backdrop click, the close button, or Esc all fire onClose. Inherits
// theme vars from the header subtree (e.g. .theme-ember under /words).
import React, { useEffect } from 'react';
import { Icon } from '../ds/index.js';

export function MobileDrawer({ open, onClose, label = 'Menu', children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    // Lock body scroll while the drawer is open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="pd-drawer-backdrop fixed inset-0 z-[60] flex justify-end bg-overlay backdrop-blur-[6px]"
    >
      <nav
        onClick={(e) => e.stopPropagation()}
        className="pd-drawer-panel flex h-full w-[min(320px,82vw)] flex-col gap-1 overflow-y-auto border-l border-glass-line bg-surface pt-[18px] px-4 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] shadow-xl"
        aria-label={label}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="font-code text-[11px] uppercase tracking-[0.16em] text-faint">{label}</span>
          <button
            onClick={onClose}
            title="Close menu"
            aria-label="Close menu"
            className="grid h-[38px] w-[38px] place-items-center rounded-sm border border-line bg-transparent cursor-pointer"
          >
            <Icon name="x" size={18} color="var(--text-muted)" />
          </button>
        </div>
        {children}
      </nav>
    </div>
  );
}
