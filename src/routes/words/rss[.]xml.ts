// Server route → GET /words/rss.xml — RSS 2.0 feed of the latest chapters,
// built from the same catalog the pages use (R2 or sample). No UI component.
import { createFileRoute } from '@tanstack/react-router'

import { loadCatalog } from '../../server/stories-data'
import { words } from '../../content/words'

function xmlEscape(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export const Route = createFileRoute('/words/rss.xml')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin
        const catalog = await loadCatalog()

        // Flatten every story's chapters into feed items, newest index first.
        const items = catalog.stories
          .flatMap((s: any) =>
            (s.toc ?? []).map((c: any) => ({
              storyId: s.id,
              storyTitle: s.title,
              chapterId: c.index,
              title: c.title,
              words: c.words,
            })),
          )
          .sort((a: any, b: any) => b.chapterId - a.chapterId)
          .slice(0, 50)

        const itemXml = items
          .map((it: any) => {
            const link = `${origin}/words/${it.storyId}/${it.chapterId}`
            return [
              '    <item>',
              `      <title>${xmlEscape(`${it.storyTitle} — ${it.title}`)}</title>`,
              `      <link>${link}</link>`,
              `      <guid isPermaLink="true">${link}</guid>`,
              `      <description>${xmlEscape(`Chapter ${it.chapterId} of ${it.storyTitle}${it.words ? ` · ${it.words} words` : ''}`)}</description>`,
              '    </item>',
            ].join('\n')
          })
          .join('\n')

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${xmlEscape(words.feed.title)}</title>
    <link>${origin}/words</link>
    <description>${xmlEscape(words.feed.description)}</description>
    <language>en</language>
${itemXml}
  </channel>
</rss>
`

        return new Response(xml, {
          headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=600',
          },
        })
      },
    },
  },
})
