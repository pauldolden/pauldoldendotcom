import { createFileRoute } from '@tanstack/react-router'

import { HomeScreen } from '../../components/site/words/HomeScreen.jsx'
import { getCatalog } from '../../server/stories'
import { words } from '../../content/words'

export const Route = createFileRoute('/words/')({
  loader: () => getCatalog(),
  head: () => ({ meta: [{ title: words.home.meta }] }),
  component: HomeRoute,
})

function HomeRoute() {
  const { stories } = Route.useLoaderData()
  return <HomeScreen stories={stories} />
}
