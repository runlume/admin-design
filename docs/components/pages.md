---
description: 标准页型：外壳与页面零件的组装示例，复制一个页面改数据即可用。
---

# 标准页型

标准页型是"外壳 + 页面零件"的组装示例，业务系统复制其中一个页面改数据即可。
所有页面都在 `src/pages/` 下，路由注册在 `src/App.tsx`。

## 页面清单

| 页面     | 路由                     | 文件                       | 说明                                 |
| -------- | ------------------------ | -------------------------- | ------------------------------------ |
| 工作台   | `/`                      | `dashboard-page.tsx`       | 指标卡 + 图表 + 待办列表             |
| 客户管理 | `/customers`             | `customers-page.tsx`       | 筛选 + 表格 + 批量操作 + 分页        |
| 客户详情 | `/customers/:customerId` | `customer-detail-page.tsx` | 描述列表 + 时间线 + 侧栏容器         |
| 设置     | `/settings`              | `settings-page.tsx`        | 外观 / 配色 / 无障碍 / 通知 / 快捷键 |
| 通知中心 | `/notifications`         | `notifications-page.tsx`   | 筛选 + 搜索区 + 已读同步             |
| 登录     | `/login`                 | `login-page.tsx`           | 独立外壳（不带控制台）               |
| 注册     | `/register`              | `register-page.tsx`        | 手机或邮箱验证 + 密码强度            |
| 找回密码 | `/forgot-password`       | `forgot-password-page.tsx` | 提交后进入"已发送"状态               |

## 页面骨架

```tsx
export function CustomersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Customer"
        title={t('sample.customersTitle')}
        description="筛选、导出与批量操作都在同一层工具栏。"
        actions={<Button>新建客户</Button>}
      />

      <ListModule search={<SearchFilters onSubmit={applyFilters}>…</SearchFilters>}>
        <TableToolbar>…</TableToolbar>
        <DataTable … />
        <PagePager page={page} pageCount={pageCount} onPageChange={setPage} />
      </ListModule>
    </>
  );
}
```

## 页面零件

| 组件                                              | 位置                                | 用途                                                         |
| ------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------ |
| `PageHeader`                                      | `components/page.tsx`               | 页头：`eyebrow`（必填）+ `title` + `description` + `actions` |
| `ListModule`                                      | `components/list-module.tsx`        | "筛选区 + 内容区"的列表外壳，筛选区去掉外边框、改用虚线分隔  |
| `SearchFilters` / `SearchField` / `SearchActions` | `components/search-filters.tsx`     | 筛选区与字段、操作区                                         |
| `TableToolbar` / `BulkActions` / `RowActions`     | `components/table-*`                | 表格工具条与行操作                                           |
| `FixedBar`                                        | `components/fixed-bar.tsx`          | 长表单粘底操作条                                             |
| `PagePager` / `CursorPagination`                  | `components/page-pager.tsx`         | 两种分页（见[数据展示](/components/data)）                   |
| `PageButton`                                      | `components/page-button.tsx`        | 上一步 / 下一步按钮，自带箭头图标                            |
| `PageTabs`                                        | `components/page-tabs.tsx`          | 页面级页签栏                                                 |
| `PageReloadButton`                                | `components/page-reload-button.tsx` | 顶栏刷新："重建当前页"，不播进入动画                         |
| `EmptyState` / `ErrorState` / `LoadingState`      | `components/page.tsx`               | 三态占位                                                     |
| `RouteError` / `NotFoundPage`                     | `components/route-error.tsx`        | 路由错误边界与 404                                           |

## 登录 / 注册 / 找回密码

三个页面共用一个外壳 `AuthLayout`：左侧品牌与卖点、右侧表单区、底部版权，
它们**不在控制台外壳内**（`src/App.tsx` 里是同级路由），所以没有侧栏与顶栏。

```tsx
export function LoginPage() {
  return (
    <AuthLayout>
      <AuthHeading title={t('login.title')} description={t('login.description')} />
      <form>…</form>
    </AuthLayout>
  )
}
```

注册的验证方式（手机 / 邮箱）用 `InputOTP` + 分段切换，未验证不允许提交；
密码强度用 `PasswordStrength` 实时反馈。这些页面只演示表单与校验，**不接身份服务**。

## 退出登录

两处入口，都是同一个回调：

| 位置             | 组件                        |
| ---------------- | --------------------------- |
| 侧栏底部用户菜单 | `UserMenu` → `onSignOut`    |
| 个人中心弹窗     | `UserProfile` → `onSignOut` |

```tsx
async function signOut() {
  await auth.logout() // 业务实现
  void navigate('/login')
}
```

模板里的实现只做跳转（`src/app/app-layout.tsx`）。
