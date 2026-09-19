#!/usr/bin/env node
/**
 * 文档站的 GEO 附件：`llms.txt`（索引）与 `llms-full.txt`（全文）。
 *
 * 直接吃 `docs/` 下的 Markdown 源文件，构建后写进产物目录 —— 文案只有一份，不会跟页面脱节。
 * 约定沿用 LLM 发现入口的通行写法：第一行标题、引用块摘要、按页面分组链接、末尾指全文。
 */
import { lstat, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, posix, relative, sep } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const source = join(root, 'docs')
const out = process.argv[2] ?? join(root, 'docs/.vitepress/dist')
const origin = 'https://adoc.runlume.app'

/** 递归收集文档 Markdown（跳过产物目录、public 与隐藏文件）。 */
async function collect(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'public' || entry.name === 'node_modules') continue
    const path = join(dir, entry.name)
    if ((await lstat(path)).isSymbolicLink()) continue
    if (entry.isDirectory()) files.push(...(await collect(path)))
    else if (entry.name.endsWith('.md')) files.push(path)
  }
  return files.sort()
}

const plain = (markdown) =>
  markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^```.*$/gm, '')
    .replace(/<[^>]+>/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const documents = []
for (const file of await collect(source)) {
  const raw = await readFile(file, 'utf8')
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '')
  const title = /^#\s+(.+)$/m.exec(body)?.[1]?.trim() ?? posix.basename(file, '.md')
  // 先整体去掉代码块，再取前几句，避免摘要里混进示例代码
  const summary = plain(
    body
      .replace(/```[\s\S]*?```/g, '')
      .replace(/^#\s+.+$/m, '')
      .split('\n')
      // 表格行与分隔行不适合当摘要
      .filter(
        (line) =>
          line.trim() &&
          !line.startsWith('#') &&
          !line.trim().startsWith('|') &&
          !line.trim().startsWith(':::') &&
          !/^[\s|:-]+$/.test(line),
      )
      .slice(0, 2)
      .join(' '),
  ).slice(0, 120)
  const relativePath = relative(source, file).split(sep).join('/')
  const urlPath =
    relativePath === 'index.md'
      ? '/'
      : `/${relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')}`
  documents.push({ title, summary, url: `${origin}${urlPath}`, body: body.trim() })
}

const index = `# Runlume 标准后台设计 · 文档

> 语义 Token、三种布局外壳、九类组件页、标准页型，以及动态菜单、前端权限、主题与工程约定。
> 源码 Apache-2.0 许可：https://github.com/runlume/admin-design

## 站点

- [宣传页](https://adesign.runlume.app)｜[在线演示](https://ago.runlume.app)（两个测试账号，权限不同）｜[GitHub](https://github.com/runlume/admin-design)

## 文档

${documents.map((doc) => `- [${doc.title}](${doc.url})：${doc.summary}`).join('\n')}

## 全文

- [llms-full.txt](${origin}/llms-full.txt)：以上文档的完整纯文本
`

const full = documents
  .map((doc) => `# ${doc.title}\n\n来源：${doc.url}\n\n${doc.body}`)
  .join('\n\n---\n\n')

// 逐页 Markdown 替代格式：与 HTML 同路径的 .md（/guide/intro → /guide/intro.md）
for (const doc of documents) {
  const path = doc.url.slice(origin.length).replace(/^\//, '')
  const file = join(out, path === '' ? 'index.md' : `${path}.md`)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, `${doc.body}\n`)
}
console.log(`逐页 Markdown：${documents.length} 个`)

await writeFile(join(out, 'llms.txt'), index)
await writeFile(join(out, 'llms-full.txt'), `${full}\n`)
console.log(`llms.txt · llms-full.txt（${documents.length} 篇文档）`)
