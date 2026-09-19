---
description: 动态菜单与权限：后台下发菜单的字段约定、层级与外链处理，以及前端按角色渲染的权限链路。
---

# 动态菜单与权限

后台系统的两类常见需求：**菜单由后台下发**（不同租户、不同套餐看到的入口不同），
以及**前端按权限渲染**（同一份菜单，不同角色能看的、能点的不同）。两件事在这里是一条链路：

```text
菜单接口 ─► normalizeRemoteMenu() ─► 合并本地菜单 ─► 侧栏（层级 + 外链 + 权限过滤）
                                            └────► 动态路由（RequirePermission 守门）
                                                        └────► 按钮级鉴权（<Can>）
```

| 位置                         | 文件                                  |
| ---------------------------- | ------------------------------------- |
| 菜单归一（纯逻辑，含容错）   | `src/lib/remote-menu.ts`              |
| 权限码判定（纯逻辑）         | `src/lib/permissions.ts`              |
| 菜单接口 + 合并 + 加载       | `src/app/remote-menu.ts`              |
| 动态组件注册表               | `src/app/remote-pages.tsx`            |
| 会话与测试账号               | `src/app/session.ts`                  |
| 菜单 / 路由 / 按钮的权限组件 | `src/components/permission.tsx`       |
| 侧栏层级渲染                 | `src/components/navigation-group.tsx` |

## 菜单接口的字段

接口返回 `{ groups, items }`，示例见 `src/pages/sample-data.ts` 的 `remoteMenuSample`：

```json
{
  "groups": [
    { "id": "dynamic", "labelKey": "sample.navGroupDynamic", "icon": "braces", "order": 1 }
  ],
  "items": [
    {
      "path": "/insight",
      "label": "经营分析",
      "icon": "chart-pie",
      "permission": "example.admin.insight.view",
      "children": [
        { "path": "/reports", "label": "报表中心", "component": "reports-page" },
        {
          "path": "/audit",
          "label": "操作日志",
          "component": "audit-page",
          "permission": "example.admin.audit.view"
        }
      ]
    },
    {
      "path": "/official-site",
      "label": "官网",
      "external": "https://runlume.app",
      "target": "blank"
    },
    {
      "path": "/repository",
      "label": "GitHub 仓库",
      "icon": "github",
      "external": "https://github.com/runlume/admin-design",
      "target": "blank"
    },
    {
      "path": "/tools/docs",
      "label": "文档（iframe）",
      "external": "http://localhost:3210",
      "target": "iframe"
    }
  ]
}
```

这段就是示例数据 `remoteMenuSample` 的结构：外链与「经营分析」**同级**挂在分组下，`children` 才是它的子菜单。
`icon` 既可以是 lucide 图标名，也可以是自绘 SVG（示例里的 `github` 就是自己画的标识）。

| 字段                 | 说明                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------- |
| `path`               | 站内路径（自动补前导斜杠、去掉末尾斜杠）；纯外链可以省略                                    |
| `external`           | 外链地址：给了就是外链菜单                                                                  |
| `target`             | 外链打开方式：`blank`（默认，新窗口）/ `self`（当前窗口）/ `iframe`（站内内嵌）             |
| `label` / `labelKey` | 直接用文案，或给 i18n key（都不给就用路径兜底）                                             |
| `icon`               | lucide 图标名，`chart-line` / `ChartLine` / `chart_line` 都认；查不到用占位图标并记 warning |
| `component`          | 组件键，对应 `src/pages/**/*-page.tsx`；不填表示指向已有的本地路由                          |
| `group`              | 归属分组 id，不存在时落到兜底分组 `remote`                                                  |
| `order`              | 排序，越小越靠前；不填按数组下标                                                            |
| `hidden`             | 只注册路由、不出现在菜单（详情页、灰度页）                                                  |
| `permission`         | 权限码，字符串或数组                                                                        |
| `children`           | 子菜单；子项继承父级的 `group` / `permission` / `hidden`                                    |

**容错**：缺 `path`、重复路径、未知分组、超过层级上限、非法响应都会被丢掉或降级，并写进
`normalizeRemoteMenu()` 的 `warnings`；开发环境会把 warnings 打到控制台。
一条脏数据不会让整个菜单打不开。

## 层级菜单

`children` 里的子项在侧栏缩进显示，父节点是可展开的容器；当前路由落在某个子树里时，
该分支会自动展开。层级上限 `maxMenuDepth = 4`，超出的层级会被丢弃并记 warning。

- 子项不写 `permission` 就继承父级；写了就以自己的为准。
- 父级没权限 → 整棵子树都不出现（路由仍然注册，直接访问落 403）。
- 纯容器（没有 `component`、子项又全部不可见）整条不显示，不会留一个空目录。
- 分组归属按**子树**判断：分组 `paths` 里声明子项路径，父节点也会归到该分组。
- 顶部导航的下拉里用缩进表达层级（展开成一张平铺列表，更好点）。

## 外链与打开方式

| `target`        | 表现                                                                                  |
| --------------- | ------------------------------------------------------------------------------------- |
| `blank`（默认） | 渲染成 `<a target="_blank" rel="noreferrer">`，新窗口打开，菜单右侧带外链图标         |
| `self`          | 当前窗口跳转（离开控制台）                                                            |
| `iframe`        | `path` 是站内路由，页面用 iframe 内嵌 `external` 地址，顶栏 / 侧栏 / 面包屑仍是本站的 |

```json
{ "path": "/docs", "label": "帮助文档", "external": "https://runlume.app", "target": "blank" }
{ "path": "/tools/metrics", "label": "内嵌看板", "external": "https://grafana.example.com", "target": "iframe" }
```

`target` 兼容 `_blank`、`new-window`、`same-window`、`embed` 等写法（`normalizeLinkTarget()` 归一）。
外链菜单不注册路由，也不参与"当前页"高亮；`iframe` 内嵌才需要 `path`。

::: warning 内嵌的边界
`iframe` 只对**允许被内嵌**的站点有效：对方设了 `X-Frame-Options` 或
`Content-Security-Policy: frame-ancestors` 就会显示空白，这是对方的安全策略，前端改不了。
内嵌页自带「在新窗口打开」的兜底入口。示例指向本地文档站（`pnpm docs:dev`，3210），
因为 `runlume.app` 自己发了 `X-Frame-Options: DENY`，内嵌只会是空白。
:::

## 组件注册表

动态路由的组件来自 `src/app/remote-pages.tsx` 的 `import.meta.glob('../pages/**/*-page.tsx')`：

- 组件键写 `reports-page`（也接受 `pages/reports-page.tsx` 这类写法），解析到 `src/pages/reports-page.tsx`；
- 页面导出的组件名以 `Page` 结尾（`export function ReportsPage`）；
- **接口只能引用本地已注册的页面**，命中不了会渲染错误态（`ErrorState`），不会按接口内容加载任意模块。

## 权限

权限码由身份服务下发（示例见 `src/app/session.ts`），判定规则：

| 写法                          | 含义             |
| ----------------------------- | ---------------- |
| `example.admin.customer.view` | 精确匹配         |
| `example.admin.report.*`      | 该资源下全部权限 |
| `*`                           | 全部权限         |

三处用法：

```tsx
// 1. 菜单：没有权限的项不出现（在 buildAppMenu 里过滤）
// 2. 路由：菜单看不到，直接敲 URL 进来落 403
{ path: 'audit', element: guarded('example.admin.audit.view', page(<AuditPage />)) }

// 3. 按钮 / 区块：没有权限不渲染，或用 fallback 换成禁用态
<Can permission="example.admin.customer.create"><Button>新建客户</Button></Can>
<Can permission="example.admin.customer.export" fallback={<Button disabled>导出（无权限）</Button>}>…</Can>
```

组件里读权限用 `usePermission()`：

```tsx
const { can, canAny, canAll, permissions } = usePermission()
if (can('example.admin.customer.export')) { … }
```

### 两个测试账号

登录页提供两个角色，用来看同一份菜单在不同权限下的差异（点击按钮即填入）：

| 账号                  | 密码      | 权限                                         |
| --------------------- | --------- | -------------------------------------------- |
| `admin@runlume.local` | `runlume` | `*`：全部菜单、全部页面、导出可用            |
| `test@runlume.local`  | `runlume` | 受限：看不到「操作日志」等入口，导出为禁用态 |

角色存在浏览器里（`signIn()` 写入 + 派发事件），切换后菜单与路由会重建：
`useSession()` → `useAppMenu(permissions)` → `createAppRouter(menu, account)`。
退出登录会清掉角色、回到默认管理员。

## 接真实接口

改 `src/app/remote-menu.ts` 里的 `fetchRemoteMenu()`：

```ts
export async function fetchRemoteMenu() {
  const { data } = await request.get('/api/v1/me/menus')
  return data
}
```

菜单在进入路由前加载一次（`App.tsx` 用 `useAppMenu()`，未就绪时显示 `LoadingState`）；
菜单接口失败会回落到本地菜单并在 `warnings` 里说明原因，**不会把用户挡在登录页外**。
切换租户后要重新拉菜单时，把 `useAppMenu` 换成带 key 的重新加载即可。

## 边界

- **前端权限不是安全边界**：它只决定"看不看得见、点不点得动"，真正的鉴权必须在服务端校验。
- 动态路由只覆盖"页面级"下发的场景；页内权限用 `<Can>` 自己组合。
- 菜单接口返回的组件键必须在本地已注册，接口无法凭空新增页面。
- 外链的 `self` / `blank` 不受前端控制之外的限制；`iframe` 受目标站点安全策略限制。
