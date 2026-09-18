---
description: 主题与设置：配色、通知偏好、无障碍、顶栏快捷操作、品牌与通知按钮等设置面板。
---

# 主题与设置

在线示例：`/design-system/theme`。这一组是"设置面板"本身，业务系统把它们挂在用户设置弹窗里即可。

## ColorSettings（配色）

```tsx
<ColorSettings />
```

两块内容：

1. **快捷预设**：六套方案（青绿 / 海蓝 / 森林 / 暮紫 / 琥珀 / 石墨）；
2. **基础色 × 主题色**：基础色 7 种、主题色 18 种自由组合，浅色与深色各存一份。

选中预设后根元素的 `data-palette` 变为对应值；用自定义时变为 `custom`，并带上
`data-base-color` 与 `data-theme-color`。色块直接读 CSS 变量，所以**不会出现"色块没加载"的空白格**——
新增选项时记得同时补 `custom-palettes.css` 的变量，否则色块会是透明。

## NotificationSettings（通知偏好）

```tsx
<NotificationSettings />
```

站内、邮件、桌面提醒与汇总频率；偏好存浏览器（`notifications` 存储键），服务端的通知数据不在这一层。
配套入口是顶栏的 `NotificationsButton`。

## AccessibilitySettings（无障碍）

```tsx
<AccessibilitySettings />
```

| 设置       | 取值                    |
| ---------- | ----------------------- |
| 字号       | 100 / 112.5 / 125 / 150 |
| 字重       | 默认 / 中等 / 粗体      |
| 高对比     | 开 / 关                 |
| 减少动效   | 开 / 关                 |
| 链接下划线 | 开 / 关                 |
| 灰色模式   | 开 / 关                 |
| 色弱模式   | 开 / 关                 |

细节见[无障碍](/guide/accessibility)。设置项要遵守两个约定：
「查看字号设置」这类跳转**不加下划线**（避免看起来像正文链接），
以及所有开关写入根元素属性而不是只改组件局部样式。

## HeaderActionSettings（顶栏快捷操作）

```tsx
<HeaderActionSettings />
```

调整顶栏六个入口的顺序与显隐：搜索、**通知（默认第二位）**、刷新、全屏、语言、主题。
用户改过顺序后，新版本新增的入口会按默认位置插回，不会消失。

## Brand（品牌）

```tsx
<Brand />            {/* 完整标识（按深浅模式自动切换） */}
<Brand compact />    {/* 只显示方标，用于侧栏收起态 */}
```

资源来自 `public/brand/` 下的 `mark.svg`、`mark-dark.svg`、`wordmark-light.svg`、`wordmark-dark.svg`，
**不新建图片**：换品牌直接覆盖同名文件。

## NotificationsButton（顶栏通知）

```tsx
<NotificationsButton />
```

显示未读角标，点开是最近通知列表，与通知中心页面共享同一份状态（`src/lib/notifications.ts`）。
默认排在顶栏第二位。
