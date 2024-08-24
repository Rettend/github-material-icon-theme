import path from 'node:path'
import fs from 'node:fs'
import { encodeSvgForCss } from '@iconify/utils'
import data from 'material-icon-theme/dist/material-icons.json'
import { r } from '../utils/utils'

function getCSS(svg: string): Record<string, string> {
  const uri = `url("data:image/svg+xml;utf8,${encodeSvgForCss(svg)}")`

  return {
    background: `${uri} no-repeat`,
  }
}

export async function generateCSS(outputPath: string): Promise<void> {
  const css: string[] = []

  for (const iconName in data.iconDefinitions) {
    const svgPath = data.iconDefinitions[iconName as keyof typeof data.iconDefinitions].iconPath
    const svgContent = await fs.promises.readFile(path.join(r('node_modules/material-icon-theme/dist'), svgPath), 'utf-8')
    const cssProps = getCSS(svgContent)

    const cssPropsString = Object.entries(cssProps).map(([key, value]) => {
      return `\t${key}: ${value};`
    }).join('\n')

    css.push(`.ICON_${iconName} {\n${cssPropsString}\n}\n`)
  }

  fs.writeFileSync(outputPath, css.join(''))
}
