# admin-design

Runlume 标准后台的**文档站与官网**，以及两个子仓库的落脚目录。

| 目录           | 内容                                                            | 仓库     |
| -------------- | --------------------------------------------------------------- | -------- |
| `docs/`        | 设计系统文档站（VitePress）：指南 + 组件文档                    | 本目录   |
| `site/`        | 官网静态页（纯 HTML，构建产物在 `_site/`）                      | 本目录   |
| `public/`      | 两个站点共用的公共资源：品牌、分享图、许可与 `robots`/`sitemap` | 本目录   |
| `admin-ui/`    | 组件库 `@runlume/admin-ui`（发布到 npm）                        | 独立仓库 |
| `admin-react/` | 标准后台应用：路由、菜单、会话接线与标准页面                    | 独立仓库 |

两个子目录是**各自独立的 Git 仓库**，本目录的 `.gitignore` 不跟踪它们，提交时分别进各自目录。

## 本地构建

```bash
pnpm install
pnpm docs:dev      # 文档站：http://localhost:3210
pnpm docs:build    # 文档站产物 + llms.txt
pnpm site:build    # 官网产物到 _site/
pnpm check         # 格式检查 + 两个站点构建
```

分享图（`public/og/*.png`）由 `pnpm og:build` 用真实浏览器渲染，改文案后重新生成并提交。

## 与两个子仓库的关系

- 文档站讲的是组件库的能力，示例与 API 以 `admin-ui` 的导出面为准；组件库改动后，文档站要一起更新。
- 官网只介绍标准后台这一件事，不承载控制台功能；控制台的实现在 `admin-react`。

## 协议

Apache-2.0，见 [LICENSE](LICENSE) 与 [NOTICE](NOTICE)。
