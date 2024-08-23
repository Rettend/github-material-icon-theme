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
generateCSS(r('extension/style.css'))

log('PRE', 'write version.txt')
fs.writeFileSync(r('extension/version.txt'), devDependencies['material-icon-theme'])
