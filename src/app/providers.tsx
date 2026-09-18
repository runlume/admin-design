import type { ReactNode } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import '@/lib/i18n'

/** 主题、提示与浮层 Provider。业务系统新增全局 Provider 时叠加在这里。 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {/* 提示延迟 300ms：过短容易误触，过长会显得没响应。 */}
      <TooltipProvider delayDuration={300}>
        {children}
        <Toaster position="top-right" closeButton />
      </TooltipProvider>
    </ThemeProvider>
  )
}
