import { fileExtensions, fileNames, folderNames, folderNamesExpanded } from 'material-icon-theme/dist/material-icons.json'
import { fileExtensions as languageFileExtensions } from './language-map.json'

function getFileClass(fileName: string | null | undefined) {
  fileName = fileName?.toLowerCase()

  const iconClass = fileNames[fileName as keyof typeof fileNames]
  if (iconClass)
    return `ICON_${iconClass}`

  let extension = fileName?.split('.').slice(1).join('.')
  const extensionIconClass = fileExtensions[extension as keyof typeof fileExtensions]
  if (extensionIconClass)
    return `ICON_${extensionIconClass}`

  extension = fileName?.split('.')?.pop()
  let languageIconClass = languageFileExtensions[extension as keyof typeof languageFileExtensions]
  if (languageIconClass)
    return `ICON_${languageIconClass}`

  languageIconClass = fileExtensions[extension as keyof typeof fileExtensions]
  if (languageIconClass)
    return `ICON_${languageIconClass}`

  return `default`
}

function getFolderClass(fileName: string | null | undefined, isOpen: boolean) {
  fileName = fileName?.toLowerCase()

  const folderMap = isOpen ? folderNamesExpanded : folderNames
  const iconClass = folderMap[fileName as keyof typeof folderMap]
  if (iconClass)
    return `ICON_${iconClass}`

  return `default`
}

const processedMainFileNames: Set<Element> = new Set()
const processedTreeFileNames: Set<Element> = new Set()
const processedTreeFolders: Map<Element, boolean> = new Map()

type SvgFn = (element: Element) => SVGSVGElement | null | undefined

function processFileNames(fileNames: NodeListOf<Element>, processedFileNames: Set<Element>, svgFn: SvgFn, processedTreeFolders?: Map<Element, boolean>) {
  fileNames.forEach((fileNameElement) => {
    if (processedTreeFolders?.has(fileNameElement) || processedFileNames.has(fileNameElement))
      return

    const fileName = fileNameElement.textContent
    const svgElement = svgFn(fileNameElement)
    let iconClass: string | undefined

    if (svgElement?.classList.contains('icon-directory'))
      iconClass = getFolderClass(fileName, false)
    else
      iconClass = getFileClass(fileName)

    if (iconClass)
      svgElement?.classList.add(iconClass)

    processedFileNames.add(fileNameElement)
  })
}

function processFolderNames(folderNames: NodeListOf<Element>, processedFolderNames: Map<Element, boolean>, svgFn: SvgFn) {
  folderNames.forEach((folderNameElement) => {
    const svgElement = svgFn(folderNameElement)
    const isOpen = svgElement?.classList.contains('octicon-file-directory-open-fill')

    if (isOpen === undefined)
      return

    if (processedFolderNames.has(folderNameElement) && isOpen === processedFolderNames.get(folderNameElement))
      return

    const folderName = folderNameElement.textContent
    const iconClass = getFolderClass(folderName, isOpen)

    if (iconClass)
      svgElement?.classList.add(iconClass)

    processedFolderNames.set(folderNameElement, isOpen)
  })
}

function callback() {
  const mainFileNames = document.querySelectorAll('div.react-directory-truncate a')
  const mainSvgFn: SvgFn = element =>
    element.closest('div.react-directory-filename-column')
      ?.querySelector('svg')
  processFileNames(mainFileNames, processedMainFileNames, mainSvgFn)

  const treeFolderNames = document.querySelectorAll('span.PRIVATE_TreeView-item-content-text span')
  const treeFolderSvgFn: SvgFn = element =>
    element.closest('div.PRIVATE_TreeView-item-content')
      ?.querySelector('div.PRIVATE_TreeView-directory-icon')
      ?.querySelector('svg')
  processFolderNames(treeFolderNames, processedTreeFolders, treeFolderSvgFn)

  const treeFileNames = document.querySelectorAll('span.PRIVATE_TreeView-item-content-text span')
  const treeSvgFn: SvgFn = element =>
    element.closest('div.PRIVATE_TreeView-item-content')
      ?.querySelector('div.PRIVATE_TreeView-item-visual')
      ?.querySelector('svg')
  processFileNames(treeFileNames, processedTreeFileNames, treeSvgFn, processedTreeFolders)
}

const observer = new MutationObserver(callback)
observer.observe(document.body, { childList: true, subtree: true })
