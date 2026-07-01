// ============================================================
// Public worldbuilding server functions over the R2 world artifact
// (see ./world-data). Spoilers are NOT stripped here — they carry a `spoiler`
// flag and are unveiled client-side by the reader's "show spoilers" toggle
// (blur-to-reveal). So these reads return the full world; the UI decides what
// to obscure.
// ============================================================
import { createServerFn } from '@tanstack/react-start'

import { loadWorld } from './world-data'
import { PREDICATES } from './trove-parse'

/** Whole world for a story (cast grid + relationship graph). Null when none. */
export const getWorld = createServerFn()
  .validator((d: { storyId: string }) => ({ storyId: String(d.storyId) }))
  .handler(async ({ data }) => {
    return await loadWorld(data.storyId)
  })

/**
 * One entity's profile view: the entity, plus its relationships with the
 * "other" endpoint resolved for display (name/type/icon/avatar), read from the
 * entity's POV so inverse predicates read correctly. Null when unknown.
 */
export const getEntity = createServerFn()
  .validator((d: { storyId: string; slug: string }) => ({
    storyId: String(d.storyId),
    slug: String(d.slug),
  }))
  .handler(async ({ data }) => {
    const world = await loadWorld(data.storyId)
    if (!world) return null
    const entity = world.entities.find((e) => e.slug === data.slug)
    if (!entity) return null

    const bySlug = new Map(world.entities.map((e) => [e.slug, e]))
    const links = world.relationships
      .filter((r) => r.from === entity.slug || r.to === entity.slug)
      .map((r) => {
        const outgoing = r.from === entity.slug
        const otherSlug = outgoing ? r.to : r.from
        const other = bySlug.get(otherSlug)
        return {
          predicate: outgoing ? r.predicate : r.inverse,
          label: outgoing ? r.label : PREDICATES[r.inverse]?.label ?? r.inverse.replace(/_/g, ' '),
          category: r.category,
          intensity: r.intensity,
          note: r.note,
          spoiler: r.spoiler,
          otherSlug,
          otherName: outgoing ? r.toName : r.fromName,
          otherType: other?.type ?? '',
          otherIcon: other?.icon ?? '',
          otherAvatar: other?.avatar ?? '',
        }
      })

    return { entity, links, entityTypes: world.entityTypes }
  })
