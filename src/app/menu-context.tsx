import { createContext, useContext, type ReactNode } from 'react'
import type { AppMenu } from '@/app/remote-menu'

/**
 * 菜单既喂给路由（动态路由表），又喂给外壳（侧栏），但路由表必须保持稳定 ——
 * 所以菜单不当作 props 塞进路由元素，改用 context 传给外壳。
 */
const AppMenuContext = createContext<AppMenu | undefined>(undefined)

export function AppMenuProvider({ menu, children }: { menu?: AppMenu; children: ReactNode }) {
  return <AppMenuContext.Provider value={menu}>{children}</AppMenuContext.Provider>
}

export function useAppMenuValue(): AppMenu | undefined {
  return useContext(AppMenuContext)
}
