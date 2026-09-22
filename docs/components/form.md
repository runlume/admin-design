---
description: 表单与选择：表单组装、Combobox、级联、多选、日期时间、验证码输入、文件上传与固定提交栏。
---

# 表单与选择

在线示例：`/design-system/form`。

## Calendar / Transfer

```tsx
<Calendar value={date} onValueChange={setDate} locale="zh-CN" />
<Transfer items={roles} value={selectedRoles} onValueChange={setSelectedRoles} />
```

`Calendar` 提供完整月视图、跨月选择、日期范围和禁用日期；`Transfer` 提供搜索、批量勾选、禁用项与双向移动。

## 表单组装

`Input` 的 `start` / `end` 插槽会自动把没写尺寸的图标压到 16px，不用每次自己加 `size-4`；
需要更大的图形再显式写 `className="size-5"` 覆盖。

表单页推荐的结构：`Label` + 控件 + 错误文案，底部用 `FixedBar` 收口操作。

```tsx
<div className="grid gap-1.5">
  <Label htmlFor="form-name">客户名称</Label>
  <Input id="form-name" defaultValue="云和智能制造" clearable />
</div>

<div className="grid gap-1.5">
  <Label htmlFor="form-invalid">联系电话（错误态）</Label>
  <Input id="form-invalid" aria-invalid defaultValue="138" />
  <p className="text-xs text-destructive">手机号格式不正确</p>
</div>

<FixedBar hint="表单校验通过后才会写入业务接口">
  <Button variant="outline">取消</Button>
  <Button>保存</Button>
</FixedBar>
```

模板未内置表单库封装，页面可以直接用 `react-hook-form` + `zod`（已在依赖里），
也可以受控手写；两者都要把错误态落到 `aria-invalid` 与 `text-destructive`。

## Combobox

可搜索下拉，适合人员、客户这类长列表；支持分组与清空。

```tsx
<Combobox
  label="负责人"
  value={owner}
  onValueChange={setOwner}
  clearable
  placeholder="搜索负责人"
  options={customers.map((c) => ({ value: c.id, label: c.owner, description: c.name }))}
/>
```

| prop                      | 类型                                       | 说明               |
| ------------------------- | ------------------------------------------ | ------------------ |
| `options`                 | `(ComboboxOption \| { group, options })[]` | 平铺或分组选项     |
| `value` / `onValueChange` | `string \| undefined`                      | 受控值             |
| `label`                   | `string`                                   | 必填，作为访问名称 |
| `clearable`               | `boolean`                                  | 显示清空           |
| `emptyText`               | `string`                                   | 无匹配时的提示     |

## Cascader

逐列下钻，选中叶子后回填完整路径。

```tsx
<Cascader
  label="归属组织"
  value={org}
  onValueChange={(value, path) => setOrg(value)}
  options={organizationOptions}
/>
```

`CascaderOption` 是 `{ value, label, children? }`；`onValueChange` 第二个参数是完整路径数组，
需要展示"公司 / 中心 / 组"时直接取它。

## MultiSelect

多选 + 搜索，触发器里用 `Badge` 展示已选项，**触发器是一个 button，内部不再嵌套 button**。

```tsx
<MultiSelect
  label="客户状态"
  values={statuses}
  onValuesChange={setStatuses}
  placeholder="全部状态"
  options={[
    { value: 'ACTIVE', label: '正常' },
    { value: 'PENDING', label: '待处理' },
  ]}
/>
```

## 日期与时间

| 组件             | 用途                          | 关键 prop                                                 |
| ---------------- | ----------------------------- | --------------------------------------------------------- |
| `DateInput`      | 单日选择，支持月 / 年视图切换 | `value` / `defaultValue`（`YYYY-MM-DD`）、`onValueChange` |
| `DateRangeInput` | 区间选择，支持拖选            | `value: { from?, to? }`、`onValueChange`                  |
| `DateTimeInput`  | 日期 + 时间                   | `value`（`YYYY-MM-DDTHH:mm`）、`onValueChange`            |

```tsx
<DateRangeInput label="签约区间" value={range} onValueChange={setRange} />
<DateTimeInput label="排期" value={schedule} onValueChange={setSchedule} />
```

区间工具在 `src/lib/range.ts`：`rangeShortcuts()` 生成常用快捷区间（今天 / 近 7 天 / 本月…），
`invalidRange()` 判断起止颠倒，`rangeLabel()` 输出展示文案。

浮层里点快捷区间会**立即生效并关闭**（不用再点「确定」）；点日历选日期仍然要点「确定」确认。

## InputOTP

分格验证码输入，支持直接粘贴 6 位验证码；内部是一个真实 `input`，分格只负责展示。

```tsx
<InputOTP
  label="验证码"
  value={code}
  onValueChange={setCode}
  fill
  invalid={hasError}
  describedBy="code-error"
/>
```

| prop          | 类型      | 说明                                             |
| ------------- | --------- | ------------------------------------------------ |
| `label`       | `string`  | 必填，输入框的访问名称                           |
| `length`      | `number`  | 位数，默认 6                                     |
| `fill`        | `boolean` | 铺满整行：格子等分拉伸，与其它输入框等宽对齐     |
| `invalid`     | `boolean` | 错误态：格子描红，同时把 `aria-invalid` 交给读屏 |
| `describedBy` | `string`  | 错误说明元素的 id，与 `aria-describedby` 一起用  |

注册页的手机 / 邮箱验证就是用它：先选验证方式，再填验证码，验证通过才允许提交；
错误提示挂在字段下方，由 `invalid` + `describedBy` 关联到控件。

## PasswordStrength

```tsx
<Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
<PasswordStrength password={password} />
{/* 表单页更常用紧凑版：只留强度条 + 问号提示 */}
<PasswordStrength password={password} compact />
```

规则清单在 `src/lib/password.ts`（长度、大小写、数字、符号），组件只做展示；
业务要换规则改 `passwordRules` 即可，注册页与修改密码共用同一套。
`compact` 把规则收进强度条右侧的问号（悬停或聚焦展开），注册页用的就是这一版；
组件总览里的示例用默认形态，规则一次看全。

## FileUpload

```tsx
<FileUpload
  label="上传附件"
  accept=".pdf,.png,.jpg"
  maxSize={2 * 1024 * 1024}
  concurrency={3}
  files={uploads}
  onFilesChange={setUploads}
  uploader={async (file, signal, onProgress) => {
    await api.upload(file, { signal, onProgress }) // 业务实现
  }}
/>
```

| prop                      | 类型                                          | 说明                                       |
| ------------------------- | --------------------------------------------- | ------------------------------------------ |
| `files` / `onFilesChange` | `UploadFile[]`                                | 受控列表，含进度、错误、取消状态           |
| `accept` / `maxSize`      | `string` / `number`                           | 客户端校验，不合法直接拦下并提示           |
| `multiple`                | `boolean`                                     | 是否多选                                   |
| `concurrency`             | `number`                                      | 同时上传数上限，超出的排队                 |
| `uploader`                | `(file, signal, onProgress) => Promise<void>` | 业务上传实现；不传时只走本地校验与进度演示 |

支持重试与取消：取消通过 `AbortSignal` 传给 `uploader`，重试会重新调用同一个实现。

## ImagePreview

```tsx
<ImagePreview alt="品牌方标" src="/brand/mark.svg" />
<ImagePreview alt="合同" src={contracts[0].src} images={contracts} />
```

点击打开浮层，支持缩放、拖动与多图左右切换。

## Mention

contentEditable 的提及输入，`@` 触发候选，采纳后插入不可编辑的内联标签。

```tsx
<Mention
  label="跟进记录"
  value={comment}
  onValueChange={setComment}
  options={customers.slice(0, 5).map((c) => ({ value: c.id, label: c.owner, description: c.name }))}
/>
```

键盘：`@` 打开候选，`↑`/`↓` 选择，`Enter` 采纳，`Esc` 关闭。

候选列表默认向下展开；下方剩余空间不足列表最小样式（约两行）时改为向上展开，窗口缩放与滚动后重新判断。

## FixedBar

长表单的粘底操作条，`sticky bottom-0` + 半透明背景，滚动时不遮挡内容。

```tsx
<FixedBar hint="表单校验通过后才会写入业务接口">
  <Button variant="outline">取消</Button>
  <Button>保存</Button>
</FixedBar>
```
