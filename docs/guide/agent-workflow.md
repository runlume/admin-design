---
description: Agent 工作流：命令入口、改动流程与提交前检查清单，给在这里工作的 AI Agent 与人。
---

# Agent 工作流

给在这里工作的 AI Agent（以及人）的固定流程。先读 `AGENTS.md`，本文补充"怎么跑、怎么自证"。

## 命令入口

| 目的              | 命令                                                               |
| ----------------- | ------------------------------------------------------------------ |
| 日常改动后自证    | `pnpm check`（格式检查 + 类型 + lint + 单测 + 生产构建）           |
| 完整验证          | `pnpm verify`（`check` + Playwright）                              |
| 只跑单元测试      | `pnpm test`                                                        |
| 只跑端到端        | `pnpm test:e2e -- --output=/tmp/pw-admin-out`                      |
| 截图评审          | `pnpm screenshots`（写入 `/tmp/admin-design-shots`）               |
| 格式化            | `pnpm format`（`format:check` 已并入 `check`）                     |
| 文档站开发 / 构建 | `pnpm docs:dev` / `pnpm docs:build`（产物 `docs/.vitepress/dist`） |

并行跑 Playwright 时**必须**加 `-- --output=/tmp/pw-admin-out`，否则多个进程共用 `test-results/` 会出现假失败。

## 改动流程

1. **先读约定**：`AGENTS.md`（范围与约束）、本文、`docs/guide/architecture.md`（分层与决策）。
2. **判断题：** 用户给的是路径 + 目的，别把样例数据当业务模型；需要新能力时先看 `components/` 是否已有等价组件（很多能力是 prop 开关，而不是新组件）。
3. **改代码**：颜色走语义 Token；文案进 `src/lib/i18n.ts`（中英同步）；测试放 `src/test/`。
4. **跑 `pnpm check`**：格式、类型、lint、单测、构建任何一项失败都要修到绿，不能靠跳过用例。
5. **涉及交互/视觉**：跑 `pnpm test:e2e`，必要时 `pnpm screenshots` 自查截图。
6. **补三件套**：组件总览示例 + 至少一处真实落点 + 单元或 Playwright 覆盖；
   公共组件还要在 `docs/components/<分类>.md` 补一节（props 表 + 用法）。
7. **提交**：`.githooks/pre-commit` 会自动跑格式/类型/lint/单测（首次克隆后执行 `git config core.hooksPath .githooks`）。

## 提交前检查清单

- [ ] `pnpm check` 全绿
- [ ] 有交互改动时 `pnpm verify` 全绿
- [ ] 新增组件/能力有总览示例与测试
- [ ] 中英文案同步，未使用未登记 key
- [ ] 没有引入新的第三方依赖（图表、动效、图标库）
- [ ] 没有把示例数据写进 `lib/` 或组件默认值
