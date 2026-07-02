import { createFileRoute } from '@tanstack/react-router'

import { split } from '../content/split'
import splitCss from '../styles/split.css?url'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [{ title: split.meta.title }],
    links: [{ rel: 'stylesheet', href: splitCss }],
  }),
  component: SplitFrontDoor,
})

function Half({ data, variant }: { data: (typeof split.halves)['code']; variant: 'code' | 'words' }) {
  const className = variant === 'words' ? 'half words theme-ember' : 'half code'
  return (
    <a className={className} href={data.href}>
      <div className="bg" />
      <div className="scrim" />
      <div className="content">
        <div className="eyebrow">{data.eyebrow}</div>
        <h1 className="title">
          {data.titleLead}
          <span className="grad">{data.titleAccent}</span>
        </h1>
        <p className="line">
          {data.line}{' '}
          <br />
          <b style={{ color: data.highlightColor }}>{data.highlight}</b>
          {data.lineEnd}
        </p>
        <span className="cta">{data.cta}</span>
      </div>
    </a>
  )
}

function SplitFrontDoor() {
  const { brand, halves } = split
  return (
    <div className="split split-screen">
      <Half data={halves.code} variant="code" />

      {/* Between the halves in the DOM so it can flow as an in-flow divider
          chip on mobile; on desktop it's absolutely centred (order ignored). */}
      <div className="brand">
        <img src={brand.logo} alt="" />
        <div className="name">
          <span className="b-code">{brand.codeWord}</span>
          <span className="b-words">{brand.wordsWord}</span>
        </div>
        <div className="hint">{brand.hint}</div>
      </div>

      <Half data={halves.words} variant="words" />
      <div className="divider" />
    </div>
  )
}
