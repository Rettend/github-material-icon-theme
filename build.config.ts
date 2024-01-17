import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'index',
  ],
  outDir: 'extension/dist',
  externals: [
    'fs-extra',
    'kolorist',
    'universalify',
    'graceful-fs',
    'jsonfile',
    'jsonfile/utils',
  ],
})
