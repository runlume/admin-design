import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Steps } from '@/components/steps'
import { PreferencesMenu } from '@/components/preferences-menu'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Section, DesignHeader } from './section'

const pageLinks = [
  { to: '/', labelKey: 'sample.navOverview' },
  { to: '/customers', labelKey: 'sample.navCustomers' },
  { to: '/notifications', labelKey: 'notifications.title' },
  { to: '/settings', labelKey: 'sample.settingsTitle' },
  { to: '/login', labelKey: 'login.title' },
  { to: '/register', labelKey: 'register.title' },
] as const

/** 导航与流程：面包屑、页签、步骤条、快捷键与页型入口。 */
export function DesignNavigationPage() {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  return (
    <>
      <DesignHeader title={t('gallery.navigation')} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Section
          title="面包屑与页签"
          description="外层导航保持同一套间距；页签支持文字与图标两种形态。"
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">工作台</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/customers">客户管理</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>客户详情</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Tabs defaultValue="text">
            <TabsList>
              <TabsTrigger value="text">文字页签</TabsTrigger>
              <TabsTrigger value="icon">
                <Search aria-hidden="true" />
                图标页签
              </TabsTrigger>
              <TabsTrigger value="disabled" disabled>
                禁用页签
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="text-sm text-muted-foreground">
              文字页签内容
            </TabsContent>
            <TabsContent value="icon" className="text-sm text-muted-foreground">
              图标页签内容
            </TabsContent>
          </Tabs>
        </Section>

        <Section title="步骤条" description="向导与审批流程；支持进行中、已完成与错误态。">
          <Steps
            current={step}
            items={[
              { value: 'verify', label: '验证身份', description: '手机号或邮箱' },
              { value: 'profile', label: '填写资料', description: '客户与联系人' },
              { value: 'done', label: '完成', description: '等待审核' },
            ]}
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
              上一步
            </Button>
            <Button disabled={step === 2} onClick={() => setStep(step + 1)}>
              下一步
            </Button>
          </div>
          <Steps
            current={1}
            status="error"
            items={[
              { value: 'a', label: '提交申请' },
              { value: 'b', label: '资质审核', description: '资料不一致' },
              { value: 'c', label: '开通服务' },
            ]}
          />
        </Section>

        <Section title="快捷键" description="命令面板与常用操作的按键提示。">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
            打开命令面板
            <KbdGroup>
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
            </KbdGroup>
            选择结果
            <KbdGroup>
              <Kbd>Enter</Kbd>
            </KbdGroup>
            打开
          </div>
          <p className="text-xs text-muted-foreground">
            顶栏右下的「语言 / 主题」菜单与侧栏「菜单搜索」都支持键盘操作。
          </p>
          <PreferencesMenu />
        </Section>

        <Section
          title="标准页型入口"
          description="列表、详情、设置、通知与登录注册都在标准外壳内组装。"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {pageLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <span>{t(link.labelKey)}</span>
                <ArrowRight aria-hidden="true" className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </Section>
      </div>
    </>
  )
}
