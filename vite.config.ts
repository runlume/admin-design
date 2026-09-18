import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import { brandBanner } from './scripts/banner.ts'
import { precompress } from './scripts/compress.ts'
import { analytics } from './scripts/analytics.ts'

export default defineConfig(({ mode }) => {
  // 环境变量在这里读一次：终端横幅（Node 侧）拿不到 import.meta.env。
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), '')
  return {
    plugins: [
      react(),
      tailwindcss(),
      ...brandBanner({ site: env.VITE_APP_PLATFORM_WEB_BASEURL }),
      precompress(env.VITE_BUILD_COMPRESS ?? ''),
      // 访问统计按部署注入：模板本身不带任何第三方计数器
      analytics(env.VITE_APP_ANALYTICS_URL),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // host: true 让终端同时打印 Local 与 Network 地址，手机或同网段设备可直接访问。
    server: { host: true, port: 3200, strictPort: true },
    preview: { host: 'localhost', port: 3201, strictPort: true },
    // sourcemap 按环境开关（测试环境默认开），排障与包体的折中。
    build: { sourcemap: env.VITE_BUILD_SOURCEMAP === 'true' },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/test/{unit,components}/**/*.{test,spec}.{ts,tsx}'],
      restoreMocks: true,
      clearMocks: true,
    },
  }
})
