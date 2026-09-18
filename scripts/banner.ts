import type { Plugin } from 'vite'
import { brandInfo } from '../src/lib/brand-info.ts'

const ansi = {
  reset: '\u001B[0m',
  bold: '\u001B[1m',
  dim: '\u001B[2m',
  underline: '\u001B[4m',
  green: '\u001B[32m',
  cyan: '\u001B[36m',
  magenta: '\u001B[35m',
  bgGreen: '\u001B[42m',
}

const colorEnabled =
  process.stdout.isTTY === true && process.env.NO_COLOR === undefined && process.env.TERM !== 'dumb'

function paint(text: string, codes: string[] = []): string {
  return colorEnabled && codes.length ? `${codes.join('')}${text}${ansi.reset}` : text
}

/** 终端显示宽度：中文、日文、全角标点占两列。 */
export function displayWidth(text: string): number {
  let width = 0
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0
    const wide =
      (code >= 0x1100 && code <= 0x115f) ||
      (code >= 0x2e80 && code <= 0xa4cf) ||
      (code >= 0xac00 && code <= 0xd7a3) ||
      (code >= 0xf900 && code <= 0xfaff) ||
      (code >= 0xfe30 && code <= 0xfe6f) ||
      (code >= 0xff00 && code <= 0xff60) ||
      (code >= 0xffe0 && code <= 0xffe6)
    width += wide ? 2 : 1
  }
  return width
}

type Segment = {
  text: string
  /** ANSI 片段；空数组表示不着色。 */
  codes?: string[]
}

/**
 * 横幅内容按行分段：留白、品牌名与版本各自独立，
 * 这样既能把品牌名做成背景块，也能参与整体宽度对齐。
 */
export function bannerSegments(site: string = brandInfo.site): Segment[][] {
  return [
    [
      { text: '由 ', codes: [ansi.green] },
      { text: `${brandInfo.name} ${brandInfo.product}`, codes: [ansi.bgGreen] },
      { text: ' 驱动', codes: [ansi.green, ansi.bold] },
    ],
    [],
    [{ text: site, codes: [ansi.cyan, ansi.underline] }],
    [],
    [
      { text: '当前使用：', codes: [ansi.green] },
      { text: brandInfo.edition, codes: [ansi.magenta, ansi.bold] },
    ],
  ]
}

function plainLines(site: string = brandInfo.site): string[] {
  return bannerSegments(site).map((line) => line.map((segment) => segment.text).join(''))
}

function boxWidth(site: string = brandInfo.site): number {
  return Math.max(...plainLines(site).map(displayWidth), 0) + 8
}

function center(text: string, inner: number): { left: string; right: string } {
  const padding = Math.max(0, inner - displayWidth(text))
  const left = Math.floor(padding / 2)
  return { left: ' '.repeat(left), right: ' '.repeat(padding - left) }
}

/** 横幅纯文本（含边框），不带颜色，便于单测断言与宽度校验。 */
export function renderBanner(site: string = brandInfo.site): string {
  const inner = boxWidth(site)
  const border = '═'.repeat(inner)
  const body = plainLines(site).map((text) => {
    const { left, right } = center(text, inner)
    return `║${left}${text}${right}║`
  })
  return [`╔${border}╗`, ...body, `╚${border}╝`, '', `  ${brandInfo.warning}`, ''].join('\n')
}

/**
 * 进程级标记：改 vite.config 或 scripts 会让 Vite 重启开发服务器，
 * 每次重启都会重新执行插件，横幅只在同一个进程里打一次。
 */
export const bannerPrintedFlag = Symbol.for('runlume.banner.printed')

export function printBanner(options: { force?: boolean; site?: string } = {}): void {
  // 单元测试进程里静默，避免污染测试输出（测试用 force 显式驱动）。
  if (!options.force && process.env.VITEST) return
  const site = options.site ?? brandInfo.site
  const holder = globalThis as typeof globalThis & { [bannerPrintedFlag]?: boolean }
  if (holder[bannerPrintedFlag]) return
  holder[bannerPrintedFlag] = true

  const inner = boxWidth(site)
  const plain = plainLines(site)
  const border = paint('═'.repeat(inner), [ansi.green])
  // 左右留白补在着色之外，避免 ANSI 转义序列被算进列宽。
  const body = bannerSegments(site).map((line, index) => {
    const { left, right } = center(plain[index] ?? '', inner)
    const painted = line.map((segment) => paint(segment.text, segment.codes)).join('')
    return `${paint('║', [ansi.green])}${left}${painted}${right}${paint('║', [ansi.green])}`
  })
  console.log(
    [
      '',
      `╔${border}╗`,
      ...body,
      `╚${border}╝`,
      '',
      `  ${paint(brandInfo.warning, [ansi.dim])}`,
      '',
    ].join('\n'),
  )
}

/**
 * 挂到 vite.config.ts 的插件：开发服务器启动与生产构建开始时各打一次横幅。
 */
export function brandBanner(options: { site?: string } = {}): Plugin[] {
  return [
    {
      name: 'runlume:brand-banner-serve',
      apply: 'serve',
      configureServer() {
        printBanner({ site: options.site })
      },
    },
    {
      name: 'runlume:brand-banner-build',
      apply: 'build',
      buildStart() {
        printBanner({ site: options.site })
      },
    },
  ]
}
