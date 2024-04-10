import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    includeSource: ['src/**/*.{js,ts}'],
  },
})
