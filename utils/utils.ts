/* eslint-disable no-console */
import path from 'node:path'
import process from 'node:process'
import { bgCyan, black } from 'kolorist'

const cwd = process.env.INIT_CWD || process.cwd()
export const r = (file: string) => path.join(cwd, file)

export const logs = [
  'PRE',
  'POST',
  'BUILD',
] as const

export type Log = typeof logs[number]

export function log(name: Log, ...messages: string[]): void
export function log(name: string): void
export function log(name: string, ...messages: string[]): void {
  if (messages.length)
    console.log(black(bgCyan(` ${name} `)), ...messages)
  else
    console.log(name)
}
