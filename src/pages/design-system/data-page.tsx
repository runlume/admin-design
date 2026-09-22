import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { EditableTable } from '@/components/editable-table'
import { DataTable, ColumnManager } from '@/components/data-table'
import { Descriptions } from '@/components/descriptions'
import { PagePager } from '@/components/page-pager'
import { StatusBadge } from '@/components/status-badge'
import { Timeline } from '@/components/timeline'
import { LayoutContainer } from '@/components/layout-container'
import { Tree, type TreeItem } from '@/components/tree'
import { TreeTable } from '@/components/tree-table'
import { TableToolbar } from '@/components/table-toolbar'
import { BulkActions } from '@/components/bulk-actions'
import { ResizablePanel } from '@/components/resizable-panel'
import { SortableList, type SortableItem } from '@/components/sortable-list'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { organizationUnits, type OrganizationUnit } from '@/pages/sample-data'
import { type TreeNode } from '@/lib/tree'
import { readColumnOrder } from '@/lib/table-prefs'
import { Section, DesignHeader } from './section'

type Row = { id: string; name: string; owner: string; status: string; updatedAt: string }
type SortableField = SortableItem & { label: string; description: string }

/** 大数据量示例：1000 行，用来演示虚拟滚动只渲染可视窗口。 */
const largeRows: Row[] = Array.from({ length: 1000 }, (_, index) => ({
  id: `ROW-${String(index + 1).padStart(4, '0')}`,
  name: `记录 ${index + 1}`,
  owner: ['张伟', '李娜', '王强', '陈静'][index % 4] ?? '张伟',
  status: ['ACTIVE', 'PENDING', 'DISABLED'][index % 3] ?? 'ACTIVE',
  updatedAt: `2026-09-${String((index % 28) + 1).padStart(2, '0')} 10:${String(index % 60).padStart(2, '0')}`,
}))

const rows: Row[] = organizationUnits.slice(0, 8).map((unit, index) => ({
  id: unit.id,
  name: unit.name,
  owner: ['张伟', '李娜', '王强', '陈静'][index % 4] ?? '张伟',
  status: unit.status,
  updatedAt: `2026-09-${String(10 + index).padStart(2, '0')} 09:${String(20 + index).padStart(2, '0')}`,
}))

const unitKindKeys = {
  COMPANY: 'sample.unitCompany',
  DEPARTMENT: 'sample.unitDepartment',
  TEAM: 'sample.unitTeam',
} as const

/** 数据展示：表格、树、描述列表、时间线与分页。 */
export function DesignDataPage() {
  const { t } = useTranslation()
  const [density, setDensity] = useState<'compact' | 'default' | 'relaxed'>('default')
  const [visibility, setVisibility] = useState<Record<string, boolean>>({})
  // 列顺序从浏览器偏好初始化：传空数组会被当成"默认顺序"，把保存的顺序覆盖掉
  const [order, setOrder] = useState<string[]>(() => readColumnOrder('design-data'))
  const [page, setPage] = useState(1)
  const [checkableUnits, setCheckableUnits] = useState<string[]>(['OU-111'])
  const [treeCheckable, setTreeCheckable] = useState(false)
  // 可编辑表格已保存的行：示例里只用来演示 onChange，真实项目在这里落库
  const [, setEditableRows] = useState<{ id: string; values: Record<string, string> }[]>([])
  const [sortableFields, setSortableFields] = useState<SortableField[]>([
    { id: 'name', label: '客户名称', description: '主展示字段' },
    { id: 'owner', label: '负责人', description: '用于分组与筛选' },
    { id: 'status', label: '状态', description: '固定业务字段', disabled: true },
    { id: 'updatedAt', label: '更新时间', description: '默认倒序排列' },
  ])

  const columns: ColumnDef<Row>[] = [
    { accessorKey: 'id', header: 'ID', size: 120 },
    { accessorKey: 'name', header: '名称', size: 200 },
    { accessorKey: 'owner', header: '负责人', size: 120 },
    {
      accessorKey: 'status',
      header: '状态',
      size: 120,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    { accessorKey: 'updatedAt', header: '更新时间', size: 180 },
  ]

  const listTree = useMemo<TreeNode<TreeItem>[]>(
    () =>
      organizationUnits.map((unit) => ({
        id: unit.id,
        parentId: unit.parentId,
        sortOrder: unit.sortOrder,
        data: { label: unit.name, description: t(unitKindKeys[unit.kind]) },
      })),
    [t],
  )
  const tableTree = useMemo<TreeNode<OrganizationUnit>[]>(
    () =>
      organizationUnits.map((unit) => ({
        id: unit.id,
        parentId: unit.parentId,
        sortOrder: unit.sortOrder,
        data: unit,
      })),
    [],
  )
  const rootIds = organizationUnits.filter((unit) => unit.parentId === null).map((unit) => unit.id)

  return (
    <>
      <DesignHeader title={t('gallery.data')} />
      <div className="flex flex-col gap-6">
        <Section
          title="数据表格"
          description="表头排序、列显示管理、行密度、行点击与溢出提示都来自标准表格。"
        >
          <DataTable
            data={rows}
            columns={columns}
            caption="组织单元"
            sortable
            storageId="design-data"
            pinned={{ first: true, last: true }}
            expandable={{
              content: (row) => (
                <Descriptions
                  columns={3}
                  items={[
                    { key: 'id', label: '编号', value: row.id },
                    { key: 'owner', label: '负责人', value: row.owner },
                    { key: 'updated', label: '更新时间', value: row.updatedAt },
                    {
                      key: 'status',
                      label: '状态',
                      value: <StatusBadge status={row.status} />,
                    },
                  ]}
                />
              ),
            }}
            density={density}
            columnVisibility={visibility}
            onColumnVisibilityChange={setVisibility}
            columnOrder={order}
            onColumnOrderChange={setOrder}
            onRowClick={(row) => toast.success(row.name)}
            defaultSorting={[{ id: 'name', desc: false }]}
            toolbar={
              <TableToolbar>
                <ColumnManager
                  columns={columns}
                  storageId="design-data"
                  visibility={visibility}
                  onVisibilityChange={setVisibility}
                  order={order}
                  onOrderChange={setOrder}
                  pinned={{ first: true, last: true }}
                />
                <BulkActions label={t('density')}>
                  {(['compact', 'default', 'relaxed'] as const).map((value) => (
                    <DropdownMenuItem key={value} onSelect={() => setDensity(value)}>
                      {density === value && <Check aria-hidden="true" />}
                      {t(
                        value === 'compact'
                          ? 'densityCompact'
                          : value === 'relaxed'
                            ? 'densityRelaxed'
                            : 'densityDefault',
                      )}
                    </DropdownMenuItem>
                  ))}
                </BulkActions>
                <Button variant="outline" onClick={() => toast.success(t('sample.saved'))}>
                  批量确认
                </Button>
              </TableToolbar>
            }
            footer={
              <div className="flex w-full flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  {t('total', { count: rows.length })}
                </span>
                <PagePager page={page} pageCount={12} onPageChange={setPage} />
              </div>
            }
          />
        </Section>

        <Section
          title="大数据量表格"
          description="virtual 开启后只渲染可视窗口内的行，上下用占位行撑起滚动高度；表头固定。"
        >
          <DataTable
            data={largeRows}
            columns={columns}
            caption="大数据量记录"
            storageId="design-large"
            virtual={{ height: 460 }}
            footer={
              <span className="text-xs text-muted-foreground">
                {t('total', { count: largeRows.length })}
              </span>
            }
          />
        </Section>

        {/* 左侧放内容更宽的表格类示例，右侧留给时间线 */}
        <div className="grid gap-6 [&>*]:min-w-0 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <Section title="列表树" description="层级缩进 + 虚线层级线，支持节点搜索与整体展开收起。">
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <Checkbox
                checked={treeCheckable}
                onCheckedChange={(value) => setTreeCheckable(value === true)}
              />
              启用勾选（父节点级联子节点，孙节点被勾选时祖先显示半选）
            </label>
            <Tree
              nodes={listTree}
              label="组织单元"
              defaultExpanded={rootIds}
              filterable
              showExpandControls
              onMove={(sourceId, targetId) =>
                toast.success(
                  targetId ? `把 ${sourceId} 移动到 ${targetId} 之后` : `把 ${sourceId} 移到根节点`,
                )
              }
              loadChildren={(id) => toast.info(`按需加载 ${id} 的子节点`)}
              checkable={treeCheckable}
              defaultChecked={checkableUnits}
              onCheckedChange={setCheckableUnits}
            />
          </Section>
          <Section title="表格树" description="层级放在第一列，其余列与标准表格一致。">
            <TreeTable
              nodes={tableTree}
              caption="组织单元（表格）"
              defaultExpanded={rootIds}
              rowLabel={(node) => node.data.name}
              columns={[
                {
                  id: 'name',
                  header: '名称',
                  cell: (row) => <span className="font-medium">{row.node.data.name}</span>,
                },
                {
                  id: 'kind',
                  header: '类型',
                  width: 110,
                  cell: (row) => t(unitKindKeys[row.node.data.kind]),
                },
                {
                  id: 'members',
                  header: '成员',
                  width: 90,
                  cell: (row) => row.node.data.members,
                },
                {
                  id: 'status',
                  header: '状态',
                  width: 120,
                  cell: (row) => <StatusBadge status={row.node.data.status} />,
                },
              ]}
            />
          </Section>
          <Section
            title="可编辑表格"
            description="底部整行新增，逐行编辑/删除；新行默认就在编辑态，取消即丢弃。"
          >
            <EditableTable
              columns={[
                { key: 'name', label: '客户名称', placeholder: '请输入客户名称' },
                {
                  key: 'owner',
                  label: '负责人',
                  type: 'select',
                  options: [
                    { value: '张伟', label: '张伟' },
                    { value: '李娜', label: '李娜' },
                    { value: '王强', label: '王强' },
                  ],
                },
                {
                  key: 'status',
                  label: '状态',
                  type: 'select',
                  options: [
                    { value: 'ACTIVE', label: '正常' },
                    { value: 'PENDING', label: '待处理' },
                    { value: 'DISABLED', label: '已停用' },
                  ],
                },
                { key: 'startedAt', label: '签约日期', type: 'date' },
                { key: 'amount', label: '合同金额', type: 'number', placeholder: '0.00' },
                { key: 'vip', label: '重点客户', type: 'switch' },
              ]}
              defaultRows={[
                {
                  id: 'row-1',
                  values: {
                    name: '清源环保科技',
                    owner: '张伟',
                    status: 'ACTIVE',
                    startedAt: '2026-09-16',
                    amount: '128000',
                    vip: 'true',
                  },
                },
                {
                  id: 'row-2',
                  values: {
                    name: '云和智能制造',
                    owner: '李娜',
                    status: 'PENDING',
                    startedAt: '2026-08-02',
                    amount: '264500',
                    vip: 'false',
                  },
                },
              ]}
              onChange={(rows) => setEditableRows(rows)}
            />
          </Section>
          <Section title="时间线" description="操作记录与审批轨迹，按时间倒序展示。">
            <Timeline
              items={[
                {
                  key: '1',
                  title: '提交注册资料',
                  time: '2026-09-16 09:20',
                  description: '由张伟提交，等待资质审核。',
                  tone: 'success',
                },
                {
                  key: '2',
                  title: '补充营业执照',
                  time: '2026-09-15 17:42',
                  description: '上传扫描件并完成人工比对。',
                },
                {
                  key: '3',
                  title: '审核退回',
                  time: '2026-09-14 11:05',
                  description: '联系人信息与工商登记不一致。',
                  tone: 'danger',
                },
              ]}
            />
          </Section>
        </div>

        <Section
          title="分割面板与拖放排序"
          description="分隔条支持指针、方向键和双击复位；列表支持原生拖放与键盘排序。"
        >
          <ResizablePanel
            className="h-72"
            firstLabel="字段排序"
            secondLabel="实时预览"
            first={
              <SortableList
                items={sortableFields}
                onReorder={setSortableFields}
                label="字段顺序"
                renderItem={(item, index) => (
                  <div>
                    <p className="text-sm font-medium">
                      {index + 1}. {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                )}
              />
            }
            second={
              <div className="space-y-3">
                <p className="font-medium">列预览</p>
                <div className="flex flex-wrap gap-2">
                  {sortableFields.map((item) => (
                    <Badge key={item.id} variant="secondary">
                      {item.label}
                    </Badge>
                  ))}
                </div>
              </div>
            }
          />
        </Section>

        <Section
          className="xl:col-span-2"
          title="布局容器"
          description="主内容 + 可折叠、可拖拽调宽的详情侧栏；宽度按 storageId 保存在浏览器。"
        >
          <LayoutContainer
            asideLabel="详情侧栏示例"
            storageId="design-aside"
            aside={
              <>
                <p className="font-medium">关联信息</p>
                <p className="text-xs text-muted-foreground">
                  拖左边缘调整宽度（键盘 ←/→ 也可），双击复位；刷新后保持。
                </p>
                <Timeline
                  items={[
                    { key: 'a', title: '同步客户资料', time: '2 分钟前', tone: 'success' },
                    { key: 'b', title: '重试推送订单', time: '1 小时前' },
                  ]}
                />
              </>
            }
          >
            <Descriptions
              items={[
                { key: 'id', label: '客户编号', value: 'CUS-1001' },
                { key: 'owner', label: '负责人', value: '张伟' },
                { key: 'phone', label: '联系电话', value: '13800000001' },
                { key: 'status', label: '状态', value: <StatusBadge status="ACTIVE" /> },
                {
                  key: 'email',
                  label: '邮箱',
                  value: 'ops@yunhe.example',
                  span: 2,
                },
              ]}
            />
          </LayoutContainer>
        </Section>
      </div>
    </>
  )
}
