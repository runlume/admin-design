# admin-design 协作约定

本仓库是 **文档站与官网**：`docs/` 是设计系统文档站（VitePress），`site/` 是官网静态页，
`public/` 是两个站点共用的公共资源。组件库与标准应用是同级目录下的独立仓库：

| 目录 | 仓库职责 | 什么时候动 |
| --- | --- | --- |
| `admin-ui/` | 组件库 `@runlume/admin-ui` | 界面能力、样式层、外壳变化时 |
| `admin-react/` | 标准后台应用 | 路由、菜单、会话接线与标准页面变化时 |
| 本目录 | 文档站与官网 | 上面两个仓库的对外说明、示例与站点呈现变化时 |

## 边界

- 只写文档与静态页：不放应用运行时代码，不承载控制台功能。
- 文档里的示例与 API 必须以 `admin-ui` 的导出面为准；组件库改了导出或 props，文档站同步改，
  不允许文档描述一套、代码是另一套。
- 两个子仓库各自提交，本目录的提交不包含它们的内容（`.gitignore` 已排除）。

## 结构

| 路径 | 内容 |
| --- | --- |
| `docs/.vitepress/` | 站点配置与主题（Layout、品牌字标组件） |
| `docs/guide/` | 指南：接入、主题、结构、测试、发布 |
| `docs/components/` | 组件文档 |
| `site/` | 官网静态页（手写 HTML/CSS/JS，无打包步骤） |
| `scripts/build-site.mjs` | 官网拼装：`site/` + `public/brand/` → `_site/` |
| `scripts/build-llms.mjs` | 文档站的 `llms.txt` / `llms-full.txt` |
| `scripts/make-og.mjs` | 三个站点的分享图（真实浏览器渲染） |

## 验证

```bash
pnpm install
pnpm check      # 格式检查 + docs:build（含死链检查）+ site:build
```

- 改导航、侧栏或链接必须让 `docs:build` 通过：Vitepress 的死链检查是硬门禁。
- 分享图是产物，改文案后重新 `pnpm og:build` 并把新的 PNG 一起提交。

## 提交

中文 Conventional Commit，一个提交一个内聚目标。
