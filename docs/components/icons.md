---
description: 图标：统一使用 lucide-react、命名换算、按需加载方式与图标预览页。
---

# 图标

在线示例：`/design-system/icons`。

## 图标来源

图标统一用 [lucide-react](https://lucide.dev/)（已在依赖里），不要混用多套图标库，
也不要在业务代码里手写 SVG（除图表这类自绘图形）。

```tsx
import { CalendarDays, Search } from 'lucide-react'

<CalendarDays className="size-4" aria-hidden="true" />
<Button><Search aria-hidden="true" />搜索</Button>
```

约定：

- 装饰性图标一律 `aria-hidden="true"`；
- 只用图标表达的按钮必须给 `aria-label`（例如 `<Button size="icon" aria-label="删除"><Trash2 aria-hidden="true" /></Button>`）；
- 尺寸用 `size-4` / `size-3.5` 这类工具类，不要写 `w-4 h-4`；
- 图标颜色跟随文字（`currentColor`），不要单独写颜色。

## 图标预览页

`/design-system/icons` 加载 lucide 的**全部图标**，支持：

- 关键字搜索（按组件名，例如 `Arrow`、`Chart`）；
- 分页浏览（每页 96 个）；
- 点击任意图标复制组件名，方便直接粘到代码里；
- 底部的导入语句复制按钮。

## 按需加载，不膨胀主包

```tsx
import { DynamicIcon, dynamicIconImports } from 'lucide-react/dynamic'

const all = Object.keys(dynamicIconImports)   // 2000+ 图标名（kebab-case）

<DynamicIcon name="calendar-days" className="size-5" aria-hidden="true" />
```

预览页用动态入口，只有可视区用到的图标包会被加载，避免把全量图标打进主包。
**业务代码仍然按需具名导入**：`import { Search } from 'lucide-react'`，
动态入口只用于"要枚举全部图标"的场景（图标选择器、图标预览）。

## 命名换算

`dynamicIconImports` 的键是 kebab-case（`arrow-down-0-1`），组件名是 PascalCase（`ArrowDown01`）。
预览页里存了两种形式并以此展示，复制的是**组件名**。注意形如 `arrow-down-0-1` 与 `arrow-down-01`
会映射到同一个组件名，列表的 key 用 kebab 名而不是组件名，否则会有重复 key。
