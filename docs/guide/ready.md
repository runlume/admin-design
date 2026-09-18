---
description: 准备工作：环境要求、安装启动、常用命令、编辑器建议与环境变量。
---

# 准备工作

## 环境要求

| 依赖    | 版本    | 说明                                         |
| ------- | ------- | -------------------------------------------- |
| Node.js | 24.x    | `package.json` 的 `engines.node` 要求 `>=24` |
| pnpm    | 11.21.0 | 只维护 `pnpm-lock.yaml`，不要混用 npm / yarn |

```bash
node -v      # v24.x
pnpm -v      # 11.21.0
```

## 安装与启动

```bash
pnpm install
pnpm dev          # 应用：http://localhost:3200
```

应用端口在 `vite.config.ts` 里固定（`strictPort`），被占用时会直接报错而不是偷偷换端口。文档站单独占 3210，
两者可以同时开：

```bash
pnpm docs:dev     # 文档站：http://localhost:3210
```

启动横幅（每个进程只打一次）：

```text
╔════════════════════════════════════╗
║    由 Runlume admin-design 驱动    ║
║                                    ║
║        https://runlume.app         ║
║                                    ║
║          当前使用：标准版          ║
╚════════════════════════════════════╝
```

开发服务器监听局域网（`server.host: true`），终端会同时给出 Local 与 Network 两个地址，
手机或同网段设备用 Network 地址就能打开；不需要暴露时把 `vite.config.ts` 的 `server.host` 改回 `'localhost'`。

```text
  ➜  Local:   http://localhost:3200/
  ➜  Network: http://192.168.1.10:3200/
```

## 常用命令

| 目的            | 命令                                                 |
| --------------- | ---------------------------------------------------- |
| 开发应用        | `pnpm dev`                                           |
| 开发文档站      | `pnpm docs:dev`                                      |
| 生产构建        | `pnpm build`                                         |
| 预览构建产物    | `pnpm preview`（`http://localhost:3201`）            |
| 构建文档站      | `pnpm docs:build`（产物 `docs/.vitepress/dist`）     |
| 预览文档站产物  | `pnpm docs:preview`（`http://localhost:3211`）       |
| 类型检查        | `pnpm typecheck`                                     |
| Lint            | `pnpm lint`                                          |
| 单元 / 组件测试 | `pnpm test`                                          |
| 端到端测试      | `pnpm test:e2e`                                      |
| 改动后自证      | `pnpm check`（格式 + 类型 + lint + 单测 + 构建）     |
| 完整验证        | `pnpm verify`（`check` + Playwright）                |
| 截图评审        | `pnpm screenshots`（写入 `/tmp/admin-design-shots`） |

多人或多会话并行跑 Playwright 时，用 `pnpm test:e2e -- --output=/tmp/pw-admin-out` 隔离产物目录，
否则共用 `test-results/` 会出现假失败。

## 应用预览

模板本身就是一个可运行的后台示例，启动 `pnpm dev` 后可以直接看：
不想本地起服务时，直接看在线演示 **<https://ago.runlume.app/>**。
未登录打开深链接（例如 `/design-system`）会先到登录页，登录成功后自动回到那一页；直接打开登录页则进工作台。

| 页面                   | 地址                                             |
| ---------------------- | ------------------------------------------------ |
| 组件总览               | `http://localhost:3200/design-system`            |
| 基础控件               | `http://localhost:3200/design-system/basic`      |
| 表单与选择             | `http://localhost:3200/design-system/form`       |
| 数据展示               | `http://localhost:3200/design-system/data`       |
| 反馈与浮层             | `http://localhost:3200/design-system/feedback`   |
| 导航与流程             | `http://localhost:3200/design-system/navigation` |
| 指标与图表             | `http://localhost:3200/design-system/metrics`    |
| 图标预览               | `http://localhost:3200/design-system/icons`      |
| 主题与设置             | `http://localhost:3200/design-system/theme`      |
| 登录 / 注册 / 找回密码 | `/login`、`/register`、`/forgot-password`        |

## 编辑器建议

- 保存时自动格式化：仓库里带 `.prettierrc.json`（无分号、单引号、行宽 100）。
- 推荐开启 TypeScript 的"使用工作区版本"，`.vscode` 之外无需额外配置。
- 提交前钩子在 `.githooks/`：首次克隆后执行一次 `git config core.hooksPath .githooks`，
  之后 `git commit` 会自动跑格式检查 + 类型 + lint + 单测。

## 环境变量

| 变量                            | 作用                                                       |
| ------------------------------- | ---------------------------------------------------------- |
| `VITE_APP_TITLE`                | 浏览器标题后缀                                             |
| `VITE_APP_STORAGE_PREFIX`       | 浏览器存储前缀（业务系统务必改成自己的）                   |
| `VITE_APP_API_BASEURL`          | 接口基地址（模板未使用，留给业务）                         |
| `VITE_APP_PLATFORM_WEB_BASEURL` | 平台 / 官网地址：终端横幅、控制台品牌输出与侧栏外链        |
| `VITE_APP_DISABLE_DEVTOOL`      | 是否屏蔽 F12 / 右键 / 查看源码快捷键（`'true'` 生效）      |
| `VITE_BUILD_SOURCEMAP`          | 构建是否产出 sourcemap（`'true'` 生效，测试环境默认开）    |
| `VITE_BUILD_COMPRESS`           | 构建预压缩格式：`gzip`、`brotli`，逗号分隔；默认留空不压缩 |

默认值在 `.env.development` / `.env.production` / `.env.test`，机器专用覆盖写 `.env.*.local`（已忽略）。
细节见[构建与部署](/guide/deploy)。
