import { createFileRoute } from '@tanstack/react-router'

import { AdminStoryEditor } from '../../../components/site/words/admin/AdminStoryEditor.jsx'
import { adminGetCatalog } from '../../../server/admin'

export const Route = createFileRoute('/words/admin/$storyId')({
  loader: async ({ params }) => {
    const cat = await adminGetCatalog()
    const story = (cat.stories ?? []).find((s: any) => s.id === params.storyId) ?? null
    return { story, storyId: params.storyId }
  },
  component: AdminEdit,
})

function AdminEdit() {
  const { story, storyId } = Route.useLoaderData()
  return <AdminStoryEditor story={story} storyId={storyId} />
}
