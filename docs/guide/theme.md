---
description: 主题与配色：语义 Token 的三处定义与分层、预设与自定义配色、深浅模式与无障碍覆盖。
---

# 主题与配色

## 三处定义，责任分明

| 文件                      | 负责                                                                 |
| ------------------------- | -------------------------------------------------------------------- |
| `src/index.css`           | **默认方案的语义 Token**（青绿），以及 Token → Tailwind 工具类的映射 |
| `src/palettes.css`        | 六套预设配色（`data-palette`）                                       |
| `src/custom-palettes.css` | 基础色 × 主题色自由组合（`data-base-color` × `data-theme-color`）    |
| `src/accessibility.css`   | 高对比、灰色、色弱、字号字重的覆盖                                   |

**颜色只走语义 Token**：页面写 `bg-card`、`text-muted-foreground`、`border-border`、`text-success`，
不写死色值。这样切主题、切配色、开高对比时业务代码零改动。

## 语义 Token 分层

| 类别       | Token                                                                                                            |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| 面层       | `background`、`card`、`popover`、`muted`、`accent`、`secondary`、`sidebar`                                       |
| 文字       | `foreground`、`muted-foreground`、`*-foreground`                                                                 |
| 边框与焦点 | `border`、`input`、`ring`、`table-border`                                                                        |
| 品牌       | `brand-lime`、`brand-lime-foreground`（面层色，随方案色相走）                                                    |
| 语义       | `success`、`warning`、`info`、`danger`（各带 `-soft` 面层）                                                      |
| 业务状态   | `suspended`（已暂停，暖橙）、`disabled`（已停用，石墨灰）、`inactive`（未启用，石板蓝）、`unknown`（未知，雾紫） |

状态色刻意彼此分开：待处理的琥珀、已暂停的暖橙、已停用的石墨灰、未启用的石板蓝、未知的雾紫，
在灰度打印或色弱模式下也能靠色相区分，配合 `StatusBadge` 的文字与图标双重编码。

## 预设配色

六套预设，值定义在 `palettes.css`，切换时只改根元素上的 `data-palette`：

| 值         | 名称         | 特点                                         |
| ---------- | ------------ | -------------------------------------------- |
| `teal`     | 青绿（默认） | 品牌方案，与官网一致，青柠绿面层 + 青绿主色  |
| `blue`     | 海蓝         | 面层到文字按统一色度阶梯递进，最"标准"的一套 |
| `forest`   | 森林         | 偏暖灰绿                                     |
| `violet`   | 暮紫         | 中性偏冷，适合数据密集型界面                 |
| `amber`    | 琥珀         | 沙金暖调                                     |
| `graphite` | 石墨         | 中性冷灰，面层 60% 深度                      |

## 自定义配色

「设置 → 配色」里可以自由组合：**基础色 7 种**（`neutral`、`stone`、`zinc`、`mauve`、`olive`、`mist`、`taupe`）
× **主题色 18 种**（`default`、`amber`、`blue`、`cyan`、`emerald`、`fuchsia`、`green`、`indigo`、`lime`、`orange`、
`pink`、`purple`、`red`、`rose`、`sky`、`teal`、`violet`、`yellow`）。

浅色与深色各存一份（`customColors.light` / `customColors.dark`），选中后 `data-palette` 变为 `custom`，
根元素同时带上 `data-base-color` 与 `data-theme-color`。

## 深浅模式

`theme` 取 `light`、`dark`、`system` 三态。`system` 跟随系统 `prefers-color-scheme`。
首屏防闪烁脚本内联在 `index.html`：在 React 挂载前就把 `dark` 类、`data-palette`、
`data-base-color`、`data-theme-color` 和无障碍属性写到 `<html>` 上，避免刷新时先亮后暗。

## 无障碍覆盖

| 设置       | 取值                    | 效果                                        |
| ---------- | ----------------------- | ------------------------------------------- |
| 字号       | 100 / 112.5 / 125 / 150 | 根元素 `data-font-scale`，影响所有 rem 尺寸 |
| 字重       | default / medium / bold | 覆盖 `--a11y-weight-*`，全局加粗一档        |
| 高对比     | 开 / 关                 | 提升边框与文字对比度                        |
| 减少动效   | 开 / 关                 | 过渡与数字滚动动画降级                      |
| 链接下划线 | 开 / 关                 | 链接始终带下划线                            |
| 灰色模式   | 开 / 关                 | 全站转灰度，便于打印与聚焦层次              |
| 色弱模式   | 开 / 关                 | 提高饱和度与对比度，帮助区分状态色          |

## 新增一套预设配色

1. 在 `palettes.css` 里加 `:root[data-palette='xxx']` 与 `:root.dark[data-palette='xxx']` 两组变量。
2. 在 `src/lib/appearance.ts` 的 `palettes` 数组里登记值，`resolvePalette` 会自动接受。
3. 在 `src/lib/i18n.ts` 里补显示名（中英同步）。
4. 配色面板会自动多出一项（`ColorSettings` 从 `palettes` 读取）。
5. 用「设置 → 无障碍 → 高对比」与深色模式各看一遍，确认语义色对比度仍然达标（e2e 里有 AA 断言）。
