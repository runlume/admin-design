import { useState } from 'react'
import { Accessibility, Info, Palette } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/page'
import { AccessibilitySettings } from '@/components/accessibility-settings'
import { ColorSettings } from '@/components/color-settings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AboutPanel } from '@/components/about-panel'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'appearance', icon: Palette, label: '外观' },
  { id: 'accessibility', icon: Accessibility, label: '无障碍' },
  { id: 'about', icon: Info, label: '关于' },
] as const

/**
 * 标准设置页：左侧分组导航固定，右侧内容区独立滚动。
 * 每个分组是普通路由可达的片段，便于分享具体设置位置。
 */
export function SettingsPage() {
  const { t } = useTranslation()
  const [active, setActive] = useState<(typeof sections)[number]['id']>('appearance')
  return (
    <>
      <PageHeader
        eyebrow={t('console')}
        title={t('sample.settingsTitle')}
        description={t('sample.settingsDescription')}
      />
      <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
        <nav aria-label={t('sample.settingsTitle')} className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
            {sections.map((section) => (
              <li key={section.id} className="shrink-0">
                <button
                  type="button"
                  aria-current={active === section.id ? 'true' : undefined}
                  onClick={() => setActive(section.id)}
                  className={cn(
                    'flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-sm',
                    active === section.id
                      ? 'bg-accent font-medium text-accent-foreground'
                      : 'text-muted-foreground hover:bg-muted',
                  )}
                >
                  <section.icon className="size-4 shrink-0" aria-hidden="true" />
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="min-w-0">
          {active === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{sections[0].label}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <ColorSettings />
              </CardContent>
            </Card>
          )}
          {active === 'accessibility' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('accessibility.title')}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <AccessibilitySettings />
              </CardContent>
            </Card>
          )}
          {active === 'about' && (
            <Card>
              <CardContent>
                <AboutPanel />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
