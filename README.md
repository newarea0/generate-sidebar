# generate-sidebar

该脚本用于自动生成 VitePress 侧边栏配置

## 安装

```bash
npm install -g @newarea/generate-sidebar
```

## 使用方法

在 VitePress 项目根目录下运行：

```bash
generate-sidebar 目录名 输出文件路径
```

- **目录名**：要生成侧边栏的目录名
- **输出文件路径**：生成的侧边栏配置文件路径

示例：

```bash
node .\generate-sidebar.js .\依赖包\ .\.vitepress\menu\package.ts
```

## 注意事项

- 目录结构将被转换为嵌套的侧边栏项
- 默认所有目录都是折叠的（collapsed: true）
- README.md 文件会被忽略
- 文件名将作为侧边栏项的文本显示
