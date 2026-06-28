import { createFileRoute } from '@tanstack/react-router'

import { LibraryScreen } from '../../components/site/words/LibraryScreen.jsx'
import { getCatalog } from '../../server/stories'
import { words } from '../../content/words'

export const Route = createFileRoute('/words/library')({
  loader: () => getCatalog(),
  head: () => ({ meta: [{ title: words.library.meta }] }),
  component: LibraryRoute,
})

function LibraryRoute() {
  const { stories } = Route.useLoaderData()
  return <LibraryScreen stories={stories} />
}
