import React from 'react';
import { Button } from '../core/Button.jsx';
import { Input } from '../core/Input.jsx';

/**
 * FollowSignup — the "get the next chapter" email capture block.
 * A glass card over the page's gradient/splash background.
 */
export function FollowSignup({
  title = 'Never miss a chapter',
  blurb = 'New chapters land most weeks. Drop your email and I’ll send each one straight to your inbox — no spam, unsubscribe anytime.',
  cta = 'Follow',
  onSubmit,
}) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(); }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--glass)',
        border: '1px solid var(--glass-border)',
        backdropFilter: 'blur(var(--blur-md))',
        WebkitBackdropFilter: 'blur(var(--blur-md))',
        borderRadius: 'var(--r-xl)',
        padding: 'var(--space-8)',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-glow)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', maxWidth: 460 }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
          letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase',
          color: 'var(--cyan-400)', marginBottom: 12,
        }}>§ Follow the work</div>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-black)',
          fontSize: 'var(--text-3xl)', lineHeight: 1.1, color: 'var(--text-strong)',
          margin: '0 0 10px', letterSpacing: 'var(--tracking-tight)',
        }}>{title}</h3>
        <p style={{ margin: '0 0 22px', color: 'var(--text-muted)', fontSize: 'var(--text-md)', lineHeight: 1.55, fontFamily: 'var(--font-ui)' }}>{blurb}</p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 220px' }}>
            <Input placeholder="you@domain.com" type="email" required iconLeft={<span aria-hidden>✉</span>} />
          </div>
          <Button variant="neon" type="submit">{cta}</Button>
        </div>
      </div>
    </form>
  );
}
