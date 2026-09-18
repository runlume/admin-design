import { useTranslation } from 'react-i18next'
import { AccessibilitySettings } from '@/components/accessibility-settings'
import { ColorSettings } from '@/components/color-settings'
import { NotificationSettings } from '@/components/notification-settings'
import { NotificationsButton } from '@/components/notifications-button'
import { Section, DesignHeader } from './section'

/** 主题与设置：配色、通知偏好、无障碍与顶栏入口。 */
export function DesignThemePage() {
  const { t } = useTranslation()
  return (
    <>
      <DesignHeader title={t('gallery.theme')} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="配色方案" description="快捷预设与基础色/主题色自由组合，改动即时生效。">
          <ColorSettings />
        </Section>
        <Section title="通知偏好" description="站内、邮件、桌面提醒与汇总频率，保存在当前浏览器。">
          <NotificationSettings />
          <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
            <span className="text-sm text-muted-foreground">顶栏通知入口</span>
            <NotificationsButton />
          </div>
        </Section>
        <Section
          className="xl:col-span-2"
          title="无障碍"
          description="字号、字重、对比度、减少动效、链接下划线、灰色模式与色弱模式。"
        >
          <AccessibilitySettings />
        </Section>
      </div>
    </>
  )
}
