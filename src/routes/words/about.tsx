import { createFileRoute } from '@tanstack/react-router'

import { AboutScreen } from '../../components/site/words/AboutScreen.jsx'
import { words } from '../../content/words'

export const Route = createFileRoute('/words/about')({
  head: () => ({ meta: [{ title: words.about.meta }] }),
  component: AboutScreen,
})
