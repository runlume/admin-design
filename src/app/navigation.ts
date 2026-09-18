import {
  Bell,
  ChartLine,
  CircleGauge,
  FileText,
  LayoutDashboard,
  Layers,
  ListTree,
  MessageSquareWarning,
  Navigation,
  Settings,
  Shapes,
  Smile,
  UsersRound,
} from 'lucide-react'
import type { NavigationGroupDefinition, NavigationItem } from '@/lib/navigation'

/**
 * 示例菜单。业务系统在这里替换成自己的菜单：
 * 1. 每个一级路由在 navigation 中登记 path / label / icon；
 * 2. 在 navigationGroups 的 paths 中声明它属于哪个分组，顺序即显示顺序；
 * 3. 未登记分组的菜单会落到第一个分组，避免新增页面漏挂菜单。
 * 菜单项 label 可以先写中文，也可以写 i18n key。
 */
export const navigationGroups: NavigationGroupDefinition[] = [
  {
    id: 'business',
    label: 'sample.navGroupBusiness',
    icon: LayoutDashboard,
    paths: ['/', '/customers'],
  },
  {
    id: 'system',
    label: 'sample.navGroupSystem',
    icon: Settings,
    paths: ['/notifications', '/settings'],
  },
  {
    id: 'design',
    label: 'sample.navGroupDesign',
    icon: Shapes,
    // 设计系统下的每个分类页都登记在这里，避免回落到第一个分组（业务）。
    paths: [
      '/design-system',
      '/design-system/basic',
      '/design-system/form',
      '/design-system/data',
      '/design-system/feedback',
      '/design-system/navigation',
      '/design-system/metrics',
      '/design-system/theme',
      '/design-system/icons',
    ],
  },
]

export const navigation: NavigationItem[] = [
  { path: '/', label: 'sample.navOverview', icon: LayoutDashboard },
  { path: '/customers', label: 'sample.navCustomers', icon: UsersRound },
  { path: '/notifications', label: 'sample.navNotifications', icon: Bell },
  { path: '/settings', label: 'sample.navSettings', icon: Settings },
  { path: '/design-system', label: 'gallery.overview', icon: Shapes },
  { path: '/design-system/basic', label: 'gallery.basic', icon: Layers },
  { path: '/design-system/form', label: 'gallery.form', icon: FileText },
  { path: '/design-system/data', label: 'gallery.data', icon: ListTree },
  { path: '/design-system/feedback', label: 'gallery.feedback', icon: MessageSquareWarning },
  { path: '/design-system/navigation', label: 'gallery.navigation', icon: Navigation },
  { path: '/design-system/metrics', label: 'gallery.metrics', icon: ChartLine },
  { path: '/design-system/icons', label: 'icons.title', icon: Smile },
  { path: '/design-system/theme', label: 'gallery.theme', icon: CircleGauge },
]
