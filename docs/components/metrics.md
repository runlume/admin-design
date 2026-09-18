---
description: 指标与图表：指标卡、趋势、迷你图与折线、柱状、环形、热力、雷达、漏斗、甘特等自绘 SVG 图表。
---

# 指标与图表

在线示例：`/design-system/metrics`。全部图表在 `src/components/charts.tsx` 与 `column-chart.tsx` 里**自绘 SVG**，
跟随语义 Token 与深浅模式，支持"减少动效"，不引入任何图表库。

## 指标卡三件套

```tsx
<div className="rounded-xl border bg-card p-4">
  <p className="text-xs text-muted-foreground">客户总数</p>
  <div className="mt-2 flex items-end justify-between gap-3">
    <p className="text-2xl font-semibold tabular-nums">
      <CountTo value={12480} />
    </p>
    <Trend direction="up" value={8.4} />
  </div>
  <Sparkline className="mt-3" values={series} label="客户总数近 8 期趋势" />
</div>
```

## CountTo

| prop                     | 默认      | 说明                           |
| ------------------------ | --------- | ------------------------------ |
| `value`                  | —         | 目标数值                       |
| `duration`               | `1200`    | 动画时长（ms），0 表示直接显示 |
| `decimals` / `separator` | `0` / `,` | 小数位与千分位                 |
| `prefix` / `suffix`      | `''`      | 例如 `¥ `、`%`                 |

系统开启「减少动效」或 `prefers-reduced-motion` 时直接显示终值。

## Trend

```tsx
<Trend direction="up" value={8.4} />
<Trend direction="down" value={2.6} variant="solid" />
<Trend direction="up" value={50} reverse />        {/* "涨反而是坏事"，例如待处理数 */}
```

`direction` 取 `up | down | flat`；`reverse` 反转"好 / 坏"配色；`variant` 取 `soft | solid`。

## Sparkline / MiniBars

```tsx
<Sparkline values={[28, 32, 30, 36, 41, 38, 46, 52]} label="近 8 期趋势" />
<Sparkline values={weekly} width={120} height={32} smooth={false} label="近 7 日" />
<MiniBars values={weekly} label="近 7 日新增" height={32} />
```

两者都是"没有坐标轴的小图"，用于表格单元格或指标卡内；`label` 必填（图形没有文字时靠它被读屏理解）。

## LineChart

```tsx
<LineChart
  labels={['3月', '4月', '5月', '6月', '7月', '8月', '9月']}
  series={[
    { name: '本月金额（万元）', values: [28, 32, 30, 41, 38, 46, 52] },
    { name: '上月同期', values: [26, 28, 33, 34, 36, 40, 44], tone: 'var(--info)' },
  ]}
/>
```

| prop     | 类型                        | 说明                                 |
| -------- | --------------------------- | ------------------------------------ |
| `labels` | `string[]`                  | 横轴刻度                             |
| `series` | `{ name, values, tone? }[]` | 多序列；`tone` 默认 `var(--primary)` |
| `height` | `number`                    | 默认 160                             |

悬停会显示该点的读数；线的 `aria-label` 由序列名拼成。

## ColumnChart（普通柱状图）

```tsx
<ColumnChart
  label="近 14 天新增"
  valueSuffix=" 个"
  data={[
    { label: '9-03', value: 3 },
    { label: '9-04', value: 5 },
  ]}
/>
```

| prop          | 默认             | 说明                       |
| ------------- | ---------------- | -------------------------- |
| `data`        | —                | `{ label, value }[]`       |
| `height`      | `220`            | 图高                       |
| `tone`        | `var(--primary)` | 柱色                       |
| `valueSuffix` | `''`             | 悬停读数后缀               |
| `showAverage` | `true`           | 画一条平均值参考线（虚线） |

带纵轴刻度、平均值参考线与悬停读数；和 `MiniBars` 的区别是"要能读具体数值"。

## DonutChart

```tsx
<DonutChart value={72} label="本月目标完成率" />
<DonutChart value={38} label="额度使用率" tone="var(--warning)" />
<DonutChart value={94} label="工单按时率" tone="var(--success)" size={120} />
```

`value` / `max` 控制比例，`label` 同时作为无障碍名称与中间说明。

## BarList

```tsx
<BarList
  label="来源渠道对比"
  items={[
    { name: '官网表单', value: 4820 },
    { name: '渠道合作', value: 3160 },
  ]}
/>
```

横向条形对比，值与名称同行展示，适合渠道、来源、Top N 这类"看排序"的场景。

## Heatmap

```tsx
<Heatmap
  label="下单时段分布"
  rows={['周一', '周二', '周三']}
  columns={['09', '11', '13', '15', '17']}
  values={[[0.1, 0.45, 0.2, 0.55, 0.7]]}
/>
```

`values[row][column]` 取 0–1，用同一主色的深浅表达强度，快速看出高峰时段。

## RadarChart

```tsx
<RadarChart
  axes={['交付', '响应', '质量', '成本', '协同', '增长']}
  series={[
    { name: '本期', values: [0.85, 0.7, 0.9, 0.6, 0.75, 0.8] },
    { name: '上期', values: [0.7, 0.65, 0.75, 0.7, 0.6, 0.65], tone: 'var(--info)' },
  ]}
/>
```

各序列按同一 `axes` 顺序给 0–1 的值，用于能力画像、评分对比。

## FunnelChart

```tsx
<FunnelChart
  stages={[
    { name: '访问', value: 12800 },
    { name: '注册', value: 4820 },
    { name: '付费', value: 860 },
  ]}
/>
```

每级自动算**相对上一级的转化率**，用于注册、试用、付费这类链路分析。

## GanttChart

```tsx
<GanttChart
  today={4}
  days={['9-14', '9-15', '9-16', '9-17', '9-18', '9-19']}
  rows={[
    { name: '需求评审', start: 0, span: 2 },
    { name: '接口联调', start: 1, span: 3, progress: 60 },
    { name: '回归测试', start: 4, span: 2, progress: 20, tone: 'var(--warning)' },
  ]}
/>
```

| prop    | 说明                                                          |
| ------- | ------------------------------------------------------------- |
| `rows`  | `{ name, start, span, progress?, tone? }[]`，`start` 是列下标 |
| `days`  | 时间轴刻度（日期或"第 N 天"）                                 |
| `today` | 今日列下标，传入后画一条竖线                                  |

横向可滚动，适合排期与里程碑。

## Progress 与 CodeBlock

```tsx
<Progress value={72} label="导出进度" />
<Progress value={38} tone="warning" label="额度使用" />

<CodeBlock title="GET /api/v1/customers" code={`{ "total": 12480 }`} />
```

`CodeBlock` 带复制按钮（复制成功 / 失败都有 toast），用于接口示例与配置展示；
**不做语法高亮**，避免引入高亮库。

## 什么时候该换图表

自绘图表覆盖后台 90% 的"看趋势、看分布、看转化"需求。出现下面情况时，在业务侧单独引库：

- 地图、关系图、桑基图、K 线；
- 十万级数据点的散点或密集折线；
- 需要缩放、刷选、联动等完整图表交互。

引库时保持"sandbox 在业务页面里"，不要把库引到 `src/components/ui/`。
