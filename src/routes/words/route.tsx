import { createFileRoute, Outlet } from '@tanstack/react-router'

import { Shell } from '../../components/site/words/Shell.jsx'
import { words } from '../../content/words'
import wordsCss from '../../styles/words.css?url'

export const Route = createFileRoute('/words')({
  head: () => ({
    links: [
      { rel: 'stylesheet', href: wordsCss },
      { rel: 'alternate', type: 'application/rss+xml', title: words.feed.title, href: '/words/rss.xml' },
    ],
  }),
  component: WordsLayout,
})

function WordsLayout() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  )
}
