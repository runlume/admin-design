import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router'
import { PAGE_RELOAD_PATH } from '@/components/page-reload-button'
import { ConsoleLayout } from '@/components/console-layout'
import { UserMenu } from '@/components/user-menu'
import { UserSettings } from '@/components/user-settings'
import { PageReloadButton } from '@/components/page-reload-button'
import { NotificationsButton } from '@/components/notifications-button'
import { groupNavigation } from '@/lib/navigation'
import { useAppearance } from '@/lib/appearance'
import { readShortcuts, useDefaultShortcuts, type ShortcutSetting } from '@/lib/preset-shortcuts'
import type { AppMenu } from '@/app/remote-menu'
import { signOut as endSession, type DemoAccount } from '@/app/session'

/**
 * 应用外壳接线示例：把菜单、用户菜单、设置弹窗与顶栏操作挂到 ConsoleLayout。
 * `menu` 由 `App` 在进入路由前加载（本地菜单 + 后台菜单 + 权限过滤），
 * 会话与权限码见 `src/app/session.ts`。
 */
export function AppLayout({ menu, account }: { menu: AppMenu; account: DemoAccount }) {
  const navigate = useNavigate()
  const navigationType = useNavigationType()
  const transition = useAppearance((state) => state.transition)
  const location = useLocation()
  const { key: locationKey, pathname } = location
  const reloadReturn = Boolean(
    (location.state as { pageReloadReturn?: boolean } | null)?.pageReloadReturn,
  )
  useEffect(() => {
    // 刷新按钮是"重建当前页"，往返都不播页面进入动画。
    if (pathname === PAGE_RELOAD_PATH || reloadReturn) {
      document.documentElement.dataset.transition = 'none'
      return
    }
    // auto：前进向左滑入、后退向右滑入、首屏与 replace 淡入；写入根元素供 CSS 使用。
    const resolved =
      transition !== 'auto'
        ? transition
        : navigationType === 'PUSH'
          ? 'slide'
          : navigationType === 'POP'
            ? 'slide-left'
            : 'fade'
    document.documentElement.dataset.transition = resolved
  }, [navigationType, transition, locationKey, reloadReturn, pathname])
  const [view, setView] = useState<'settings' | 'profile' | null>(null)
  const groups = groupNavigation(menu.navigation, menu.groups)
  /** 面包屑标题：本地映射优先，后台菜单的项用它自己的 label 兜底（支持子路径）。 */
  const pageTitles = {
    ...Object.fromEntries(menu.navigation.map((item) => [item.path, item.label])),
    '/customers': 'sample.customersTitle',
    '/notifications': 'notifications.title',
  }
  const [shortcuts, setShortcuts] = useState<ShortcutSetting[]>(readShortcuts)
  useDefaultShortcuts((path) => void navigate(path), shortcuts)
  useEffect(() => {
    const sync = () => setShortcuts(readShortcuts())
    window.addEventListener('shortcuts-changed', sync)
    return () => window.removeEventListener('shortcuts-changed', sync)
  }, [])
  // 设计层只负责跳转；真实项目在这里调用身份中心的退出接口。
  function signOut() {
    setView(null)
    endSession()
    void navigate('/login')
  }
  return (
    <>
      <ConsoleLayout
        navigation={menu.navigation}
        groups={menu.groups}
        title="Runlume 标准后台"
        favoritesKey={account.role}
        headerActions={{
          reload: <PageReloadButton />,
          notifications: <NotificationsButton />,
        }}
        pageTitles={pageTitles}
        fallbackTitle="sample.dashboardTitle"
        userControl={
          <UserMenu
            displayName={account.displayName}
            description={account.email}
            onOpenProfile={() => setView('profile')}
            onOpenSettings={() => setView('settings')}
            onSignOut={signOut}
          />
        }
      />
      <UserSettings
        shortcuts={shortcuts}
        onShortcutsChange={(next) => {
          setShortcuts(next)
          window.dispatchEvent(new Event('shortcuts-changed'))
        }}
        view={view}
        onClose={() => setView(null)}
        groups={groups}
        profile={{
          displayName: account.displayName,
          userId: account.role,
          contacts: [
            { key: 'email', value: account.email, verified: true },
            { key: 'phone', value: '138****0000', verified: false },
          ],
          onSignOut: signOut,
        }}
      />
    </>
  )
}
