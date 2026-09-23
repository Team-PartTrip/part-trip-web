import { useEffect, useState } from 'react'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ThemeProvider } from 'styled-components'
import { getAccessToken } from '@/entities/session/api'
import { ACCESSIBILITY_SETTINGS_EVENT, readAccessibilitySettings } from '@/shared/libs/accessibility-settings'
import { appTheme, highContrastTheme } from '@/shared/theme'
import { LocationReporter } from '@/widgets/location-reporter'

export const Route = createFileRoute('/(app)/_authenticated')({
  beforeLoad: ({ location }) => {
    if (!getAccessToken()) {
      throw redirect({ search: { redirect: location.href }, to: '/login' })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const [settings, setSettings] = useState(readAccessibilitySettings)
  const [systemContrast, setSystemContrast] = useState(() => window.matchMedia('(prefers-contrast: more)').matches)

  useEffect(() => {
    const sync = () => setSettings(readAccessibilitySettings())
    window.addEventListener(ACCESSIBILITY_SETTINGS_EVENT, sync)
    return () => window.removeEventListener(ACCESSIBILITY_SETTINGS_EVENT, sync)
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(prefers-contrast: more)')
    const sync = () => setSystemContrast(query.matches)
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  const highContrast = settings.highContrast || systemContrast
  useEffect(() => {
    const body = document.body
    body.dataset.accessibilityRoot = ''
    body.dataset.textSize = settings.textSize
    body.dataset.highContrast = String(highContrast)
    return () => {
      delete body.dataset.accessibilityRoot
      delete body.dataset.textSize
      delete body.dataset.highContrast
    }
  }, [highContrast, settings.textSize])

  return <ThemeProvider theme={highContrast ? highContrastTheme : appTheme}>
    <div>
      <LocationReporter />
      <Outlet />
    </div>
  </ThemeProvider>
}
