import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Cascader, type CascaderOption } from '@/components/cascader'
import { Combobox } from '@/components/combobox'
import { MultiSelect } from '@/components/multi-select'
import { DateRangeInput } from '@/components/ui/date-range-input'
import { DateTimeInput } from '@/components/ui/date-time-input'
import { FixedBar } from '@/components/fixed-bar'
import { PasswordStrength } from '@/components/password-strength'
import { FileUpload, type UploadFile } from '@/components/ui/file-upload'
import { ImagePreview } from '@/components/image-preview'
import { Mention } from '@/components/mention'
import { Button } from '@/components/ui/button'
import { DateInput } from '@/components/ui/date-input'
import { Input } from '@/components/ui/input'
import { InputOTP } from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { customers } from '@/pages/sample-data'
import type { DateRange } from '@/lib/range'
import { Section, DesignHeader } from './section'

const organizationOptions: CascaderOption[] = [
  {
    value: 'OU-1',
    label: '云和智能制造',
    children: [
      {
        value: 'OU-11',
        label: '研发中心',
        children: [
          { value: 'OU-111', label: '平台组' },
          { value: 'OU-112', label: '应用组' },
        ],
      },
      { value: 'OU-12', label: '销售中心' },
    ],
  },
  {
    value: 'OU-2',
    label: '海通供应链',
    children: [{ value: 'OU-21', label: '运营部' }],
  },
]

/** 表单与选择：控件组合、验证码、密码强度、级联选择与固定操作条。 */
export function DesignFormPage() {
  const { t } = useTranslation()
  const [owner, setOwner] = useState<string>()
  const [org, setOrg] = useState<string>()
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [statuses, setStatuses] = useState<string[]>(['ACTIVE'])
  const [range, setRange] = useState<DateRange>({ from: '2026-09-01', to: '2026-09-16' })
  const [uploads, setUploads] = useState<UploadFile[]>([])
  const [comment, setComment] = useState('')
  const [schedule, setSchedule] = useState('2026-09-16T09:30')
  return (
    <>
      <DesignHeader title={t('gallery.form')} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="基础表单" description="标签、校验提示与错误态；保存入口放在固定操作条。">
          <div className="grid gap-1.5">
            <Label htmlFor="form-name">客户名称</Label>
            <Input id="form-name" defaultValue="云和智能制造" clearable />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="form-date">签约日期</Label>
              <DateInput id="form-date" defaultValue="2026-09-16" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="form-schedule">排期（日期 + 时间）</Label>
              <DateTimeInput label="排期" value={schedule} onValueChange={setSchedule} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="form-invalid">联系电话（错误态）</Label>
            <Input id="form-invalid" aria-invalid defaultValue="138" />
            <p className="text-xs text-destructive">手机号格式不正确</p>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="form-note">备注</Label>
            <Textarea id="form-note" rows={2} placeholder="补充说明" />
          </div>
          <FixedBar hint="表单校验通过后才会写入业务接口">
            <Button variant="outline">{t('cancel')}</Button>
            <Button onClick={() => toast.success(t('sample.saved'))}>{t('confirm')}</Button>
          </FixedBar>
        </Section>

        <Section title="选择器" description="可搜索下拉与级联选择，覆盖人员、组织等场景。">
          <div className="grid gap-1.5">
            <Label htmlFor="form-owner">负责人</Label>
            <Combobox
              label="负责人"
              value={owner}
              onValueChange={setOwner}
              clearable
              placeholder="搜索负责人"
              options={customers.map((customer) => ({
                value: customer.id,
                label: customer.owner,
                description: customer.name,
              }))}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="form-org">归属组织</Label>
            <Cascader
              label="归属组织"
              value={org}
              onValueChange={(value) => setOrg(value)}
              placeholder="选择组织"
              options={organizationOptions}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="form-status">客户状态（多选）</Label>
            <MultiSelect
              label="客户状态"
              values={statuses}
              onValuesChange={setStatuses}
              placeholder="全部状态"
              options={[
                { value: 'ACTIVE', label: '正常' },
                { value: 'PENDING', label: '待处理' },
                { value: 'DISABLED', label: '已停用' },
              ]}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="form-range">签约区间</Label>
            <DateRangeInput label="签约区间" value={range} onValueChange={setRange} />
          </div>
          <p className="text-xs text-muted-foreground">
            级联选择逐列下钻，选中叶子后回填完整路径；组合框输入即过滤。
          </p>
        </Section>

        <Section title="验证码" description="分格输入，支持直接粘贴 6 位验证码。">
          <div className="grid gap-2">
            <Label htmlFor="form-code">验证码</Label>
            <InputOTP label="验证码" value={code} onValueChange={setCode} />
            <p className="text-xs text-muted-foreground">当前输入：{code || '—'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setCode('123456')}>
              填入示例验证码
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCode('')}>
              {t('clear')}
            </Button>
          </div>
        </Section>

        <Section title="密码强度" description="规则清单实时反馈，注册与改密共用。">
          <div className="grid gap-1.5">
            <Label htmlFor="form-password">密码</Label>
            <Input
              id="form-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <PasswordStrength password={password} />
        </Section>

        <Section
          className="xl:col-span-2"
          title="上传与提及"
          description="拖拽上传先做客户端校验，图片可点击放大；提及输入用 @ 触发候选。"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <FileUpload
                label="上传附件"
                accept=".pdf,.png,.jpg"
                maxSize={2 * 1024 * 1024}
                files={uploads}
                onFilesChange={setUploads}
              />
              <ImagePreview alt="品牌方标" src="/brand/mark.svg" />
            </div>
            <div className="space-y-2">
              <Mention
                label="跟进记录"
                value={comment}
                onValueChange={setComment}
                options={customers.slice(0, 5).map((customer) => ({
                  value: customer.id,
                  label: customer.owner,
                  description: customer.name,
                }))}
              />
              <p className="text-xs text-muted-foreground">
                输入 @ 后可用 ↑/↓ 选择、Enter 采纳，Esc 关闭候选。
              </p>
            </div>
          </div>
        </Section>
      </div>
    </>
  )
}
