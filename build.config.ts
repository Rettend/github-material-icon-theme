import fs from 'node:fs'
import { defineBuildConfig } from 'unbuild'
import { log, r } from './utils/utils'

export default defineBuildConfig({
  hooks: {
    'build:before': async () => {
      const proc = Bun.spawn(['bun', 'pre'])
      const text = await new Response(proc.stdout).text()
      log(text)
    },
    'build:done': () => {
      fs.renameSync(r('dist/background.mjs'), r('dist/background.js'))
      fs.renameSync(r('dist/content.mjs'), r('dist/content.js'))
    },
  },
  entries: [
    'src/background.ts',
    'src/content.ts',
  ],
  rollup: {
    inlineDependencies: true,
  },
  replace: {
    'import.meta.vitest': 'undefined',
  },
})
