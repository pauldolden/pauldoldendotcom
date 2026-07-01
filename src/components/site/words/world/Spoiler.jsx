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
  if (!active) return children

  const hidden = !show && !revealed
  const Tag = inline ? 'span' : 'div'
  return (
    <Tag style={{ position: 'relative', display: inline ? 'inline-block' : 'block', height: inline ? undefined : '100%' }}>
      <Tag
        aria-hidden={hidden || undefined}
        style={
          hidden
            ? { filter: 'blur(7px)', userSelect: 'none', pointerEvents: 'none', opacity: 0.55, transition: 'filter .25s ease, opacity .25s ease', display: inline ? 'inline' : 'block' }
            : { transition: 'filter .25s ease, opacity .25s ease', display: inline ? 'inline' : 'block' }
        }
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
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: 'rgba(11,8,23,0.35)',
            border: 'none',
            borderRadius: 'var(--r-md)',
            cursor: 'pointer',
            color: 'var(--accent)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
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
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 36,
        padding: '0 14px',
        borderRadius: 'var(--r-pill)',
        border: `1px solid ${show ? 'var(--accent)' : 'var(--border)'}`,
        background: show ? 'rgba(122,31,61,0.16)' : 'transparent',
        color: show ? 'var(--accent)' : 'var(--text-muted)',
        fontFamily: 'var(--font-ui)',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'var(--t-control)',
      }}
    >
      {show ? <Eye size={15} /> : <EyeOff size={15} />} {show ? 'Hide spoilers' : 'Show spoilers'}
    </button>
  )
}
