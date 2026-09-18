---
description: 基础控件：Button、Input、Checkbox、Switch、Badge、Alert、Progress 等原子控件的用法与示例。
---

# 基础控件

在线示例：`/design-system/basic`（启动 `pnpm dev` 后打开）。

## Button

```tsx
import { Button } from '@/components/ui/button'

<Button>主要</Button>
<Button variant="secondary">次要</Button>
<Button variant="outline">描边</Button>
<Button variant="ghost">幽灵</Button>
<Button variant="success">成功</Button>
<Button variant="warning">警告</Button>
<Button variant="destructive">危险</Button>
<Button variant="link">链接</Button>
```

| prop      | 类型                                                                                    | 默认      | 说明                                                          |
| --------- | --------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------- |
| `variant` | `default \| secondary \| outline \| ghost \| success \| warning \| destructive \| link` | `default` | 语义变体                                                      |
| `size`    | `default \| xs \| sm \| lg \| icon \| icon-xs \| icon-sm \| icon-lg`                    | `default` | 尺寸                                                          |
| `loading` | `boolean`                                                                               | `false`   | 显示转圈图标并自动禁用，避免重复提交                          |
| `asChild` | `boolean`                                                                               | `false`   | 用子元素渲染（例如包 `<Link>`）；此时只保留禁用语义，不插图标 |

```tsx
<Button variant="outline" loading>提交中</Button>
<Button asChild><Link to="/customers">去列表</Link></Button>
```

::: tip 为什么 `asChild` 时不显示加载图标
Radix 的 `Slot` 只接受单个子元素。加载态需要插入图标，两者同时开启会让 Slot 收到两个 children 并直接崩溃，
所以 `asChild` 时只保留 `disabled` / `aria-busy`。
:::

## Input / Textarea

```tsx
<Input placeholder="请输入关键字" />
<Input clearable value={keyword} onChange={(e) => setKeyword(e.target.value)} onClear={() => setKeyword('')} />
<Input start={<Search aria-hidden="true" className="size-3.5" />} />
<Input end={<span className="text-xs">.com</span>} />
<Input type="password" defaultValue="runlume-2026" />
<Textarea rows={2} placeholder="补充说明" />
```

| prop            | 类型         | 说明                                                                           |
| --------------- | ------------ | ------------------------------------------------------------------------------ |
| `start` / `end` | `ReactNode`  | 前后缀插槽（图标、单位、按钮）                                                 |
| `clearable`     | `boolean`    | 有值时显示清空按钮，配合 `onClear`                                             |
| `onClear`       | `() => void` | 清空回调（组件不直接改值）                                                     |
| `type`          | `string`     | `password` 自动加可见切换；`date` / `time` / `datetime-local` 走日期与时间组件 |
| `aria-invalid`  | `boolean`    | 错误态，边框与焦点环转为 danger                                                |

::: warning 别用"有没有值"决定 DOM 结构
输入框的包裹结构只由属性决定。如果按"是否有值"切换结构，清空按钮出现 / 消失会重挂载 input，
连续输入时会丢焦点。
:::

## Checkbox / Switch / RadioGroup

```tsx
<label className="flex items-center gap-2 text-sm">
  <Checkbox defaultChecked /> 已选中
</label>
<Checkbox indeterminate />            {/* 半选：列表全选、父节点级联 */}
<Switch checked={notify} onCheckedChange={setNotify} aria-label="通知开关" />

<RadioGroup defaultValue="week">
  <RadioGroupItem value="week" aria-label="按周" />
</RadioGroup>
```

| 组件         | 关键 prop                                                        |
| ------------ | ---------------------------------------------------------------- |
| `Checkbox`   | `checked` / `defaultChecked`、`indeterminate`、`onCheckedChange` |
| `Switch`     | `checked`、`onCheckedChange`、`disabled`                         |
| `RadioGroup` | `value` / `defaultValue`、`onValueChange`、`orientation`         |

## NativeSelect / Label / Separator / Skeleton

```tsx
<Label htmlFor="gallery-select">下拉选择</Label>
<NativeSelect id="gallery-select" defaultValue="a">
  <option value="a">选项一</option>
  <option value="c" disabled>禁用选项</option>
</NativeSelect>
<Separator />
<Skeleton className="h-4 w-32" />
```

原生 `select` 用于选项少、不需要搜索的场景；需要搜索 / 分组用 [Combobox](/components/form)，
需要多选 / 带描述用 `Select` 与 `MultiSelect`。

## Badge / Tag

```tsx
<Badge>实心徽标</Badge>
<Badge variant="outline">描边徽标</Badge>
<Badge variant="secondary" onClose={() => remove(tag)} closeLabel={`移除 ${tag}`}>{tag}</Badge>

<Tag tone="success" icon={<CircleCheck aria-hidden="true" />}>已完成</Tag>
<Tag tone="warning" closable onClose={clear}>待复核</Tag>
```

| 组件    | 取值                                                              | 用途                                  |
| ------- | ----------------------------------------------------------------- | ------------------------------------- |
| `Badge` | `default \| secondary \| destructive \| outline \| ghost \| link` | 计数、状态附标；传 `onClose` 变可关闭 |
| `Tag`   | `default \| primary \| success \| warning \| danger \| outline`   | 带语义色的标签，支持图标与关闭        |

## Alert

```tsx
<Alert variant="info" title="示例环境" description="数据仅用于演示，刷新后恢复初始状态。" />
<Alert
  variant="warning"
  title="额度即将用尽"
  description="本月剩余额度不足 10%，请及时调整用量。"
  action={<Button size="sm" variant="outline">查看用量</Button>}
/>
```

| prop                    | 类型                                   | 说明                     |
| ----------------------- | -------------------------------------- | ------------------------ |
| `variant`               | `info \| success \| warning \| danger` | 四态，图标与配色自动匹配 |
| `title` / `description` | `ReactNode`                            | 标题与正文               |
| `action`                | `ReactNode`                            | 底部操作区               |
| `onClose`               | `() => void`                           | 传入后显示关闭按钮       |

## Progress

```tsx
<Progress value={72} label="导出进度" />
<Progress value={38} tone="warning" label="额度使用" />
<Progress value={12} tone="danger" label="失败比例" />
```

`tone` 取 `primary | success | warning | danger | info`，`value` / `max` 控制比例，`label` 会写到 `aria-label`。

## Kbd

```tsx
;<KbdGroup>
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>
打开命令面板
```

## NumberField / Slider

```tsx
<NumberField label="并发数" value={concurrency} min={1} max={20} onValueChange={setConcurrency} />
<NumberField label="超时" value={timeout} unit="秒" onValueChange={setTimeout} />
<Slider label="告警阈值" value={threshold} onValueChange={setThreshold} max={100} step={5} ticks={[0, 50, 100]} />
```

| 组件          | 关键 prop                                                                            |
| ------------- | ------------------------------------------------------------------------------------ |
| `NumberField` | `value`、`onValueChange`、`min`、`max`、`step`、`unit`、`label`（必填）              |
| `Slider`      | `value: number[]`、`onValueChange`、`min` / `max` / `step`、`ticks`、`label`（必填） |

## ScrollArea / Collapsible

```tsx
<ScrollArea className="h-32 rounded-lg border">
  <ul className="divide-y text-sm">…</ul>
</ScrollArea>

<Collapsible>
  <CollapsibleTrigger>查看字段说明</CollapsibleTrigger>
  <CollapsibleContent>并发数影响同步任务的资源占用，超过 20 需要审批。</CollapsibleContent>
</Collapsible>
```

滚动区用于固定高度的长列表；折叠区用于收纳次要说明，**不替代页面级的"更多筛选"**（那是 `SearchFilters` 的职责）。
