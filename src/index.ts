import { fileExtensions, fileNames } from 'material-icon-theme/dist/material-icons.json'
import { fileExtensions as languageFileExtensions } from './language-map.json'

function getIconClass(fileName: string | null | undefined) {
  fileName = fileName?.toLowerCase()

  const iconClass = fileNames[fileName as keyof typeof fileNames]
  if (iconClass)
    return `ICON_${iconClass}`

  let extension = fileName?.split('.').slice(1).join('.')
  const extensionIconClass = fileExtensions[extension as keyof typeof fileExtensions]
  if (extensionIconClass)
    return `ICON_${extensionIconClass}`

  extension = fileName?.split('.')?.pop()
  const languageIconClass = languageFileExtensions[extension as keyof typeof languageFileExtensions]
  if (languageIconClass)
    return `ICON_${languageIconClass}`

  return `ICON_file`
}

const processedMainFileNames: Set<Element> = new Set()
const processedTreeFileNames: Set<Element> = new Set()

type SvgFn = (element: Element) => SVGSVGElement | null | undefined

function processFileNames(fileNames: NodeListOf<Element>, processedFileNames: Set<Element>, svgFn: SvgFn) {
  fileNames.forEach((fileNameElement) => {
    if (processedFileNames.has(fileNameElement))
      return

    const fileName = fileNameElement.textContent
    const iconClass = getIconClass(fileName)

    const svgElement = svgFn(fileNameElement)
    if (iconClass)
      svgElement?.classList.add(iconClass)

    processedFileNames.add(fileNameElement)
  })
}

function callback() {
  const mainFileNames = document.querySelectorAll('.react-directory-truncate a')
  const mainSvgFn: SvgFn = element =>
    element.closest('div.react-directory-filename-column')
      ?.querySelector('svg')
  processFileNames(mainFileNames, processedMainFileNames, mainSvgFn)

  const treeFileNames = document.querySelectorAll('li.PRIVATE_TreeView-item')
  const treeSvgFn: SvgFn = element =>
    element.querySelector('div.PRIVATE_TreeView-item-container')
      ?.querySelector('div.PRIVATE_TreeView-item-content')
      ?.querySelector('div.PRIVATE_TreeView-item-visual')
      ?.querySelector('svg')
  processFileNames(treeFileNames, processedTreeFileNames, treeSvgFn)
}

const observer = new MutationObserver(callback)
observer.observe(document.body, { childList: true, subtree: true })
