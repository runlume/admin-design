import type { ReactNode } from 'react'
import { PermissionContext } from '@/lib/permission-context'
import type { PermissionCode } from '@/lib/permissions'

/** 把当前会话的权限码挂到上下文，供菜单、路由守卫与按钮级鉴权读取。 */
export function PermissionProvider({
  permissions,
  children,
}: {
  permissions?: readonly PermissionCode[]
  children: ReactNode
}) {
  return <PermissionContext value={permissions ?? []}>{children}</PermissionContext>
}
