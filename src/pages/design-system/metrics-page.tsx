import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CountTo } from '@/components/count-to'
import { Sparkline } from '@/components/sparkline'
import { Trend } from '@/components/trend'
import { CodeBlock } from '@/components/code-block'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ColumnChart } from '@/components/column-chart'
import {
  BarList,
  DonutChart,
  FunnelChart,
  GanttChart,
  Heatmap,
  LineChart,
  RadarChart,
} from '@/components/charts'
import { Section, DesignHeader } from './section'

const metrics = [
  {
    key: 'customers',
    value: 12480,
    suffix: '',
    direction: 'up' as const,
    percent: 8.4,
    series: [28, 32, 30, 36, 41, 38, 46, 52],
  },
  {
    key: 'orders',
    value: 386,
    suffix: '',
    direction: 'up' as const,
    percent: 3.1,
    series: [18, 22, 20, 26, 24, 30, 34, 33],
  },
  {
    key: 'revenue',
    value: 419400,
    suffix: '',
    direction: 'down' as const,
    percent: 2.6,
    series: [52, 48, 50, 44, 46, 40, 38, 36],
  },
  {
    key: 'pending',
    value: 3,
    suffix: '',
    direction: 'up' as const,
    percent: 50,
    series: [1, 1, 2, 2, 2, 3, 3, 3],
  },
]

/** 指标与图表：数字滚动、涨跌徽标、迷你趋势线与进度。 */
export function DesignMetricsPage() {
  const { t } = useTranslation()
  const [replay, setReplay] = useState(0)
  return (
    <>
      <DesignHeader title={t('gallery.metrics')} />
      <div className="grid gap-6">
        <Section
          title="指标卡"
          description="数字滚动 + 涨跌徽标 + 趋势线；系统开启减少动效时直接显示终值。"
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.key} className="rounded-xl border bg-card p-4">
                <p className="text-xs text-muted-foreground">
                  {t(`sample.metric${(metric.key[0] ?? '').toUpperCase()}${metric.key.slice(1)}`)}
                </p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <p className="text-2xl font-semibold tabular-nums">
                    <CountTo
                      key={replay}
                      value={metric.value}
                      prefix={metric.key === 'revenue' ? '¥ ' : ''}
                    />
                  </p>
                  <Trend
                    direction={metric.direction}
                    value={metric.percent}
                    reverse={metric.key === 'pending'}
                  />
                </div>
                <Sparkline
                  className="mt-3"
                  values={metric.series}
                  label={`${t(`sample.metric${(metric.key[0] ?? '').toUpperCase()}${metric.key.slice(1)}`)} ${t('gallery.metrics')}`}
                />
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={() => setReplay((value) => value + 1)}>
            重播动效
          </Button>
        </Section>

        <div className="grid gap-6 xl:grid-cols-2">
          <Section
            className="flex h-full flex-col"
            contentClassName="flex flex-1 flex-col justify-between gap-8"
            title="折线 / 环形 / 条形"
            description="多条序列折线（悬停读数）、环形进度与横向条形对比。"
          >
            <LineChart
              labels={['3月', '4月', '5月', '6月', '7月', '8月', '9月']}
              series={[
                { name: '本月金额（万元）', values: [28, 32, 30, 41, 38, 46, 52] },
                { name: '上月同期', values: [26, 28, 33, 34, 36, 40, 44], tone: 'var(--info)' },
              ]}
            />
            <div className="flex flex-wrap items-center gap-8">
              <DonutChart value={72} label="本月目标完成率" />
              <DonutChart value={38} label="额度使用率" tone="var(--warning)" />
              <DonutChart value={94} label="工单按时率" tone="var(--success)" />
            </div>
            <BarList
              label="来源渠道对比"
              items={[
                { name: '官网表单', value: 4820 },
                { name: '渠道合作', value: 3160 },
                { name: '活动落地页', value: 2140 },
                { name: '客户推荐', value: 980 },
              ]}
            />
          </Section>
          <div className="grid content-start gap-6">
            <Section
              title="分布热力"
              description="按周 × 时段看下单高峰，用同一主色的深浅表达强度。"
            >
              <Heatmap
                label="下单时段分布"
                rows={['周一', '周二', '周三', '周四', '周五']}
                columns={['09', '11', '13', '15', '17', '19', '21']}
                values={[
                  [0.1, 0.45, 0.2, 0.55, 0.7, 0.35, 0.1],
                  [0.15, 0.5, 0.25, 0.6, 0.75, 0.4, 0.15],
                  [0.2, 0.55, 0.3, 0.65, 0.8, 0.45, 0.2],
                  [0.18, 0.48, 0.28, 0.58, 0.72, 0.5, 0.22],
                  [0.3, 0.7, 0.4, 0.85, 0.95, 0.6, 0.28],
                ]}
              />
            </Section>
            <Section
              title="新增趋势（柱状图）"
              description="近 14 天每日新增，带纵轴刻度与平均值参考线（虚线），悬停查看具体数值。"
            >
              <ColumnChart
                label="近 14 天新增"
                valueSuffix=" 个"
                data={[
                  { label: '9-03', value: 3 },
                  { label: '9-04', value: 5 },
                  { label: '9-05', value: 4 },
                  { label: '9-06', value: 6 },
                  { label: '9-07', value: 8 },
                  { label: '9-08', value: 7 },
                  { label: '9-09', value: 9 },
                  { label: '9-10', value: 6 },
                  { label: '9-11', value: 10 },
                  { label: '9-12', value: 12 },
                  { label: '9-13', value: 9 },
                  { label: '9-14', value: 11 },
                  { label: '9-15', value: 14 },
                  { label: '9-16', value: 13 },
                ]}
              />
              <p className="text-xs text-muted-foreground">峰值 14（9-15）· 合计 113 · 日均 8.1</p>
            </Section>
          </div>
          <Section
            className="xl:col-span-2"
            title="雷达 / 漏斗 / 甘特"
            description="画像对比用雷达，转化分析用漏斗，排期用甘特；都是同一套语义色与网格。"
          >
            <div className="grid gap-8 lg:grid-cols-3">
              <RadarChart
                axes={['交付', '响应', '质量', '成本', '协同', '增长']}
                series={[
                  { name: '本期', values: [0.85, 0.7, 0.9, 0.6, 0.75, 0.8] },
                  { name: '上期', values: [0.7, 0.65, 0.75, 0.7, 0.6, 0.65], tone: 'var(--info)' },
                ]}
              />
              <FunnelChart
                stages={[
                  { name: '访问', value: 12800 },
                  { name: '注册', value: 4820 },
                  { name: '试用', value: 2140 },
                  { name: '付费', value: 860 },
                  { name: '续费', value: 520 },
                ]}
              />
              <GanttChart
                today={4}
                days={['9-14', '9-15', '9-16', '9-17', '9-18', '9-19', '9-20', '9-21']}
                rows={[
                  { name: '需求评审', start: 0, span: 2 },
                  { name: '接口联调', start: 1, span: 3, progress: 60 },
                  { name: '回归测试', start: 4, span: 2, progress: 20, tone: 'var(--warning)' },
                  { name: '灰度发布', start: 6, span: 1, progress: 0, tone: 'var(--success)' },
                ]}
              />
            </div>
          </Section>
          <Section title="进度与额度" description="上传进度、额度消耗与任务完成度。">
            <Progress value={72} label="导出进度" />
            <Progress value={38} tone="warning" label="额度使用" />
            <Progress value={100} tone="success" label="已完成" />
            <Progress value={12} tone="danger" label="失败比例" />
          </Section>
          <Section title="代码块" description="接口示例与配置展示，带复制按钮。">
            <CodeBlock
              title="GET /api/v1/customers"
              code={`{
  "items": [{ "id": "CUS-1001", "status": "ACTIVE" }],
  "total": 12480,
  "cursor": "eyJpZCI6MTI0ODB9"
}`}
            />
          </Section>
        </div>
      </div>
    </>
  )
}
