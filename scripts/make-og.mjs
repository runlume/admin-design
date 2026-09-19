#!/usr/bin/env node
/**
 * 生成三站点的分享图（1200×630 PNG，OG / Twitter 卡片用）。
 *
 * 用真实浏览器渲染，避免手搓图形：底图是品牌色，字标直接用 `public/brand` 的资源。
 * 产物提交进仓库（分享图要稳定 URL，不适合每次构建都变），改文案后重新执行：
 *   node scripts/make-og.mjs
 */
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const root = new URL('..', import.meta.url).pathname
const out = join(root, 'public/og')

const cards = [
  {
    file: 'adesign.png',
    title: '标准后台设计',
    subtitle: '语义 Token · 布局外壳 · 公共组件 · 标准页型',
    url: 'adesign.runlume.app',
  },
  {
    file: 'adoc.png',
    title: '标准后台设计 · 文档',
    subtitle: '组件说明、工程约定、动态菜单与前端权限',
    url: 'adoc.runlume.app',
  },
  {
    file: 'ago.png',
    title: '标准后台设计 · 在线演示',
    subtitle: '两个测试账号，权限不同，可切主题与布局',
    url: 'ago.runlume.app',
  },
]

const wordmark = await readFile(join(root, 'public/brand/wordmark-light.svg'), 'utf8')

const page_html = (card) => `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; }
  body {
    margin: 0; width: 1200px; height: 630px; padding: 72px 80px;
    display: flex; flex-direction: column; justify-content: space-between;
    background: linear-gradient(150deg, #0a3a35, #062a27 62%);
    color: #eef7f3; font-family: "PingFang SC", system-ui, sans-serif;
  }
  .mark { width: 300px; }
  .mark svg { width: 100%; height: auto; display: block; }
  h1 { margin: 28px 0 0; font-size: 68px; line-height: 1.08; letter-spacing: -0.02em; }
  p { margin: 18px 0 0; color: #b6d2c9; font-size: 26px; }
  .foot {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 24px; border-top: 1px solid rgb(255 255 255 / 14%);
    color: #93b8ae; font-size: 22px; font-family: ui-monospace, Menlo, monospace;
  }
  .tag { color: #dcef9b; }
</style></head>
<body>
  <div>
    <div class="mark">${wordmark.replace(/fill="[^"]*"/g, 'fill="#eef7f3"')}</div>
    <h1>${card.title}</h1>
    <p>${card.subtitle}</p>
  </div>
  <div class="foot"><span class="tag">Apache-2.0 License</span><span>${card.url}</span></div>
</body></html>`

await mkdir(out, { recursive: true })
const browser = await chromium.launch()
for (const card of cards) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
  await page.setContent(page_html(card), { waitUntil: 'load' })
  await page.screenshot({ path: join(out, card.file) })
  await page.close()
  console.log(`public/og/${card.file}`)
}
await browser.close()
