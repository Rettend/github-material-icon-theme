/* eslint-disable no-console */
// from: https://github.com/Claudiohbsantos/github-material-icons-extension/blob/master/scripts/build-languages.js

import path from 'node:path'
import process from 'node:process'
import fetch from 'node-fetch'
import fs from 'fs-extra'
import { Octokit } from '@octokit/core'
import stringify from 'json-stable-stringify'
import iconMap from 'material-icon-theme/dist/material-icons.json'
import { r } from '../utils/utils'

const vsDataPath = r('data')
const outputPath = r('download')

let index = 0
let total
const items = []
const contributions = []
const languages = []

const resultsPerPage = 100
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})
const query = {
  page: 0,
  per_page: resultsPerPage,
  q: 'contributes languages filename:package.json repo:microsoft/vscode',
}
const GITHUB_RATELIMIT = 6000

const languageMap = {
  fileExtensions: {},
  fileNames: {},
}

async function main() {
  try {
    await fs.remove(vsDataPath)
    await fs.ensureDir(vsDataPath)
    await fs.remove(path.resolve(outputPath, 'language-map.json'))

    console.log('[1/7] Querying Github API for official VSC language contributions.')
    await queryLanguageContributions()
  }
  catch (error) {
    console.error('An error occurred:', error)
    process.exit(1)
  }
}

async function queryLanguageContributions() {
  try {
    const res = await octokit.request('GET /search/code', query)
    if (!res.data)
      throw new Error('Couldn\'t fetch Microsoft language contributions from Github.')
    query.page = index
    index += 1
    if (!total)
      total = res.data.total_count
    items.push(...res.data.items)
    if (resultsPerPage * index >= total) {
      console.log('[2/7] Fetching Microsoft language contributions from Github.')
      index = 0
      total = items.length
      for (const item of items) {
        await fetchLanguageContribution(item)
      }
      await processLanguageContributions()
    }
    else {
      setTimeout(queryLanguageContributions, GITHUB_RATELIMIT)
    }
  }
  catch (error) {
    console.error('Error in queryLanguageContributions:', error)
    throw error
  }
}

async function fetchLanguageContribution(item) {
  try {
    const rawUrl = item.html_url.replace('/blob/', '/raw/')
    const resPath = item.path.replace(/[^/]+$/, 'extension.json')
    const extPath = path.join(vsDataPath, resPath)
    let extManifest = await fetch(rawUrl)
    extManifest = await extManifest.text()
    await fs.ensureDir(path.dirname(extPath))
    await fs.writeFile(extPath, extManifest, 'utf-8')
    items[index] = [extPath, extManifest]
    index += 1
  }
  catch (error) {
    console.error('Error in fetchLanguageContribution:', error)
    throw error
  }
}

async function processLanguageContributions() {
  try {
    console.log('[3/7] Loading VSC language contributions into Node.')
    index = 0
    for (const item of items) {
      loadLanguageContribution(item)
    }
    console.log('[4/7] Processing language contributions for VSC File Icon API compatibility.')
    index = 0
    total = contributions.length
    for (const contribution of contributions) {
      processLanguageContribution(contribution)
    }
    console.log('[5/7] Mapping language contributions into file icon configuration.')
    index = 0
    total = languages.length
    for (const lang of languages) {
      mapLanguageContribution(lang)
    }
    await generateLanguageMap()
  }
  catch (error) {
    console.error('Error in processLanguageContributions:', error)
    throw error
  }
}

function loadLanguageContribution([extPath, extManifest]) {
  try {
    const data = JSON.parse(extManifest.replace(/#\w[\dA-Z]*_\w+#/gi, '0'))
    if (!data.contributes || !data.contributes.languages) {
      total -= 1
      return
    }
    contributions.push(...data.contributes.languages)
    index += 1
  }
  catch (error) {
    console.error(`Error parsing ${extPath}:`, error)
  }
}

function processLanguageContribution(contribution) {
  const { id, filenamePatterns } = contribution
  let { extensions, filenames } = contribution
  extensions = extensions || []
  filenames = filenames || []
  if (filenamePatterns) {
    filenamePatterns.forEach((ptn) => {
      if (/^\*\.[^*/?]+$/.test(ptn))
        extensions.push(ptn.substring(1))

      if (/^[^*/?]+$/.test(ptn))
        filenames.push(ptn)
    })
  }
  extensions = extensions
    .map(ext => (ext.charAt(0) === '.' ? ext.substring(1) : ext))
    .filter(ext => !/[*/?]/.test(ext))
  filenames = filenames.filter(name => !/[*/?]/.test(name))
  if (!filenames.length && !extensions.length) {
    total -= 1
    return
  }
  const language = languages.find(lang => lang.id === id)
  if (language) {
    language.filenames.push(...filenames)
    language.extensions.push(...extensions)
  }
  else {
    languages.push({ id, extensions, filenames })
  }
  index += 1
}

function mapLanguageContribution(lang) {
  const langIcon = iconMap.languageIds[lang.id]
  lang.extensions.forEach((ext) => {
    const iconName = iconMap.fileExtensions[ext] || langIcon
    if (
      !iconMap.fileExtensions[ext]
      && iconName
      && languageMap.fileExtensions
      && iconMap.iconDefinitions[iconName]
    ) {
      languageMap.fileExtensions[ext] = iconName
    }
  })
  lang.filenames.forEach((name) => {
    const iconName = iconMap.fileNames[name] || langIcon
    if (
      !iconMap.fileNames[name]
      && !(name.startsWith('.') && iconMap.fileExtensions[name.substring(1)])
      && iconName
      && languageMap.fileNames
      && iconMap.iconDefinitions[iconName]
    ) {
      languageMap.fileNames[name] = iconName
    }
  })
  index += 1
}

async function generateLanguageMap() {
  try {
    console.log('[6/7] Writing language contribution map to icon configuration file.')
    await fs.writeFile(
      path.resolve(outputPath, 'language-map.json'),
      `${stringify(languageMap, { space: '  ' })}\n`,
    )
    console.log('[7/7] Deleting language contribution cache.')
    await fs.remove(vsDataPath)
    console.log('Script completed successfully.')
  }
  catch (error) {
    console.error('Error in generateLanguageMap:', error)
    throw error
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error)
  process.exit(1)
})
