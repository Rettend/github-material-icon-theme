import { writeManifest } from './manifest'
import { downloadAllIcons } from './icons'

const repoUrl = 'https://github.com/PKief/vscode-material-icon-theme.git'
const iconsFolder = 'icons'

writeManifest()
downloadAllIcons(repoUrl, iconsFolder)
