<a href="https://runlume.app">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/brand/wordmark-dark.svg" />
  <img src="public/brand/wordmark-light.svg" alt="Runlume" width="220" />
</picture>
</a>

# 标准后台前端

[![开源协议](https://img.shields.io/github/license/runlume/admin-design?style=flat-square&label=%E5%BC%80%E6%BA%90%E5%8D%8F%E8%AE%AE&color=blue)](LICENSE)
[![当前版本](https://img.shields.io/github/package-json/v/runlume/admin-design?style=flat-square&label=%E5%BD%93%E5%89%8D%E7%89%88%E6%9C%AC&color=007ec6)](https://github.com/runlume/admin-design/releases)
[![技术栈](https://img.shields.io/badge/React%2019%20%C2%B7%20TypeScript%20%C2%B7%20Vite%20%2B%20Tailwind-1f6feb?style=flat-square)](docs/guide/intro.md)
[![校验](https://img.shields.io/badge/pnpm%20check-%E5%85%A8%E7%BB%BF-2ea44f?style=flat-square)](#校验)

站点：<https://adesign.runlume.app> · 文档：<https://adoc.runlume.app> · 在线演示：<https://ago.runlume.app> · [English](README.en.md)

从 [Runlume](https://runlume.app) 平台前端提取出来的「标准后台」模板：主题与语义 Token、布局外壳、公共组件、标准页型和一整套组件总览。
业务系统只需要接自己的菜单、文案、身份与接口，界面语言、交互细节和视觉规范直接用这里的一份。

配套的后端标准起点是 [标准后台后端](https://github.com/runlume/admin-java)：默认接入平台集成 SDK，
自带本地用户管理与登录，接口契约、会话、权限、租户隔离与平台接入用那一份。

React 19 + TypeScript + Vite + Tailwind CSS + Radix UI，**不引入图表库、UI 框架或组件库依赖**（图表与动效均为自绘 SVG）。

## 快速开始

使用 Node.js 24 与 pnpm 11.21.0，只维护 `pnpm-lock.yaml`，不要混用 npm/yarn。

```bash
pnpm install
pnpm dev            # http://localhost:3200
pnpm build          # 产物在 dist/
pnpm preview        # http://localhost:3201 预览构建产物
```

`pnpm dev` 启动时终端会打出品牌横幅（每个进程只打一次），并同时给出 Local 与 Network 两个地址
（`server.host: true`，手机或同网段设备可用 Network 地址访问）。品牌文案在 `src/lib/brand-info.ts`，
终端横幅在 `scripts/banner.ts`，浏览器 F12 控制台的品牌输出在 `src/lib/brand-console.ts`。

## 校验

```bash
pnpm typecheck                 # tsc -b
pnpm lint                      # oxlint
pnpm test                      # Vitest（单元 / 组件）
pnpm test:e2e                  # Playwright（真实浏览器）
pnpm check                     # 以上四项 + 生产构建
```

截图评审（不是回归用例，默认跳过）：

```bash
SCREENSHOTS=1 pnpm test:e2e    # 截图写入 /tmp/admin-design-shots
```

多人/多会话并行跑 Playwright 时，用 `pnpm test:e2e -- --output=/tmp/pw-admin-out` 隔离产物目录，
避免共用 `test-results/` 造成假失败。

## 文档站

`docs/` 是一个独立的 VitePress 站点（`vitepress` 只在 devDependencies，不进应用产物），
结构为 `index.md` + `guide/`（指南）+ `components/`（组件）：

```bash
pnpm docs:dev      # http://localhost:3210
pnpm docs:build    # 产物在 docs/.vitepress/dist，构建时会检查死链
pnpm docs:preview  # http://localhost:3211 预览文档产物
```

文档站品牌资源通过 `docs/public/brand` 软链接复用 `public/brand`，换品牌只改一处。

## 目录结构

```text
src/
├── app/            # 外壳接线：路由、布局、Providers、示例菜单
├── components/     # 公共组件（外壳、页型零件、图表、设置面板）
│   └── ui/         # 基础控件（button/input/table/tabs/dialog…）
├── hooks/          # 通用 hooks
├── lib/            # 纯逻辑：主题偏好、i18n、树、分页、指标、表格偏好…
├── pages/          # 标准页型示例：工作台、列表、详情、设置、通知、登录注册
│   └── design-system/  # 组件总览（按类型拆分，见下）
└── test/           # 全部测试：unit / components / e2e
```

## 组件总览

侧栏「设计系统」分组下按类型拆分，每个控件都能在页面上直接交互：

| 页面       | 路径                        | 内容                                                                                      |
| ---------- | --------------------------- | ----------------------------------------------------------------------------------------- |
| 组件总览   | `/design-system`            | 品牌、语义色板、分类入口                                                                  |
| 基础控件   | `/design-system/basic`      | 按钮、输入、选择、勾选、标签、进度、步进、滑块、滚动区、折叠                              |
| 表单与选择 | `/design-system/form`       | 表单、日期时间、验证码、密码强度、组合框、级联、多选、上传、提及                          |
| 数据展示   | `/design-system/data`       | 表格（排序/列管理/密度/固定列/行内展开/虚拟滚动）、树、表格树、描述列表、时间线、布局容器 |
| 反馈与浮层 | `/design-system/feedback`   | 提示条、弹窗、抽屉、确认、菜单、提示、多步加载、右键菜单、悬停卡片、状态                  |
| 导航与流程 | `/design-system/navigation` | 面包屑、页签、步骤条、快捷键、页型入口                                                    |
| 指标与图表 | `/design-system/metrics`    | 指标卡、折线、柱状、环形、迷你柱、条形、热力、雷达、漏斗、甘特、代码块                    |
| 图标预览   | `/design-system/icons`      | lucide 全量图标（按需加载），点击复制组件名                                               |
| 主题与设置 | `/design-system/theme`      | 配色、通知偏好、无障碍、品牌                                                              |

组件的能力、props 与用法见文档站 [components/](docs/components/index.md)（或 `pnpm docs:dev` 后打开）。

## 作为模板使用

1. **复制整个目录**到业务仓库，改 `package.json` 的 `name`。
2. **换菜单**：改 `src/app/navigation.ts`（`navigation` + `navigationGroups` 的 `paths` 决定分组与顺序）。
3. **换身份**：`src/app/session.ts` 里的 `demoAccounts` 换成会话数据（含权限码）；退出登录回调改成调用身份服务。
4. **接接口**：页面里的示例数据（`src/pages/sample-data.ts`、`src/lib/notifications.ts`）换成真实查询；加载/空/错误态用 `LoadingState` / `EmptyState` / `ErrorState`。
5. **换文案**：`src/lib/i18n.ts` 是唯一的语言包入口，中英文必须同步；菜单项可先写中文，未登记的 key 会原样显示。
6. **换品牌**：`public/brand/` 下的 `mark.svg`、`mark-dark.svg`、`wordmark-light.svg`、`wordmark-dark.svg` 直接覆盖即可，组件不用改。
7. **换环境变量**：`.env.development` / `.env.production` / `.env.test` 里的 `VITE_APP_TITLE`、`VITE_APP_STORAGE_PREFIX`（偏好存储前缀，业务系统务必改成自己的）、`VITE_APP_PLATFORM_WEB_BASEURL`（终端横幅 / 控制台品牌输出 / 侧栏外链）、`VITE_APP_DISABLE_DEVTOOL`（是否屏蔽开发者工具）、`VITE_BUILD_SOURCEMAP`（是否产出 sourcemap）、`VITE_BUILD_COMPRESS`（预压缩，默认关闭）。

## 关键约定

- **颜色只用语义 Token**：`bg-card`、`text-muted-foreground`、`border-border`、`text-success` 等；业务组件不写死颜色。语义色（success / warning / info / danger）与品牌色（`brand-lime`）分开。
- **深浅模式与配色**：`palettes.css`（六套预设）+ `custom-palettes.css`（基础色 × 主题色自由组合）+ `accessibility.css`（高对比、灰色、色弱）。
- **偏好只存浏览器**：主题、配色、无障碍、通知偏好、顶栏操作顺序、侧栏宽度/圆角/动画/布局模式、表格列宽、筛选预设、快捷键都在 `localStorage`，键名统一带 `VITE_APP_STORAGE_PREFIX`。
- **菜单可以来自后台**：`src/app/remote-menu.ts` 的 `fetchRemoteMenu()` 换成真实接口即可；菜单项支持**多层级（`children`）**、**外链与打开方式（新窗口 / 当前窗口 / iframe 内嵌）**、图标名、i18n key、排序、隐藏与权限码。动态页面的组件由本地注册表（`src/app/remote-pages.tsx`）提供，接口只能引用不能新增。
- **两个测试账号**：登录页可一键填入 `admin`（`*` 全量权限）与 `test`（受限权限），用来看菜单、路由守卫与按钮鉴权的差异，见 `src/app/session.ts`。
- **前端权限三处生效**：菜单按权限过滤、路由用 `RequirePermission` 落 403、按钮用 `<Can>` 隐藏或置灰；权限码支持 `*` 与 `module:*`，示例会话见 `src/app/session.ts`。
- **无障碍**：所有交互可用键盘完成；对话框有焦点管理；表格、树、表单控件带 ARIA 属性；语义色对比度按 AA 校验（有 Playwright 断言）。
- **零依赖图表**：折线/柱状/环形/迷你图/热力/雷达/漏斗/甘特都在 `src/components/charts.tsx`、`column-chart.tsx` 里自绘，需要更多图表时先考虑自绘或业务侧引入。

## 示例数据的边界

- 工作台指标、客户、订单、通知、组织单元等都是**内存示例数据**，刷新即恢复初始状态；通知的已读状态也不例外（偏好类设置才会持久化）。
- 登录/注册/找回密码只演示表单与校验，**不接身份服务**；退出登录只做跳转。
- 上传、提及、快捷键、表格虚拟滚动等能力的接口已留出（`uploader`、`onMove`、`loadChildren`、`virtual` 等 prop），接真实实现时替换回调即可。

## 不在本模板内

认证与会话、API 客户端与错误码、权限模型、图表库与装饰性营销动效、二维码/代码高亮/Iconify 图标库等重依赖能力。

其中认证与会话、API 客户端与错误码、权限模型由 [标准后台后端](https://github.com/runlume/admin-java) 提供。

## 开源协议

[Apache-2.0](LICENSE)，Copyright 2026 Runlume。可以自由复制进商业产品，只需保留版权与许可声明，
并随分发附上 [LICENSE](LICENSE) 与 [NOTICE](NOTICE)；协议含显式专利授权，但不授予商标权。
`public/brand/` 下的品牌标识属于品牌资产，使用时替换成自己的。细节见 [docs/guide/license.md](docs/guide/license.md)。
