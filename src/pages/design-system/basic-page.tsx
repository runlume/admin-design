import { useState } from 'react'
import { Check, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/native-select'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { NumberField } from '@/components/ui/number-field'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Rate } from '@/components/rate'
import { Section, DesignHeader } from './section'

/** 基础控件：按钮、输入、选择、勾选、标签与快捷键标记。 */
export function DesignBasicPage() {
  const { t } = useTranslation()
  const [keyword, setKeyword] = useState('云和智能制造')
  const [notify, setNotify] = useState(true)
  const [tags, setTags] = useState(['正常', '待处理'])
  const [concurrency, setConcurrency] = useState(4)
  const [threshold, setThreshold] = useState([60])
  const [rating, setRating] = useState(3.5)
  return (
    <>
      <DesignHeader title={t('gallery.basic')} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="按钮" description="九种语义变体，含加载态；加载时自动禁用避免重复提交。">
          <div className="flex flex-wrap gap-2">
            <Button>主要</Button>
            <Button variant="secondary">次要</Button>
            <Button variant="outline">描边</Button>
            <Button variant="ghost">幽灵</Button>
            <Button variant="success">成功</Button>
            <Button variant="warning">警告</Button>
            <Button variant="destructive">危险</Button>
            <Button variant="link">链接</Button>
            <Button disabled>禁用</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">
              <Plus aria-hidden="true" />
              小号
            </Button>
            <Button variant="outline" loading>
              提交中
            </Button>
            <Button variant="outline" size="icon" aria-label="删除">
              <Trash2 aria-hidden="true" />
            </Button>
          </div>
        </Section>

        <Section title="输入" description="一键清除、前后缀插槽与密码可见切换。">
          <Input
            aria-label="关键字"
            value={keyword}
            clearable
            placeholder="请输入关键字"
            start={<RefreshCw aria-hidden="true" className="size-3.5" />}
            onClear={() => setKeyword('')}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Input
            aria-label="域名"
            placeholder="example"
            end={<span className="text-xs">.com</span>}
          />
          <Input aria-label="密码" type="password" defaultValue="runlume-2026" />
          <Textarea aria-label="备注" rows={2} placeholder="支持内容伸展" />
        </Section>

        <Section title="选择与勾选" description="复选框支持半选，开关用于是/否设置项。">
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox defaultChecked />
              已选中
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox indeterminate />
              半选
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox disabled />
              禁用
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={notify} onCheckedChange={setNotify} aria-label="通知开关" />
              通知开关
            </label>
          </div>
          <RadioGroup defaultValue="week" className="sm:grid-cols-3 sm:grid-flow-col sm:gap-2">
            {[
              { value: 'day', label: '按天' },
              { value: 'week', label: '按周' },
              { value: 'month', label: '按月' },
            ].map((item) => (
              <label
                key={item.value}
                className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border p-3 has-checked:border-primary has-checked:bg-primary/5"
              >
                <RadioGroupItem value={item.value} aria-label={item.label} />
                {item.label}
              </label>
            ))}
          </RadioGroup>
          <div className="grid gap-1.5 sm:max-w-xs">
            <Label htmlFor="gallery-select">下拉选择</Label>
            <NativeSelect id="gallery-select" defaultValue="a">
              <option value="a">选项一</option>
              <option value="b">选项二</option>
              <option value="c" disabled>
                禁用选项
              </option>
            </NativeSelect>
          </div>
        </Section>

        <Section title="标签与进度" description="可关闭标签用于筛选条件，进度条用于上传与额度。">
          <div className="flex flex-wrap gap-2">
            <Badge>实心徽标</Badge>
            <Badge variant="outline">描边徽标</Badge>
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                onClose={() => setTags((value) => value.filter((item) => item !== tag))}
                closeLabel={`${t('clear')} ${tag}`}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="space-y-3">
            <Progress value={72} label="导出进度" />
            <Progress value={38} tone="warning" label="额度使用" />
            <Progress value={100} tone="success" label="已完成" />
          </div>
          <Separator />
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            快捷键
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
            打开命令面板
            <KbdGroup>
              <Kbd>Esc</Kbd>
            </KbdGroup>
            关闭
          </div>
        </Section>

        <Section
          title="数值与滚动"
          description="步进输入、滑块与自定义滚动区，折叠区用于收纳次要说明。"
        >
          <div className="flex flex-wrap items-end gap-4">
            <div className="grid gap-1.5">
              <span className="text-sm font-medium">并发数</span>
              <NumberField
                label="并发数"
                value={concurrency}
                min={1}
                max={20}
                onValueChange={setConcurrency}
              />
            </div>
            <div className="grid min-w-56 flex-1 gap-1.5">
              <span className="text-sm font-medium">告警阈值 · {threshold[0]}%</span>
              <Slider
                label="告警阈值"
                value={threshold}
                onValueChange={setThreshold}
                max={100}
                step={5}
              />
            </div>
          </div>
          <ScrollArea className="h-32 rounded-lg border">
            <ul className="divide-y text-sm">
              {['平台组', '应用组', '测试组', '华东大区', '华南大区', '运营部', '财务部'].map(
                (item) => (
                  <li key={item} className="px-3 py-2">
                    {item}
                  </li>
                ),
              )}
            </ul>
          </ScrollArea>
          <Collapsible>
            <CollapsibleTrigger>查看字段说明</CollapsibleTrigger>
            <CollapsibleContent>
              并发数影响同步任务的资源占用，超过 20 需要平台管理员审批。
            </CollapsibleContent>
          </Collapsible>
        </Section>

        <Section title="评分" description="支持整星/半星、清空，以及方向键调整评分。">
          <div className="flex items-center gap-3">
            <Rate value={rating} onValueChange={setRating} precision={0.5} label="服务评分" />
            <span className="text-sm text-muted-foreground">{rating || '未评分'} / 5</span>
          </div>
          <Rate defaultValue={4} disabled label="只读评分" />
        </Section>

        <Section
          className="xl:col-span-2"
          title="提示条"
          description="四态提示条，用于表单说明、风险提示与操作反馈。"
        >
          <div className="grid gap-3 lg:grid-cols-2">
            <Alert
              variant="info"
              title="示例环境"
              description="数据仅用于演示，刷新后会恢复初始状态。"
            />
            <Alert
              variant="success"
              title="保存成功"
              description="设置已即时生效并保存在当前浏览器。"
            />
            <Alert
              variant="warning"
              title="额度即将用尽"
              description="本月剩余额度不足 10%，请及时调整用量。"
              action={
                <Button size="sm" variant="outline">
                  查看用量
                </Button>
              }
            />
            <Alert
              variant="danger"
              title="同步失败"
              description="最近一次同步未完成，请重试或联系管理员。"
              action={
                <Button size="sm" variant="outline">
                  <Check aria-hidden="true" />
                  重试
                </Button>
              }
            />
          </div>
        </Section>
      </div>
    </>
  )
}
