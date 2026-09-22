---
layout: home
# 站点全名已经带「· 文档」，首页不再拼一次标题后缀
titleTemplate: false
description: Runlume 标准后台设计文档：语义 Token、三种布局外壳、九类组件页与标准页型，业务系统可直接复制的后台模板。

hero:
  text: 标准后台设计
  tagline: 语义 Token、布局外壳、公共组件与标准页型，业务系统直接复制这一份
  actions:
    - theme: brand
      text: 开始
      link: /guide/intro
    - theme: alt
      text: 组件总览
      link: /components/
    - theme: alt
      text: 架构与决策
      link: /guide/architecture
    - theme: alt
      text: GitHub
      link: https://github.com/runlume/admin-design
    - theme: alt
      text: npm 组件库
      link: https://www.npmjs.com/package/@runlume/admin-ui

features:
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg>'
    title: 语义 Token 主题
    details: 颜色只走 bg-card / text-muted-foreground / text-success 这类语义工具类，六套预设配色 + 基础色 × 主题色自由组合，切主题时业务代码零改动
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/></svg>'
    title: 组件按类型拆分
    details: 基础控件、表单与选择、数据展示、反馈与浮层、导航与流程、指标与图表、图标、主题与设置，共九类页面，每个能力都能直接交互
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>'
    title: 三种布局外壳
    details: 侧边导航、顶部 + 侧边导航、顶部导航三种模式；侧栏宽度、圆角、页面过渡、顶栏操作顺序都可在设置里调，偏好存浏览器
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/></svg>'
    title: 零依赖图表
    details: 折线、柱状、环形、迷你柱、条形、热力、雷达、漏斗、甘特全部自绘 SVG，跟随语义色与深色模式，不引第三方图表库
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>'
    title: 中英双语与无障碍
    details: src/lib/i18n.ts 是唯一语言包入口，中英结构由类型强制对齐；键盘可达、对话框焦点管理、高对比与色弱模式、减少动效
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="7" x="3" y="3" rx="1"/><rect width="9" height="7" x="3" y="14" rx="1"/><rect width="5" height="7" x="16" y="14" rx="1"/></svg>'
    title: 标准页型
    details: 工作台、列表、详情、设置、通知中心、登录注册与找回密码，页面零件（页头、筛选、工具栏、空态、错误态）统一复用
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/></svg>'
    title: 快捷键与命令面板
    details: ⌘K 呼出全文搜索（⌘⇧S 同样可用）；常用页面可自定义快捷键，冲突会直接提示
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>'
    title: 对 Agent 友好
    details: pnpm check / verify 一把梭自证，pre-commit 与 CI 同源；AGENTS.md、架构决策与工作流文档随代码一起维护
---

## 快速开始

只使用公共组件时，安装已发布的 `0.2.3`：

```bash
pnpm add @runlume/admin-ui
```

```tsx
import { Button, Calendar, DataTable, Transfer } from '@runlume/admin-ui'
import '@runlume/admin-ui/styles.css'
```

需要完整后台模板、示例页面和主题配置时，再克隆仓库运行：

```bash
pnpm install
pnpm dev        # 应用 http://localhost:3200
pnpm docs:dev   # 本文档站 http://localhost:3210
pnpm check      # 格式 + 类型 + lint + 单测 + 生产构建
```

## 这套设计包含什么

| 层           | 位置                                                                                    | 说明                                                                |
| ------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 主题与 Token | `src/index.css`、`src/palettes.css`、`src/custom-palettes.css`、`src/accessibility.css` | 语义色、六套预设配色、基础色 × 主题色、无障碍覆盖                   |
| 布局外壳     | `src/components/console-layout.tsx`                                                     | 侧栏 + 顶栏 + 页签栏 + 面包屑 + 内容区，三种布局模式                |
| 基础控件     | `src/components/ui/`                                                                    | button / input / select / table / tabs / dialog 等，基于 Radix 原语 |
| 公共组件     | `src/components/`                                                                       | 表格、树、图表、设置面板、页型零件等后台语义组件                    |
| 纯逻辑       | `src/lib/`                                                                              | 偏好、i18n、树、分页、指标、表格偏好、快捷键                        |
| 标准页型     | `src/pages/`                                                                            | 工作台、客户列表与详情、设置、通知中心、登录注册                    |
| 组件总览     | `src/pages/design-system/`                                                              | 九类页面，改组件必须先在这里补示例                                  |

## 边界

这里只放**设计与交互层**：不放业务接口、认证、权限模型与业务规则。示例数据都是内存态，刷新即重置；
认证、上传、树拖拽、懒加载等通过 prop 注入（`uploader`、`onMove`、`loadChildren`、`onSignOut`）。

阅读顺序建议：[介绍](/guide/intro) → [准备工作](/guide/ready) → [组件总览](/components/) → [架构与决策](/guide/architecture)。
