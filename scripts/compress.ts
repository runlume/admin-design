import { readFile, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { brotliCompress, constants, gzip } from 'node:zlib'
import { promisify } from 'node:util'
import type { Plugin } from 'vite'

const gzipAsync = promisify(gzip)
const brotliAsync = promisify(brotliCompress)

/** 值得预压缩的文本产物；图片、字体本身已经压过，再压只浪费时间。 */
const compressible = new Set(['.js', '.css', '.html', '.svg', '.json', '.txt', '.xml'])
/** 小于 1KB 的文件压不出多少，反而多一次请求判断。 */
const minSize = 1024

/**
 * 预压缩产物：静态托管（对象存储 / CDN）可以直接发 `.gz` / `.br`，省掉服务器实时压缩。
 * Node 自带 zlib 就能做，所以不引第三方压缩插件：需要在构建后扫产物、
 * 按扩展名过滤、控制最小体积，这点逻辑自己写更可控。
 */
export function precompress(formats: string): Plugin {
  const targets = formats
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item === 'gzip' || item === 'brotli')

  return {
    name: 'runlume:build-precompress',
    apply: 'build',
    async writeBundle(options, bundle) {
      const dir = options.dir
      if (!dir || targets.length === 0) return
      for (const item of Object.values(bundle)) {
        if (!compressible.has(extname(item.fileName))) continue
        const file = join(dir, item.fileName)
        const source = await readFile(file)
        if (source.byteLength < minSize) continue
        if (targets.includes('gzip')) {
          await writeFile(`${file}.gz`, await gzipAsync(source, { level: 9 }))
        }
        if (targets.includes('brotli')) {
          await writeFile(
            `${file}.br`,
            await brotliAsync(source, {
              params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
            }),
          )
        }
      }
    },
  }
}
