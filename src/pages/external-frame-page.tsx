import { ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/page'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

/**
 * 内嵌外链页面：后台菜单里 `target: 'iframe'` 的项落到这里，
 * 用 iframe 把站外页面嵌进内容区（顶栏、侧栏、面包屑仍然是本站的）。
 *
 * 注意：目标站点必须允许被内嵌——设了 `X-Frame-Options` 或
 * `Content-Security-Policy: frame-ancestors` 的站点会显示空白，这是对方的安全策略，改不了。
 */
export function ExternalFramePage({ url, title }: { url: string; title: string }) {
  const { t } = useTranslation()
  const heading = t(title)
  return (
    <>
      <PageHeader
        eyebrow="Embed"
        title={heading}
        description={url}
        actions={
          <Button variant="outline" asChild>
            <a href={url} target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden="true" />
              {t('externalFrame.open')}
            </a>
          </Button>
        }
      />
      <Alert
        className="mb-4"
        variant="info"
        title={t('externalFrame.hintTitle')}
        description={t('externalFrame.hint')}
      />
      <div className="overflow-hidden rounded-xl border bg-card">
        <iframe
          src={url}
          title={heading}
          className="h-[70vh] w-full"
          referrerPolicy="no-referrer"
        />
      </div>
    </>
  )
}
