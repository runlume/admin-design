import { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  demoAccounts,
  roleOfAccount,
  roles,
  signIn,
  useSession,
  type DemoRole,
} from '@/app/session'
import { AuthHeading, AuthLayout } from '@/components/auth-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { safeRedirect } from '@/lib/redirect'

/**
 * 示例登录页：表单、必填校验与错误状态。
 * 设计层不接身份服务，提交后直接进入控制台；真实项目在此接入身份中心。
 */
export function LoginPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  /** 未登录访问深链接时带过来的目标页；直接打开登录页时回工作台。 */
  const redirect = safeRedirect(searchParams.get('redirect'))
  const { account } = useSession()
  /** 刚提交过登录：等会话真正落到外壳再跳，见下面的注释。 */
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ account: '', password: '', remember: true })
  /** 当前测试账号：按钮与提示文案都跟着它切换。 */
  const [role, setRole] = useState<DemoRole>(() => roleOfAccount(''))
  const [error, setError] = useState('')

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.account.trim() || !form.password) {
      setError(t('login.errorRequired'))
      return
    }
    setError('')
    // 示例登录：按账号决定角色（权限不同），真实项目换成身份服务返回的会话
    signIn(roleOfAccount(form.account))
    // 不能在这里直接 navigate：会话是异步送进外壳的，跳过去时控制台还会认为"未登录"，
    // 于是又被弹回登录页——表现就是"登录后跳转没生效"。改成置位，等会话到位再声明式跳转。
    setSubmitted(true)
  }

  /** 落到进来时想去的页面，没有就进工作台；演示站的落地页由部署侧决定。 */
  if (submitted && account) return <Navigate to={redirect} replace />

  function fill(role: DemoRole) {
    const account = demoAccounts[role]
    setForm({ account: account.email, password: account.password, remember: true })
    setRole(role)
    setError('')
  }

  return (
    <AuthLayout>
      <AuthHeading
        icon={ShieldCheck}
        title={t('login.title')}
        description={t('login.description')}
      />
      <form className="mt-8 space-y-4" onSubmit={submit} noValidate>
        <div className="grid gap-1.5">
          <Label htmlFor="login-account">{t('auth.account')}</Label>
          <Input
            id="login-account"
            autoComplete="username"
            placeholder={t('auth.accountPlaceholder')}
            value={form.account}
            onChange={(event) => {
              setForm({ ...form, account: event.target.value })
              // 手输示例账号时，提示文案也跟着切
              setRole(roleOfAccount(event.target.value))
            }}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="login-password">{t('auth.password')}</Label>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder={t('auth.passwordPlaceholder')}
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="flex items-center justify-between gap-3 pt-1">
          <label className="flex items-center gap-2 text-sm">
            <input
              className="size-4 accent-primary"
              type="checkbox"
              checked={form.remember}
              onChange={(event) => setForm({ ...form, remember: event.target.checked })}
            />
            {t('login.remember')}
          </label>
          <Button asChild variant="link" className="h-auto px-0 text-sm">
            <Link to="/forgot-password">{t('login.forgot')}</Link>
          </Button>
        </div>
        <Button type="submit" className="h-11 w-full">
          {t('login.submit')}
          <ArrowRight aria-hidden="true" />
        </Button>
        {/* 演示账号一键登录：只有居中的分隔线标题与两枚按钮，不套外框也不带权限提示 */}
        <div className="pt-1">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
            <span className="text-xs font-medium text-muted-foreground">{t('login.demoFill')}</span>
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
          </div>
          <div className="mt-3 flex justify-center gap-2">
            {roles.map((item) => (
              <Button
                key={item}
                type="button"
                size="sm"
                variant={role === item ? 'default' : 'outline'}
                onClick={() => fill(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
        {/* 与注册页一致：纯文字一行，不用按钮外框 */}
        <p className="pt-1 text-center text-sm text-muted-foreground">
          {t('login.noAccountQuestion')}{' '}
          <Link className="font-medium text-foreground hover:text-primary" to="/register">
            {t('login.signUp')}
          </Link>
        </p>
      </form>
      <p className="mt-6 text-xs leading-6 text-muted-foreground">{t('auth.note')}</p>
    </AuthLayout>
  )
}
