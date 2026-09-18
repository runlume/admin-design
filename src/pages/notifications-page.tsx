import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { CheckCheck, Eye, MailOpen, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { DataTable } from '@/components/data-table'
import { ListModule } from '@/components/list-module'
import { SearchActions, SearchField, SearchFilters } from '@/components/search-filters'
import { FilterButton } from '@/components/filter-button'
import { RowActions } from '@/components/row-actions'
import { BulkActions } from '@/components/bulk-actions'
import { TableCellOverflow } from '@/components/table-cell-overflow'
import { TimeAgo } from '@/components/time-ago'
import { PageHeader } from '@/components/page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { DateRangeInput } from '@/components/ui/date-range-input'
import type { DateRange } from '@/lib/range'
import {
  notificationCategories,
  unreadCount,
  useNotifications,
  type AppNotification,
} from '@/lib/notifications'
import { cn } from '@/lib/utils'

const readStates = ['all', 'unread', 'read'] as const
type ReadState = (typeof readStates)[number]

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
 * 标准通知页：搜索区、批量操作、表格、详情弹窗四段。
 * 已读状态与顶栏角标共用 `useNotifications`，接入真实接口时替换数据来源即可。
 */
export function NotificationsPage() {
  const { t } = useTranslation()
  const items = useNotifications((state) => state.items)
  const markRead = useNotifications((state) => state.markRead)
  const markAllRead = useNotifications((state) => state.markAllRead)
  const remove = useNotifications((state) => state.remove)
  const [draft, setDraft] = useState({
    keyword: '',
    read: 'all' as ReadState,
    category: '',
    range: {} as DateRange,
  })
  const [query, setQuery] = useState(draft)
  const [selected, setSelected] = useState<string[]>([])
  const [detail, setDetail] = useState<AppNotification>()
  const unread = unreadCount(items)

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (query.read === 'all' || (query.read === 'unread' ? !item.read : item.read)) &&
          (query.category === '' || item.category === query.category) &&
          (query.keyword === '' ||
            [item.title, item.body, item.id].some((value) =>
              value.toLowerCase().includes(query.keyword.toLowerCase()),
            )) &&
          (!query.range.from || item.createdAt.slice(0, 10) >= query.range.from) &&
          (!query.range.to || item.createdAt.slice(0, 10) <= query.range.to),
      ),
    [items, query],
  )
  const currentIds = filtered.map((item) => item.id)
  const allSelected = currentIds.length > 0 && currentIds.every((id) => selected.includes(id))
  const someSelected = currentIds.some((id) => selected.includes(id))

  function updateRead(ids: string[], read: boolean) {
    markRead(ids, read)
    setSelected((value) => value.filter((id) => !ids.includes(id)))
    toast.success(t('notifications.saved'))
  }
  function discard(ids: string[]) {
    remove(ids)
    setSelected((value) => value.filter((id) => !ids.includes(id)))
    setDetail((value) => (value && ids.includes(value.id) ? undefined : value))
    toast.success(t('notifications.removed'))
  }

  const columns: ColumnDef<AppNotification>[] = [
    {
      id: 'select',
      header: () => (
        <SelectAllCheckbox
          checked={allSelected}
          indeterminate={someSelected && !allSelected}
          label={t('notifications.columnTitle')}
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
          aria-label={row.original.title}
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
      accessorKey: 'title',
      header: t('notifications.columnTitle'),
      size: 320,
      cell: ({ row }) => (
        <div className="min-w-0 space-y-1">
          <div className="flex min-w-0 items-center gap-2">
            {!row.original.read && (
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-primary" />
            )}
            <button
              type="button"
              className={cn(
                'min-w-0 truncate text-left hover:text-primary hover:underline',
                !row.original.read && 'font-medium',
              )}
              onClick={() => {
                setDetail(row.original)
                if (!row.original.read) markRead([row.original.id], true)
              }}
            >
              {row.original.title}
            </button>
          </div>
          <TableCellOverflow>
            <span className="block truncate text-xs text-muted-foreground">
              {row.original.body}
            </span>
          </TableCellOverflow>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: t('notifications.columnCategory'),
      size: 110,
      cell: ({ row }) => (
        <Badge variant="outline">{t(`notifications.categories.${row.original.category}`)}</Badge>
      ),
    },
    {
      accessorKey: 'read',
      header: t('notifications.columnStatus'),
      size: 100,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn(
            'border-transparent font-medium',
            row.original.read ? 'bg-muted text-muted-foreground' : 'bg-info-soft text-info',
          )}
        >
          {t(row.original.read ? 'notifications.read' : 'notifications.unread')}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: t('notifications.columnTime'),
      size: 150,
      cell: ({ row }) => <TimeAgo value={row.original.createdAt.replace(' ', 'T')} />,
    },
    {
      id: 'actions',
      header: t('notifications.columnActions'),
      cell: ({ row }) => (
        <RowActions>
          <Button variant="outline" size="sm" onClick={() => setDetail(row.original)}>
            <Eye aria-hidden="true" />
            {t('notifications.view')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateRead([row.original.id], !row.original.read)}
          >
            {t(row.original.read ? 'notifications.markUnread' : 'notifications.markRead')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => discard([row.original.id])}>
            <Trash2 aria-hidden="true" />
            {t('notifications.remove')}
          </Button>
        </RowActions>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow={t('console')}
        title={t('notifications.title')}
        description={t('notifications.description')}
        actions={
          <>
            <Badge variant="outline" className="h-8 px-3">
              {unread > 0
                ? t('notifications.unreadSummary', { count: unread })
                : t('notifications.allReadSummary')}
            </Badge>
            <Button
              disabled={unread === 0}
              onClick={() => {
                markAllRead()
                setSelected([])
                toast.success(t('notifications.saved'))
              }}
            >
              <CheckCheck aria-hidden="true" />
              {t('notifications.readAll')}
            </Button>
          </>
        }
      />
      <ListModule
        search={
          <SearchFilters
            presets={{
              storageId: 'notifications',
              value: query,
              onApply: (value) => {
                const preset = value as typeof draft
                setDraft(preset)
                setQuery(preset)
              },
            }}
            onSubmit={(event) => {
              event.preventDefault()
              setQuery(draft)
            }}
          >
            <SearchField as="label">
              {t('notifications.keyword')}
              <Input
                value={draft.keyword}
                placeholder={t('notifications.keywordPlaceholder')}
                clearable
                onClear={() => setDraft({ ...draft, keyword: '' })}
                onChange={(event) => setDraft({ ...draft, keyword: event.target.value })}
              />
            </SearchField>
            <SearchField as="label">
              {t('notifications.readState')}
              <NativeSelect
                value={draft.read}
                onChange={(event) => setDraft({ ...draft, read: event.target.value as ReadState })}
              >
                <option value="all">{t('notifications.all')}</option>
                <option value="unread">{t('notifications.unreadOnly')}</option>
                <option value="read">{t('notifications.readOnly')}</option>
              </NativeSelect>
            </SearchField>
            <SearchField as="label">
              {t('notifications.category')}
              <NativeSelect
                value={draft.category}
                onChange={(event) => setDraft({ ...draft, category: event.target.value })}
              >
                <option value="">{t('notifications.allCategories')}</option>
                {notificationCategories.map((category) => (
                  <option key={category} value={category}>
                    {t(`notifications.categories.${category}`)}
                  </option>
                ))}
              </NativeSelect>
            </SearchField>
            <SearchField as="label">
              {t('notifications.timeRange')}
              <DateRangeInput
                label={t('notifications.timeRange')}
                value={draft.range}
                onValueChange={(range) => setDraft({ ...draft, range })}
              />
            </SearchField>
            <SearchActions>
              <FilterButton action="search" />
              <FilterButton
                action="clear"
                onClick={() => {
                  const cleared = {
                    keyword: '',
                    read: 'all' as ReadState,
                    category: '',
                    range: {} as DateRange,
                  }
                  setDraft(cleared)
                  setQuery(cleared)
                }}
              />
            </SearchActions>
          </SearchFilters>
        }
      >
        <DataTable
          data={filtered}
          columns={columns}
          caption={t('notifications.title')}
          emptyTitle={t('notifications.empty')}
          emptyDescription={t('notifications.emptyDescription')}
          toolbar={
            <>
              <BulkActions label={t('moreActions')} disabled={selected.length === 0}>
                <DropdownMenuItem onSelect={() => updateRead(selected, true)}>
                  <MailOpen aria-hidden="true" />
                  {t('notifications.readSelected')}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => discard(selected)}>
                  <Trash2 aria-hidden="true" />
                  {t('notifications.removeSelected')}
                </DropdownMenuItem>
              </BulkActions>
              <Button variant="outline" disabled={unread === 0} onClick={() => markAllRead()}>
                <CheckCheck aria-hidden="true" />
                {t('notifications.readAll')}
              </Button>
            </>
          }
        />
      </ListModule>
      <Dialog open={detail !== undefined} onOpenChange={(open) => !open && setDetail(undefined)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{detail?.title}</DialogTitle>
            <DialogDescription>
              {detail &&
                `${t(`notifications.categories.${detail.category}`)} · ${detail.createdAt}`}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm leading-6 text-muted-foreground">{detail?.body}</p>
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={() => setDetail(undefined)}>
              {t('sample.cancel')}
            </Button>
            {detail?.link && (
              <Button asChild>
                <Link to={detail.link}>{t('notifications.openLink')}</Link>
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
