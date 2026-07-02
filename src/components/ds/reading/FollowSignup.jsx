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
      className="relative overflow-hidden rounded-xl border border-glass-line bg-glass p-10 backdrop-blur-[var(--blur-md)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-grad-glow" />
      <div className="relative max-w-[460px]">
        <div className="mb-3 font-code text-xs uppercase tracking-wider text-cyan-400">§ Follow the work</div>
        <h3 className="m-0 mb-2.5 font-heading text-3xl font-bold leading-[1.1] tracking-tight text-strong">{title}</h3>
        <p className="m-0 mb-[22px] font-sans text-md leading-[1.55] text-muted">{blurb}</p>
        <div className="flex flex-wrap items-start gap-2.5">
          <div className="flex-[1_1_220px]">
            <Input placeholder="you@domain.com" type="email" required iconLeft={<span aria-hidden>✉</span>} />
          </div>
          <Button variant="neon" type="submit">{cta}</Button>
        </div>
      </div>
    </form>
  );
}
