---
description: 组件总览：ui/ 基础控件与带后台语义的公共组件，分类、使用约定与依赖说明。
---

# 组件总览

组件分两层：`src/components/ui/` 是基础控件（button / input / table / dialog），
`src/components/` 是带后台语义的公共组件（数据表格、树、图表、设置面板、页型零件）。

## 在线示例

启动 `pnpm dev` 后打开组件总览，每个能力都能直接交互（这一节也是组件改动的验收面）：

| 页面       | 地址                        | 内容                                                                                                |
| ---------- | --------------------------- | --------------------------------------------------------------------------------------------------- |
| 组件总览   | `/design-system`            | 品牌、语义色板、分类入口                                                                            |
| 基础控件   | `/design-system/basic`      | 按钮、输入、选择、勾选、标签、进度、步进、滑块、滚动区、折叠                                        |
| 表单与选择 | `/design-system/form`       | 表单、日期时间、验证码、密码强度、组合框、级联、多选、上传、提及                                    |
| 数据展示   | `/design-system/data`       | 表格（排序 / 列管理 / 密度 / 固定列 / 行内展开 / 虚拟滚动）、树、表格树、描述列表、时间线、布局容器 |
| 反馈与浮层 | `/design-system/feedback`   | 提示条、弹窗、抽屉、确认、菜单、提示、多步加载、右键菜单、悬停卡片、状态                            |
| 导航与流程 | `/design-system/navigation` | 面包屑、页签、步骤条、快捷键、页型入口                                                              |
| 指标与图表 | `/design-system/metrics`    | 指标卡、折线、柱状、环形、迷你柱、条形、热力、雷达、漏斗、甘特、代码块                              |
| 图标预览   | `/design-system/icons`      | lucide 全量图标（按需加载），点击复制组件名                                                         |
| 主题与设置 | `/design-system/theme`      | 配色、通知偏好、无障碍、品牌                                                                        |

## 文档分类

| 分类       | 文档                                 | 组件                                                                                                                                                                                    |
| ---------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 基础控件   | [基础控件](/components/basic)        | Button、Input、Textarea、Checkbox、Switch、RadioGroup、NativeSelect、Badge、Tag、Alert、Progress、Kbd、NumberField、Slider、ScrollArea、Collapsible、Separator、Skeleton                |
| 表单与选择 | [表单与选择](/components/form)       | Combobox、Cascader、MultiSelect、Mention、DateInput、DateRangeInput、DateTimeInput、InputOTP、PasswordStrength、FileUpload、ImagePreview、FixedBar                                      |
| 数据展示   | [数据展示](/components/data)         | DataTable、EditableTable、ColumnManager、Tree、TreeTable、Descriptions、Timeline、PagePager、PaginationBar、CursorPagination、LayoutContainer、TableToolbar、BulkActions、SearchFilters |
| 反馈与浮层 | [反馈与浮层](/components/feedback)   | Dialog、Sheet、AlertDialog、ConfirmDialog、DropdownMenu、ContextMenu、Tooltip、HoverCard、toast、MultiStepLoader、LoadingState / EmptyState / ErrorState、StatusBadge                   |
| 导航与流程 | [导航与流程](/components/navigation) | Breadcrumb、Tabs、Steps、Kbd、MenuSearch、PreferencesMenu、FavoritesMenu、PageTabs、UserMenu                                                                                            |
| 指标与图表 | [指标与图表](/components/metrics)    | CountTo、Trend、Sparkline、LineChart、ColumnChart、DonutChart、BarList、Heatmap、RadarChart、FunnelChart、GanttChart、MiniBars、CodeBlock                                               |
| 图标       | [图标](/components/icons)            | lucide-react 全量图标 + 动态按需加载                                                                                                                                                    |
| 主题与设置 | [主题与设置](/components/theme)      | ColorSettings、NotificationSettings、AccessibilitySettings、HeaderActionSettings、Brand、NotificationsButton                                                                            |
| 标准页型   | [标准页型](/components/pages)        | 工作台、列表、详情、设置、通知中心、登录 / 注册 / 找回密码、页面零件                                                                                                                    |

## 使用约定

**样式合并用 `cn()`**：所有组件都接受 `className`，内部用 `cn(clsx + tailwind-merge)` 合并，
传入的类名优先，不会产生样式冲突。

```tsx
import { cn } from '@/lib/utils'
;<Button className="w-full">提交</Button>
```

**颜色用语义 Token**：`bg-card`、`text-muted-foreground`、`border-border`、`text-success`，
不要写死色值，也不要直接引用 `--primary` 之外的内部变量。

**受控优先**：表单类组件都提供 `value` + `onValueChange`，非受控默认值只在演示里用。

**副作用靠 prop 注入**：组件不直接调接口。上传用 `uploader`，树排序用 `onMove`，
懒加载用 `loadChildren`，退出登录用 `onSignOut`。

**可访问性由组件负责**：`label` / `aria-label` 是必填项（例如 `Tree`、`Slider`、`Sparkline` 都要求传 `label`），
调用方不需要重复补 `role`。

## 依赖说明

基础控件基于 `radix-ui` 原语自建，图标用 `lucide-react`，表格用 `@tanstack/react-table`，
提示用 `sonner`，其余（图表、动效、树、分页）都是自绘或自己实现——**不引入 UI 框架与图表库**。
文档站用的 VitePress 只装在 devDependencies，不进应用产物。
