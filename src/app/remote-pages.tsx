/* oxlint-disable react/static-components -- 动态组件来自模块级缓存，引用稳定，不会重置状态 */
import { Suspense, lazy, useMemo, type ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { ErrorState, LoadingState } from '@/components/page'

/**
 * 动态路由的组件表。
 *
 * 只有本仓库 `src/pages/**\/*-page.tsx` 里的文件参与动态路由——接口给的组件键
 * 命中不了就渲染错误态，**永远不会**根据接口内容去加载任意模块。
 */
const pageModules = import.meta.glob('../pages/**/*-page.tsx')

/** lazy() 每次调用都会产生新组件并触发重挂载，这里按组件键缓存。 */
const pageCache = new Map<string, ComponentType | null>()

function pageKey(component: string): string {
  const name = component
    .trim()
    .replace(/^@\//, '')
    .replace(/^\.?\//, '')
    .replace(/^pages\//, '')
    .replace(/\.tsx$/, '')
  return `../pages/${name}.tsx`
}

function resolveRemotePage(component: string): ComponentType | undefined {
  const key = pageKey(component)
  const cached = pageCache.get(key)
  if (cached !== undefined) return cached ?? undefined
  const loader = pageModules[key]
  if (!loader) {
    pageCache.set(key, null)
    return undefined
  }
  const Page = lazy(async () => {
    const module = (await loader()) as Record<string, unknown>
    // 页面统一用命名导出（`export function XxxPage`），取第一个以 Page 结尾的导出。
    const exportName = Object.keys(module).find((name) => /Page$/.test(name))
    const resolved = (exportName ? module[exportName] : module.default) as ComponentType | undefined
    if (!resolved) throw new Error(`页面 ${component} 没有可用的导出`)
    return { default: resolved }
  })
  pageCache.set(key, Page)
  return Page
}

/** 动态路由渲染器：懒加载 + 加载态；组件键对不上时给出可读的错误态，而不是白屏。 */
export function RemotePage({ component }: { component?: string }) {
  const { t } = useTranslation()
  // useMemo：组件键不变时不重新解析，也不在每次渲染时新建组件。
  // 解析结果是模块级缓存里的同一个组件（见 pageCache），因此不会重置状态。
  // oxlint-disable-next-line react/static-components
  const Page = useMemo(() => (component ? resolveRemotePage(component) : undefined), [component])
  if (!Page) {
    return <ErrorState message={t('remoteMenu.unknownComponent', { component: component ?? '' })} />
  }
  return (
    <Suspense fallback={<LoadingState />}>
      <Page />
    </Suspense>
  )
}
