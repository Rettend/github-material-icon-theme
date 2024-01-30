import fs from 'node:fs'
import { defineBuildConfig } from 'unbuild'
import { r, run } from './utils/utils'

export default defineBuildConfig({
  hooks: {
    'build:before': async () => {
      await run('pnpm run pre')
    },
    'build:done': () => {
      fs.renameSync(r('dist/index.mjs'), r('dist/index.js'))
    },
  },
  entries: [
    'src/index.ts',
    { input: 'extension/' },
  ],
  rollup: {
    inlineDependencies: true,
  },
})
