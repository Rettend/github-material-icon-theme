import path from 'node:path'
import fs from 'node:fs'
import { encodeSvgForCss } from '@iconify/utils'
import data from 'material-icon-theme/dist/material-icons.json'
import { r } from '../utils/utils'

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
    }
  }
  // colored
  else {
    return {
      'background': `${uri} no-repeat`,
      'background-size': '100% 100%',
      'background-color': 'transparent',
    }
  }
}

export async function generateCSS(outputPath: string): Promise<void> {
  const commonCss = `
.react-directory-filename-column > svg, 
.PRIVATE_TreeView-directory-icon > svg, 
.PRIVATE_TreeView-item-visual > svg {
  height: 1.35em;
  width: 1.35em;
  color: transparent !important;
}
`

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

  fs.writeFileSync(outputPath, commonCss + css.join(''))
}
