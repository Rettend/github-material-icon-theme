/* eslint-disable no-console */
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { bgCyan, black } from 'kolorist'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const r = (...args: string[]) => resolve(__dirname, '..', ...args)

export function log(name: string, message: string) {
  console.log(black(bgCyan(` ${name} `)), message)
}
