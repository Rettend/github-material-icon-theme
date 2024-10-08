import 'webextension-polyfill'

const BASE_URL = 'https://rettend.github.io/github-material-icon-theme/download'
const GET = (url: string) => fetch(`${BASE_URL}/${url}`)
const hours = (n: number) => n * 60 * 60 * 1000

if (typeof browser === 'undefined') {
  // @ts-expect-error build time
  globalThis.browser = chrome
}

async function checkForUpdates(): Promise<{ updated: boolean, version?: string }> {
  try {
    const response = await GET('version.txt')
    const latestVersion = await response.text()
    const { version: currentVersion } = await browser.storage.local.get('version')

    if (latestVersion !== currentVersion) {
      const [css, materialIcons, languageMap] = await Promise.all([
        GET('style.css').then(res => res.text()),
        GET('material-icons.json').then(res => res.json()),
        GET('language-map.json').then(res => res.json()),
      ])

      await browser.storage.local.set({
        version: latestVersion,
        css,
        materialIcons,
        languageMap,
      })

      return { updated: true, version: latestVersion }
    }

    return { updated: false }
  }
  catch (error) {
    console.error('Failed to check for updates:', error)
    throw error
  }
}

browser.runtime.onMessage.addListener((message, _sender, sendResponse: (response: any) => void) => {
  if (message.action === 'updateIcons') {
    checkForUpdates()
      .then((result) => {
        sendResponse({ success: true, ...result })
      })
      .catch(() => {
        sendResponse({ success: false })
      })
    return true // This is important!
  }
})

browser.runtime.onInstalled.addListener(() => checkForUpdates())
browser.runtime.onStartup.addListener(() => checkForUpdates())
setInterval(() => checkForUpdates(), hours(24))
