---
description: 无障碍：键盘可达、焦点管理、语义属性、对比度与用户可调的辅助选项，以及改动时的自检清单。
---

# 无障碍

无障碍不是附加功能，而是这套外壳的默认行为；改动交互时不要破坏下面任何一条。

## 键盘可达

- 所有可交互元素都是原生 `button` / `a` / `input`，或 Radix 原语提供的可聚焦节点。
- 侧栏菜单、命令面板、下拉、树、步骤条都能只用键盘走完：`Tab` 移动、`Enter` / `Space` 触发、`Esc` 关闭。
- 命令面板：`⌘K` 打开（`⌘⇧S` 同样可用），`↑`/`↓` 选择，`Enter` 打开结果，`Esc` 关闭。
- 对话框拖动：聚焦标题栏后用方向键微调位置，`Shift` 加速，双击标题复位。
- 树节点可键盘展开 / 收起、移动到节点上、按拖拽协议排序。

## 焦点管理

- 对话框打开时焦点进入内容区，关闭后回到触发元素；`src/lib/dialog-focus.ts` 里的 `avoidInitialCloseFocus`
  防止"关闭按钮抢初始焦点"导致误触。
- 浮层统一由 Radix 负责焦点陷阱与 `Esc` 关闭，业务侧不要自己 `preventDefault` 掉这些行为。
- 模态浮层（对话框、抽屉、下拉菜单、右键菜单、选择器）打开时，背景同时被标记 `aria-hidden` 与 `inert`：
  前者来自 Radix，后者由 `src/lib/overlay-suppression.ts` 补上。只加 `aria-hidden` 的话，背景控件仍在
  Tab 顺序里——屏幕阅读器看不到、键盘却能走过去，原生 `<dialog>.showModal()` 则是整体 `inert`。
  浮层自身与其中的菜单项、选项不受影响；关闭时按引用计数撤销，不会把 `inert` 留在页面上。
- 对话框拖动时**标题保持不可选中**（否则拖拽会顺手选中文本），但也不阻止复制标题内容——这是刻意的折中。

## 语义与属性

- 页面结构：`<header>`（页头）、`<main>`（内容）、`<ol>`（步骤条）、`<table>`（表格，含 `caption`）。
- 表格：`aria-sort` 表达排序方向，行内展开按钮带 `aria-expanded`，虚拟滚动只影响渲染不影响可访问树。
- 表单：`Label` 与控件用 `htmlFor` / `id` 关联，错误态走 `aria-invalid` + `text-destructive` 文案。
- 图标一律 `aria-hidden="true"`，可点图标按钮必须给 `aria-label`。
- 纯装饰图形（迷你趋势线等）提供 `role="img"` + `aria-label`，把"图形在说什么"讲清楚。

## 对比度

- 语义色（success / warning / info / danger）与各自 `-soft` 面层的组合按 **WCAG AA** 校验。
- `src/test/e2e/a11y.spec.ts` 用 axe 扫描 9 个总览页的**浅色与深色**两套语义色，改 Token 后必须重跑
  `pnpm test:e2e`；对比度不足要改 Token 或样式，不能加豁免。
- 浮层展开态单独扫描：除"背景被有意隐藏"导致的 `landmark-one-main` / `page-has-heading-one` / `region`
  三条 best-practice 规则外，其余规则一律零容忍。
- 「设置 → 无障碍 → 高对比」会进一步加深边框与文字，深色模式也要成立。

## 用户可调的辅助选项

| 选项       | 取值                    | 实现                                                        |
| ---------- | ----------------------- | ----------------------------------------------------------- |
| 字号       | 100 / 112.5 / 125 / 150 | `data-font-scale`                                           |
| 字重       | 默认 / 中等 / 粗体      | `--a11y-weight-*`                                           |
| 高对比     | 开 / 关                 | `data-high-contrast`                                        |
| 减少动效   | 开 / 关                 | `data-reduce-motion`，同时尊重系统 `prefers-reduced-motion` |
| 链接下划线 | 开 / 关                 | `data-underline-links`                                      |
| 灰色模式   | 开 / 关                 | `data-grayscale`                                            |
| 色弱模式   | 开 / 关                 | `data-color-weak`                                           |

这些属性在 `index.html` 的内联脚本里于首屏前写入根元素，避免"先正常再变灰"的闪烁。

## 改动时的自检

1. 只用键盘能否完成这次交互？焦点有没有掉到 `body`？
2. 展开浮层时，背景控件还能不能 Tab 进去？关闭后焦点回到触发器了吗？
3. 深色 + 高对比下，文字与背景还能分清吗？
4. 打开「减少动效」后，是否还有必须等完的动画？
5. 新加的图标按钮有没有 `aria-label`？新加的表单控件有没有 `Label` 关联？
6. 有没有把可聚焦控件放进 `role="slider"` 这类容器（会触发 `nested-interactive`）？
7. `pnpm test:e2e` 的 `a11y.spec.ts` 与键盘用例是否仍然通过？
