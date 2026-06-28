import { createFileRoute, notFound } from '@tanstack/react-router'

import { StoryScreen } from '../../../components/site/words/StoryScreen.jsx'
import { getStoryBundle } from '../../../server/stories'
import { words } from '../../../content/words'

export const Route = createFileRoute('/words/$storyId/')({
  loader: async ({ params }) => {
    const data = await getStoryBundle({ data: { storyId: params.storyId } })
    if (!data) throw notFound()
    return data
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.story.title ?? 'Story'} — words.pauldolden.com` }],
  }),
  component: StoryRoute,
  notFoundComponent: NotFound,
})

function StoryRoute() {
  const { story, chapters } = Route.useLoaderData()
  return <StoryScreen story={story} chapters={chapters} />
}

function NotFound() {
  const { storyId } = Route.useParams()
  return (
    <div style={{ maxWidth: 'var(--width-prose)', margin: '0 auto', padding: '80px 28px', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-strong)' }}>{words.notFound.storyTitle}</h1>
      <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-muted)' }}>{words.notFound.storyBody(storyId)}</p>
    </div>
  )
}
