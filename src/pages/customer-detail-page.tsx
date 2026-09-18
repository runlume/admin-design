import { useNavigate, useParams } from 'react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { ArrowLeft, Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/data-table'
import { Descriptions } from '@/components/descriptions'
import { Timeline } from '@/components/timeline'
import { EmptyState, PageHeader } from '@/components/page'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { customers, orders, type Order } from '@/pages/sample-data'

/**
 * 标准详情页：页头返回与操作、关键信息描述列表、页签内的从属数据。
 * 页签内容各自独立加载/滚动，动作入口跟随当前页签。
 */
export function CustomerDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { customerId } = useParams()
  const customer = customers.find((item) => item.id === customerId)
  if (!customer) {
    return (
      <>
        <PageHeader eyebrow={t('console')} title={t('sample.detailTitle')} />
        <EmptyState
          action={
            <Button variant="outline" onClick={() => navigate('/customers')}>
              <ArrowLeft aria-hidden="true" />
              {t('sample.back')}
            </Button>
          }
        />
      </>
    )
  }
  const related = orders.filter((order) => order.customerId === customer.id)
  const orderColumns: ColumnDef<Order>[] = [
    { accessorKey: 'id', header: t('sample.orderId'), size: 160 },
    {
      accessorKey: 'amount',
      header: t('sample.orderAmount'),
      size: 140,
      cell: ({ row }) => `¥ ${row.original.amount.toLocaleString('zh-CN')}`,
    },
    {
      accessorKey: 'status',
      header: t('sample.orderStatus'),
      size: 140,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    { accessorKey: 'createdAt', header: t('sample.columnCreatedAt'), size: 130 },
  ]
  const facts = [
    { label: t('sample.fieldName'), value: customer.name },
    { label: t('sample.fieldOwner'), value: customer.owner },
    { label: t('sample.fieldPhone'), value: customer.phone },
    { label: t('sample.fieldEmail'), value: customer.email },
  ]
  return (
    <>
      <PageHeader
        eyebrow={`${t('sample.navCustomers')} · ${customer.id}`}
        title={customer.name}
        description={t('sample.detailDescription')}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate('/customers')}>
              <ArrowLeft aria-hidden="true" />
              {t('sample.back')}
            </Button>
            <Button>
              <Pencil aria-hidden="true" />
              {t('sample.edit')}
            </Button>
          </>
        }
      />
      <Tabs defaultValue="overview" className="gap-6">
        <TabsList aria-label={t('sample.detailTitle')}>
          <TabsTrigger value="overview">{t('sample.tabOverview')}</TabsTrigger>
          <TabsTrigger value="orders">{t('sample.tabOrders')}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardContent>
              <Descriptions
                columns={3}
                items={[
                  ...facts.map((fact) => ({
                    key: fact.label,
                    label: fact.label,
                    value: <span className="font-medium">{fact.value}</span>,
                  })),
                  {
                    key: 'status',
                    label: t('sample.fieldStatus'),
                    value: <StatusBadge status={customer.status} />,
                  },
                  {
                    key: 'createdAt',
                    label: t('sample.columnCreatedAt'),
                    value: <span className="font-medium">{customer.createdAt}</span>,
                  },
                  {
                    key: 'note',
                    label: t('sample.fieldNote'),
                    value: customer.note || '—',
                    span: 3,
                  },
                ]}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('sample.timelineTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline
                items={[
                  {
                    key: '1',
                    title: t('sample.timelineCreated'),
                    time: customer.createdAt,
                    description: `${customer.owner} · ${customer.phone}`,
                    tone: 'success',
                  },
                  {
                    key: '2',
                    title: t('sample.timelineContacted'),
                    time: customer.createdAt,
                    description: t('sample.timelineContactedHint'),
                  },
                  {
                    key: '3',
                    title: t('sample.timelineNote'),
                    time: customer.createdAt,
                    description: customer.note || t('sample.timelineNoteHint'),
                    tone: 'warning',
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders">
          <DataTable
            data={related}
            columns={orderColumns}
            caption={t('sample.tabOrders')}
            emptyTitle={t('empty')}
            emptyDescription={t('emptyDescription')}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}
