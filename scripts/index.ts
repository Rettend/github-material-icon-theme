import { writeManifest } from './manifest'
import { cloneAndCopyIcons } from './icons'

const repoUrl = 'https://github.com/PKief/vscode-material-icon-theme.git'
const iconsFolder = 'icons'

writeManifest()
cloneAndCopyIcons(repoUrl, iconsFolder)
