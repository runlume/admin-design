// oxlint-disable react/only-export-components -- the application root lives beside the render call
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useTranslation } from 'react-i18next'
import { App } from '@/App'
import { printBrandBanner } from '@/lib/brand-console'
import { AdminUiProvider } from '@/lib/use-ui-translation'
import '@/index.css'

printBrandBanner()

function Root() {
  const { i18n, t } = useTranslation()
  return (
    <AdminUiProvider language={i18n.language} translate={(key, options) => t(key, options)}>
      <App />
    </AdminUiProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
