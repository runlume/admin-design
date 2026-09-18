---
description: 反馈与浮层：toast、Dialog、Sheet、确认框、菜单提示，以及加载、空、错误三类状态的约定。
---

# 反馈与浮层

在线示例：`/design-system/feedback`。

## 提示消息（toast）

四种提示都保持**中性面层**，只用文字与图标着色，避免整块弹窗染成红绿导致视觉噪音：

```tsx
import { toast } from 'sonner'

toast.success(t('sample.saved')) // 成功：对勾 + success 色
toast.error(t('errorDefault')) // 失败：警告圈 + danger 色
toast.warning(t('sample.warning')) // 警告：三角 + warning 色
toast.info(t('notifications.settingsHint')) // 普通：信息 + info 色
```

容器挂在 `Providers` 里（`sonner`），全局只声明一次，页面直接 `toast.*` 即可。
需要更长的说明或操作按钮时改用页内 `Alert`，不要堆长文案到 toast。

## Dialog

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">打开弹窗</Button>
  </DialogTrigger>
  <DialogContent draggable>
    <DialogHeader>
      <DialogTitle>弹窗标题（可拖动）</DialogTitle>
      <DialogDescription>桌面端拖动标题栏移动窗口，方向键微调，双击标题复位。</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">取消</Button>
      <Button>确定</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

| prop              | 类型                  | 默认    | 说明                                                                                                   |
| ----------------- | --------------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| `draggable`       | `boolean \| 'always'` | `false` | `true` 只在精细指针（鼠标 / 触控板）生效；`'always'` 连大触摸屏也能拖（标题栏设 `touch-action: none`） |
| `zIndex`          | `number`              | —       | 覆盖浮层层级，仅在与第三方浮层叠加时使用                                                               |
| `top`             | `number`              | —       | 距顶部距离（px）；不传则垂直居中                                                                       |
| `showCloseButton` | `boolean`             | `true`  | 是否显示右上角关闭                                                                                     |

拖动实现要点（改之前先看清楚）：

- 拖动区是**整条标题栏**，鼠标移到标题栏变抓取手势；
- 有 4px 启动阈值，轻微抖动不会让窗口飘走；
- 拖动期间关闭过渡动画，松手后才恢复，避免"追着鼠标跑"的滞后感；
- 位移叠加在 Tailwind 的 `--tw-translate-x/y` 上（不是直接写 `translate` 属性）：居中用的
  `translate-x/y-[-50%]` 走的也是这两个变量，直接覆盖会把居中一起抹掉，表现为"一按下弹窗跳半个身位"；
- 拖拽层不覆盖顶栏其余可点区域，标题文字保持可选中（还要支持复制标题）。

## Sheet（抽屉）

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">打开抽屉</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>抽屉标题</SheetTitle>
      <SheetDescription>侧边抽屉用于次级表单与详情。</SheetDescription>
    </SheetHeader>
    <SheetFooter>
      <Button>保存</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

抽屉用于"不离开当前列表"的次级任务；需要强中断的场景用 `Dialog`。

## AlertDialog 与 ConfirmDialog

`AlertDialog` 是 Radix 原生二次确认；模板里更常用的是封装后的 `ConfirmDialog`，
它内置页脚、语义色与**异步 loading**：

```tsx
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  tone="danger"
  title="删除所选记录？"
  description="删除后无法恢复，关联订单会保留但标记为待处理。"
  confirmLabel="删除"
  onConfirm={async () => {
    await api.remove(ids) // 等待期间确认按钮 loading 且不可重复提交
  }}
/>
```

`tone` 取 `default | danger | warning`；`onConfirm` 返回 Promise 时会自动接管 pending 状态。

## 菜单与提示

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild><Button variant="outline">下拉菜单</Button></DropdownMenuTrigger>
  <DropdownMenuContent align="start">
    <DropdownMenuLabel>分组标题</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>菜单项</DropdownMenuItem>
    <DropdownMenuItem disabled>禁用项</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

<ContextMenu>…右键菜单…</ContextMenu>

<Tooltip>
  <TooltipTrigger asChild><Button variant="outline">悬停提示</Button></TooltipTrigger>
  <TooltipContent>提示内容</TooltipContent>
</Tooltip>

<HoverCard>…悬停卡片，用于展示负责人、客户等摘要…</HoverCard>
```

| 组件           | 触发方式    | 适合                         |
| -------------- | ----------- | ---------------------------- |
| `DropdownMenu` | 点击        | 操作集合、列管理、密度切换   |
| `ContextMenu`  | 右键        | 行级快捷操作                 |
| `Tooltip`      | 悬停 / 聚焦 | 一句话说明，不能放交互元素   |
| `HoverCard`    | 悬停        | 富内容预览（人员、客户卡片） |

## 多步加载

```tsx
<MultiStepLoader
  current={step}
  steps={[
    { key: 'auth', label: '校验身份与权限', description: '读取当前账户与角色' },
    { key: 'fetch', label: '拉取业务数据', description: '分页拉取并合并' },
    { key: 'render', label: '生成视图', description: '写入缓存并渲染' },
  ]}
/>
```

`current` 为步骤下标（`0..steps.length`），用于初始化、导入、报表生成这类**有阶段**的长任务；
没有阶段时用普通 `LoadingState`。

## 状态：加载 / 空 / 错误

```tsx
<LoadingState />                        {/* 默认 spinner */}
<LoadingState variant="dots" />         {/* spinner / dots / bars */}
<EmptyState title="暂无客户" action={<Button>新建客户</Button>} />
<ErrorState message={t('errorDefault')} traceId="trace-8f2c91" retry={refetch} />
```

| 组件           | 关键 prop                                                            |
| -------------- | -------------------------------------------------------------------- |
| `LoadingState` | `variant: spinner \| dots \| bars`、`label`                          |
| `EmptyState`   | `title`、`description`、`action`、`icon`、`size: default \| compact` |
| `ErrorState`   | `message`、`traceId`（可复制）、`retry`                              |

列表页三态统一用这三个组件，不要各页自己写一套。`traceId` 会以可复制的形式展示，方便和日志对齐。

## StatusBadge

```tsx
<StatusBadge status="ACTIVE" />
```

支持的状态：`ACTIVE`、`PENDING`、`PROCESSING`、`FAILED`、`DISABLED`、`INACTIVE`、`SUSPENDED`、`UNKNOWN`。
每个状态有独立色族，并带一个**色点 + 文字**的双重编码；未知状态回落到 `UNKNOWN` 而不是报错。

## 权限：Can / RequirePermission

```tsx
<Can permission="customer:create"><Button>新建客户</Button></Can>
<Can permission="customer:export" fallback={<Button disabled>导出</Button>}>…</Can>

<RequirePermission permission="audit:view"><AuditTable /></RequirePermission>
```

- `Can`：按钮 / 区块级，没有权限就不渲染，或用 `fallback` 换成禁用态。
- `RequirePermission`：路由级，没有权限渲染 `ForbiddenPage`（403）。
- 两者都读 `usePermission()`，权限码来自 `PermissionProvider`；没挂 Provider 时按**无权限**处理。

菜单过滤、路由守卫、按钮鉴权的完整链路见[动态菜单与权限](/guide/dynamic-menu)。
