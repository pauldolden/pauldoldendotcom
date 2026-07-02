import { createFileRoute, Outlet } from '@tanstack/react-router'

import { Shell } from '../../components/site/words/Shell.jsx'
import { amIAdmin } from '../../server/admin'
import { words } from '../../content/words'

export const Route = createFileRoute('/words')({
  head: () => ({
    links: [
      { rel: 'alternate', type: 'application/rss+xml', title: words.feed.title, href: '/words/rss.xml' },
    ],
  }),
  loader: () => amIAdmin(),
  component: WordsLayout,
})

function WordsLayout() {
  const { admin } = Route.useLoaderData()
  return (
    <Shell isAdmin={admin}>
      <Outlet />
    </Shell>
  )
}
