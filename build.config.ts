import fs from 'node:fs'
import { defineBuildConfig } from 'unbuild'
import { log, r } from './utils/utils'

export default defineBuildConfig([{
  hooks: {
    'build:before': async () => {
      const proc = Bun.spawn(['bun', 'pre'])
      const text = await new Response(proc.stdout).text()
      log(text)
    },
  },
  entries: [
    'src/background.ts',
    { input: 'extension/' },
  ],
  rollup: {
    inlineDependencies: true,
  },
}, {
  entries: [
    'src/content.ts',
  ],
  replace: {
    'import.meta.vitest': 'undefined',
  },
}, {
  hooks: {
    'build:done': () => {
      fs.readdirSync(r('dist')).forEach((file) => {
        if (file.endsWith('.mjs'))
          fs.renameSync(r('dist', file), r('dist', file.replace('.mjs', '.js')))
      })

      fs.copyFileSync(r('node_modules/webextension-polyfill/dist/browser-polyfill.js'), r('dist/browser-polyfill.js'))
    },
  },
  entries: [
    'src/popup.ts',
  ],
}])
