import { useMemo, useState } from 'react'
import { DynamicIcon, dynamicIconImports } from 'lucide-react/dynamic'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { CodeBlock } from '@/components/code-block'
import { PagePager } from '@/components/page-pager'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Section, DesignHeader } from './section'

/**
 * 图标集：用 lucide 的动态入口按需加载，页面只加载可视区需要的图标包，
 * 避免把 2000+ 图标一次性打进主包。
 */
const toComponentName = (kebab: string) =>
  kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

const allIcons = Object.keys(dynamicIconImports)
  .sort()
  .map((kebab) => ({ name: toComponentName(kebab), kebab }))

const pageSize = 96

/** 图标预览：全部图标可搜索、分页浏览，点一下复制组件名。 */
export function DesignIconsPage() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const matched = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return keyword ? allIcons.filter((item) => item.name.toLowerCase().includes(keyword)) : allIcons
  }, [query])
  const pageCount = Math.max(1, Math.ceil(matched.length / pageSize))
  const current = Math.min(page, pageCount)
  const visible = matched.slice((current - 1) * pageSize, current * pageSize)

  async function copy(name: string) {
    try {
      await navigator.clipboard.writeText(name)
      toast.success(t('icons.copied', { name }))
    } catch {
      toast.error(t('copyFailed'))
    }
  }

  return (
    <>
      <DesignHeader title={t('icons.title')} />
      <div className="grid gap-6">
        <Section title={t('icons.title')} description={t('icons.hint', { count: allIcons.length })}>
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-64 flex-1">
              <Input
                aria-label={t('icons.search')}
                placeholder={t('icons.search')}
                value={query}
                clearable
                onClear={() => {
                  setQuery('')
                  setPage(1)
                }}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(1)
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {t('icons.matched', { count: matched.length })}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {visible.map(({ name, kebab }) => (
              <button
                key={kebab}
                type="button"
                aria-label={t('icons.copy', { name })}
                title={name}
                className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-lg border bg-card px-2 py-3 text-xs hover:border-primary/40 hover:bg-accent/40"
                onClick={() => void copy(name)}
              >
                <DynamicIcon name={kebab as never} className="size-5" aria-hidden="true" />
                <span className="w-full truncate text-center text-muted-foreground">{name}</span>
              </button>
            ))}
            {!visible.length && (
              <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
                {t('empty')}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              {t('sample.pageSummary', { page: current, count: matched.length })}
            </span>
            <PagePager page={current} pageCount={pageCount} onPageChange={setPage} />
          </div>
        </Section>

        <Section title={t('icons.usage')} description={t('icons.usageHint')}>
          <CodeBlock
            title="usage.tsx"
            code={`import { CalendarDays, Search } from 'lucide-react'

<CalendarDays className="size-4" aria-hidden="true" />
<Button><Search aria-hidden="true" />搜索</Button>`}
          />
          <Button
            variant="outline"
            onClick={() => void copy("import { Search } from 'lucide-react'")}
          >
            {t('icons.copyImport')}
          </Button>
        </Section>
      </div>
    </>
  )
}
