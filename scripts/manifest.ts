import type { Manifest } from 'webextension-polyfill'
import pkg from '../package.json' assert { type: 'json' }

const urls = [
  'https://github.com/*',
]

export function getManifest(): Manifest.WebExtensionManifest {
  return {
    manifest_version: 3,
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    action: {
      default_icon: './logo.png',
    },
    icons: {
      16: './logo.png',
      48: './logo.png',
      128: './logo.png',
    },
    permissions: [],
    content_scripts: [
      {
        matches: urls,
        js: ['index.mjs'],
        css: ['style.css'],
      },
    ],
    web_accessible_resources: [
      {
        resources: ['style.css'],
        matches: urls,
      },
    ],
    content_security_policy: {
      extension_pages: 'script-src \'self\'; object-src \'self\'',
    },
  }
}
