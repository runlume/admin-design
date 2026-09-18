import { useEffect, useMemo, useState } from 'react'
import { navigation as localNavigation, navigationGroups as localGroups } from '@/app/navigation'
import { resolveNavIcon } from '@/lib/nav-icons'
import type { NavigationGroupDefinition, NavigationItem } from '@/lib/navigation'
import type { PermissionCode } from '@/lib/permissions'
import {
  normalizeRemoteMenu,
  remoteRoutes,
  visibleMenuItems,
  type NormalizedRemoteMenu,
  type RemoteRoute,
} from '@/lib/remote-menu'
import { remoteMenuSample } from '@/pages/sample-data'

export type AppMenu = {
  /** 本地菜单 + 后台菜单（后台菜单在后，分组同理） */
  navigation: NavigationItem[]
  groups: NavigationGroupDefinition[]
  /** 后台菜单声明的动态路由，带权限要求，交给 RequirePermission 守门 */
  routes: RemoteRoute[]
  /** 被丢弃或被降级的条目说明，接真实接口时先看这里 */
  warnings: string[]
}

/**
 * 菜单接口。示例直接返回本地数据，业务系统换成真实请求即可：
 *
 * ```ts
 * export async function fetchRemoteMenu() {
 *   const { data } = await request.get('/api/v1/me/menus')
 *   return data
 * }
 * ```
 */
export async function fetchRemoteMenu(): Promise<unknown> {
  return remoteMenuSample
}

/** 把后台菜单合并到本地菜单后面，并按当前权限过滤可见项。 */
export function buildAppMenu(
  payload: unknown,
  permissions: readonly PermissionCode[] = [],
): AppMenu {
  const remote = normalizeRemoteMenu(payload, {
    fallbackGroupId: 'remote',
    fallbackGroupLabel: 'remote',
  })
  return mergeMenu(remote, permissions)
}

function mergeMenu(remote: NormalizedRemoteMenu, permissions: readonly PermissionCode[]): AppMenu {
  const warnings = [...remote.warnings]
  const visible = visibleMenuItems(remote, permissions)

  /** 递归映射成导航项：菜单层级原样保留，图标按名字解析。 */
  const toNavigationItem = (item: (typeof visible)[number]): NavigationItem => {
    const resolved = resolveNavIcon(item.icon)
    if (item.icon && !resolved.known) {
      warnings.push(`图标「${item.icon}」不在图标集里，已用占位图标（${item.path}）。`)
    }
    // label 交给下游 t()：登记的 key 会翻译，普通文案原样显示。
    return {
      path: item.path,
      label: item.labelKey ?? item.label,
      icon: resolved.icon,
      ...(item.external ? { external: item.external } : {}),
      ...(item.children.length ? { children: item.children.map(toNavigationItem) } : {}),
    }
  }
  const items: NavigationItem[] = visible.map(toNavigationItem)

  const groups: NavigationGroupDefinition[] = remote.groups
    .map((group) => {
      const resolved = resolveNavIcon(group.icon)
      if (group.icon && !resolved.known) {
        warnings.push(`分组图标「${group.icon}」不在图标集里，已用占位图标（${group.id}）。`)
      }
      return {
        id: group.id,
        label: group.labelKey ?? group.label,
        icon: resolved.icon,
        paths: visible.filter((item) => item.group === group.id).map((item) => item.path),
      }
    })
    .filter((group) => group.paths.length > 0)

  return {
    navigation: [...localNavigation, ...items],
    groups: [...localGroups, ...groups],
    routes: remoteRoutes(remote),
    warnings,
  }
}

/** 拉取菜单并合并成本地可用的菜单结构。菜单未就绪时返回 undefined，由调用方决定怎么占位。 */
export function useAppMenu(permissions: readonly PermissionCode[]): AppMenu | undefined {
  const [payload, setPayload] = useState<{ value: unknown }>()
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let cancelled = false
    fetchRemoteMenu()
      .then((value) => {
        if (!cancelled) setPayload({ value })
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  /**
   * 动态路由只跟菜单数据有关、跟权限无关：每条路由自带权限要求，由 `RequirePermission` 兜住，
   * 所以这里保持同一个引用。登录换角色只会换可见菜单，不会重建路由表 ——
   * 否则新旧路由器交替的瞬间可能丢掉子路由匹配，页面就是空的。
   */
  const routes = useMemo(
    () =>
      payload
        ? remoteRoutes(
            normalizeRemoteMenu(payload.value, {
              fallbackGroupId: 'remote',
              fallbackGroupLabel: 'remote',
            }),
          )
        : undefined,
    [payload],
  )

  return useMemo(() => {
    // 菜单接口失败不阻塞进入系统：回落到本地菜单，把原因挂到 warnings。
    if (!payload && !failed) return undefined
    const menu = buildAppMenu(payload?.value ?? {}, permissions)
    if (failed) menu.warnings.push('菜单接口请求失败，已回落到本地菜单。')
    if (import.meta.env.DEV && menu.warnings.length) {
      console.warn('[remote-menu] 菜单存在问题，已按容错规则处理：', menu.warnings)
    }
    return routes ? { ...menu, routes } : menu
  }, [payload, failed, permissions, routes])
}
