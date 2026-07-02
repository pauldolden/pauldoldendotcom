import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

// Admin layout for /words/admin*. Cloudflare Access protects this path at the
// edge in prod; the write server functions re-verify the Access JWT (see
// src/server/access.ts). noindex so the editor never lands in search results.
export const Route = createFileRoute('/words/admin')({
  head: () => ({
    meta: [
      { title: 'Admin — words' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminLayout,
  errorComponent: AdminError,
})

function AdminLayout() {
  return (
    <div className="mx-auto max-w-content px-7 pb-24 pt-10">
      <div className="mb-7 flex items-center justify-between gap-4">
        <div className="font-code text-xs uppercase tracking-[0.2em] text-magenta-400">
          § Admin · /words
        </div>
        <Link to="/words" className="font-sans text-sm text-cyan-400 no-underline">
          View site →
        </Link>
      </div>
      <Outlet />
    </div>
  )
}

function AdminError({ error }: { error: Error }) {
  return (
    <div className="mx-auto max-w-content px-7 py-20">
      <h1 className="m-0 font-heading text-[32px] font-bold text-strong">Not authorized</h1>
      <p className="mt-3.5 max-w-[560px] font-sans text-[17px] text-muted">
        This area is gated by Cloudflare Access. Sign in with an allowed account, or check the Access configuration.
      </p>
      <p className="mt-[18px] font-code text-[13px] text-faint">{error?.message}</p>
    </div>
  )
}
