// WorldIcon + EntityAvatar — icons for Trove entities. Trove stores an
// arbitrary Lucide icon name per entity/type; the DS <Icon/> only maps a fixed
// set, so this keeps a curated worldbuilding map (named imports → tree-shaken)
// and falls back to an initials monogram so an entity always looks intentional.
import React from 'react'
import {
  User, Users, Crown, Sword, Swords, Shield, Castle, Home, Landmark, MapPin,
  Map as MapIcon, Mountain, Trees, Waves, Ship, Scroll, BookOpen, Feather, Flag,
  Skull, Ghost, Gem, Key, Flame, Star, Heart, Eye, Moon, Sun, Sparkles, Coins,
  Anchor, Compass, Bird, Cat, Dog, Building2, Wand2, Zap, Leaf, Bug, Church,
  Hammer, Wine, Utensils, Music, Scale, Gavel, Tent,
} from 'lucide-react'

const MAP = {
  user: User, person: User, users: Users, people: Users, family: Users,
  crown: Crown, king: Crown, queen: Crown, royal: Crown,
  sword: Sword, swords: Swords, blade: Sword, shield: Shield, guard: Shield,
  castle: Castle, fortress: Castle, keep: Castle, home: Home, house: Home,
  landmark: Landmark, monument: Landmark, 'map-pin': MapPin, location: MapPin,
  map: MapIcon, mountain: Mountain, peak: Mountain, trees: Trees, tree: Trees,
  forest: Trees, waves: Waves, sea: Waves, river: Waves, ship: Ship, boat: Ship,
  scroll: Scroll, book: BookOpen, 'book-open': BookOpen, tome: BookOpen,
  feather: Feather, quill: Feather, flag: Flag, banner: Flag, faction: Flag,
  skull: Skull, death: Skull, ghost: Ghost, spirit: Ghost, gem: Gem, jewel: Gem,
  key: Key, flame: Flame, fire: Flame, star: Star, heart: Heart, eye: Eye,
  moon: Moon, sun: Sun, sparkles: Sparkles, magic: Sparkles, coins: Coins,
  gold: Coins, money: Coins, anchor: Anchor, compass: Compass, bird: Bird,
  cat: Cat, dog: Dog, wolf: Dog, building: Building2, tower: Building2,
  wand: Wand2, staff: Wand2, zap: Zap, lightning: Zap, leaf: Leaf, herb: Leaf,
  bug: Bug, church: Church, temple: Church, chapel: Church, hammer: Hammer,
  smith: Hammer, wine: Wine, tavern: Wine, inn: Wine, food: Utensils,
  music: Music, bard: Music, scale: Scale, law: Scale, gavel: Gavel,
  court: Gavel, tent: Tent, camp: Tent,
}

/** Returns the Lucide component for a Trove icon name, or null if unmapped. */
export function worldIconFor(name) {
  return MAP[String(name || '').toLowerCase()] ?? null
}

export function WorldIcon({ name, size = 18, color = 'currentColor', strokeWidth = 1.75 }) {
  const C = worldIconFor(name)
  if (!C) return null
  return (
    <span style={{ display: 'inline-flex', lineHeight: 0 }}>
      <C size={size} color={color} strokeWidth={strokeWidth} />
    </span>
  )
}

export function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

/**
 * Entity avatar: the Trove avatar image when present, else the mapped icon,
 * else an initials monogram. `radius` lets callers make it a circle (people)
 * or a rounded square (places/factions).
 */
export function EntityAvatar({ entity, size = 56, radius = 'var(--r-md)' }) {
  const dim = { width: size, height: size, flex: `0 0 ${size}px` }
  if (entity?.avatar) {
    return (
      <img
        src={entity.avatar}
        alt=""
        style={{ ...dim, objectFit: 'cover', borderRadius: radius, border: '1px solid var(--border)' }}
      />
    )
  }
  const C = worldIconFor(entity?.icon)
  return (
    <div
      style={{
        ...dim,
        borderRadius: radius,
        display: 'grid',
        placeItems: 'center',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
      }}
    >
      {C ? (
        <C size={Math.round(size * 0.46)} color="var(--accent)" strokeWidth={1.6} />
      ) : (
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: Math.round(size * 0.36),
            color: 'var(--accent)',
            lineHeight: 1,
          }}
        >
          {initials(entity?.name)}
        </span>
      )}
    </div>
  )
}
