import { createFileRoute, notFound } from '@tanstack/react-router'

import { CharacterProfile } from '../../../../components/site/words/world/CharacterProfile.jsx'
import { getStoryBundle } from '../../../../server/stories'
import { getEntity } from '../../../../server/world'
import { words } from '../../../../content/words'

export const Route = createFileRoute('/words/$storyId/cast/$slug')({
  loader: async ({ params }) => {
    const [bundle, data] = await Promise.all([
      getStoryBundle({ data: { storyId: params.storyId } }),
      getEntity({ data: { storyId: params.storyId, slug: params.slug } }),
    ])
    if (!bundle || !data) throw notFound()
    return { story: bundle.story, entity: data.entity, links: data.links, entityTypes: data.entityTypes }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.entity.name ?? 'Profile'} — ${loaderData?.story.title ?? 'words.pauldolden.com'}` }],
  }),
  component: ProfileRoute,
  notFoundComponent: EntityNotFound,
})

function ProfileRoute() {
  const { story, entity, links, entityTypes } = Route.useLoaderData()
  return <CharacterProfile story={story} entity={entity} links={links} entityTypes={entityTypes} />
}

function EntityNotFound() {
  return (
    <div style={{ maxWidth: 'var(--width-prose)', margin: '0 auto', padding: '80px 28px', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-strong)' }}>{words.notFound.entityTitle}</h1>
      <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-muted)' }}>{words.notFound.entityBody}</p>
    </div>
  )
}
