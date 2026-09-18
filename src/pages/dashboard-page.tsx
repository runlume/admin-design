import { Link } from 'react-router'
import { ArrowUpRight, ClipboardList, UsersRound, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/page'
import { CountTo } from '@/components/count-to'
import { Sparkline } from '@/components/sparkline'
import { Trend } from '@/components/trend'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'
import { customers, orders } from '@/pages/sample-data'

/** 工作台：标准后台的默认落地页，指标 → 待办 → 快捷入口。 */
export function DashboardPage() {
  const { t } = useTranslation()
  const metrics = [
    {
      key: 'metricCustomers',
      value: customers.length,
      prefix: '',
      direction: 'up' as const,
      percent: 8.4,
      series: [28, 32, 30, 36, 41, 38, 46, customers.length],
    },
    {
      key: 'metricOrders',
      value: orders.length,
      prefix: '',
      direction: 'up' as const,
      percent: 3.1,
      series: [2, 3, 3, 4, 4, 5, 5, orders.length],
    },
    {
      key: 'metricRevenue',
      value: orders.reduce((sum, order) => sum + order.amount, 0),
      prefix: '¥ ',
      direction: 'down' as const,
      percent: 2.6,
      series: [52, 48, 50, 44, 46, 40, 38, 36],
    },
    {
      key: 'metricPending',
      value: customers.filter((item) => item.status === 'PENDING').length,
      prefix: '',
      direction: 'up' as const,
      percent: 50,
      series: [1, 1, 2, 2, 2, 3, 3, 3],
    },
  ]
  const shortcuts = [
    {
      to: '/customers',
      title: t('sample.customersTitle'),
      description: t('sample.customersDescription'),
      icon: UsersRound,
    },
    {
      to: '/settings',
      title: t('sample.settingsTitle'),
      description: t('sample.settingsDescription'),
      icon: Wallet,
    },
  ]
  return (
    <>
      <PageHeader
        eyebrow={t('console')}
        title={t('sample.dashboardTitle')}
        description={t('sample.dashboardDescription')}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.key}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t(`sample.${metric.key}`)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-3">
                <p className="text-2xl font-semibold tracking-tight">
                  <CountTo value={metric.value} prefix={metric.prefix} />
                </p>
                <Trend
                  direction={metric.direction}
                  value={metric.percent}
                  reverse={metric.key === 'metricPending'}
                />
              </div>
              <Sparkline
                className="mt-3"
                values={metric.series}
                label={t(`sample.${metric.key}`)}
              />
            </CardContent>
          </Card>
        ))}
      </div>
      <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="size-4 text-muted-foreground" aria-hidden="true" />
              {t('sample.tabOrders')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/40 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs text-muted-foreground">{order.id}</p>
                  <p className="mt-1 truncate text-sm font-medium">
                    {customers.find((item) => item.id === order.customerId)?.name ??
                      order.customerId}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm tabular-nums">
                    ¥ {order.amount.toLocaleString('zh-CN')}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('sample.shortcutTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {shortcuts.map((shortcut) => (
              <Link
                key={shortcut.to}
                to={shortcut.to}
                className="group flex min-h-24 flex-col justify-between gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <shortcut.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="flex items-end justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{shortcut.title}</span>
                    <span className="mt-1 line-clamp-2 block text-xs text-muted-foreground">
                      {shortcut.description}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  )
}
