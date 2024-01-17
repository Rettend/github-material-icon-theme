import fs, { promises as fsp } from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'
import git from 'simple-git'
import ncp from 'ncp'
import { log, r } from './utils'

const localPath = r('icons')
const tempPath = r('.temp')

const copy = promisify(ncp)
const remove = async (path: string) => await fsp.rm(path, { recursive: true, force: true })

export async function cloneAndCopyIcons(url: string, iconsFolder: string): Promise<void> {
  log('PRE', 'clone repo with icons')
  const gitInstance = git()
  await gitInstance.clone(url, tempPath)

  log('PRE', 'clean up unnecessary files')
  if (fs.existsSync(localPath))
    await remove(localPath)

  await copy(path.join(tempPath, iconsFolder), localPath)
  await remove(tempPath)
}
