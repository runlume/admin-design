---
description: 作为模板使用：从复制目录、换菜单、接身份与接口，到换文案与品牌的分步改造顺序。
---

# 作为模板使用

复制到业务仓库后的改造顺序，按下面的步骤走完就能接真实接口。

## 1. 复制整个目录

把 `admin-design/` 复制成业务仓库（或作为子目录），改 `package.json` 的 `name`，
执行 `pnpm install`。`docs/` 可以一起带走，也可以只保留 `src/`。

## 2. 换菜单

只改 `src/app/navigation.ts`：

```ts
export const navigation: NavigationItem[] = [
  { path: '/', label: 'sample.navOverview', icon: LayoutDashboard },
  { path: '/customers', label: 'sample.navCustomers', icon: UsersRound },
]

export const navigationGroups: NavigationGroupDefinition[] = [
  {
    id: 'business',
    label: 'sample.navGroupBusiness',
    icon: LayoutDashboard,
    paths: ['/', '/customers'],
  },
]
```

`navigation` 决定"有哪些菜单"，`navigationGroups.paths` 决定"分组与顺序"。未登记分组的菜单会落到第一个分组，
避免新增页面漏挂菜单。`label` 可以直接写中文，也可以写 i18n key。

## 3. 换身份与退出

`src/app/app-layout.tsx` 里的 `currentUser` 换成会话数据，`signOut()` 改成调用身份服务：

```tsx
const currentUser = { id: session.userId, displayName: session.name, email: session.email }

async function signOut() {
  await auth.logout() // 业务实现
  void navigate('/login')
}
```

用户菜单与个人中心（`UserMenu`、`UserProfile`）已经接好 `onSignOut`，传进去就会显示退出登录。

## 4. 接接口

页面里的示例数据集中在这两处：

| 数据                       | 位置                       |
| -------------------------- | -------------------------- |
| 客户、订单、组织单元、指标 | `src/pages/sample-data.ts` |
| 通知与通知偏好             | `src/lib/notifications.ts` |

替换时的约定：**加载 / 空 / 错误三态用 `LoadingState` / `EmptyState` / `ErrorState`**，
不要各页各写一套；错误态把追踪标识传给 `traceId`，方便和日志对齐。

```tsx
if (query.isPending) return <LoadingState />
if (query.isError) return <ErrorState message={t('errorDefault')} traceId={query.error.traceId} />
if (!rows.length) return <EmptyState title={t('empty')} action={<Button>新建客户</Button>} />
```

## 5. 换文案

`src/lib/i18n.ts` 是唯一语言包入口：

```ts
export const zhResources = { ... }        // 中文
const enResources: typeof zhResources = { ... }   // 英文，类型强制结构一致
```

- 组件里用 `const { t } = useTranslation()` + `t('key')`。
- 页面文案可以按业务域拆分模块再合并进 `resources`。
- `src/test/unit/i18n-keys.test.ts` 会扫描代码里的字面量 key，拦住"用了但没登记"。

## 6. 换品牌

`public/brand/` 下的四个文件直接覆盖，组件不用改：

| 文件                 | 用途                              |
| -------------------- | --------------------------------- |
| `mark.svg`           | 浅色方标（侧栏、登录页、favicon） |
| `mark-dark.svg`      | 深色方标                          |
| `wordmark-light.svg` | 浅色完整标识                      |
| `wordmark-dark.svg`  | 深色完整标识                      |

登录页、侧栏、文档站都从这里取资源——**不要新建图片目录**。

品牌文案集中在 `src/lib/brand-info.ts`（名称、产品名、站点、当前使用版本、控制台安全提示），
三处输出共用它，改一处即可：

| 输出位置                         | 实现                                                         |
| -------------------------------- | ------------------------------------------------------------ |
| 终端启动横幅（每个进程只打一次） | `scripts/banner.ts`                                          |
| 浏览器 F12 控制台                | `src/lib/brand-console.ts`（中文环境走中文，其它语言走英文） |

## 7. 换环境变量

```bash
VITE_APP_TITLE=Runlume 标准后台设计
VITE_APP_STORAGE_PREFIX=runlume.        # 业务系统务必改成自己的前缀
VITE_APP_API_BASEURL=/
VITE_APP_PLATFORM_WEB_BASEURL=https://runlume.app  # 终端横幅 / 控制台输出 / 侧栏外链
VITE_APP_DISABLE_DEVTOOL=false          # true 时屏蔽 F12 / 右键 / 查看源码
VITE_BUILD_SOURCEMAP=false              # 测试环境默认 true
VITE_BUILD_COMPRESS=                    # 默认留空；要源站预压缩再填 gzip,brotli（网关需配 gzip_static）
```

前缀会拼到所有浏览器存储键前面（`storageKey()`），多个后台同域部署时靠它隔离偏好数据。

## 示例数据的边界

- 工作台指标、客户、订单、通知、组织单元都是**内存示例数据**，刷新即恢复初始状态。
- 登录 / 注册 / 找回密码只演示表单与校验，**不接身份服务**；退出登录只做跳转。
- 上传、提及、树拖拽与懒加载、表格虚拟滚动的接口已留出（`uploader`、`onMove`、`loadChildren`、`virtual`），替换回调即可。
- 只有偏好类设置会持久化：主题、配色、无障碍、通知偏好、顶栏操作顺序、侧栏宽度 / 圆角 / 动画 / 布局模式、表格列宽、筛选预设、快捷键。
