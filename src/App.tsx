import { Suspense, lazy, useEffect, useMemo, type ReactNode } from 'react'
import { Navigate, createBrowserRouter, useLocation } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { AppLayout } from '@/app/app-layout'
import { AppMenuProvider, useAppMenuValue } from '@/app/menu-context'
import { PermissionProvider } from '@/app/permission-provider'
import { Providers } from '@/app/providers'
import { useAppMenu } from '@/app/remote-menu'
import { RemotePage } from '@/app/remote-pages'
import { useSession } from '@/app/session'
import { LoadingState, NotFoundPage } from '@/components/page'
import { RequirePermission } from '@/components/permission'
import { PAGE_RELOAD_PATH } from '@/components/page-reload-button'
import { PageReloadRoute } from '@/components/page-reload-route'
import { RouteError } from '@/components/route-error'
import { trackPageview } from '@/lib/analytics'
import type { RemoteRoute } from '@/lib/remote-menu'
import { DashboardPage } from '@/pages/dashboard-page'
import { ExternalFramePage } from '@/pages/external-frame-page'

const LoginPage = lazy(() =>
  import('@/pages/login-page').then((module) => ({ default: module.LoginPage })),
)
const RegisterPage = lazy(() =>
  import('@/pages/register-page').then((module) => ({ default: module.RegisterPage })),
)
const ForgotPasswordPage = lazy(() =>
  import('@/pages/forgot-password-page').then((module) => ({
    default: module.ForgotPasswordPage,
  })),
)
const CustomersPage = lazy(() =>
  import('@/pages/customers-page').then((module) => ({ default: module.CustomersPage })),
)
const CustomerDetailPage = lazy(() =>
  import('@/pages/customer-detail-page').then((module) => ({ default: module.CustomerDetailPage })),
)
const SettingsPage = lazy(() =>
  import('@/pages/settings-page').then((module) => ({ default: module.SettingsPage })),
)
const NotificationsPage = lazy(() =>
  import('@/pages/notifications-page').then((module) => ({
    default: module.NotificationsPage,
  })),
)
const designPages = {
  overview: lazy(() =>
    import('@/pages/design-system/overview-page').then((module) => ({
      default: module.DesignOverviewPage,
    })),
  ),
  basic: lazy(() =>
    import('@/pages/design-system/basic-page').then((module) => ({
      default: module.DesignBasicPage,
    })),
  ),
  form: lazy(() =>
    import('@/pages/design-system/form-page').then((module) => ({
      default: module.DesignFormPage,
    })),
  ),
  data: lazy(() =>
    import('@/pages/design-system/data-page').then((module) => ({
      default: module.DesignDataPage,
    })),
  ),
  feedback: lazy(() =>
    import('@/pages/design-system/feedback-page').then((module) => ({
      default: module.DesignFeedbackPage,
    })),
  ),
  navigation: lazy(() =>
    import('@/pages/design-system/navigation-page').then((module) => ({
      default: module.DesignNavigationPage,
    })),
  ),
  metrics: lazy(() =>
    import('@/pages/design-system/metrics-page').then((module) => ({
      default: module.DesignMetricsPage,
    })),
  ),
  icons: lazy(() =>
    import('@/pages/design-system/icons-page').then((module) => ({
      default: module.DesignIconsPage,
    })),
  ),
  theme: lazy(() =>
    import('@/pages/design-system/theme-page').then((module) => ({
      default: module.DesignThemePage,
    })),
  ),
}

function page(node: ReactNode) {
  return <Suspense fallback={<LoadingState />}>{node}</Suspense>
}

/** 需要权限的页面：直接敲 URL 进来没有权限就落 403，而不是白屏或 404。 */
function guarded(permission: string, node: ReactNode) {
  return <RequirePermission permission={permission}>{node}</RequirePermission>
}

/**
 * 控制台外壳的会话闸门：未登录（或菜单还没到）时，任何控制台路径都回登录页。
 * 会话与菜单都在这里读，路由表本身不依赖它们，登录/退出也就不会重建路由器。
 */
function ConsoleShell() {
  const { account } = useSession()
  const menu = useAppMenuValue()
  const location = useLocation()
  if (!account || !menu) {
    // 把想去的那一页带上：登录成功后回到它，而不是一律落到工作台。
    const target = `${location.pathname}${location.search}`
    return <Navigate to={`/login?redirect=${encodeURIComponent(target)}`} replace />
  }
  return <AppLayout menu={menu} account={account} />
}

/**
 * 路由表 = 本地静态路由 + 后台菜单下发的动态路由。
 * 动态路由的组件来自 `src/app/remote-pages.tsx` 的本地注册表，接口只能引用不能新增。
 * 只吃菜单数据：动态路由自带权限要求，能不能看由 `RequirePermission` 在渲染时决定。
 */
function createAppRouter(routes: RemoteRoute[]) {
  return createBrowserRouter([
    // 未登录页不带控制台外壳，作为独立的标准页型示例。
    { path: '/login', element: page(<LoginPage />) },
    { path: '/register', element: page(<RegisterPage />) },
    { path: '/forgot-password', element: page(<ForgotPasswordPage />) },
    {
      path: '/',
      element: <ConsoleShell />,
      errorElement: <RouteError />,
      children: [
        { index: true, element: <DashboardPage /> },
        {
          path: 'customers',
          element: guarded('example.admin.customer.view', page(<CustomersPage />)),
        },
        {
          path: 'customers/:customerId',
          element: guarded('example.admin.customer.view', page(<CustomerDetailPage />)),
        },
        { path: 'notifications', element: page(<NotificationsPage />) },
        {
          path: 'settings',
          element: guarded('example.admin.system.settings', page(<SettingsPage />)),
        },
        // 组件总览按类型拆分，开发与构建产物都保留这些入口。
        {
          path: 'design-system',
          element: guarded('example.admin.design.view', page(<designPages.overview />)),
        },
        {
          path: 'design-system/basic',
          element: guarded('example.admin.design.view', page(<designPages.basic />)),
        },
        {
          path: 'design-system/form',
          element: guarded('example.admin.design.view', page(<designPages.form />)),
        },
        {
          path: 'design-system/data',
          element: guarded('example.admin.design.view', page(<designPages.data />)),
        },
        {
          path: 'design-system/feedback',
          element: guarded('example.admin.design.view', page(<designPages.feedback />)),
        },
        {
          path: 'design-system/navigation',
          element: guarded('example.admin.design.view', page(<designPages.navigation />)),
        },
        {
          path: 'design-system/metrics',
          element: guarded('example.admin.design.view', page(<designPages.metrics />)),
        },
        {
          path: 'design-system/theme',
          element: guarded('example.admin.design.view', page(<designPages.theme />)),
        },
        {
          path: 'design-system/icons',
          element: guarded('example.admin.design.view', page(<designPages.icons />)),
        },
        // 后台菜单下发的动态路由：路径、组件（或内嵌外链地址）与权限都来自菜单。
        ...routes.map((route) => ({
          path: route.path.replace(/^\//, ''),
          element: guarded(
            route.permission[0] ?? '',
            page(
              route.url ? (
                <ExternalFramePage url={route.url} title={route.label} />
              ) : (
                <RemotePage component={route.component} />
              ),
            ),
          ),
        })),
        { path: PAGE_RELOAD_PATH.slice(1), element: <PageReloadRoute /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ])
}

export function App() {
  const { account } = useSession()
  // 未登录时也要给 `useAppMenu` 一个稳定引用：它按 permissions 的引用重建菜单，
  // 每次渲染都新建数组会让菜单反复重建。
  const permissions = useMemo(() => account?.permissions ?? [], [account])
  // 菜单要先于路由就绪：动态路由的路径与组件都来自菜单。
  const menu = useAppMenu(permissions)
  // 路由表只跟菜单数据走（`menu.routes` 换权限时保持同一引用）：
  // 登录、退出、切角色都不重建路由器，避免新旧路由器交替的瞬间丢页。
  const routes = menu?.routes
  const router = useMemo(() => (routes ? createAppRouter(routes) : undefined), [routes])
  // 路由切换后补一条访问统计：每个页面都要被统计到，而不只是入口页。
  useEffect(() => {
    if (!router) return
    return router.subscribe((state) =>
      trackPageview(state.location.pathname + state.location.search),
    )
  }, [router])

  if (!router) {
    return (
      <Providers>
        <div className="flex min-h-dvh items-center justify-center">
          <LoadingState />
        </div>
      </Providers>
    )
  }

  return (
    <Providers>
      <PermissionProvider permissions={permissions}>
        <AppMenuProvider menu={menu}>
          <RouterProvider router={router} />
        </AppMenuProvider>
      </PermissionProvider>
    </Providers>
  )
}
