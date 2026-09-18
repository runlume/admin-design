---
description: 导航与流程：面包屑、标签页、步骤条、命令面板、页签栏、偏好菜单与页面过渡。
---

# 导航与流程

在线示例：`/design-system/navigation`。

## Breadcrumb

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link to="/">工作台</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>客户详情</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

外壳会自动根据路由生成面包屑；动态路由（例如 `/customers/:id`）的名称由 `ConsoleLayout` 的 `pageTitles`
控制，取最长匹配的父路径。**顶部导航模式下面包屑与顶部菜单分两行**，点击顶部菜单不改变这一层结构。

## Tabs

```tsx
<Tabs defaultValue="text">
  <TabsList>
    <TabsTrigger value="text">文字页签</TabsTrigger>
    <TabsTrigger value="icon">
      <Search aria-hidden="true" />
      图标页签
    </TabsTrigger>
    <TabsTrigger value="disabled" disabled>
      禁用页签
    </TabsTrigger>
  </TabsList>
  <TabsContent value="text">文字页签内容</TabsContent>
</Tabs>
```

两种形态同宽同高：纯文字与"图标 + 文字"。页签栏本身（页面级）的样式在
「设置 → 外观 → 页签」里切换 `card` / `line`。

## Steps

```tsx
<Steps
  current={step}
  items={[
    { value: 'verify', label: '验证身份', description: '手机号或邮箱' },
    { value: 'profile', label: '填写资料', description: '客户与联系人' },
    { value: 'done', label: '完成', description: '等待审核' },
  ]}
/>

<Steps current={1} status="error" items={errorItems} />
```

| prop      | 类型                               | 说明                                 |
| --------- | ---------------------------------- | ------------------------------------ |
| `items`   | `{ value, label, description? }[]` | 步骤定义                             |
| `current` | `number`                           | 当前下标（从 0 开始）                |
| `status`  | `process \| error`                 | 当前步骤状态；之前的步骤自动标记完成 |

## Kbd

```tsx
<KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup> 打开命令面板
```

快捷键提示统一用它渲染，不要手写 `<kbd>` 或用方括号拼字符串。

## 命令面板（MenuSearch）

```tsx
<MenuSearch groups={groups} />
```

- `⌘K`（Windows：`Ctrl+K`）呼出，搜索范围只有两处：**菜单**与**当前页已渲染的内容**（未展开、未加载、虚拟滚动之外的部分不在范围内）；`⌘⇧S` 作为兼容别名同样可用；
- 索引上限 400 条，按路由缓存，内容变化通过 `MutationObserver` 失效重建；
- `↑`/`↓` 选择、`Enter` 打开、`Esc` 关闭；近期打开过的结果会置顶（`menu-search.recent`）。

## PreferencesMenu

```tsx
<PreferencesMenu action="language" />   {/* 只要语言 */}
<PreferencesMenu action="theme" />      {/* 只要主题 */}
<PreferencesMenu />                     {/* 语言 + 主题 */}
```

顶栏的语言与主题入口就是它；`action` 用于把两项拆成两个按钮。

## 页签栏、收藏夹与用户菜单

| 组件                   | 说明                                                                      |
| ---------------------- | ------------------------------------------------------------------------- |
| `PageTabs`             | 页面级页签栏，记录打开过的页；样式由 `tabbarStyle`（`card` / `line`）决定 |
| `FavoritesMenu`        | 侧栏收藏夹，按 `userId` 隔离存储，缺权限的项标记失效                      |
| `NavigationGroup`      | 侧栏分组渲染（可折叠）；配合 `NavigationItems` 递归渲染多层菜单           |
| `UserMenu`             | 侧栏底部用户菜单：个人中心 / 设置 / 退出登录                              |
| `UserProfile`          | 个人中心内容，传 `onSignOut` 显示退出登录                                 |
| `UserSettings`         | 设置弹窗容器：外观、快捷操作、快捷键、通知、语言、主题                    |
| `HeaderActionSettings` | 顶栏快捷操作顺序配置（通知默认第二位）                                    |

## 页面过渡

过渡由根元素的 `data-transition` 驱动，取值见[布局外壳](/guide/layout)：
`none`、`fade`、`slide`、`slide-left`、`slide-right`、`slide-up`、`slide-down` 与 `auto`。
`auto` 时前进向左滑入、后退向右滑入、首屏与 replace 淡入；点顶栏刷新不播进入动画。

## 标准页型入口

列表、详情、设置、通知与登录注册都在标准外壳内组装，见[标准页型](/components/pages)。
