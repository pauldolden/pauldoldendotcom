// Spoiler system — client-side blur-to-reveal, no reading-progress tracking.
// Content flagged `spoiler` in Trove renders blurred behind a lock until the
// reader unveils it — either one item at a time (click) or all at once via the
// global "show spoilers" toggle (persisted in localStorage, shared across every
// /words page through <SpoilerProvider> in the Shell).
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'

const KEY = 'words:showSpoilers'
const Ctx = createContext({ show: false, toggle: () => {} })

export function SpoilerProvider({ children }) {
  // Start hidden on both server and first client render (no hydration
  // mismatch); adopt the stored preference after mount.
  const [show, setShow] = useState(false)
  useEffect(() => {
    try {
      setShow(localStorage.getItem(KEY) === '1')
    } catch {
      /* private mode / no storage */
    }
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem(KEY, show ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [show])
  const toggle = () => setShow((s) => !s)
  return <Ctx.Provider value={{ show, toggle }}>{children}</Ctx.Provider>
}

export const useSpoilers = () => useContext(Ctx)

/**
 * Wraps spoiler content. When `active` and not (globally shown / locally
 * revealed), renders the children blurred with a lock overlay that reveals on
 * click. When not `active`, renders children untouched (no wrapper).
 */
export function Spoiler({ active, children, label = 'Spoiler', inline = false }) {
  const { show } = useSpoilers()
  const [revealed, setRevealed] = useState(false)
  // A global "hide spoilers" must also re-hide anything revealed one-at-a-time.
  useEffect(() => {
    if (!show) setRevealed(false)
  }, [show])
  if (!active) return children

  const hidden = !show && !revealed
  const Tag = inline ? 'span' : 'div'
  const flow = inline ? 'inline' : 'block'
  return (
    <Tag className={`relative ${inline ? 'inline-block' : 'block'}`}>
      <Tag
        aria-hidden={hidden || undefined}
        className={`${flow} [transition:filter_.25s_ease,opacity_.25s_ease] ${hidden ? 'pointer-events-none select-none opacity-55 blur-[7px]' : ''}`}
      >
        {children}
      </Tag>
      {hidden && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setRevealed(true)
          }}
          aria-label={`Reveal ${label.toLowerCase()}`}
          title="Reveal spoiler"
          className="absolute inset-0 flex cursor-pointer items-center justify-center gap-1.5 rounded-md border-none bg-[rgba(11,8,23,0.35)] font-code text-[11px] font-semibold uppercase tracking-[0.08em] text-accent"
        >
          <Lock size={13} /> {label}
        </button>
      )}
    </Tag>
  )
}

/** The global show/hide-spoilers pill. Render on pages that carry spoilers. */
export function SpoilerToggle() {
  const { show, toggle } = useSpoilers()
  return (
    <button
      type="button"
      onClick={toggle}
      title={show ? 'Hide spoilers' : 'Show spoilers'}
      className={`inline-flex h-9 cursor-pointer items-center gap-[7px] rounded-pill border px-[14px] font-sans text-[13px] font-semibold transition-control ${show ? 'border-accent bg-[rgba(122,31,61,0.16)] text-accent' : 'border-line bg-transparent text-muted'}`}
    >
      {show ? <Eye size={15} /> : <EyeOff size={15} />} {show ? 'Hide spoilers' : 'Show spoilers'}
    </button>
  )
}
