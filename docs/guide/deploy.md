---
description: 构建与部署：应用与文档站的构建命令、环境变量、路由回退、访问统计与上线前检查。
---

# 构建与部署

## 应用

```bash
pnpm build           # tsc -b && vite build → dist/
pnpm preview         # http://localhost:3201 本地预览产物
pnpm build:test      # 用 .env.test 构建测试环境产物
```

`dist/` 是纯静态资源，可直接交给任意静态托管。sourcemap 按环境走 `VITE_BUILD_SOURCEMAP`：
生产默认关闭（包体小），测试环境默认打开（对着堆栈排查）。

## 环境变量

| 变量                            | 用途               | 建议                                            |
| ------------------------------- | ------------------ | ----------------------------------------------- |
| `VITE_APP_TITLE`                | 浏览器标题后缀     | 按环境区分，例如"（测试）"                      |
| `VITE_APP_STORAGE_PREFIX`       | 浏览器存储前缀     | **业务系统必须改成自己的**，例如 `myapp.`       |
| `VITE_APP_API_BASEURL`          | 接口基地址         | 模板未使用，留给业务接入                        |
| `VITE_APP_PLATFORM_WEB_BASEURL` | 平台 / 官网地址    | 终端横幅、控制台品牌输出与侧栏底部外链都读它    |
| `VITE_APP_ANALYTICS_URL`        | 访问统计端点       | 留空不加载统计脚本；见「访问统计」一节          |
| `VITE_APP_DISABLE_DEVTOOL`      | 屏蔽开发者工具     | `'true'` 拦 F12 / 右键 / 查看源码，只是提高门槛 |
| `VITE_BUILD_SOURCEMAP`          | 是否产出 sourcemap | 生产默认 `false`，测试环境默认 `true`           |
| `VITE_BUILD_COMPRESS`           | 预压缩格式         | **默认留空（不压缩）**；见下方说明              |

三个环境文件：`.env.development`、`.env.production`、`.env.test`；机器专用覆盖写 `.env.*.local`（已忽略，不要提交）。

### 预压缩产物

**默认关闭**。站点一般会经过 CDN（Cloudflare 等），边缘会按 `Accept-Encoding` 自己压缩，终端用户拿到的
编码由边缘决定；源站再产一份 `.gz` / `.br` 只在"回源那一跳"省一点 CPU，却让每次发布多传一倍文件。

实测（平台前端，2026-09-17）：产物里 126 个 `.br`，myhost nginx 只有 `gzip on`、没有 `gzip_static`，
这些文件**没有任何请求会读到**；打开 `curl -H 'Accept-Encoding: br'` 拿到的 `content-encoding: br`
来自 Cloudflare。因此默认留空。

确实需要源站自带压缩时（例如以后直连源站、不经边缘），再设 `gzip` 或 `brotli`，并同时满足：

- 网关开启 `gzip_static`（brotli 需要 `ngx_brotli` 模块，Debian 官方 nginx 没有）；
- 回源请求带 `Accept-Encoding`，否则网关不会选预压缩文件。

满足不了这两条时，产出的 `.gz` / `.br` 只是仓库与发布体积的负担，建议保持留空。

### 关于屏蔽开发者工具

`VITE_APP_DISABLE_DEVTOOL=true` 会拦掉 F12、右键菜单与 `Ctrl/Cmd+Shift+I/J/C`、`Ctrl+U`。
它挡的是"随手打开"，**不构成安全边界**：前端代码始终在用户机器上，密钥与权限判断不能放在前端。

`VITE_APP_STORAGE_PREFIX` 决定偏好数据的隔离边界：多个后台部署在同一域名下时，前缀不同才不会互相串主题、
串表格列宽、串通知偏好。

## 路由回退

应用用 `createBrowserRouter`（history 模式），**托管方必须把未命中的路径回退到 `index.html`**，
否则刷新 `/customers/CUS-1001` 会 404。

| 平台             | 配置                                                |
| ---------------- | --------------------------------------------------- |
| Nginx            | `location / { try_files $uri $uri/ /index.html; }`  |
| 静态对象存储     | 设置 404 → `index.html`（或开启 SPA 模式）          |
| Vercel / Netlify | 框架预设为 Vite 时默认已处理；自建时加 rewrite 规则 |

## 文档站

```bash
pnpm docs:build      # → docs/.vitepress/dist
pnpm docs:preview    # http://localhost:3211 预览文档产物
```

文档站与应用的构建互相独立：

- 应用构建（`pnpm build`）不包含文档站；
- 文档站依赖 `vitepress`（devDependencies），不会进应用产物；
- 文档站里的品牌资源是 `docs/public/brand` 指向 `public/brand` 的软链接，改品牌只改一处。

部署时把 `docs/.vitepress/dist` 放到独立域名或子路径。带子路径部署需要同时设置 `base`：

```ts
// docs/.vitepress/config.ts
export default defineConfig({ base: '/design/' /* … */ })
```

## 访问统计（可选）

模板默认**不带任何第三方统计**，仓库里也不写死计数器地址。需要统计的部署在构建时传端点即可：

```bash
VITE_APP_ANALYTICS_URL=https://your-counter.example/count pnpm build       # 应用
VITE_APP_ANALYTICS_URL=https://your-counter.example/count pnpm docs:build  # 文档站
VITE_APP_ANALYTICS_URL=https://your-counter.example/count pnpm site:build  # 宣传页
```

注入点分别是 `scripts/analytics.ts`（应用）、`docs/.vitepress/config.ts`（文档站）与
`scripts/build-site.mjs`（宣传页），留空就完全不加载统计脚本。

`gc.zgo.at/count.js` 这类脚本只在整页加载时上报一次，两个单页应用（文档站与在线演示）切路由的计数由
`docs/.vitepress/theme/index.ts` 和 `src/lib/analytics.ts` 自己补，按路径去重，初始路由不会多算一条。
脚本自带过滤：`localhost`、内网 IP、`file:` 与预渲染环境都不上报，本地开发与 e2e 不会写进线上数据。

## 三个站点

同一份代码有三个部署面，产物与入口回退规则各不相同：

| 站点     | 产物                   | 入口回退规则                                   |
| -------- | ---------------------- | ---------------------------------------------- |
| 宣传页   | `site/`（纯静态）      | `try_files $uri $uri/ =404`                    |
| 文档站   | `docs/.vitepress/dist` | `try_files $uri $uri.html $uri/ =404`          |
| 在线演示 | `dist/`                | `try_files $uri $uri/ /index.html`（SPA 回退） |

站点根不做改写：应用保持常规行为 —— 未登录访问任何控制台路径都由前端带到
`/login?redirect=<原路径>`，登录成功后 `replace` 回那一页；直接打开登录页则进工作台。
想换落地页只需在入口加一条 `location = /` 跳转，不必动前端：本项目的演示站就是这样让站点根
落到组件总览的（未登录时表现为 `/login?redirect=%2Fdesign-system`）。

发布按 `releases + current` 目录约定：一次构建三份产物写进同一个 release 目录，原子切换 `current`
软链接，回滚就是切回上一个 release。

## CI

`.github/workflows/ci.yml` 在 push 与 PR 时执行：

```bash
pnpm install --frozen-lockfile
pnpm check                                              # 格式 + 类型 + lint + 单测 + 构建
pnpm exec playwright install --with-deps chromium
pnpm test:e2e
```

失败时把 `test-results/` 作为 artifact 上传（保留 7 天），可以直接看 trace 与截图。

## 上线前检查

1. `pnpm verify` 全绿（含端到端）。
2. `VITE_APP_STORAGE_PREFIX` 已改成业务自己的前缀。
3. 路由回退规则配好，深链接刷新不 404。
4. `public/brand/` 已换成业务品牌（四个文件同名覆盖）。
5. 需要的偏好类设置（主题 / 布局模式等）确认在真实环境保存与恢复都正常。
