/* eslint-disable no-console */
import * as path from 'node:path'
import * as process from 'node:process'
import { exec } from 'node:child_process'
import { bgCyan, black } from 'kolorist'

const cwd = process.env.INIT_CWD || process.cwd()
export const r = (file: string) => path.join(cwd, file)

export function log(name: string, message: string) {
  console.log(black(bgCyan(` ${name} `)), message)
}

export function run(command: string) {
  return new Promise<void>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(error)
        reject(error)
        return
      }
      if (stderr) {
        console.error(stderr)
        reject(stderr)
        return
      }
      if (stdout)
        console.log(stdout)

      resolve()
    })
  })
}
