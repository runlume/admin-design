import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Alert } from '@/components/ui/alert'
import { ColumnChart } from '@/components/column-chart'
import { CountTo } from '@/components/count-to'
import { DataTable } from '@/components/data-table'
import { PageHeader } from '@/components/page'
import { Sparkline } from '@/components/sparkline'
import { StatusBadge } from '@/components/status-badge'
import { Trend } from '@/components/trend'
import { customers, orders } from '@/pages/sample-data'

type Row = {
  id: string
  name: string
  owner: string
  orders: number
  amount: number
  status: string
}

/**
 * 报表中心：由后台菜单下发的动态路由页面（组件键 `reports-page`）。
 * 页面本身不关心"自己是怎么被路由到的"，只按标准页型组装。
 */
export function ReportsPage() {
  const { t } = useTranslation()

  const rows = useMemo<Row[]>(
    () =>
      customers.slice(0, 8).map((customer, index) => {
        const own = orders.filter((order) => order.customerId === customer.id)
        return {
          id: customer.id,
          name: customer.name,
          owner: customer.owner,
          orders: own.length || (index % 3) + 1,
          amount: own.reduce((sum, order) => sum + order.amount, 0) || (index + 2) * 12800,
          status: customer.status,
        }
      }),
    [],
  )

  const total = rows.reduce((sum, row) => sum + row.amount, 0)
  const columns: ColumnDef<Row>[] = [
    { accessorKey: 'name', header: t('sample.columnName'), size: 220 },
    { accessorKey: 'owner', header: t('sample.columnOwner'), size: 120 },
    { accessorKey: 'orders', header: t('sample.orderCount'), size: 100 },
    {
      accessorKey: 'amount',
      header: t('sample.orderAmount'),
      size: 140,
      cell: ({ row }) => (
        <span className="tabular-nums">¥ {row.original.amount.toLocaleString('zh-CN')}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: t('sample.orderStatus'),
      size: 120,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ]

  const metrics = [
    { key: 'revenue', value: total, prefix: '¥ ', direction: 'up' as const, percent: 12.4 },
    {
      key: 'orders',
      value: rows.reduce((sum, row) => sum + row.orders, 0),
      prefix: '',
      direction: 'up' as const,
      percent: 4.2,
    },
    {
      key: 'average',
      value: Math.round(total / Math.max(rows.length, 1)),
      prefix: '¥ ',
      direction: 'down' as const,
      percent: 1.8,
    },
    { key: 'customers', value: rows.length, prefix: '', direction: 'up' as const, percent: 6.1 },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Report"
        title={t('sample.reportsTitle')}
        description={t('sample.reportsDescription')}
      />
      <div className="grid gap-6">
        <Alert
          variant="info"
          title={t('sample.dynamicRouteTitle')}
          description={t('sample.dynamicRouteDescription')}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.key} className="rounded-xl border bg-card p-4">
              <p className="text-xs text-muted-foreground">
                {t(`sample.report${(metric.key[0] ?? '').toUpperCase()}${metric.key.slice(1)}`)}
              </p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="text-2xl font-semibold tabular-nums">
                  <CountTo value={metric.value} prefix={metric.prefix} />
                </p>
                <Trend direction={metric.direction} value={metric.percent} />
              </div>
              <Sparkline
                className="mt-3"
                values={[3, 5, 4, 6, 8, 7, 9, 11]}
                label={t(
                  `sample.report${(metric.key[0] ?? '').toUpperCase()}${metric.key.slice(1)}`,
                )}
              />
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-card p-4">
          <p className="mb-4 text-sm font-medium">{t('sample.reportDaily')}</p>
          <ColumnChart
            label={t('sample.reportDaily')}
            valueSuffix={t('sample.reportUnit')}
            data={[
              { label: '9-11', value: 6 },
              { label: '9-12', value: 9 },
              { label: '9-13', value: 7 },
              { label: '9-14', value: 11 },
              { label: '9-15', value: 14 },
              { label: '9-16', value: 12 },
              { label: '9-17', value: 16 },
            ]}
          />
        </div>

        <DataTable
          data={rows}
          columns={columns}
          caption={t('sample.reportTable')}
          sortable
          storageId="reports"
          defaultSorting={[{ id: 'amount', desc: true }]}
        />
      </div>
    </>
  )
}
