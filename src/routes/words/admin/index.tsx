import { createFileRoute } from '@tanstack/react-router'

import { AdminStoryList } from '../../../components/site/words/admin/AdminStoryList.jsx'
import { adminGetCatalog } from '../../../server/admin'

export const Route = createFileRoute('/words/admin/')({
  loader: () => adminGetCatalog(),
  component: AdminIndex,
})

function AdminIndex() {
  const catalog = Route.useLoaderData()
  return <AdminStoryList catalog={catalog} />
}
