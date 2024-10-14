#!/usr/bin/env node
import type { DefaultTheme } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

function generateSidebar(dir: string, basePath = ''): DefaultTheme.SidebarItem[] {
  const sidebar: DefaultTheme.SidebarItem[] = []
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      const dirName = path.basename(file)
      const items = generateSidebar(filePath, path.join(basePath, dirName))
      if (items.length > 0) {
        sidebar.push({
          text: dirName,
          collapsed: true, // 设置默认折叠
          items,
        })
      }
    }
    else if (path.extname(file) === '.md') {
      const name = path.basename(file, '.md')
      if (name.toLowerCase() !== 'readme') {
        sidebar.push({
          text: name,
          // 去掉开头的斜杠，否则侧边栏菜单无法高亮
          link: `${path.join(basePath, name).replace(/\\/g, '/')}`,
        })
      }
    }
  })

  return sidebar
}

function stringifySidebar(sidebar: DefaultTheme.SidebarItem[], indent = 0) {
  const spaces = ' '.repeat(indent)
  let result = '[\n'
  sidebar.forEach((item) => {
    if (Object.keys(item).length === 2 && item.text && item.link) {
      // 如果只有 text 和 link，则在一行内显示
      result += `${spaces}  { text: '${item.text}', link: '${item.link}' },`
    }
    else {
      result += `${spaces}  {\n`
      result += `${spaces}    text: '${item.text}',\n`
      if (item.link) {
        result += `${spaces}    link: '${item.link}',\n`
      }
      if (item.collapsed !== undefined) {
        result += `${spaces}    collapsed: ${item.collapsed},\n`
      }
      if (item.items) {
        result += `${spaces}    items: ${stringifySidebar(item.items, indent + 4)},\n`
      }
      result += `${spaces}  },`
    }
    result += '\n'
  })
  result += `${spaces}]`
  return result
}

function writeSidebarConfig(sidebar: DefaultTheme.SidebarItem[], outputPath: string) {
  const content = `import type { DefaultTheme } from 'vitepress'

export const ${path.basename(outputPath, '.ts')}Sidebar: DefaultTheme.SidebarItem[] = ${stringifySidebar(sidebar)}
`

  fs.writeFileSync(outputPath, content)
  console.log(`侧边栏配置已生成到: ${outputPath}`)
}

// 获取命令行参数
const args = process.argv.slice(2)
if (args.length < 2) {
  console.error('请提供目录名和输出文件路径作为参数')
  process.exit(1)
}

const dirName = args[0]
const outputPath = args[1]
const docsDir = path.join(path.resolve('.'), dirName)
console.log(docsDir)

if (!fs.existsSync(docsDir)) {
  console.error(`目录 "${dirName}" 不存在`)
  process.exit(1)
}

const sidebar = generateSidebar(docsDir)
writeSidebarConfig(sidebar, outputPath)
