import { createFileRoute } from '@tanstack/react-router'

import { HubLanding } from '../components/site/hub/HubLanding.jsx'
import { code } from '../content/code'

export const Route = createFileRoute('/code')({
  head: () => ({
    meta: [{ title: code.meta.title }],
  }),
  component: HubLanding,
})
