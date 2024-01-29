import type { Manifest } from 'webextension-polyfill'
import pkg from '../package.json' assert { type: 'json' }

const urls = [
  'https://github.com/*',
]
export function getManifest(isFirefox: boolean): Manifest.WebExtensionManifest {
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: isFirefox ? 2 : 3,
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
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
  }

  if (isFirefox) {
    manifest.browser_action = {
      default_icon: './logo.png',
    }
    manifest.browser_specific_settings = {
      gecko: {
        id: 'github@materialicontheme.com',
        strict_min_version: '48.0',
      },
    }
  }
  else {
    manifest.action = {
      default_icon: './logo.png',
    }
    manifest.content_security_policy = {
      extension_pages: 'script-src \'self\'; object-src \'self\'',
    }
    manifest.web_accessible_resources = [
      {
        resources: ['style.css'],
        matches: urls,
      },
    ]
  }

  return manifest
}
