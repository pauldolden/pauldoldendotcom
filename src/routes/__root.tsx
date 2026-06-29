import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import dsCss from '../styles/design-system.css?url'
import themeOverridesCss from '../styles/theme-overrides.css?url'
import appCss from '../styles.css?url'
import responsiveCss from '../styles/responsive.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Paul Dolden',
      },
    ],
    links: [
      // Design-system tokens (the synthwave/grimoire palette + fonts), then the
      // starter Tailwind sheet (preflight + body utilities).
      {
        rel: 'stylesheet',
        href: dsCss,
      },
      // Local-only carve-out: keeps the button/badge restyle on the code side
      // (reverts chamfer + neon glow under .theme-ember). Must load after dsCss.
      {
        rel: 'stylesheet',
        href: themeOverridesCss,
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'stylesheet',
        href: responsiveCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="pd-root antialiased [overflow-wrap:anywhere]">
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
