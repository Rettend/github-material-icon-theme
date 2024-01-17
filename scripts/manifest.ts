import type { Manifest } from 'webextension-polyfill'
import fs from 'fs-extra'
import pkg from '../package.json' assert { type: 'json' }
import { log, r } from './utils'

export const urls = [
  'https://github.com/*',
]

function getManifest(): Manifest.WebExtensionManifest {
  return {
    manifest_version: 3,
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    action: {
      default_icon: './assets/icon-512.png',
    },
    background: {
      service_worker: './dist/index.js',
    },
    icons: {
      16: './assets/icon-512.png',
      48: './assets/icon-512.png',
      128: './assets/icon-512.png',
    },
    permissions: [],
    content_scripts: [
      {
        matches: urls,
        js: [
          'dist/index.js',
        ],
      },
    ],
    web_accessible_resources: [
      {
        resources: ['dist/style.css'],
        matches: urls,
      },
    ],
    content_security_policy: {
      extension_pages: 'script-src \'self\'; object-src \'self\'',
    },
  }
}

export async function writeManifest() {
  await fs.writeJSON(r('extension/manifest.json'), getManifest(), { spaces: 2 })
  log('PRE', 'write manifest.json')
}
