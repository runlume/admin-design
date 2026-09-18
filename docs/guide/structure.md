---
description: 目录结构：各目录职责、命名约定，以及新增页面或公共组件要动哪几处。
---

# 目录结构

```text
admin-design/
├── docs/                     # 文档站（VitePress）：guide/ + components/
├── public/brand/             # 品牌资源，业务系统直接覆盖同名文件
├── src/
│   ├── app/                  # 外壳接线：路由、布局、Providers、示例菜单
│   ├── components/           # 公共组件（外壳、页型零件、图表、设置面板）
│   │   └── ui/               # 基础控件（button/input/table/tabs/dialog…）
│   ├── hooks/                # 通用 hooks
│   ├── lib/                  # 纯逻辑：主题偏好、i18n、树、分页、指标、表格偏好…
│   ├── pages/                # 标准页型示例：工作台、列表、详情、设置、通知、登录注册
│   │   └── design-system/    # 组件总览（按类型拆分）
│   ├── test/                 # 全部测试：unit / components / e2e
│   └── index.css             # 语义 Token 的唯一来源
├── .githooks/pre-commit      # 提交前校验
└── .github/workflows/ci.yml  # CI：check + e2e
```

## 判断标准

新增代码前先回答一个问题：**这段代码服务谁？**

| 代码性质                                                         | 落点                 |
| ---------------------------------------------------------------- | -------------------- |
| 能给任意业务复用的通用控件                                       | `src/components/ui/` |
| 带后台语义但不绑定具体业务（表格、树、图表、设置面板、页型零件） | `src/components/`    |
| 纯函数 / 纯数据（无 React）                                      | `src/lib/`           |
| 只服务某个页面                                                   | `src/pages/`         |
| 外壳接线（路由、布局、Providers、菜单）                          | `src/app/`           |

需要 UI 状态时才用 Zustand，并且放在 `lib/` 里；**服务端数据不进 Zustand**，也不写进 `localStorage`。

## 命名约定

- 文件名 kebab-case：`data-table.tsx`、`password-strength.tsx`。
- 组件名 PascalCase，导出用命名导出（`export function DataTable`），不使用默认导出。
- 基础控件沿用 shadcn 风格：`src/components/ui/button.tsx` 导出 `Button` 与 `buttonVariants`。
- 测试文件与被测对象同名：`src/test/components/data-table.test.tsx` 对应 `src/components/data-table.tsx`。
- 文档页与组件分类页一一对应：`docs/components/data.md` ↔ `/design-system/data`。

## 新增一个页面要动哪几处

1. `src/pages/xxx-page.tsx` 写页面（用 `PageHeader` + 页面零件组装）。
2. `src/App.tsx` 注册路由，懒加载（`lazy(() => import(...))`）。
3. `src/app/navigation.ts` 把路径登记到 `navigation`，并在 `navigationGroups` 的 `paths` 里声明分组与顺序。
4. 文案进 `src/lib/i18n.ts`（中英同步），标题可以走 `pageTitles`。
5. 补测试：页面级交互放 `src/test/e2e/`，纯逻辑放 `src/test/unit/`。

如果页面是**后台菜单下发**的（不需要在前端登记菜单），跳过第 3 步：页面放在 `src/pages/` 下，
接口用组件键（例如 `reports-page`）引用它即可，见[动态菜单与权限](/guide/dynamic-menu)。

## 新增一个公共组件要动哪几处

模板要求"三件套"，缺一不可：

1. 组件本体：`src/components/`（通用控件放 `ui/`）。
2. **组件总览示例**：加到对应分类页（`src/pages/design-system/*.tsx`），可交互。
3. **至少一处真实落点**：标准页型里真的用上，而不是只存在于总览。
4. **测试**：`src/test/components/` 或 `src/test/unit/`，交互复杂再加 Playwright。
5. 文档：在 `docs/components/<分类>.md` 补一节（props 表 + 用法）。
