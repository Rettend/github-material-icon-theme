import { fileExtensions, fileNames, folderNames, folderNamesExpanded, light } from 'material-icon-theme/dist/material-icons.json'
import { fileExtensions as languageFileExtensions } from './language-map.json'

const isLightMode = document.documentElement.getAttribute('data-color-mode') === 'light'

interface LookupPair { key: string, lookup: Record<string, string> | undefined }

function getIconClass(pairs: LookupPair[]) {
  for (const pair of pairs) {
    if (pair.lookup) {
      const iconClass = pair.lookup[pair.key]
      if (iconClass)
        return `ICON_${iconClass}`
    }
  }
}

function getFileClass(fileName: string | undefined) {
  if (!fileName)
    return

  fileName = fileName.toLowerCase()
  const longExtension = fileName.split('.').slice(1).join('.')
  const shortExtension = fileName.split('.').pop() || ''

  const pairs: LookupPair[] = [
    { key: fileName, lookup: isLightMode ? light.fileNames : undefined },
    { key: fileName, lookup: fileNames },
    { key: longExtension, lookup: isLightMode ? light.fileExtensions : undefined },
    { key: longExtension, lookup: fileExtensions },
    { key: shortExtension, lookup: fileExtensions },
    { key: shortExtension, lookup: languageFileExtensions },
  ]

  return getIconClass(pairs)
}

function getFolderClass(fileName: string | undefined, isOpen: boolean) {
  if (!fileName)
    return

  fileName = fileName.toLowerCase()

  const folderMap = isOpen ? folderNamesExpanded : folderNames
  const lightFolderMap = isOpen ? light.folderNamesExpanded : light.folderNames

  const pairs: LookupPair[] = [
    { key: fileName, lookup: isLightMode ? lightFolderMap : undefined },
    { key: fileName, lookup: folderMap },
  ]

  return getIconClass(pairs)
}

const processedMainFileNames: Set<Element> = new Set()
const processedTreeFileNames: Set<Element> = new Set()
const processedTreeFolders: Map<Element, boolean> = new Map()

type SvgFn = (element: Element) => SVGSVGElement | null | undefined

// also processes main-view folders (as they cannot be opened)
function processFileNames(fileNames: NodeListOf<Element>, processedFileNames: Set<Element>, svgFn: SvgFn, processedTreeFolders?: Map<Element, boolean>) {
  fileNames.forEach((fileNameElement) => {
    if (processedTreeFolders?.has(fileNameElement) || processedFileNames.has(fileNameElement))
      return

    let iconClass: string | undefined

    const fileName = fileNameElement.textContent ?? undefined
    const svgElement = svgFn(fileNameElement)
    const isSubmodule = fileNameElement?.hasAttribute('style')

    if (isSubmodule)
      iconClass = 'ICON_folder'
    else if (svgElement?.classList.contains('icon-directory'))
      iconClass = getFolderClass(fileName, false) || 'ICON_folder'
    else
      iconClass = getFileClass(fileName) || 'ICON_file'

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

    const folderName = folderNameElement.textContent ?? undefined
    const iconClass = getFolderClass(folderName, isOpen) || (isOpen ? 'ICON_folder-open' : 'ICON_folder')

    if (iconClass)
      svgElement?.classList.add(iconClass)

    processedFolderNames.set(folderNameElement, isOpen)
  })
}

function processExtraIcons() {
  const extraFolderIcon = document.querySelector('#folder-row-0 svg')
  if (extraFolderIcon && !processedMainFileNames.has(extraFolderIcon)) {
    extraFolderIcon.classList.add('ICON_folder')
    processedMainFileNames.add(extraFolderIcon)
  }
}

function callback() {
  processExtraIcons()

  // main-view files and folders are technically the same
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
