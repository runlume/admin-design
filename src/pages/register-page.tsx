import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Lock, Mail, Smartphone, UserRound, UserRoundPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AuthHeading, AuthLayout } from '@/components/auth-layout'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { InputOTP } from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PasswordStrength } from '@/components/password-strength'

/** 示例环境固定验证码，接入真实短信/邮件服务后由服务端校验。 */
const sampleCode = '123456'
const phonePattern = /^1[3-9]\d{9}$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** 字段名；错误提示按这个挂到对应控件下方。 */
type Field = 'target' | 'code' | 'name' | 'password' | 'confirm' | 'agree'
type FieldError = { field: Field; message: string }

/** 字段级错误提示：紧贴控件下方，与组件总览里的错误态同一套观感。 */
function FieldError({ field, error }: { field: Field; error: FieldError | null }) {
  if (error?.field !== field) return null
  return (
    <p id={`register-${field}-error`} role="alert" className="text-sm text-destructive">
      {error.message}
    </p>
  )
}

/**
 * 示例注册页：手机号或邮箱二选一，先发送验证码再提交。
 * 验证通过后回到登录页；真实项目在发送与提交时调用身份服务的接口。
 */
export function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [channel, setChannel] = useState<'phone' | 'email'>('phone')
  const [form, setForm] = useState({
    name: '',
    target: '',
    code: '',
    password: '',
    confirm: '',
    agree: false,
  })
  /** 错误挂在对应字段上，提示直接显示在字段下方（和组件总览里的错误态一致）。 */
  const [error, setError] = useState<FieldError | null>(null)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown <= 0) return
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [countdown])

  function switchChannel(next: 'phone' | 'email') {
    setChannel(next)
    setForm((current) => ({ ...current, target: '', code: '' }))
    setCountdown(0)
    setError(null)
  }
  /** 只清掉当前字段的错误，别的字段提示保留。 */
  function clearError(field: Field) {
    setError((current) => (current?.field === field ? null : current))
  }
  /** 字段错误文案。 */
  function fieldError(field: Field) {
    return error?.field === field ? error.message : undefined
  }
  /** 原生控件（Input / Checkbox）的错误态与说明。 */
  function ariaFor(field: Field): Record<string, string | boolean> {
    return fieldError(field)
      ? { 'aria-invalid': true, 'aria-describedby': `register-${field}-error` }
      : {}
  }
  function invalidTarget() {
    if (channel === 'phone')
      return !form.target.trim()
        ? t('register.errorPhoneRequired')
        : phonePattern.test(form.target.trim())
          ? ''
          : t('register.errorPhoneInvalid')
    return !form.target.trim()
      ? t('register.errorEmailRequired')
      : emailPattern.test(form.target.trim())
        ? ''
        : t('register.errorEmailInvalid')
  }
  function sendCode() {
    const invalid = invalidTarget()
    if (invalid) {
      setError({ field: 'target', message: invalid })
      return
    }
    setError(null)
    setCountdown(60)
    toast.info(t('register.sent', { target: form.target.trim(), code: sampleCode }))
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.name.trim()) return setError({ field: 'name', message: t('register.errorName') })
    const invalid = invalidTarget()
    if (invalid) return setError({ field: 'target', message: invalid })
    if (!countdown) return setError({ field: 'code', message: t('register.errorCodeRequired') })
    if (form.code.trim() !== sampleCode)
      return setError({ field: 'code', message: t('register.errorCodeInvalid') })
    if (form.password.length < 8)
      return setError({ field: 'password', message: t('register.errorPassword') })
    if (form.password !== form.confirm)
      return setError({ field: 'confirm', message: t('register.errorMismatch') })
    if (!form.agree) return setError({ field: 'agree', message: t('register.errorAgree') })
    setError(null)
    toast.success(t('register.submitted', { target: form.target.trim() }))
    void navigate('/login')
  }

  return (
    <AuthLayout>
      <AuthHeading
        icon={UserRoundPlus}
        title={t('register.title')}
        description={t('register.description')}
      />
      {/* 极简表单：图标在输入框内、标签只留无障碍名称，密码规则收进问号提示 */}
      <form className="mt-8 space-y-4" onSubmit={submit} noValidate>
        <Tabs
          value={channel}
          onValueChange={(value) => switchChannel(value as 'phone' | 'email')}
          aria-label={t('register.channel')}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="phone">{t('register.channelPhone')}</TabsTrigger>
            <TabsTrigger value="email">{t('register.channelEmail')}</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="grid gap-1.5">
          <Label className="sr-only" htmlFor="register-target">
            {t(channel === 'phone' ? 'register.phone' : 'register.email')}
          </Label>
          <Input
            id="register-target"
            inputMode={channel === 'phone' ? 'tel' : 'email'}
            autoComplete={channel === 'phone' ? 'tel' : 'email'}
            placeholder={t(
              channel === 'phone' ? 'register.phonePlaceholder' : 'register.emailPlaceholder',
            )}
            start={
              channel === 'phone' ? (
                <Smartphone aria-hidden="true" className="size-4" />
              ) : (
                <Mail aria-hidden="true" className="size-4" />
              )
            }
            value={form.target}
            onChange={(event) => {
              setForm({ ...form, target: event.target.value })
              clearError('target')
            }}
            {...ariaFor('target')}
          />
          <FieldError field="target" error={error} />
        </div>
        <div className="grid gap-1.5">
          <Label className="sr-only" htmlFor="register-code">
            {t('register.code')}
          </Label>
          <div className="flex flex-wrap items-center gap-2">
            <InputOTP
              id="register-code"
              label={t('register.code')}
              value={form.code}
              onValueChange={(code) => {
                setForm({ ...form, code })
                clearError('code')
              }}
              invalid={Boolean(fieldError('code'))}
              describedBy={fieldError('code') ? 'register-code-error' : undefined}
              fill
              className="min-w-[15rem] flex-1"
            />
            {/* 宽度写死：倒计时换文案不跳；窄屏换行时靠右对齐 */}
            <Button
              type="button"
              variant="outline"
              className="ml-auto h-10 w-24 shrink-0 px-0 text-sm"
              disabled={countdown > 0}
              onClick={sendCode}
            >
              <span className="whitespace-nowrap tabular-nums">
                {countdown > 0
                  ? t('register.resendCode', { seconds: countdown })
                  : t('register.sendCode')}
              </span>
            </Button>
          </div>
          <FieldError field="code" error={error} />
        </div>
        <div className="grid gap-1.5">
          <Label className="sr-only" htmlFor="register-name">
            {t('register.name')}
          </Label>
          <Input
            id="register-name"
            autoComplete="name"
            placeholder={t('register.namePlaceholder')}
            start={<UserRound aria-hidden="true" className="size-4" />}
            value={form.name}
            onChange={(event) => {
              setForm({ ...form, name: event.target.value })
              clearError('name')
            }}
            {...ariaFor('name')}
          />
          <FieldError field="name" error={error} />
        </div>
        <div className="grid gap-1.5">
          <Label className="sr-only" htmlFor="register-password">
            {t('auth.password')}
          </Label>
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            placeholder={t('auth.passwordPlaceholder')}
            start={<Lock aria-hidden="true" className="size-4" />}
            value={form.password}
            onChange={(event) => {
              setForm({ ...form, password: event.target.value })
              clearError('password')
            }}
            {...ariaFor('password')}
          />
          <PasswordStrength password={form.password} compact />
          <FieldError field="password" error={error} />
        </div>
        <div className="grid gap-1.5">
          <Label className="sr-only" htmlFor="register-confirm">
            {t('auth.confirmPassword')}
          </Label>
          <Input
            id="register-confirm"
            type="password"
            autoComplete="new-password"
            placeholder={t('auth.confirmPasswordPlaceholder')}
            start={<Lock aria-hidden="true" className="size-4" />}
            value={form.confirm}
            onChange={(event) => {
              setForm({ ...form, confirm: event.target.value })
              clearError('confirm')
            }}
            {...ariaFor('confirm')}
          />
          <FieldError field="confirm" error={error} />
        </div>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <div className="flex items-start gap-2.5 text-sm">
              <Checkbox
                id="register-agree"
                className="mt-0.5"
                checked={form.agree}
                onCheckedChange={(value) => {
                  setForm({ ...form, agree: value === true })
                  clearError('agree')
                }}
                {...ariaFor('agree')}
              />
              <Label htmlFor="register-agree" className="font-normal leading-6">
                {t('register.agree')}
              </Label>
            </div>
            <FieldError field="agree" error={error} />
          </div>
          <Button type="submit" className="h-12 w-full text-base font-semibold">
            {t('register.submit')}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {t('register.haveAccount')}{' '}
            <Link className="font-medium text-foreground hover:text-primary" to="/login">
              {t('register.signIn')}
            </Link>
          </p>
        </div>
      </form>
      <p className="mt-6 text-xs leading-6 text-muted-foreground">{t('auth.note')}</p>
    </AuthLayout>
  )
}
