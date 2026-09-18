import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './custom.css'

declare global {
  interface Window {
    goatcounter?: { count: (vars?: { path?: string }) => void }
  }
}

/**
 * 模块求值时还没发生任何导航，此刻的地址就是入口页：那一次访问由 count.js 在整页加载时
 * 上报过了。构建期在 Node 里跑，没有 `window`，入口路径留空即可（客户端是另一份实例）。
 */
let lastPath =
  typeof window === 'undefined' ? '' : window.location.pathname + window.location.search

/**
 * 访问统计（GoatCounter）只补切路由的页面浏览，按路径去重，初始路由事件不会多算一条。
 */
function trackPageview(href: string): void {
  if (typeof window === 'undefined') return
  const { pathname, search } = new URL(href, window.location.origin)
  const path = pathname + search
  if (path === lastPath) return
  lastPath = path
  window.goatcounter?.count({ path })
}

/** 只覆盖配色与少量排版，布局、侧栏与搜索继续用 VitePress 默认主题。 */
const theme: Theme = {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ router }) {
    router.onAfterRouteChanged = trackPageview
  },
}

export default theme
