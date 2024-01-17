import fs from 'node:fs'
import { glob } from 'glob'
import { convertParsedSVG, encodeSvgForCss, parseSVGContent } from '@iconify/utils'

const folders = [
  'assets',
  // 'icons',
]

async function loadAndParseSVGs(folders: string[]): Promise<void> {
  const files = folders.map(async (folder) => {
    return await glob(`./${folder}/**/*.svg`)
  })

  const allFiles = (await Promise.all(files)).flat()

  for (const file of allFiles) {
    const content = await fs.promises.readFile(file, 'utf-8')
    const parsed = parseSVGContent(content)

    if (!parsed)
      return

    const svg = convertParsedSVG(parsed)

    if (!svg)
      return

    const cssProps = getCSS(svg.body)

    const css = Object.entries(cssProps).map(([key, value]) => {
      return `${key}: ${value};`
    }).join('\n')
  }
}

function getCSS(svg: string): Record<string, string> {
  const mode = svg.includes('currentColor')
    ? 'mask'
    : 'background-img'

  const uri = `url("data:image/svg+xml;utf8,${encodeSvgForCss(svg)}")`

  // monochrome
  if (mode === 'mask') {
    return {
      'mask': `${uri} no-repeat`,
      'mask-size': '100% 100%',
      '-webkit-mask': `${uri} no-repeat`,
      '-webkit-mask-size': '100% 100%',
      'background-color': 'currentColor',
      'color': 'inherit',
      'height': '1em',
      'width': '1em',
    }
  }
  // colored
  else {
    return {
      'background': `${uri} no-repeat`,
      'background-size': '100% 100%',
      'background-color': 'transparent',
      'height': '1em',
      'width': '1em',
    }
  }
}

loadAndParseSVGs(folders)
