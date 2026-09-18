import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/native-select'
import { Textarea } from '@/components/ui/textarea'
import type { Customer } from '@/pages/sample-data'

const schema = z.object({
  name: z.string().trim().min(1),
  owner: z.string().trim().min(1),
  phone: z.string().trim(),
  email: z.string().trim(),
  status: z.enum(['ACTIVE', 'PENDING', 'DISABLED']),
  note: z.string().trim().max(200),
})

type FormValues = z.infer<typeof schema>

const emptyValues: FormValues = {
  name: '',
  owner: '',
  phone: '',
  email: '',
  status: 'ACTIVE',
  note: '',
}

/**
 * 标准表单弹窗：字段标签、校验、错误反馈与底部动作同排。
 * 校验消息通过 i18n key 声明，错误色使用 destructive，不与主题色混用。
 */
export function CustomerFormDialog({
  open,
  customer,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  customer?: Customer
  onOpenChange: (open: boolean) => void
  onSubmit: (values: FormValues, customer?: Customer) => void
}) {
  const { t } = useTranslation()
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: emptyValues })
  const { errors } = form.formState
  useEffect(() => {
    if (!open) return
    form.reset(
      customer
        ? {
            name: customer.name,
            owner: customer.owner,
            phone: customer.phone,
            email: customer.email,
            status: customer.status,
            note: customer.note ?? '',
          }
        : emptyValues,
    )
  }, [open, customer, form])
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {t(customer ? 'sample.formEditTitle' : 'sample.formCreateTitle')}
          </DialogTitle>
          <DialogDescription>{t('sample.formDescription')}</DialogDescription>
        </DialogHeader>
        <form
          id="customer-form"
          className="grid gap-5 overflow-y-auto"
          noValidate
          onSubmit={form.handleSubmit((values) => onSubmit(values, customer))}
        >
          <div className="grid gap-1.5">
            <Label htmlFor="customer-name">{t('sample.fieldName')}</Label>
            <Input
              id="customer-name"
              autoComplete="off"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'customer-name-error' : undefined}
              {...form.register('name')}
            />
            {errors.name && (
              <p id="customer-name-error" className="text-xs text-destructive">
                {t('sample.formNameRequired')}
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="customer-owner">{t('sample.fieldOwner')}</Label>
              <Input id="customer-owner" autoComplete="off" {...form.register('owner')} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="customer-phone">{t('sample.fieldPhone')}</Label>
              <Input
                id="customer-phone"
                autoComplete="off"
                inputMode="tel"
                aria-invalid={!!errors.phone}
                {...form.register('phone', {
                  validate: (value) => value === '' || /^1\d{10}$/.test(value),
                })}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{t('sample.formPhoneInvalid')}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="customer-email">{t('sample.fieldEmail')}</Label>
              <Input id="customer-email" autoComplete="off" {...form.register('email')} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="customer-status">{t('sample.fieldStatus')}</Label>
              <NativeSelect id="customer-status" {...form.register('status')}>
                <option value="ACTIVE">{t('ACTIVE')}</option>
                <option value="PENDING">{t('PENDING')}</option>
                <option value="DISABLED">{t('DISABLED')}</option>
              </NativeSelect>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="customer-note">{t('sample.fieldNote')}</Label>
            <Textarea id="customer-note" rows={3} {...form.register('note')} />
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('sample.cancel')}
          </Button>
          <Button type="submit" form="customer-form" disabled={form.formState.isSubmitting}>
            {t('sample.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
