import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Brand } from '@/components/brand'
import { StatusBadge } from '@/components/status-badge'
import { Section, DesignHeader } from './section'

const surfaceTokens = ['primary', 'accent', 'muted', 'sidebar', 'card', 'brand-lime'] as const
const pages = [
  { to: '/design-system/basic', key: 'gallery.basic', hint: '按钮、输入、选择、勾选与快捷键标记' },
  { to: '/design-system/form', key: 'gallery.form', hint: '表单控件、验证码、密码强度与级联选择' },
  { to: '/design-system/data', key: 'gallery.data', hint: '表格、树、描述列表、时间线与分页' },
  {
    to: '/design-system/feedback',
    key: 'gallery.feedback',
    hint: '提示条、弹窗、抽屉、确认与状态',
  },
  {
    to: '/design-system/navigation',
    key: 'gallery.navigation',
    hint: '面包屑、页签、步骤条与命令面板',
  },
  {
    to: '/design-system/metrics',
    key: 'gallery.metrics',
    hint: '数字滚动、涨跌徽标、趋势线与进度',
  },
  { to: '/design-system/theme', key: 'gallery.theme', hint: '品牌、配色、通知与无障碍设置' },
  { to: '/design-system/icons', key: 'gallery.icons', hint: '全部图标可搜索、可复制' },
] as const

/** 组件总览首页：分类入口 + 品牌与语义色板。 */
export function DesignOverviewPage() {
  const { t } = useTranslation()
  return (
    <>
      <DesignHeader title={t('gallery.overview')} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Section
          className="xl:col-span-2"
          title="@runlume/admin-ui 0.2.1 已发布"
          description="基础控件、数据表格、筛选分页、图表、页面状态、日历、穿梭框、评分、可调整面板与拖放列表均可通过 npm 直接安装。"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/30 px-4 py-3">
            <code className="text-sm">pnpm add @runlume/admin-ui</code>
            <a
              href="https://www.npmjs.com/package/@runlume/admin-ui"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              查看 npm 包
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </div>
        </Section>
        <Section
          title="品牌与标识"
          description="这里展示的是 Runlume 的品牌资产（public/brand，深浅模式各一份）；业务系统对外发布前请替换。"
        >
          <div className="flex flex-wrap items-center gap-6">
            <Brand className="w-36" />
            <Brand compact />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="flex h-16 w-24 items-end rounded-lg bg-brand-lime p-2 font-mono text-[10px] text-brand-lime-foreground">
              brand-lime
            </span>
            <span className="flex h-16 w-24 items-end rounded-lg bg-primary p-2 font-mono text-[10px] text-primary-foreground">
              primary
            </span>
            <span className="flex h-16 w-24 items-end rounded-lg bg-accent p-2 font-mono text-[10px] text-accent-foreground">
              accent
            </span>
          </div>
        </Section>
        <Section title="语义色板" description="面层与文字全部来自语义 Token，切换主题自动跟随。">
          <div className="grid grid-cols-3 gap-2">
            {surfaceTokens.map((token) => (
              <span
                key={token}
                className="flex h-20 flex-col justify-between rounded-lg border p-2 font-mono text-[10px]"
                style={{
                  background: `var(--${token})`,
                  color: `var(--${token}-foreground, var(--foreground))`,
                }}
              >
                <span>{token}</span>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              'ACTIVE',
              'PENDING',
              'PROCESSING',
              'FAILED',
              'DISABLED',
              'INACTIVE',
              'SUSPENDED',
              'UNKNOWN',
            ].map((status) => (
              <StatusBadge key={status} status={status} />
            ))}
          </div>
        </Section>
        <Section
          className="xl:col-span-2"
          title="分类导航"
          description="组件按类型拆分到独立页面，避免单页过长。"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <Link
                key={page.to}
                to={page.to}
                className="flex items-start justify-between gap-3 rounded-xl border bg-card px-4 py-3 transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{t(page.key)}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{page.hint}</span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                />
              </Link>
            ))}
          </div>
        </Section>
      </div>
    </>
  )
}
