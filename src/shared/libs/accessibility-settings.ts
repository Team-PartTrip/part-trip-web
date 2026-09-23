export type AccessibilitySettings = {
  textSize: 'normal' | 'large' | 'larger'
  highContrast: boolean
}

export const ACCESSIBILITY_SETTINGS_EVENT = 'parttrip:accessibility-settings'

const STORAGE_KEY = 'parttrip.accessibility-settings'
const defaultSettings: AccessibilitySettings = { textSize: 'normal', highContrast: false }

export function parseAccessibilitySettings(value: string | null): AccessibilitySettings {
  if (!value) return defaultSettings
  try {
    const parsed: unknown = JSON.parse(value)
    if (typeof parsed !== 'object' || parsed === null) return defaultSettings
    const settings = parsed as Record<string, unknown>
    return {
      highContrast: settings.highContrast === true,
      textSize: settings.textSize === 'large' || settings.textSize === 'larger' ? settings.textSize : 'normal',
    }
  } catch {
    return defaultSettings
  }
}

export function readAccessibilitySettings(): AccessibilitySettings {
  return parseAccessibilitySettings(window.localStorage.getItem(STORAGE_KEY))
}

export function saveAccessibilitySettings(settings: AccessibilitySettings) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  window.dispatchEvent(new Event(ACCESSIBILITY_SETTINGS_EVENT))
}
