if (typeof browser === 'undefined') {
  // @ts-expect-error build time
  globalThis.browser = chrome
}

document.addEventListener('DOMContentLoaded', async () => {
  const updateButton = document.getElementById('updateButton') as HTMLButtonElement
  const feedbackMessage = document.getElementById('feedbackMessage') as HTMLParagraphElement
  const versionNumber = document.getElementById('versionNumber') as HTMLDivElement

  // Display current version
  const { version } = await browser.storage.local.get('version')
  versionNumber.textContent = `v${version || 'N/A'}`

  updateButton.addEventListener('click', async () => {
    updateButton.disabled = true
    feedbackMessage.textContent = 'Checking for updates...'

    try {
      const response = await browser.runtime.sendMessage({ action: 'updateIcons' })
      if (response.success) {
        if (response.updated) {
          feedbackMessage.textContent = `Updated to version ${response.version}!`
          versionNumber.textContent = `v${response.version}`
        }
        else {
          feedbackMessage.textContent = 'Already up to date.'
        }
        feedbackMessage.style.color = 'green'
      }
      else {
        throw new Error('Update failed')
      }
    }
    catch (error: any) {
      feedbackMessage.textContent = `Error: ${error.message}`
      feedbackMessage.style.color = 'red'
    }
    finally {
      updateButton.disabled = false
    }
  })
})
