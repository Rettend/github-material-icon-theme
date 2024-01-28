import { defineBuildConfig } from 'unbuild'
import { run } from './utils/utils'

export default defineBuildConfig({
  hooks: {
    'build:before': async () => {
      await run('pnpm run pre')
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
