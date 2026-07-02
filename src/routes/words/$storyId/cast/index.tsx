import { createFileRoute, notFound } from '@tanstack/react-router'

import { CastScreen } from '../../../../components/site/words/world/CastScreen.jsx'
import { getStoryBundle } from '../../../../server/stories'
import { getWorld } from '../../../../server/world'
import { words } from '../../../../content/words'

export const Route = createFileRoute('/words/$storyId/cast/')({
  loader: async ({ params }) => {
    const [bundle, world] = await Promise.all([
      getStoryBundle({ data: { storyId: params.storyId } }),
      getWorld({ data: { storyId: params.storyId } }),
    ])
    if (!bundle) throw notFound()
    return { story: bundle.story, world }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Cast — ${loaderData?.story.title ?? 'Story'} — words.pauldolden.com` }],
  }),
  component: CastRoute,
  notFoundComponent: NotFound,
})

function CastRoute() {
  const { story, world } = Route.useLoaderData()
  return <CastScreen story={story} world={world} />
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
