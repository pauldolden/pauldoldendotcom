import { defineConfig } from 'vitest/config'

// Separate from vite.config.ts on purpose: the Cloudflare plugin used for the
// Workers build is incompatible with Vitest's env. Unit tests run in plain Node.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
