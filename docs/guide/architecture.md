---
description: 架构与决策：分层约定、关键决策的来由，以及已知取舍与待办。
---

# 架构与决策

这份文档记录"为什么这样分层"，避免后续改动（人或 Agent）把约定改散。

## 分层

```text
pages/            只负责业务内容与页面级状态
  design-system/  只做展示，不引入业务逻辑
components/       公共组件：外壳、页型零件、图表、设置面板
components/ui/    基础控件（button/input/table/dialog…），不含业务语义
lib/              纯逻辑：偏好、i18n、树、分页、指标、表格偏好、快捷键
app/              外壳接线：路由、布局、Providers、示例菜单
```

判断标准：**能给任意业务复用 → `components/ui`；带后台语义但无关具体业务 → `components`；纯函数/纯数据 → `lib`；只服务某个页面 → `pages`。**

## 关键决策

1. **颜色只走语义 Token**。业务代码使用 `bg-card`、`text-muted-foreground`、`text-success` 等工具类；语义色（success/warning/info/danger）与品牌色（brand-lime）分离，切换主题与配色时业务代码零改动。
2. **不引第三方组件库/图表库**。基础控件基于 Radix 原语自建，图表（折线/柱状/环形/迷你/热力/雷达/漏斗/甘特）自绘 SVG。理由：包体、主题一致性、可控的无障碍行为。
3. **偏好只存浏览器**，键名统一带 `VITE_APP_STORAGE_PREFIX`：主题、配色、无障碍、通知、顶栏操作顺序、侧栏宽度/圆角/动画/布局模式、表格列宽、筛选预设、快捷键。服务端数据不进 Zustand。
4. **设计层不碰业务**。认证、接口、权限、上传实现等通过 prop 注入：`uploader`、`onMove`、`loadChildren`、`onSignOut`、`systemContent`。
5. **组件总览是验收面**。新增/修改公共组件必须在对应分类页给出示例；`AGENTS.md` 要求"总览示例 + 真实落点 + 测试"三件套。
6. **i18n 单一入口**。`src/lib/i18n.ts` 导出 `zhResources`，`en: typeof zhResources` 由类型强制结构一致；`src/test/unit/i18n-keys.test.ts` 扫描代码里的字面量 key，拦住"用了但没登记"。

## 已知取舍与待办

| 项                         | 现状                                                       | 建议                                                                  |
| -------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------- |
| `noUncheckedIndexedAccess` | **已开启**（分批修复：lib → 组件 → 页面 → 测试，共 61 处） | 后续新增代码需按"索引可能为 undefined"处理                            |
| 虚拟滚动                   | 固定行高（实测首行高度自适应），与行内展开互斥             | 需要动态行高时改为按行测量 + 滚动锚定                                 |
| 树虚拟化                   | 节点 > 200 时按 36px 估算窗口                              | 同上                                                                  |
| 命令面板内容索引           | 上限 400 条，路由级缓存 + MutationObserver 失效            | 大页面可改为分片索引                                                  |
| 示例数据                   | 内存态，刷新重置                                           | 接真实接口时整体替换 `pages/sample-data.ts` 与 `lib/notifications.ts` |
