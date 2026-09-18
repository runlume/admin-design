import { useState } from 'react'
import { Link } from 'react-router'
import { KeyRound, MailCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AuthHeading, AuthLayout } from '@/components/auth-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * 示例找回密码页：提交账号后进入“已发送”态，不真正发信。
 * 真实项目由身份中心发送重置链接，并通过回调地址回到登录页。
 */
export function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [account, setAccount] = useState('')
  const [sent, setSent] = useState('')
  const [error, setError] = useState('')

  if (sent)
    return (
      <AuthLayout>
        <AuthHeading
          icon={MailCheck}
          title={t('forgot.sentTitle')}
          description={t('forgot.sentDescription', { account: sent })}
        />
        <div className="mt-8 space-y-4">
          <Button asChild className="h-11 w-full">
            <Link to="/login">{t('auth.backToLogin')}</Link>
          </Button>
          <Button variant="outline" className="h-11 w-full" onClick={() => setSent('')}>
            {t('forgot.submit')}
          </Button>
        </div>
        <p className="mt-6 text-xs leading-6 text-muted-foreground">{t('forgot.sentHint')}</p>
      </AuthLayout>
    )

  return (
    <AuthLayout>
      <AuthHeading
        icon={KeyRound}
        title={t('forgot.title')}
        description={t('forgot.description')}
      />
      <form
        className="mt-8 space-y-4"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          if (!account.trim()) {
            setError(t('forgot.errorRequired'))
            return
          }
          setError('')
          setSent(account.trim())
        }}
      >
        <div className="grid gap-1.5">
          <Label htmlFor="forgot-account">{t('auth.account')}</Label>
          <Input
            id="forgot-account"
            autoComplete="username"
            placeholder={t('auth.accountPlaceholder')}
            value={account}
            onChange={(event) => setAccount(event.target.value)}
          />
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" className="h-11 w-full">
          {t('forgot.submit')}
        </Button>
        <Button asChild variant="ghost" className="h-10 w-full">
          <Link to="/login">{t('auth.backToLogin')}</Link>
        </Button>
      </form>
      <p className="mt-6 text-xs leading-6 text-muted-foreground">{t('auth.note')}</p>
    </AuthLayout>
  )
}
