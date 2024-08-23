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
      fs.renameSync(r('dist/index.mjs'), r('dist/index.js'))
    },
  },
  entries: [
    'src/background.ts',
    'src/content.ts',
    { input: 'extension/' },
  ],
  rollup: {
    inlineDependencies: true,
  },
  replace: {
    'import.meta.vitest': 'undefined',
  },
})
