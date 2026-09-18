import { useEffect, useState } from 'react'
import { storageKey } from '@/lib/storage-key'
import type { PermissionCode } from '@/lib/permissions'

/**
 * 示例会话：两个不同角色的测试账号。接真实身份服务时，
 * 把 `demoAccounts` 换成登录响应（用户信息 + 权限码），`signIn()` 换成真实登录调用。
 *
 * 权限码约定见 `src/lib/permissions.ts`：`*` 全部、`module:*` 模块内全部、其余精确匹配。
 */
export type DemoRole = 'admin' | 'test'

export type DemoAccount = {
  role: DemoRole
  /** 登录用的账号（邮箱） */
  email: string
  password: string
  /** 侧栏/用户菜单展示的名字 */
  displayName: string
  permissions: readonly PermissionCode[]
}

export const demoAccounts: Record<DemoRole, DemoAccount> = {
  admin: {
    role: 'admin',
    email: 'admin@runlume.local',
    password: 'runlume',
    displayName: '系统管理员',
    permissions: ['*'],
  },
  test: {
    role: 'test',
    email: 'test@runlume.local',
    password: 'runlume',
    displayName: '测试账号',
    permissions: [
      'example.admin.customer.view',
      'example.admin.customer.create',
      'example.admin.insight.view',
      'example.admin.report.view',
      'example.admin.system.settings',
      'example.admin.design.view',
    ],
  },
}

export const roles: DemoRole[] = ['admin', 'test']
export const defaultRole: DemoRole = 'admin'

/** 会话变化事件：登录/退出后通知外壳重建菜单与路由。 */
export const sessionEvent = 'demo-session-changed'
export const sessionStorageKey = storageKey('demo-role')

/** 只认存下来的两个角色；没有或对不上就是"未登录"，不要回落成默认账号。 */
export function resolveRole(value: unknown): DemoRole | null {
  return value === 'test' || value === 'admin' ? value : null
}

export function readRole(): DemoRole | null {
  try {
    return resolveRole(localStorage.getItem(sessionStorageKey))
  } catch {
    return null
  }
}

/** 按账号判定角色：能对上示例账号就用它的角色，其它账号按管理员（示例行为）。 */
export function roleOfAccount(account: string): DemoRole {
  const matched = roles.find(
    (role) => demoAccounts[role].email.toLowerCase() === account.trim().toLowerCase(),
  )
  return matched ?? defaultRole
}

/** 登录：示例只记录角色，真实项目在这里调用身份服务。 */
export function signIn(role: DemoRole): void {
  try {
    localStorage.setItem(sessionStorageKey, role)
  } catch {
    /* 隐私模式下写不进去也不影响本次会话。 */
  }
  window.dispatchEvent(new Event(sessionEvent))
}

/** 退出登录：清掉角色，回到未登录状态（路由据此跳回登录页）。 */
export function signOut(): void {
  try {
    localStorage.removeItem(sessionStorageKey)
  } catch {
    /* 同上。 */
  }
  window.dispatchEvent(new Event(sessionEvent))
}

/**
 * 当前会话，未登录时为 `null`。角色变化（登录/退出）时自动刷新，菜单与路由随之重建。
 * 示例不做真实身份校验，所以"登录"只是往浏览器里记一个角色；
 * 但这个角色**必须是显式登录过的**，打开站点先看到登录页。
 */
export function useSession(): { account: DemoAccount | null; signIn: (role: DemoRole) => void } {
  const [role, setRole] = useState<DemoRole | null>(readRole)
  useEffect(() => {
    const sync = () => setRole(readRole())
    window.addEventListener(sessionEvent, sync)
    return () => window.removeEventListener(sessionEvent, sync)
  }, [])
  return { account: role ? demoAccounts[role] : null, signIn }
}
