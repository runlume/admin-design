import { defineConfig } from 'vitepress'

/**
 * 文档站配置。
 *
 * 选 VitePress 的理由：内容就是 Markdown（业务同学改 md 就能发布，不用碰 React），
 * 导航 / 侧栏 / 目录大纲 / 深色模式 / 本地全文搜索都是主题内置的，
 * 构建产物是纯静态文件，且 `docs:build` 会顺手做死链检查。
 *
 * 只把 vitepress 放在 devDependencies：它不进应用产物，`pnpm build` 不会带上文档站。
 */
const guideSidebar = [
  {
    text: '指南',
    items: [
      { text: '介绍', link: '/guide/intro' },
      { text: '准备工作', link: '/guide/ready' },
      { text: '目录结构', link: '/guide/structure' },
      { text: '作为模板使用', link: '/guide/start' },
      { text: '布局外壳', link: '/guide/layout' },
      { text: '动态菜单与权限', link: '/guide/dynamic-menu' },
      { text: '主题与配色', link: '/guide/theme' },
      { text: '国际化', link: '/guide/i18n' },
      { text: '无障碍', link: '/guide/accessibility' },
      { text: '常见问题', link: '/guide/q-a' },
    ],
  },
  {
    text: '组件',
    items: [
      { text: '组件总览', link: '/components/' },
      { text: '基础控件', link: '/components/basic' },
      { text: '表单与选择', link: '/components/form' },
      { text: '数据展示', link: '/components/data' },
      { text: '反馈与浮层', link: '/components/feedback' },
      { text: '导航与流程', link: '/components/navigation' },
      { text: '指标与图表', link: '/components/metrics' },
      { text: '图标', link: '/components/icons' },
      { text: '主题与设置', link: '/components/theme' },
      { text: '标准页型', link: '/components/pages' },
    ],
  },
  {
    text: '工程',
    items: [
      { text: '代码规范', link: '/guide/coding-standard' },
      { text: '测试与自证', link: '/guide/testing' },
      { text: '构建与部署', link: '/guide/deploy' },
      { text: '架构与决策', link: '/guide/architecture' },
      { text: 'Agent 工作流', link: '/guide/agent-workflow' },
      { text: '开源协议', link: '/guide/license' },
    ],
  },
]

/** 文档站的正式域名：canonical、sitemap、分享信息都从这里取。 */
const siteOrigin = 'https://adoc.runlume.app'
/**
 * 站点全名：品牌 + 品类 + 角色词。`<title>`、og / twitter 标题与结构化数据都取这一份，
 * 不要各写各的 —— 微信分享卡片取的是 `<title>`，其它渠道取 `og:title`，两边不一致就会出现两套标题。
 */
const siteTitle = 'Runlume 标准后台设计 · 文档'
const defaultDescription =
  'Runlume 标准后台设计文档：语义 Token、三种布局外壳、九类组件页与标准页型，含动态菜单、前端权限、主题与工程约定。'

/** 访问统计（可选）：构建时传了端点才挂脚本，模板默认不带第三方统计。 */
const analyticsEndpoint = process.env.VITE_APP_ANALYTICS_URL?.trim()

export default defineConfig({
  lang: 'zh-CN',
  title: siteTitle,
  // 子页标题拼成「页面名 · Runlume 标准后台设计 · 文档」；首页在 index.md 里用 titleTemplate: false 关掉后缀，避免品牌名重复两遍
  titleTemplate: `:title · ${siteTitle}`,
  description:
    'Runlume 标准后台设计：语义 Token、布局外壳、公共组件、标准页型与组件总览，业务系统直接复制这一份。',
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/brand/mark.svg' }],
    ['meta', { name: 'theme-color', content: '#086c6a' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1' }],
    ['meta', { property: 'og:site_name', content: 'Runlume' }],
    ['meta', { property: 'og:type', content: 'article' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'og:image', content: `${siteOrigin}/og/adoc.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:image', content: `${siteOrigin}/og/adoc.png` }],
    // 访问统计。整页加载的计数由脚本自己完成，切路由的计数在 theme/index.ts 里补。
    ...(analyticsEndpoint
      ? [
          [
            'script',
            {
              'data-goatcounter': analyticsEndpoint,
              async: '',
              src: 'https://gc.zgo.at/count.js',
            },
          ],
        ]
      : []),
  ],
  // 单语言站点：canonical 与分享信息逐页生成，附上 TechArticle + 面包屑结构化数据
  transformHead({ pageData }) {
    const relative = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    const path = `/${relative}`.replace(/\/$/, '/')
    const url = `${siteOrigin}${path === '/' ? '/' : path}`
    const pageTitle = pageData.title || siteTitle
    const description = pageData.description || defaultDescription
    // 与 `<title>` 保持同一句话；首页没有页面名，直接用站点全名
    const shareTitle = pageData.title ? `${pageData.title} · ${siteTitle}` : siteTitle
    const segments = path.split('/').filter(Boolean)
    const graph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://runlume.app/#organization',
          name: 'Runlume',
          url: 'https://runlume.app',
        },
        {
          '@type': 'WebSite',
          '@id': `${siteOrigin}/#website`,
          url: `${siteOrigin}/`,
          name: siteTitle,
          inLanguage: 'zh-CN',
          publisher: { '@id': 'https://runlume.app/#organization' },
        },
        {
          '@type': 'TechArticle',
          headline: pageTitle,
          description,
          url,
          inLanguage: 'zh-CN',
          isPartOf: { '@id': `${siteOrigin}/#website` },
          license: 'https://github.com/runlume/admin-design/blob/main/LICENSE',
          publisher: { '@id': 'https://runlume.app/#organization' },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: '文档首页', item: `${siteOrigin}/` },
            ...segments.map((segment, index) => ({
              '@type': 'ListItem',
              position: index + 2,
              name: index === segments.length - 1 ? pageTitle : segment,
              item: `${siteOrigin}/${segments.slice(0, index + 1).join('/')}`,
            })),
          ],
        },
      ],
    }
    return [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:title', content: shareTitle }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { name: 'twitter:title', content: shareTitle }],
      ['meta', { name: 'twitter:description', content: description }],
      ['script', { type: 'application/ld+json' }, JSON.stringify(graph)],
    ]
  },
  sitemap: { hostname: siteOrigin },
  // 文档站单独占用一个端口，避免和应用开发服务器（3200）冲突。
  vite: {
    server: { port: 3210, strictPort: true },
    preview: { port: 3211, strictPort: true },
  },
  markdown: {
    lineNumbers: true,
    theme: { light: 'github-light', dark: 'github-dark' },
  },
  themeConfig: {
    // 深浅模式各用一份方标，与控制台 Brand 组件取的是同一批资源。
    logo: { light: '/brand/mark.svg', dark: '/brand/mark-dark.svg' },
    siteTitle: '标准后台设计',
    nav: [
      // 主页指向宣传页：文档站只讲组件与工程约定
      { text: '主页', link: 'https://adesign.runlume.app' },
      {
        text: '指南',
        link: '/guide/intro',
        activeMatch:
          '/guide/(intro|ready|structure|start|layout|dynamic-menu|theme|i18n|accessibility|q-a)',
      },
      { text: '组件', link: '/components/', activeMatch: '/components/' },
      {
        text: '工程',
        link: '/guide/coding-standard',
        activeMatch: '/guide/(coding-standard|testing|deploy|architecture|agent-workflow|license)',
      },
      { text: '在线演示', link: 'https://ago.runlume.app/' },
    ],
    sidebar: guideSidebar,
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除条件',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/runlume/admin-design' }],
    darkModeSwitchLabel: '深浅模式',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部',
    externalLinkIcon: true,
    footer: {
      message: '语义 Token · 布局外壳 · 公共组件 · 标准页型',
      copyright: 'Runlume 标准后台设计 · MIT License',
    },
  },
})
