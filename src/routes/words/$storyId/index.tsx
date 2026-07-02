import { createFileRoute, notFound } from '@tanstack/react-router'

import { StoryScreen } from '../../../components/site/words/StoryScreen.jsx'
import { getStoryBundle } from '../../../server/stories'
import { getWorld } from '../../../server/world'
import { words } from '../../../content/words'

export const Route = createFileRoute('/words/$storyId/')({
  loader: async ({ params }) => {
    const [data, world] = await Promise.all([
      getStoryBundle({ data: { storyId: params.storyId } }),
      getWorld({ data: { storyId: params.storyId } }),
    ])
    if (!data) throw notFound()
    return { ...data, world }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.story.title ?? 'Story'} — words.pauldolden.com` }],
  }),
  component: StoryRoute,
  notFoundComponent: NotFound,
})

function StoryRoute() {
  const { story, chapters, world } = Route.useLoaderData()
  return <StoryScreen story={story} chapters={chapters} world={world} />
}

function NotFound() {
  const { storyId } = Route.useParams()
  return (
    <div className="mx-auto max-w-prose px-7 py-20 text-center">
      <h1 className="font-heading text-strong">{words.notFound.storyTitle}</h1>
      <p className="font-sans text-muted">{words.notFound.storyBody(storyId)}</p>
    </div>
  )
}
