if (typeof browser === 'undefined') {
  // @ts-expect-error build time
  globalThis.browser = chrome
}

document.addEventListener('DOMContentLoaded', () => {
  const updateButton = document.getElementById('updateButton') as HTMLButtonElement
  const feedbackMessage = document.getElementById('feedbackMessage') as HTMLParagraphElement

  updateButton.addEventListener('click', async () => {
    updateButton.disabled = true
    feedbackMessage.textContent = 'Updating icons...'

    try {
      const response = await browser.runtime.sendMessage({ action: 'updateIcons' })
      if (response && response.success) {
        feedbackMessage.textContent = 'Icons updated!'
        feedbackMessage.style.color = 'green'
      }
      else {
        throw new Error('Update failed')
      }
    }
    catch (error: any) {
      feedbackMessage.textContent = error.message
      feedbackMessage.style.color = 'red'
    }
    finally {
      updateButton.disabled = false
    }
  })
})
