import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  outDir: 'extension/dist',
  externals: [
    'fs-extra',
    'kolorist',
    'universalify',
    'graceful-fs',
    'jsonfile',
    'jsonfile/utils',
    'glob',
    '@iconify/utils',
    'debug',
    'ms',
    'has-flag',
  ],
})
