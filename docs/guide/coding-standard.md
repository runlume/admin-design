---
description: 代码规范：Prettier 与 ESLint 工具链、TypeScript 约束、命名结构、注释与提交前钩子。
---

# 代码规范

## 工具链

| 工具       | 配置                                                                            | 命令                                |
| ---------- | ------------------------------------------------------------------------------- | ----------------------------------- |
| Prettier   | `.prettierrc.json`（无分号、单引号、行宽 100、尾逗号 all）                      | `pnpm format` / `pnpm format:check` |
| oxlint     | `.oxlintrc.json`（忽略 `dist/`、`node_modules/`、`test-results/`）              | `pnpm lint`                         |
| TypeScript | `tsconfig.app.json`（`strict` + `noUncheckedIndexedAccess` + `noUnusedLocals`） | `pnpm typecheck`                    |

一次性自证：`pnpm check`（格式检查 → 类型 → lint → 单测 → 生产构建）。

## TypeScript 约束

- **`strict: true`**：不允许隐式 `any`、不允许可空值直接使用。
- **`noUncheckedIndexedAccess: true`**：`rows[0]`、`record[key]` 的类型都带 `undefined`。
  用兜底值处理，**不要用 `!` 断言绕过**：

  ```ts
  const owner = owners[index % owners.length] ?? '未分配' // 对
  const owner = owners[index % owners.length]! // 错
  ```

- **`verbatimModuleSyntax: true`**：类型导入必须写 `import type { X } from '...'`。
- **`noUnusedLocals` / `noUnusedParameters`**：删掉比留着干净，不要用 `_` 前缀糊过去。

## 命名与结构

| 对象   | 约定                                      | 示例                               |
| ------ | ----------------------------------------- | ---------------------------------- |
| 文件   | kebab-case                                | `data-table.tsx`、`page-pager.tsx` |
| 组件   | PascalCase，命名导出                      | `export function DataTable`        |
| Hook   | `use-` 开头文件名 + `useXxx` 导出         | `hooks/use-mobile.ts`              |
| 纯逻辑 | 动词或名词短语                            | `flattenTree`、`resolvePalette`    |
| 类型   | PascalCase，props 用内联对象或 `XxxProps` | `ConsoleLayoutProps`               |
| 测试   | 与被测对象同名                            | `src/test/unit/tree.test.ts`       |

组件内部顺序保持一致：类型 → 常量 → 主组件 → 辅助函数。

## 写组件时的硬约定

- **颜色只走语义 Token**，不写 `#086c6a`、`text-green-600` 这类具体色值。
- **文案进语言包**（组件内部固定文案必须进；总览示例文案可以直接写中文）。
- **不引第三方依赖**：图表自绘 SVG，动效用 CSS，不为了一个动效加一个库。
- **偏好只存浏览器**并带 `VITE_APP_STORAGE_PREFIX`；服务端数据不进 Zustand。
- **副作用通过 prop 注入**（`uploader`、`onMove`、`loadChildren`、`onSignOut`），组件不直接调接口。
- **测试放 `src/test/`**，不与被测文件并排。

## 注释

- 只解释"为什么"，不重复"做了什么"。
- 踩过的坑要留下原因，例如：

  ```tsx
  // 结构只由属性决定：否则清空按钮出现/消失会重挂载输入框，连续输入会丢焦点。
  ```

- 不写"照抄自 xx 项目"这类溯源注释：`.claude` 之外的读者只关心为什么这么写，来源信息放文档里。

## 提交前钩子与 CI

| 位置                       | 内容                                                                                |
| -------------------------- | ----------------------------------------------------------------------------------- |
| `.githooks/pre-commit`     | 格式检查 + 类型 + lint + 单元测试（提交被拦过一次就算生效）                         |
| `.github/workflows/ci.yml` | `pnpm install --frozen-lockfile` → `pnpm check` → Playwright → 上传 `test-results/` |

首次克隆后执行一次：

```bash
git config core.hooksPath .githooks
```

钩子和 CI 跑的是同一组命令，本地过了 CI 基本不会挂；**不能靠删用例或跳过来让校验变绿**。
