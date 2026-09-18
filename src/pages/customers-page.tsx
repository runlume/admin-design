import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Ban, Download, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { DataTable } from '@/components/data-table'
import { ColumnManager } from '@/components/data-table'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PagePager } from '@/components/page-pager'
import { ListModule } from '@/components/list-module'
import { SearchActions, SearchField, SearchFilters } from '@/components/search-filters'
import { FilterButton } from '@/components/filter-button'
import { RowActions } from '@/components/row-actions'
import { BulkActions } from '@/components/bulk-actions'
import { StatusBadge } from '@/components/status-badge'
import { PaginationBar } from '@/components/pagination-bar'
import { PageButton } from '@/components/page-button'
import { PageHeader } from '@/components/page'
import { Can } from '@/components/permission'
import { readColumnOrder, readTablePrefs, type ColumnSizes } from '@/lib/table-prefs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DateRangeInput } from '@/components/ui/date-range-input'
import { NativeSelect } from '@/components/ui/native-select'
import { MultiSelect } from '@/components/multi-select'
import { StorageBox } from '@/components/storage-box'
import type { DateRange } from '@/lib/range'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { CustomerFormDialog } from '@/pages/customer-form-dialog'
import { customers as seed, statusOptions, type Customer } from '@/pages/sample-data'

const pageSizeOptions = [10, 20, 50] as const

/** 全选复选框需要 indeterminate，原生 checkbox 只能通过 ref 设置。 */
function SelectAllCheckbox({
  checked,
  indeterminate,
  label,
  onChange,
}: {
  checked: boolean
  indeterminate: boolean
  label: string
  onChange: (checked: boolean) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])
  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label={label}
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
  )
}

/**
 * 标准列表页：搜索区、操作区、表格、分页四个区域相互独立。
 * 接真实接口时把 seed 换成查询结果，并保留加载态与空态分支。
 */
export function CustomersPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [rows, setRows] = useState<Customer[]>(seed)
  const [draft, setDraft] = useState({
    keyword: '',
    statuses: [] as string[],
    range: {} as DateRange,
  })
  const [query, setQuery] = useState(draft)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [selected, setSelected] = useState<string[]>([])
  const [editing, setEditing] = useState<Customer | undefined>()
  const [formOpen, setFormOpen] = useState(false)
  const [visibility, setVisibility] = useState<Record<string, boolean>>({})
  // 列顺序从浏览器偏好初始化：传空数组会被当成"默认顺序"，把保存的顺序覆盖掉
  const [order, setOrder] = useState<string[]>(() => readColumnOrder('customers'))
  const [sizes, setSizes] = useState<ColumnSizes>(() => readTablePrefs('customers').sizes)
  const [confirmRemove, setConfirmRemove] = useState(false)

  /** 筛选条件摘要：关键字 / 状态 / 日期，用于筛选预设与视图预设的行内说明。 */
  function describeFilters(value: typeof draft) {
    const parts = [
      value.keyword ? `${t('sample.keyword')}: ${value.keyword}` : undefined,
      value.statuses.length
        ? `${t('sample.status')}: ${value.statuses.map((status) => t(status)).join('/')}`
        : undefined,
      value.range.from || value.range.to
        ? `${t('sample.columnCreatedAt')}: ${value.range.from ?? ''}~${value.range.to ?? ''}`
        : undefined,
    ].filter(Boolean)
    return parts.length ? parts.join(' · ') : t('sample.noFilter')
  }

  const filtered = useMemo(
    () =>
      rows.filter(
        (row) =>
          (query.statuses.length === 0 || query.statuses.includes(row.status)) &&
          (query.keyword === '' ||
            [row.name, row.owner, row.phone, row.id].some((value) =>
              value.toLowerCase().includes(query.keyword.toLowerCase()),
            )) &&
          (!query.range.from || row.createdAt >= query.range.from) &&
          (!query.range.to || row.createdAt <= query.range.to),
      ),
    [rows, query],
  )
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = Math.min(page, pageCount)
  const paged = filtered.slice((current - 1) * pageSize, current * pageSize)
  const currentIds = paged.map((row) => row.id)
  const allSelected = currentIds.length > 0 && currentIds.every((id) => selected.includes(id))
  const someSelected = currentIds.some((id) => selected.includes(id))

  function remove(targets: string[]) {
    setRows((value) => value.filter((row) => !targets.includes(row.id)))
    setSelected((value) => value.filter((id) => !targets.includes(id)))
    toast.success(t('sample.deleted'))
  }
  function disable(targets: string[]) {
    setRows((value) =>
      value.map((row) => (targets.includes(row.id) ? { ...row, status: 'DISABLED' } : row)),
    )
    toast.success(t('sample.saved'))
  }

  const columns: ColumnDef<Customer>[] = [
    {
      id: 'select',
      header: () => (
        <SelectAllCheckbox
          checked={allSelected}
          indeterminate={someSelected && !allSelected}
          label={t('selectAll')}
          onChange={(checked) =>
            setSelected((value) =>
              checked
                ? [...new Set([...value, ...currentIds])]
                : value.filter((id) => !currentIds.includes(id)),
            )
          }
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          aria-label={row.original.name}
          checked={selected.includes(row.original.id)}
          onChange={(event) =>
            setSelected((value) =>
              event.target.checked
                ? [...value, row.original.id]
                : value.filter((id) => id !== row.original.id),
            )
          }
        />
      ),
    },
    {
      accessorKey: 'name',
      header: t('sample.columnName'),
      size: 220,
      cell: ({ row }) => (
        <Link className="text-primary hover:underline" to={`/customers/${row.original.id}`}>
          {row.original.name}
        </Link>
      ),
    },
    { accessorKey: 'owner', header: t('sample.columnOwner'), size: 120 },
    { accessorKey: 'phone', header: t('sample.columnPhone'), size: 140 },
    {
      accessorKey: 'status',
      header: t('sample.columnStatus'),
      size: 120,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    { accessorKey: 'createdAt', header: t('sample.columnCreatedAt'), size: 130 },
    {
      id: 'actions',
      header: t('sample.columnActions'),
      cell: ({ row }) => (
        <RowActions>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/customers/${row.original.id}`)}
          >
            {t('sample.detail')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditing(row.original)
              setFormOpen(true)
            }}
          >
            {t('sample.edit')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={row.original.status === 'DISABLED'}
            onClick={() => disable([row.original.id])}
          >
            <Ban aria-hidden="true" />
            {t('sample.disable')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => remove([row.original.id])}>
            <Trash2 aria-hidden="true" />
            {t('sample.remove')}
          </Button>
        </RowActions>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow={t('console')}
        title={t('sample.customersTitle')}
        description={t('sample.customersDescription')}
        actions={
          // 按钮级鉴权：没有 customer:create 的账号看不到这个入口。
          <Can permission="customer:create">
            <Button
              onClick={() => {
                setEditing(undefined)
                setFormOpen(true)
              }}
            >
              <Plus aria-hidden="true" />
              {t('sample.create')}
            </Button>
          </Can>
        }
      />
      <ListModule
        search={
          <SearchFilters
            presets={{
              storageId: 'customers',
              // 保存"输入框里当前的条件"，不必先点搜索
              value: draft,
              summary: (value) => describeFilters(value as typeof draft),
              onApply: (value) => {
                const preset = value as typeof draft
                setDraft(preset)
                setQuery(preset)
                setPage(1)
              },
            }}
            onSubmit={(event) => {
              event.preventDefault()
              setQuery(draft)
              setPage(1)
            }}
          >
            <SearchField as="label">
              {t('sample.keyword')}
              <Input
                value={draft.keyword}
                placeholder={t('sample.keywordPlaceholder')}
                onChange={(event) => setDraft({ ...draft, keyword: event.target.value })}
              />
            </SearchField>
            <SearchField as="label">
              {t('sample.status')}
              <MultiSelect
                label={t('sample.status')}
                placeholder={t('sample.allStatuses')}
                values={draft.statuses}
                onValuesChange={(statuses) => setDraft({ ...draft, statuses })}
                options={statusOptions.map((status) => ({ value: status, label: t(status) }))}
              />
            </SearchField>
            <SearchField as="label">
              {t('sample.columnCreatedAt')}
              <DateRangeInput
                label={t('sample.columnCreatedAt')}
                value={draft.range}
                onValueChange={(range) => setDraft({ ...draft, range })}
              />
            </SearchField>
            <SearchActions>
              <FilterButton action="search" />
              <FilterButton
                action="clear"
                onClick={() => {
                  const cleared = { keyword: '', statuses: [] as string[], range: {} as DateRange }
                  setDraft(cleared)
                  setQuery(cleared)
                  setPage(1)
                }}
              />
            </SearchActions>
          </SearchFilters>
        }
      >
        <DataTable
          data={paged}
          columns={columns}
          caption={t('sample.customersTitle')}
          sortable
          storageId="customers"
          columnVisibility={visibility}
          onColumnVisibilityChange={setVisibility}
          columnOrder={order}
          onColumnOrderChange={setOrder}
          columnSizes={sizes}
          onColumnSizesChange={setSizes}
          onRowClick={(row) => navigate(`/customers/${row.id}`)}
          toolbar={
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(undefined)
                  setFormOpen(true)
                }}
              >
                <Plus aria-hidden="true" />
                {t('sample.create')}
              </Button>
              {/* 没有 customer:export 时保留禁用态，让用户知道"有这个功能但没权限"。 */}
              <Can
                permission="customer:export"
                fallback={
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    aria-label={`${t('sample.export')}（${t('noPermission')}）`}
                  >
                    <Download aria-hidden="true" />
                    {t('sample.export')}
                  </Button>
                }
              >
                <BulkActions label={t('sample.export')} disabled={selected.length === 0}>
                  <DropdownMenuItem onSelect={() => toast.success(t('sample.saved'))}>
                    <Download aria-hidden="true" />
                    CSV
                  </DropdownMenuItem>
                </BulkActions>
              </Can>
              <BulkActions label={t('moreActions')} disabled={selected.length === 0}>
                <DropdownMenuItem onSelect={() => disable(selected)}>
                  <Ban aria-hidden="true" />
                  {t('sample.bulkDisable')}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setConfirmRemove(true)}>
                  <Trash2 aria-hidden="true" />
                  {t('sample.bulkDelete')}
                </DropdownMenuItem>
              </BulkActions>
              <ColumnManager
                columns={columns}
                storageId="customers"
                visibility={visibility}
                onVisibilityChange={setVisibility}
                order={order}
                onOrderChange={setOrder}
              />
              <StorageBox
                storageId="customers-view"
                title={t('sample.viewPreset')}
                // 视图预设保存一份完整布局：筛选条件 + 列显隐 + 列顺序 + 列宽
                snapshot={{
                  query: draft,
                  visibility,
                  order,
                  sizes,
                }}
                summary={(snapshot) => {
                  // 只记录被隐藏的列：显示"隐藏几列"比"可见几列"更能说明这个预设做了什么
                  const hidden = Object.values(snapshot.visibility).filter(
                    (value) => value === false,
                  ).length
                  return `${describeFilters(snapshot.query)} · ${t('columns')}: ${
                    hidden ? `-${hidden}` : '—'
                  }`
                }}
                onRestore={(snapshot) => {
                  setDraft(snapshot.query)
                  setQuery(snapshot.query)
                  setVisibility(snapshot.visibility)
                  // 列顺序与列宽一起恢复（旧预设没有这两个字段时保持当前值）
                  setSizes(snapshot.sizes ?? {})
                  setOrder(snapshot.order ?? order)
                }}
              />
            </>
          }
          footer={
            <>
              <PaginationBar
                mode="fixed"
                summary={t('sample.pageSummary', { page: current, count: filtered.length })}
                pageSize={
                  <NativeSelect
                    size="sm"
                    aria-label={t('sample.pageSizeLabel')}
                    value={String(pageSize)}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value))
                      setPage(1)
                    }}
                  >
                    {pageSizeOptions.map((size) => (
                      <option key={size} value={size}>
                        {t('sample.perPage', { size })}
                      </option>
                    ))}
                  </NativeSelect>
                }
              >
                <PageButton
                  direction="previous"
                  disabled={current <= 1}
                  onClick={() => setPage(current - 1)}
                >
                  {t('previous')}
                </PageButton>
                <PagePager page={current} pageCount={pageCount} onPageChange={setPage} />
                <PageButton
                  direction="next"
                  disabled={current >= pageCount}
                  onClick={() => setPage(current + 1)}
                >
                  {t('next')}
                </PageButton>
              </PaginationBar>
            </>
          }
        />
      </ListModule>
      <CustomerFormDialog
        open={formOpen}
        customer={editing}
        onOpenChange={setFormOpen}
        onSubmit={(values, customer) => {
          setRows((value) =>
            customer
              ? value.map((row) => (row.id === customer.id ? { ...row, ...values } : row))
              : [
                  {
                    ...values,
                    id: `CUS-${1000 + value.length + 1}`,
                    createdAt: new Date().toISOString().slice(0, 10),
                  },
                  ...value,
                ],
          )
          setFormOpen(false)
          toast.success(t('sample.saved'))
        }}
      />
      <ConfirmDialog
        open={confirmRemove}
        onOpenChange={setConfirmRemove}
        tone="danger"
        title={t('sample.bulkDelete')}
        description={t('sample.bulkDeleteHint')}
        confirmLabel={t('sample.remove')}
        onConfirm={() => {
          remove(selected)
          setSelected([])
        }}
      />
    </>
  )
}
