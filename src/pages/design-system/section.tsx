import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/page'

/** 组件总览各页共用的卡片分组。 */
export function Section({
  title,
  description,
  children,
  className,
  contentClassName,
}: {
  title: string
  description?: string
  children: ReactNode
  className?: string
  /** 内容区类名：需要在卡片内均分内容时用 flex 布局覆盖默认间距。 */
  contentClassName?: string
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={cn('space-y-4', contentClassName)}>{children}</CardContent>
    </Card>
  )
}

/** 每页统一的页头：Design 眼眉 + 分类标题 + 说明。 */
export function DesignHeader({ title, description }: { title: string; description?: string }) {
  const { t } = useTranslation()
  return (
    <PageHeader eyebrow="Design" title={title} description={description ?? t('gallery.hint')} />
  )
}
