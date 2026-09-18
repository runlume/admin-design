# Admin Design 协作约定

本目录是「Runlume 标准后台设计」模板，供业务系统复制使用。开始改动前先读 `README.md`，
组件总览（`/design-system` 及其分类页）就是这套设计的验收面：**新增或修改公共组件时，总览页必须同步。**

## 范围

- 这里只放**设计与交互层**：主题与语义 Token、布局外壳、公共组件、标准页型、组件总览。
- 不放业务接口、认证、权限模型与业务规则；示例数据只是演示，不能沉淀成业务模型。
- 不引入图表库、UI 框架、装饰性动效库（embla/shiki/qrcode/Iconify 等）；图表与动效自绘 SVG 或 CSS。
- 品牌资源直接复用 `public/brand/` 下的文件，不另建图片。
- `docs/` 是 VitePress 文档站（`vitepress` 只在 devDependencies，不进应用产物）；
  改公共组件时同步 `docs/components/<分类>.md`，`pnpm docs:build` 会检查死链。

## 执行约束

- Node.js 24 + pnpm 11.21.0，只维护 `pnpm-lock.yaml`，禁止 npm/yarn。
- 颜色一律走语义 Token，不写死色值；语义色与品牌色分开；深浅模式都要成立。
- 组件分层保持现状：`components/ui/` 是基础控件，`components/` 是公共组件，`pages/design-system/` 只做展示。
- 所有测试放在 `src/test/`（unit / components / e2e），业务目录不并排放测试。
- 文案进 `src/lib/i18n.ts`，中文与英文必须同时补齐（类型上 `en: typeof zh` 会强制对齐）。
- 偏好只存浏览器并带 `VITE_APP_STORAGE_PREFIX`；服务端数据不进 Zustand / localStorage。
- 交互必须键盘可达；对话框保持现有焦点管理；语义色对比度按 WCAG AA（e2e 里有断言）。

## 验证

- 每次改动至少跑 `pnpm check`（typecheck + lint + 单元测试 + 生产构建）与 `pnpm test:e2e`。
- 新组件或新能力要满足三件套：**组件总览加示例 + 至少一处真实落点 + 单元或 Playwright 覆盖**。
- 并行运行 Playwright 时用 `--output=/tmp/pw-admin-out` 隔离产物目录，避免 `test-results/` 冲突。
- 说明实际结果与未覆盖的边界；不能靠删除或跳过用例让校验变绿。
