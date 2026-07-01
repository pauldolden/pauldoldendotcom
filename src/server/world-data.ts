// ============================================================
// World data layer — R2 read/write for the normalised worldbuilding
// artifact, parallel to stories-data.ts (chapters). Trove worldbuilding
// files are parsed by the admin uploader (see trove-parse.buildWorld) into
// one object per story:
//
//   <storyId>/world.json   -> World (entities, relationships, entityTypes)
//
// This module only stores/loads that artifact; the reveal gate lives in
// world.ts (needs the request's progress cookie). Same R2 source-priority
// and "never read at module scope" rules as stories-data.ts.
// ============================================================
import type { World } from './trove-parse'

// Local copy of the STORIES-binding accessor (kept self-contained like
// access.ts, rather than reaching into stories-data internals).
async function getBucket(): Promise<any> {
  try {
    const mod: any = await import('cloudflare:workers')
    return mod?.env?.STORIES ?? null
  } catch {
    return null
  }
}

async function requireBucket(): Promise<any> {
  const bucket = await getBucket()
  if (!bucket) {
    throw new Error('R2 binding STORIES is required for writes (run on Workers or `vite dev`).')
  }
  return bucket
}

function trimBase(base: string) {
  return base.replace(/\/$/, '')
}

/** The full stored World (all reveals, ungated). Null when a story has none. */
export async function loadWorld(storyId: string): Promise<World | null> {
  const key = `${storyId}/world.json`

  const bucket = await getBucket()
  if (bucket) {
    try {
      const obj = await bucket.get(key)
      return obj ? (JSON.parse(await obj.text()) as World) : null
    } catch (err) {
      console.warn(`[world] R2 read failed for ${key}`, err)
      return null
    }
  }

  const base = process.env.STORIES_R2_BASE_URL
  if (base) {
    try {
      const res = await fetch(`${trimBase(base)}/${key}`)
      if (res.ok) return (await res.json()) as World
    } catch (err) {
      console.warn(`[world] R2 URL fetch failed for ${key}`, err)
    }
  }

  return null
}

export async function putWorld(world: World): Promise<void> {
  const bucket = await requireBucket()
  await bucket.put(`${world.storyId}/world.json`, JSON.stringify(world), {
    httpMetadata: { contentType: 'application/json; charset=utf-8' },
  })
}

export async function deleteWorld(storyId: string): Promise<void> {
  const bucket = await requireBucket()
  await bucket.delete(`${storyId}/world.json`)
}
