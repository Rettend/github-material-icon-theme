import process from 'node:process'
import fs from 'fs-extra'
import { log, r } from '../utils/utils'
import { devDependencies } from '../package.json' assert { type: 'json' }
import { getManifest } from './manifest'
import { generateCSS } from './css'

const skipManifest = process.env.SKIP_MANIFEST === 'true'
if (!skipManifest) {
  log('PRE', 'write manifest.json')
  const isFirefox = process.env.FIREFOX === 'true'
  fs.writeJSON(r('extension/manifest.json'), getManifest(isFirefox), { spaces: 2 })
}

log('PRE', 'generate css')
generateCSS(r('download/style.css'))

log('PRE', 'write version.txt')
fs.writeFileSync(r('download/version.txt'), devDependencies['material-icon-theme'])

log('PRE', 'copy material-icons.json')
fs.copyFileSync(r('node_modules/material-icon-theme/dist/material-icons.json'), r('download/material-icons.json'))
