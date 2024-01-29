import process from 'node:process'
import fs from 'fs-extra'
import { log, r } from '../utils/utils'
import { getManifest } from './manifest'
import { generateCSS } from './css'

log('PRE', 'write manifest.json')
const isFirefox = process.env.FIREFOX === 'true'
fs.writeJSON(r('extension/manifest.json'), getManifest(isFirefox), { spaces: 2 })

log('PRE', 'generate css')
generateCSS(r('extension/style.css'))
