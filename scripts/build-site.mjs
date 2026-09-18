#!/usr/bin/env node
/**
 * 拼装宣传页：`site/` + `public/brand` → `_site/`。
 *
 * 宣传页是纯静态 HTML，没有打包步骤，所以统计脚本由这里按需注入：
 * 只有配了 `VITE_APP_ANALYTICS_URL` 才插入计数器标签，模板本身不带第三方统计。
 */
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const out = join(root, '_site')
const endpoint = process.env.VITE_APP_ANALYTICS_URL?.trim()

await rm(out, { recursive: true, force: true })
await mkdir(join(out, 'brand'), { recursive: true })
await cp(join(root, 'site'), out, { recursive: true })

for (const name of await readdir(join(root, 'public/brand'))) {
  await cp(join(root, 'public/brand', name), join(out, 'brand', name))
}
await cp(join(root, 'public/og'), join(out, 'og'), { recursive: true })

if (endpoint) {
  const tag = `<script data-goatcounter="${endpoint}" async src="https://gc.zgo.at/count.js"></script>`
  for (const file of ['index.html', 'en.html']) {
    const path = join(out, file)
    const html = await readFile(path, 'utf8')
    await writeFile(path, html.replace('</head>', `    ${tag}\n  </head>`))
  }
  console.log(`_site/ 已拼装（统计端点：${endpoint}）`)
} else {
  console.log('_site/ 已拼装（未配置 VITE_APP_ANALYTICS_URL，不注入统计脚本）')
}

/*
 * 把字标 SVG 内联进页面：`<img>` 里的内容无法用 CSS 动画，
 * 只有内联才能让末尾的方点跟控制台、文档站一样呼吸。颜色走 CSS 变量，深浅模式共用一份。
 */
const wordmark = await readFile(join(root, 'public/brand/wordmark-light.svg'), 'utf8')
for (const file of ['index.html', 'en.html']) {
  const path = join(out, file)
  const html = await readFile(path, 'utf8')
  // 占位整体换成「带尺寸与动画钩子的 span + 内联 SVG」，不要把外层 span 一起换掉：
  // 高宽、深浅模式的 CSS 变量、方点动画的选择器都挂在 .hero-wordmark 上。
  await writeFile(
    path,
    html.replace(
      '<span class="hero-wordmark" data-wordmark aria-hidden="true"></span>',
      `<span class="hero-wordmark" aria-hidden="true">${wordmark.trim()}</span>`,
    ),
  )
}

/*
 * 给 css / js 带上内容哈希：这两个文件名固定，浏览器与 CDN 会按旧缓存渲染新页面，
 * 表现就是"页面样式全乱"（HTML 换新版、CSS 还是老的）。哈希变了 URL 就变了。
 */
const digest = async (file) =>
  createHash('sha256')
    .update(await readFile(join(out, file)))
    .digest('hex')
    .slice(0, 8)

const assets = await Promise.all(
  ['styles.css', 'theme.js'].map(async (file) => [file, await digest(file)]),
)
for (const file of ['index.html', 'en.html']) {
  const path = join(out, file)
  let html = await readFile(path, 'utf8')
  for (const [asset, version] of assets) {
    html = html.replaceAll(`"${asset}"`, `"${asset}?v=${version}"`)
  }
  await writeFile(path, html)
}
console.log(assets.map(([file, version]) => `${file}?v=${version}`).join(' · '))

/*
 * SEO / GEO 附属文件：sitemap 带 hreflang，llms.txt 给 AI 引擎一个入口索引，
 * llms-full.txt 把整页内容转成纯文本。三者都由页面本身推导，改文案不用手改它们。
 */
const origin = 'https://adesign.runlume.app'
const pages = [
  { file: 'index.html', path: '/', lang: 'zh-CN', title: '标准后台设计', summary: '宣传页：项目说明、三个入口与快速开始' },
  { file: 'en.html', path: '/en.html', lang: 'en', title: 'Admin Design', summary: 'Landing page: overview, entry points and quick start' },
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages
  .map(
    (page) => `  <url>
    <loc>${origin}${page.path}</loc>
${pages.map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${origin}${alt.path}" />`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/" />
  </url>`,
  )
  .join('\n')}
</urlset>
`
await writeFile(join(out, 'sitemap.xml'), sitemap)

/** 把页面正文压成纯文本：给 llms-full.txt 用，块级元素换行、逐行去空白。 */
const textOf = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<\/(p|h1|h2|h3|h4|li|div|section|footer|header|nav|ul|ol|dl|dt|dd|pre)>/g, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')

const llmsIndex = `# Runlume 标准后台设计

> 从 Runlume 平台前端提取的标准后台模板：语义 Token、三种布局外壳、九类组件页、标准页型与零依赖 SVG 图表。MIT 许可，业务系统可整份复制。

## 入口

- [宣传页](${origin}/)：项目说明与快速开始（本页）
- [English landing](${origin}/en.html)
- [文档站](https://adoc.runlume.app)：组件说明、工程约定、动态菜单与前端权限
- [在线演示](https://ago.runlume.app)：两个测试账号，权限不同
- [源码](https://github.com/runlume/admin-design)：MIT 许可

## 全文

- [llms-full.txt](${origin}/llms-full.txt)：宣传页全文纯文本
`
await writeFile(join(out, 'llms.txt'), llmsIndex)

const fullParts = []
for (const page of pages) {
  const html = await readFile(join(out, page.file), 'utf8')
  fullParts.push(`# ${page.title}（${origin}${page.path}）\n\n${textOf(html)}`)
}
await writeFile(
  join(out, 'llms-full.txt'),
  `${fullParts.join('\n\n---\n\n')}\n\n---\n\n# 其他入口\n\n- 文档站：https://adoc.runlume.app\n- 在线演示：https://ago.runlume.app\n- 源码（MIT）：https://github.com/runlume/admin-design\n`,
)
console.log('sitemap.xml · llms.txt · llms-full.txt')
