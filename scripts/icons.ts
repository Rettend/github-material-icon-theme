import { promises as fs } from 'node:fs'
import path from 'node:path'
import git from 'simple-git'
import { log, r } from './utils'

const localPath = r('icons')

async function retainIcons(iconsFolder: string): Promise<void> {
  const icons = await fs.readdir(localPath)

  await Promise.all(icons.map(async (icon) => {
    if (icon !== iconsFolder)
      await fs.rm(path.join(localPath, icon), { recursive: true, force: true })
  }))
}

export async function downloadAllIcons(url: string, iconsFolder: string): Promise<void> {
  const gitInstance = git()
  log('PRE', 'clone repo with icons')
  await gitInstance.clone(url, localPath)
  log('PRE', 'clean up unnecessary files')
  await retainIcons(iconsFolder)
}
