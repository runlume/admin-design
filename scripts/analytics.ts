import type { Plugin } from 'vite'

/** 计数器脚本地址；换服务商时只改这一处。 */
const scriptSrc = 'https://gc.zgo.at/count.js'

/**
 * 访问统计（可选）：只有配了 `VITE_APP_ANALYTICS_URL` 才把计数器脚本注入 `index.html`。
 *
 * 模板默认**不带任何第三方统计**，仓库里也不出现具体站点的计数器地址 ——
 * 需要统计的部署在构建时传这个变量（GoatCounter 的 `…/count` 端点即可）。
 * 单页应用切路由的补计在 `src/lib/analytics.ts`，同样只在脚本真的加载时才生效。
 */
export function analytics(endpoint: string | undefined): Plugin {
  const target = endpoint?.trim()
  return {
    name: 'runlume-analytics',
    transformIndexHtml(html) {
      if (!target) return html
      const tag = `    <script data-goatcounter="${target}" async src="${scriptSrc}"></script>\n`
      return html.replace('  </head>', `${tag}  </head>`)
    },
  }
}
