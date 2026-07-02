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
      className="pd-drawer-backdrop"
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'var(--bg-overlay)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', justifyContent: 'flex-end',
      }}
    >
      <nav
        onClick={(e) => e.stopPropagation()}
        className="pd-drawer-panel"
        aria-label={label}
        style={{
          width: 'min(320px, 82vw)', height: '100%',
          display: 'flex', flexDirection: 'column', gap: 4,
          padding: '18px 16px calc(env(safe-area-inset-bottom, 0px) + 20px)',
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-xl)',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>{label}</span>
          <button
            onClick={onClose}
            title="Close menu"
            aria-label="Close menu"
            style={{ width: 38, height: 38, display: 'grid', placeItems: 'center', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}
          >
            <Icon name="x" size={18} color="var(--text-muted)" />
          </button>
        </div>
        {children}
      </nav>
    </div>
  );
}
