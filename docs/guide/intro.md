---
description: 介绍：这套标准后台模板解决什么问题、技术栈、包含与不包含什么，以及推荐的阅读顺序。
---

# 介绍

本项目从 [Runlume](https://runlume.app) 平台前端提取出来，是一套「标准后台」模板：**主题与语义 Token、布局外壳、公共组件、标准页型和一整套组件总览**。
业务系统只需要接自己的菜单、文案、身份与接口，界面语言、交互细节与视觉规范直接用这一份。

## 它解决什么问题

多个后台系统各写一套按钮、表格、弹窗和配色，最后一定会出现三种结果：同一功能四种交互、改一次主题要改几十个文件、
新同学不知道哪个组件才是"标准件"。这个模板把这一层收口：

- **一处定义颜色**：`src/index.css` 是全部语义 Token 的唯一来源，页面只用 `bg-card`、`text-muted-foreground`、`text-success` 这类工具类。
- **一处定义外壳**：侧栏、顶栏、页签栏、面包屑、页面过渡、偏好与无障碍设置都在 `ConsoleLayout` 里统一处理，页面只渲染内容。
- **一处验收组件**：`/design-system` 及其分类页就是验收面，组件改了总览必须同步，避免"文档和实现两张皮"。

## 技术栈

| 方向       | 选型                                                           |
| ---------- | -------------------------------------------------------------- |
| 框架       | React 19 + TypeScript（`strict` + `noUncheckedIndexedAccess`） |
| 构建       | Vite 8，产物默认在 `dist/`                                     |
| 样式       | Tailwind CSS 4 + 语义 Token（CSS 变量）                        |
| 无障碍原语 | Radix UI（`radix-ui` 单包）                                    |
| 状态       | Zustand（只放偏好与本地 UI 状态）                              |
| 路由       | react-router 7（`createBrowserRouter`）                        |
| 国际化     | i18next + react-i18next                                        |
| 测试       | Vitest + Testing Library + Playwright                          |
| 文档站     | VitePress（只装在 devDependencies，不进应用产物）              |

## 包含什么

| 层           | 位置                                                                        | 说明                                                       |
| ------------ | --------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 主题与 Token | `src/index.css`、`palettes.css`、`custom-palettes.css`、`accessibility.css` | 语义色、六套预设配色、基础色 × 主题色组合、无障碍覆盖      |
| 布局外壳     | `src/components/console-layout.tsx`                                         | 侧栏 + 顶栏 + 页签栏 + 面包屑 + 内容区，三种布局模式       |
| 基础控件     | `src/components/ui/`                                                        | button / input / select / table / tabs / dialog 等通用控件 |
| 公共组件     | `src/components/`                                                           | 表格、树、图表、设置面板、页型零件等带后台语义的组件       |
| 纯逻辑       | `src/lib/`                                                                  | 偏好、i18n、树、分页、指标、表格偏好、快捷键               |
| 标准页型     | `src/pages/`                                                                | 工作台、客户列表与详情、设置、通知中心、登录注册与找回密码 |
| 组件总览     | `src/pages/design-system/`                                                  | 按类型拆分的九类页面                                       |

## 不包含什么

这里只放**设计与交互层**，下面这些需要业务系统自己接（组件已经把接口留出来）：

- 认证与会话、API 客户端与错误码、权限模型与业务规则；
- 上传实现、树拖拽落库、懒加载取数等副作用（`uploader`、`onMove`、`loadChildren`）；
- 图表库与装饰性营销动效、二维码 / 代码高亮 / Iconify 图标库等重依赖能力。

示例数据全部是内存态（`src/pages/sample-data.ts`、`src/lib/notifications.ts`），刷新即恢复初始值；只有**偏好类设置**会写进浏览器。

## 阅读顺序

1. [准备工作](/guide/ready)：装依赖、跑起来、常用命令。
2. [目录结构](/guide/structure)：什么代码该放哪一层。
3. [组件总览](/components/)：有哪些能直接用的组件。
4. [作为模板使用](/guide/start)：复制到业务仓库后的七步改造。
5. [架构与决策](/guide/architecture)：为什么这么分层，以及已知取舍。
