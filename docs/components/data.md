---
description: 数据展示：DataTable、可编辑表格、列表树、表格树、Descriptions、Timeline 与分页的用法。
---

# 数据展示

在线示例：`/design-system/data`。这一页是模板里最重的部分：表格、树、表格树、描述列表、时间线、分页与布局容器。

## DataTable

基于 `@tanstack/react-table` 的列定义，外层包一层后台常用能力。

```tsx
const columns: ColumnDef<Row>[] = [
  { accessorKey: 'id', header: 'ID', size: 120 },
  {
    accessorKey: 'status',
    header: '状态',
    size: 120,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
]

<DataTable
  data={rows}
  columns={columns}
  caption="组织单元"
  sortable
  storageId="design-data"
  pinned={{ first: true, last: true }}
  density={density}
  columnVisibility={visibility}
  onColumnVisibilityChange={setVisibility}
  onRowClick={(row) => navigate(`/customers/${row.id}`)}
  toolbar={<TableToolbar><ColumnManager … /></TableToolbar>}
  footer={<PagePager page={page} pageCount={12} onPageChange={setPage} />}
/>
```

| prop                                  | 类型                                 | 说明                                           |
| ------------------------------------- | ------------------------------------ | ---------------------------------------------- |
| `data` / `columns`                    | `T[]` / `ColumnDef<T>[]`             | 数据与列定义                                   |
| `caption`                             | `string`                             | 必填，表格标题（同时作为 `aria-label`）        |
| `loading`                             | `boolean`                            | 加载态                                         |
| `emptyTitle` / `emptyDescription`     | `string`                             | 空态文案                                       |
| `striped`                             | `boolean`                            | 斑马纹，默认开启                               |
| `sortable`                            | `boolean`                            | 表头排序，点击在升序 → 降序 → 取消之间循环     |
| `defaultSorting`                      | `SortingState`                       | 初始排序，支持多列与优先级                     |
| `density`                             | `compact \| default \| relaxed`      | 行高密度                                       |
| `onRowClick`                          | `(row: T) => void`                   | 行点击；行内的按钮/链接/复选框等交互元素不触发 |
| `pinned`                              | `{ first?, last? }`                  | 固定第一列 / 操作列                            |
| `storageId`                           | `string`                             | 列宽与列顺序按表名持久化                       |
| `expandable`                          | `{ content, label? }`                | 行内展开；**与 `virtual` 互斥**                |
| `virtual`                             | `{ height?, rowHeight?, overscan? }` | 大数据量虚拟滚动                               |
| `columnOrder` / `onColumnOrderChange` | `string[]`                           | 列顺序（受控）；不传时用浏览器保存的顺序       |
| `columnSizes` / `onColumnSizesChange` | `Record<string, number>`             | 列宽（受控）；受控后视图预设才能连列宽一起存   |
| `toolbar` / `footer`                  | `ReactNode`                          | 工具栏与底部（分页、合计）                     |

### 虚拟滚动

```tsx
<DataTable data={largeRows} columns={columns} caption="大数据量记录" virtual={{ height: 460 }} />
```

只渲染可视窗口内的行，上下用占位行撑起滚动高度，**表头固定**。注意两点：

- 行高固定（实测首行高度），因此与行内展开互斥；
- 滚动容器必须是表格外层，别给内层 `.table-container` 加 `overflow-x-auto`，否则表头不再吸顶。

### ColumnManager

```tsx
<ColumnManager
  columns={columns}
  storageId="design-data"
  visibility={visibility}
  onVisibilityChange={setVisibility}
/>
```

「恢复默认」在传了 `storageId` 时会**连列宽一起复位**（`resetTableLayout`），否则只复位显示 / 隐藏。

### 拖拽调整列顺序

两处都能拖：

1. **表头**：拖动列标题到目标列上；拖动时目标列会出现一条 2px 主色边框，指明会插到哪一侧。
2. **列管理（「列」下拉）**：每项前面是拖拽手柄、行尾是勾选框，拖到目标项上即可。

```tsx
const [order, setOrder] = useState<string[]>(() => readColumnOrder('customers'))

<DataTable … columnOrder={order} onColumnOrderChange={setOrder} />
<ColumnManager … order={order} onOrderChange={setOrder} pinned={{ first: true, last: true }} />
```

- 顺序与列宽存在同一个浏览器键里（按 `storageId`），刷新后保留；「列 → 恢复默认」会连列宽一起复位。
- **固定列**（`pinned.first` / `pinned.last`）不参与拖拽：被拖到中间会让吸附位置错乱，所以直接禁止；`ColumnManager` 传同一个 `pinned` 即可保持一致。
- 页面初始化 `order` 时要写 `useState(() => readColumnOrder(storageId))`：传空数组会被当成"默认顺序"，把保存的顺序覆盖掉。

## EditableTable（可编辑表格）

行内编辑 + 逐行新增的数据录入表：只读行显示文本与图标操作，进入编辑态后变成控件，
底部整行是「新增一行」。用 `onChange` 把已保存的行交给业务。

```tsx
<EditableTable
  columns={[
    { key: 'name', label: '客户名称', placeholder: '请输入客户名称' },
    { key: 'owner', label: '负责人', type: 'select', options: owners },
    { key: 'startedAt', label: '签约日期', type: 'date' },
    { key: 'amount', label: '合同金额', type: 'number' },
    { key: 'vip', label: '重点客户', type: 'switch' },
  ]}
  defaultRows={rows}
  onChange={setRows}
  maxRows={7} // 不传就不限高，也不出现纵向滚动条
/>
```

| prop            | 类型                    | 说明                                                                 |
| --------------- | ----------------------- | -------------------------------------------------------------------- |
| `columns`       | `EditableTableColumn[]` | 列定义；`type` 支持 `text` / `number` / `date` / `select` / `switch` |
| `defaultRows`   | `{ id, values }[]`      | 初始行（非受控），`values` 按列的 `key` 取值                         |
| `onChange`      | `(rows) => void`        | 已保存行的回调，编辑过程中不触发                                     |
| `stickyActions` | `boolean`               | 操作列固定在右侧，默认开启；列多时表格内部横向滚动                   |
| `maxRows`       | `number`                | 行数上限，超过才内部纵向滚动 + 表头吸顶；不传即不限高                |

配合约定：

- 操作列一律**图标按钮**（编辑 / 保存 / 取消 / 删除），删除用 `bg-danger-soft` + 淡红描边，悬停加深；
- 新行默认处于编辑态，`取消` 直接丢弃该行；`取消` 非新行时只丢掉本次改动；
- 行数多时不要自己给表格套 `max-height`，统一用 `maxRows`，表头吸顶与横向滚动都由组件负责。

## Tree（列表树）

```tsx
<Tree
  nodes={nodes}
  label="组织单元"
  defaultExpanded={rootIds}
  filterable
  showExpandControls
  guides
  checkable
  defaultChecked={['OU-111']}
  onCheckedChange={setChecked}
  onMove={(sourceId, targetId) => moveNode(sourceId, targetId)}
  loadChildren={(id) => fetchChildren(id)}
/>
```

| prop                                 | 类型                                   | 默认    | 说明                                                                       |
| ------------------------------------ | -------------------------------------- | ------- | -------------------------------------------------------------------------- |
| `nodes`                              | `TreeNode<TreeItem>[]`                 | —       | `{ id, parentId, sortOrder, data: { label, description?, disabled? } }`    |
| `label`                              | `string`                               | —       | 必填，树的访问名称                                                         |
| `defaultExpanded`                    | `string[]`                             | `[]`    | 默认展开                                                                   |
| `guides`                             | `boolean`                              | `true`  | 层级**虚线**；缩进始终保留                                                 |
| `filterable`                         | `boolean`                              | `false` | 显示节点搜索，命中自动展开祖先                                             |
| `showExpandControls`                 | `boolean`                              | `false` | 展开全部 / 收起全部按钮                                                    |
| `checkable`                          | `boolean`                              | `false` | **勾选是属性开关**，默认关闭；父节点级联子节点，孙节点被勾选时祖先显示半选 |
| `defaultChecked` / `onCheckedChange` | `string[]`                             | `[]`    | 勾选状态                                                                   |
| `onMove`                             | `(sourceId, targetId \| null) => void` | —       | 拖拽排序，落地交给业务                                                     |
| `loadChildren`                       | `(id) => void`                         | —       | 懒加载子节点                                                               |
| `virtual`                            | `boolean`                              | `false` | 节点 > 200 时按 36px 估算窗口                                              |

键盘：`↑`/`↓` 在可见节点间移动，`→` 展开或进入子节点，`←` 收起或回到父节点，`Enter` / `Space` 选中。

## TreeTable（表格树）

**表格树在标准表格样式上实现**：层级数据拍平成行，第一列补缩进与展开按钮，
列宽拖拽、固定列、行点击、溢出提示、空态全部复用 `DataTable`。

```tsx
<TreeTable
  nodes={tableTree}
  caption="组织单元（表格）"
  defaultExpanded={rootIds}
  rowLabel={(node) => node.data.name}
  columns={[
    {
      id: 'name',
      header: '名称',
      cell: (row) => <span className="font-medium">{row.node.data.name}</span>,
    },
    { id: 'kind', header: '类型', width: 110, cell: (row) => row.node.data.kind },
    {
      id: 'status',
      header: '状态',
      width: 120,
      cell: (row) => <StatusBadge status={row.node.data.status} />,
    },
  ]}
/>
```

| prop              | 说明                                                                      |
| ----------------- | ------------------------------------------------------------------------- |
| `nodes`           | `TreeNode<T>[]`                                                           |
| `columns`         | `{ id, header, width?, cell(row: FlatTreeRow<T>) }[]`，第一列自动获得缩进 |
| `caption`         | 表格标题                                                                  |
| `rowLabel`        | 展开 / 收起按钮的提示文本                                                 |
| `defaultExpanded` | 默认展开的节点 id                                                         |

## Descriptions

```tsx
<Descriptions
  columns={3}
  items={[
    { key: 'id', label: '客户编号', value: 'CUS-1001' },
    { key: 'email', label: '邮箱', value: 'ops@yunhe.example', span: 2 },
  ]}
/>
```

`bordered` 可切换描边样式；`span` 让长内容跨列。

## Timeline

```tsx
<Timeline
  items={[
    { key: '1', title: '提交注册资料', time: '2026-09-16 09:20', tone: 'success' },
    { key: '2', title: '补充营业执照', description: '上传扫描件并完成人工比对。' },
    { key: '3', title: '审核退回', tone: 'danger', time: '2026-09-14 11:05' },
  ]}
/>
```

`tone` 取 `default | success | warning | danger`，按时间倒序展示。

## 分页：两种模式

后台分页只有两种形态，选错了会在数据量大时出现"翻到第 500 页"的性能问题：

| 模式                          | 组件                                               | 适用                       | 说明                                             |
| ----------------------------- | -------------------------------------------------- | -------------------------- | ------------------------------------------------ |
| **固定分页**（offset / 页码） | `PagePager` + `PaginationBar mode="fixed"`         | 数据量可控、需要跳页与总数 | 已知总页数，可以输入页码跳转                     |
| **偏移分页**（cursor）        | `CursorPagination` + `PaginationBar mode="cursor"` | 大数据量、实时流、无限滚动 | 只知道"有没有下一页"，提供首页 / 上一页 / 下一页 |

```tsx
// 固定分页
<PagePager page={page} pageCount={12} onPageChange={setPage} />

// 偏移分页（CursorPagination 内部已用 PaginationBar mode="cursor" 包装，直接渲染即可）
<CursorPagination
  count={rows.length}
  page={page}
  pending={query.isFetching}
  hasNext={hasNext}
  hasPrevious={hasPrevious}
  first={goFirst}
  previous={goPrevious}
  next={goNext}
/>
```

需要自定义底部布局时再用 `PaginationBar`：`mode` 取 `fixed` 或 `cursor`，
`summary` / `pageSize` 放左侧信息，分页控件作为 children。

页码计算（省略号、边界）在 `src/lib/pager.ts`：`pagerItems(page, pageCount)` 返回带 `null`（省略号）的数组，
`parsePageInput()` 负责把输入框内容解析成合法页码。

## LayoutContainer

主内容 + 可折叠、可拖拽调宽的详情侧栏；宽度按 `storageId` 保存在浏览器。

```tsx
<LayoutContainer asideLabel="详情侧栏" storageId="design-aside" aside={<Timeline items={events} />}>
  <Descriptions items={detailItems} />
</LayoutContainer>
```

| prop               | 默认    | 说明                                          |
| ------------------ | ------- | --------------------------------------------- |
| `aside`            | —       | 侧栏内容，不传则只有主区                      |
| `asideLabel`       | —       | 侧栏访问名称                                  |
| `defaultCollapsed` | `false` | 初始折叠                                      |
| `storageId`        | —       | 传入后持久化宽度，并通过 `onWidthChange` 共享 |

拖左边缘调整宽度（键盘 `←`/`→` 也可），双击复位。

## 工具栏与行操作零件

| 组件                | 用途                                         |
| ------------------- | -------------------------------------------- |
| `TableToolbar`      | 表格上方工具条容器（列管理、密度、批量操作） |
| `BulkActions`       | 批量操作下拉，`label` + 子项                 |
| `RowActions`        | 行尾操作容器，固定右列时使用                 |
| `TableCellOverflow` | 超长单元格一行截断 + `title` 提示            |
| `SearchFilters`     | 列表页筛选区（见下）                         |
| `FilterButton`      | 筛选区按钮，`action` 自动获得提交语义        |

## SearchFilters

```tsx
<SearchFilters
  presets={{ storageId: 'customers', value: filters, onApply: restore }}
  columns={3}
  collapsedCount={3}
  description="筛选条件不会自动保存，常用组合可以存成预设。"
>
  <SearchField as="label">客户名称<Input … /></SearchField>
  <SearchField as="label">状态<NativeSelect … /></SearchField>
  <SearchActions>
    <Button type="reset" variant="outline">重置</Button>
    <Button type="submit">查询</Button>
  </SearchActions>
</SearchFilters>
```

| prop                                  | 默认             | 说明                                                                                       |
| ------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------ |
| `presets`                             | —                | **配置开关**：传入 `{ storageId, value, onApply }` 就启用"筛选预设"（底层是 `StorageBox`） |
| `labelPosition`                       | `left`           | `left` 会按列对齐标签宽度                                                                  |
| `columns`                             | `3`              | 列数                                                                                       |
| `collapsedCount`                      | `= columns`      | 折叠后保留的字段数；**没有可折叠字段时不显示禁用「展开」**                                 |
| `description` / `descriptionPosition` | —                | 说明文案，`bottom` 或 `inline`                                                             |
| `togglePosition`                      | `inline`         | 展开 / 收起按钮位置                                                                        |
| `collapsible` / `defaultExpanded`     | `true` / `false` | 折叠行为                                                                                   |

`StorageBox`（储物箱）也可以单独使用：保存 / 恢复 / 重命名 / 删除任意状态快照，
数据存在浏览器，用 `storageId` 区分业务。

**视图预设存的是整份列布局**：筛选条件 + 列显隐 + 列顺序 + 列宽，恢复时四项一起回来。
要做到这点，页面要把列宽与列顺序也作为受控状态交给表格：

```tsx
const [order, setOrder] = useState(() => readColumnOrder('customers'))
const [sizes, setSizes] = useState(() => readTablePrefs('customers').sizes)
const [visibility, setVisibility] = useState<VisibilityState>({})

<DataTable
  columnVisibility={visibility} onColumnVisibilityChange={setVisibility}
  columnOrder={order} onColumnOrderChange={setOrder}
  columnSizes={sizes} onColumnSizesChange={setSizes}
/>

<StorageBox
  snapshot={{ query, visibility, order, sizes }}
  onRestore={(saved) => {
    setQuery(saved.query)
    setVisibility(saved.visibility)
    setOrder(saved.order ?? order) // 旧预设没有这两个字段时保持当前值
    setSizes(saved.sizes ?? {})
  }}
/>
```

只把列显隐放进快照的话，用户改了列宽 / 列顺序再保存，恢复时那两项不会回来——这正是"预设看起来没生效"的常见原因。

命名规则：

- **回车不会保存**：输入框里按 Enter 不做任何事，必须点按钮，避免想改备注时手滑存下一条。
- **名称唯一**：重名时不会静默覆盖，输入框下方给出提示，主按钮变成「覆盖」，点它才覆盖；重命名撞名时「确定」直接禁用。
- 保存上限 20 条（`upsertPreset` 的 `limit`），满了会挤掉最旧的一条。
- **摘要可读**：列表里那行说明默认用 `describePresetValue()` 拼成 `关键字: 云和 · 状态: 正常/待处理`，不再是一串 JSON；需要业务自己的说法时给 `presets.summary` 传函数。

视图预设（`sample.viewPreset`）与筛选预设在同一个组件上，行为一致。
筛选预设保存的是**当前筛选栏里的条件**（关键字 / 状态 / 日期区间），不必先点「搜索」。
