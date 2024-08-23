import browser from 'webextension-polyfill'
import { GET, hours } from '../utils/utils'

async function checkForUpdates() {
  try {
    const response = await GET('/version.txt')
    const latestVersion = await response.text()
    const currentVersion = await browser.storage.local.get('version')
    console.log('currentVersion', currentVersion)
    console.log('latestVersion', latestVersion)

    if (latestVersion !== currentVersion.version) {
      const [css, materialIcons, languageMap] = await Promise.all([
        GET('/style.css').then(res => res.text()),
        GET('/material-icons.json').then(res => res.json()),
        GET('/language-map.json').then(res => res.json()),
      ])

      await browser.storage.local.set({
        version: latestVersion,
        css,
        materialIcons,
        languageMap,
      })

      browser.tabs.query({}).then((tabs) => {
        tabs.forEach((tab) => {
          if (tab.id)
            browser.tabs.sendMessage(tab.id, { action: 'updateIcons' })
        })
      })
    }
  }
  catch (error) {
    console.error('Failed to check for updates:', error)
  }
}

browser.runtime.onStartup.addListener(checkForUpdates)
setInterval(checkForUpdates, hours(24))
