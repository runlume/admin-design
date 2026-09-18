/**
 * 示例数据。仅用于演示标准页型的结构与交互，接入真实接口时应整体删除，
 * 不要把它当作业务模型沉淀。
 */
export type Customer = {
  id: string
  name: string
  owner: string
  phone: string
  email: string
  status: 'ACTIVE' | 'PENDING' | 'DISABLED'
  createdAt: string
  note?: string
}

export type Order = {
  id: string
  customerId: string
  amount: number
  status: 'PENDING' | 'PROCESSING' | 'ACTIVE' | 'FAILED'
  createdAt: string
}

export const customers: Customer[] = [
  {
    id: 'CUS-1001',
    name: '云和智能制造',
    owner: '张伟',
    phone: '13800000001',
    email: 'ops@yunhe.example',
    status: 'ACTIVE',
    createdAt: '2026-08-02',
  },
  {
    id: 'CUS-1002',
    name: '海通供应链',
    owner: '李娜',
    phone: '13800000002',
    email: 'it@haitong.example',
    status: 'ACTIVE',
    createdAt: '2026-08-05',
  },
  {
    id: 'CUS-1003',
    name: '明远医疗器械',
    owner: '王强',
    phone: '13800000003',
    email: 'admin@mingyuan.example',
    status: 'PENDING',
    createdAt: '2026-08-11',
  },
  {
    id: 'CUS-1004',
    name: '锦程教育集团',
    owner: '陈静',
    phone: '13800000004',
    email: 'pm@jincheng.example',
    status: 'ACTIVE',
    createdAt: '2026-08-14',
  },
  {
    id: 'CUS-1005',
    name: '北极星数据',
    owner: '刘洋',
    phone: '13800000005',
    email: 'dev@beijixing.example',
    status: 'DISABLED',
    createdAt: '2026-08-19',
  },
  {
    id: 'CUS-1006',
    name: '优行新能源',
    owner: '赵敏',
    phone: '13800000006',
    email: 'energy@youxing.example',
    status: 'ACTIVE',
    createdAt: '2026-08-22',
  },
  {
    id: 'CUS-1007',
    name: '立信会计师事务所',
    owner: '孙涛',
    phone: '13800000007',
    email: 'audit@lixin.example',
    status: 'PENDING',
    createdAt: '2026-08-27',
  },
  {
    id: 'CUS-1008',
    name: '长风文化传媒',
    owner: '周琳',
    phone: '13800000008',
    email: 'media@changfeng.example',
    status: 'ACTIVE',
    createdAt: '2026-09-01',
  },
  {
    id: 'CUS-1009',
    name: '德成物流',
    owner: '吴昊',
    phone: '13800000009',
    email: 'logistics@decheng.example',
    status: 'ACTIVE',
    createdAt: '2026-09-04',
  },
  {
    id: 'CUS-1010',
    name: '恒安保险经纪',
    owner: '郑爽',
    phone: '13800000010',
    email: 'risk@hengan.example',
    status: 'DISABLED',
    createdAt: '2026-09-08',
  },
  {
    id: 'CUS-1011',
    name: '清源环保科技',
    owner: '何磊',
    phone: '13800000011',
    email: 'green@qingyuan.example',
    status: 'ACTIVE',
    createdAt: '2026-09-10',
  },
  {
    id: 'CUS-1012',
    name: '启元机器人',
    owner: '马超',
    phone: '13800000012',
    email: 'robot@qiyuan.example',
    status: 'PENDING',
    createdAt: '2026-09-12',
  },
]

export const orders: Order[] = [
  {
    id: 'ORD-24001',
    customerId: 'CUS-1001',
    amount: 128000,
    status: 'ACTIVE',
    createdAt: '2026-09-01',
  },
  {
    id: 'ORD-24002',
    customerId: 'CUS-1001',
    amount: 46000,
    status: 'PROCESSING',
    createdAt: '2026-09-06',
  },
  {
    id: 'ORD-24003',
    customerId: 'CUS-1002',
    amount: 88000,
    status: 'ACTIVE',
    createdAt: '2026-09-02',
  },
  {
    id: 'ORD-24004',
    customerId: 'CUS-1003',
    amount: 15600,
    status: 'PENDING',
    createdAt: '2026-09-03',
  },
  {
    id: 'ORD-24005',
    customerId: 'CUS-1004',
    amount: 132000,
    status: 'ACTIVE',
    createdAt: '2026-09-05',
  },
  {
    id: 'ORD-24006',
    customerId: 'CUS-1004',
    amount: 9800,
    status: 'FAILED',
    createdAt: '2026-09-07',
  },
]

export const statusOptions = ['ACTIVE', 'PENDING', 'DISABLED'] as const

/**
 * 操作日志示例数据（给动态路由页面 /audit 用）。
 */
export type AuditLog = {
  id: string
  action: string
  operator: string
  target: string
  createdAt: string
}

export const auditLogs: AuditLog[] = [
  {
    id: 'LOG-2001',
    action: '登录控制台',
    operator: '张伟',
    target: 'demo@runlume.local',
    createdAt: '2026-09-17 09:12',
  },
  {
    id: 'LOG-2002',
    action: '更新客户资料',
    operator: '李娜',
    target: 'CUS-1001 云和智能制造',
    createdAt: '2026-09-17 09:31',
  },
  {
    id: 'LOG-2003',
    action: '导出订单',
    operator: '王强',
    target: '2026-09 订单',
    createdAt: '2026-09-17 10:02',
  },
  {
    id: 'LOG-2004',
    action: '停用账号',
    operator: '陈静',
    target: 'ops@haidong.example',
    createdAt: '2026-09-17 10:40',
  },
]

/**
 * 后台菜单示例。真实项目换成 `GET /api/v1/me/menus` 的响应即可，
 * 字段说明与容错规则见 `src/lib/remote-menu.ts`。
 *
 * 演示四件事：
 * - 层级菜单：「经营分析」是容器，下面挂「报表中心」与「操作日志」；
 * - 权限继承：父级要求 `insight:view`，子项不写权限就跟随父级；
 * - 权限过滤：「操作日志」自己要求 `audit:view`，示例会话没有 → 菜单不出现、直接访问落 403；
 * - 外链与打开方式：官网、GitHub 仓库与「经营分析」同级，都是新窗口打开的站外链接；
 *   `/tools/docs` 用 iframe 内嵌文档站（跑 `pnpm docs:dev` 后可见，站点不允许内嵌时会空白）。
 */
export const remoteMenuSample = {
  groups: [{ id: 'dynamic', labelKey: 'sample.navGroupDynamic', icon: 'braces', order: 1 }],
  items: [
    {
      path: '/insight',
      labelKey: 'sample.navAnalytics',
      icon: 'chart-pie',
      group: 'dynamic',
      order: 1,
      permission: 'example.admin.insight.view',
      children: [
        {
          path: '/reports',
          labelKey: 'sample.navReports',
          icon: 'chart-column',
          component: 'reports-page',
          order: 1,
        },
        {
          path: '/audit',
          labelKey: 'sample.navAudit',
          icon: 'scroll-text',
          component: 'audit-page',
          order: 2,
          permission: 'example.admin.audit.view',
        },
      ],
    },
    // 外链与「经营分析」同级：都挂在动态菜单分组下
    {
      path: '/official-site',
      labelKey: 'sample.navOfficialSite',
      icon: 'globe',
      group: 'dynamic',
      order: 2,
      external: 'https://runlume.app',
      target: 'blank',
    },
    {
      path: '/repository',
      labelKey: 'githubRepo',
      icon: 'github',
      group: 'dynamic',
      order: 3,
      external: 'https://github.com/runlume/admin-design',
      target: 'blank',
    },
    {
      // 指向文档站：iframe 只能内嵌"允许被内嵌"的站点，runlume.app 自己发了
      // X-Frame-Options: DENY，所以示例用文档站演示。
      path: '/tools/docs',
      label: '文档（iframe）',
      icon: 'file-text',
      group: 'dynamic',
      order: 4,
      external: 'https://adoc.runlume.app',
      target: 'iframe',
    },
  ],
}

export type OrganizationUnit = {
  id: string
  parentId: string | null
  name: string
  kind: 'COMPANY' | 'DEPARTMENT' | 'TEAM'
  members: number
  status: 'ACTIVE' | 'DISABLED'
  sortOrder: number
}

/** 层级示例数据，用于演示列表树与表格树。 */
export const organizationUnits: OrganizationUnit[] = [
  {
    id: 'OU-1',
    parentId: null,
    name: '云和智能制造',
    kind: 'COMPANY',
    members: 128,
    status: 'ACTIVE',
    sortOrder: 1,
  },
  {
    id: 'OU-11',
    parentId: 'OU-1',
    name: '研发中心',
    kind: 'DEPARTMENT',
    members: 64,
    status: 'ACTIVE',
    sortOrder: 1,
  },
  {
    id: 'OU-111',
    parentId: 'OU-11',
    name: '平台组',
    kind: 'TEAM',
    members: 18,
    status: 'ACTIVE',
    sortOrder: 1,
  },
  {
    id: 'OU-112',
    parentId: 'OU-11',
    name: '应用组',
    kind: 'TEAM',
    members: 26,
    status: 'ACTIVE',
    sortOrder: 2,
  },
  {
    id: 'OU-113',
    parentId: 'OU-11',
    name: '测试组',
    kind: 'TEAM',
    members: 12,
    status: 'DISABLED',
    sortOrder: 3,
  },
  {
    id: 'OU-12',
    parentId: 'OU-1',
    name: '销售中心',
    kind: 'DEPARTMENT',
    members: 42,
    status: 'ACTIVE',
    sortOrder: 2,
  },
  {
    id: 'OU-121',
    parentId: 'OU-12',
    name: '华东大区',
    kind: 'TEAM',
    members: 22,
    status: 'ACTIVE',
    sortOrder: 1,
  },
  {
    id: 'OU-122',
    parentId: 'OU-12',
    name: '华南大区',
    kind: 'TEAM',
    members: 14,
    status: 'ACTIVE',
    sortOrder: 2,
  },
  {
    id: 'OU-2',
    parentId: null,
    name: '海通供应链',
    kind: 'COMPANY',
    members: 76,
    status: 'ACTIVE',
    sortOrder: 2,
  },
  {
    id: 'OU-21',
    parentId: 'OU-2',
    name: '运营部',
    kind: 'DEPARTMENT',
    members: 31,
    status: 'ACTIVE',
    sortOrder: 1,
  },
  {
    id: 'OU-22',
    parentId: 'OU-2',
    name: '财务部',
    kind: 'DEPARTMENT',
    members: 12,
    status: 'DISABLED',
    sortOrder: 2,
  },
]
