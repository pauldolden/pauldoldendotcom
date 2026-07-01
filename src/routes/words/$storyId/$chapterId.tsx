import { createFileRoute, notFound } from '@tanstack/react-router'

import { ReaderScreen } from '../../../components/site/words/ReaderScreen.jsx'
import { getChapter } from '../../../server/stories'
import { getWorld } from '../../../server/world'
import { words } from '../../../content/words'

export const Route = createFileRoute('/words/$storyId/$chapterId')({
  loader: async ({ params }) => {
    const [data, world] = await Promise.all([
      getChapter({ data: { storyId: params.storyId, chapterId: params.chapterId } }),
      getWorld({ data: { storyId: params.storyId } }),
    ])
    if (!data) throw notFound()
    return { ...data, world }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.chapter.title ?? 'Chapter'} — ${loaderData?.story.title ?? ''}` }],
  }),
  component: ReaderRoute,
  notFoundComponent: NotFound,
})

function ReaderRoute() {
  const { story, chapter, blocks, prev, next, world } = Route.useLoaderData()
  return <ReaderScreen story={story} chapter={chapter} blocks={blocks} prev={prev} next={next} world={world} />
}

function NotFound() {
  return (
    <div style={{ maxWidth: 'var(--width-prose)', margin: '0 auto', padding: '80px 28px', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-strong)' }}>{words.notFound.chapterTitle}</h1>
      <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-muted)' }}>{words.notFound.chapterBody}</p>
    </div>
  )
}
