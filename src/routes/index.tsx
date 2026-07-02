import { createFileRoute } from '@tanstack/react-router'

import { split } from '../content/split'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [{ title: split.meta.title }],
  }),
  component: SplitFrontDoor,
})

const HALF_BASE =
  'pd-door-half relative flex flex-1 basis-1/2 items-center overflow-hidden no-underline ' +
  'bg-canvas [transition:flex-grow_var(--dur-slow)_var(--ease-out),filter_var(--dur)_var(--ease-out)] [will-change:flex-grow] ' +
  'max-[760px]:flex-none max-[760px]:min-h-[44vh] max-[760px]:py-[52px]'

const CONTENT_BASE =
  'pd-door-content relative z-[2] max-w-[520px] px-[clamp(28px,6vw,92px)] ' +
  '[transition:filter_var(--dur)_var(--ease-out)] max-[760px]:mx-auto max-[760px]:text-left'

function Half({ data, variant }: { data: (typeof split.halves)['code']; variant: 'code' | 'words' }) {
  const isWords = variant === 'words'

  const halfClass = isWords
    ? `${HALF_BASE} pd-door-words theme-ember`
    : `${HALF_BASE} pd-door-code`

  const contentClass = isWords
    ? `${CONTENT_BASE} ml-[clamp(20px,4vw,60px)] mr-auto`
    : `${CONTENT_BASE} mr-[clamp(20px,4vw,60px)] ml-auto text-right`

  // words half: matte grimoire button (rounded, soft glow); code half: angular neon "prism"
  const ctaClass = isWords
    ? 'cta inline-flex h-[50px] items-center gap-[9px] rounded-pill bg-accent px-[28px] font-sans text-[15px] font-bold tracking-[0.01em] text-on-neon shadow-glow-soft'
    : 'cta inline-flex h-[50px] flex-row-reverse items-center gap-[9px] rounded-none bg-accent px-[28px] font-heading text-[15px] font-bold uppercase tracking-[0.09em] text-on-neon [clip-path:polygon(11px_0,100%_0,100%_calc(100%-11px),calc(100%-11px)_100%,0_100%,0_11px)] [filter:drop-shadow(0_0_18px_rgba(255,46,151,0.55))]'

  return (
    <a className={halfClass} href={data.href}>
      {/* decorative background layer */}
      {isWords ? (
        <div className="absolute inset-0 bg-[radial-gradient(80%_90%_at_80%_30%,rgba(184,132,42,0.16),transparent_60%),radial-gradient(70%_80%_at_30%_80%,rgba(154,47,63,0.18),transparent_60%),radial-gradient(60%_70%_at_60%_60%,rgba(110,80,30,0.14),transparent_60%)]" />
      ) : (
        <div className="absolute inset-0 bg-[url('/assets/splash-bg.svg')] bg-cover bg-center opacity-50" />
      )}
      {/* legibility scrim — single-hue fade to the page base */}
      <div
        className={
          isWords
            ? 'absolute inset-0 bg-[linear-gradient(270deg,rgba(20,16,16,0.5)_0%,rgba(20,16,16,0.74)_55%,var(--bg-base)_100%)]'
            : 'absolute inset-0 bg-[linear-gradient(90deg,rgba(11,8,23,0.55)_0%,rgba(11,8,23,0.78)_55%,var(--bg-base)_100%)]'
        }
      />
      <div className={contentClass}>
        <div className="mb-[18px] font-code text-[13px] uppercase tracking-[0.22em] text-cyan-400">{data.eyebrow}</div>
        <h1
          className={`m-0 font-heading text-[clamp(48px,7vw,92px)] font-bold text-strong ${isWords ? 'leading-[1.04]' : 'leading-none'}`}
        >
          {data.titleLead}
          <span className="pd-grad-text">{data.titleAccent}</span>
        </h1>
        <p className="mb-[30px] mt-[18px] font-sans text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-muted">
          {data.line}{' '}
          <br />
          <b style={{ color: data.highlightColor }}>{data.highlight}</b>
          {data.lineEnd}
        </p>
        <span className={ctaClass}>{data.cta}</span>
      </div>
    </a>
  )
}

function SplitFrontDoor() {
  const { brand, halves } = split
  return (
    <div className="split-screen relative flex h-screen w-full max-[760px]:h-auto max-[760px]:min-h-screen max-[760px]:flex-col">
      <Half data={halves.code} variant="code" />

      {/* Between the halves in the DOM so it can flow as an in-flow divider
          chip on mobile; on desktop it's absolutely centred (order ignored). */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-[4] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[12px] text-center max-[760px]:static max-[760px]:w-full max-[760px]:translate-x-0 max-[760px]:translate-y-0 max-[760px]:flex-row max-[760px]:justify-center max-[760px]:py-[20px]">
        <img
          className="h-[60px] w-[60px] [filter:drop-shadow(0_6px_20px_rgba(0,0,0,0.6))] max-[760px]:h-[40px] max-[760px]:w-[40px]"
          src={brand.logo}
          alt=""
        />
        <div className="inline-flex items-baseline whitespace-nowrap rounded-pill border border-white/12 bg-[rgba(7,5,14,0.55)] px-[20px] py-[9px] backdrop-blur-[8px] max-[760px]:px-[16px] max-[760px]:py-[7px]">
          <span className="font-code text-[24px] font-medium tracking-[-0.01em] text-strong max-[760px]:text-[20px]">{brand.codeWord}</span>
          <span className="ml-px font-serif text-[30px] font-medium italic text-accent max-[760px]:text-[25px]">{brand.wordsWord}</span>
        </div>
        <div className="font-code text-[11px] uppercase tracking-[0.2em] text-white/55 max-[760px]:hidden">{brand.hint}</div>
      </div>

      <Half data={halves.words} variant="words" />
      <div className="absolute bottom-0 left-1/2 top-0 z-[3] w-px -translate-x-1/2 bg-[linear-gradient(180deg,transparent,rgba(255,46,151,0.5),transparent)] max-[760px]:hidden" />
    </div>
  )
}
