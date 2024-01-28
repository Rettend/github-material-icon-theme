import fs from 'fs-extra'
import { log, r } from '../utils/utils'
import { getManifest } from './manifest'
import { generateCSS } from './css'

log('PRE', 'write manifest.json')
fs.writeJSON(r('extension/manifest.json'), getManifest(), { spaces: 2 })

log('PRE', 'generate css')
generateCSS(r('extension/style.css'))
