import assert from 'node:assert/strict'
import test from 'node:test'

import { ACCESSIBILITY_SETTINGS_EVENT, parseAccessibilitySettings, readAccessibilitySettings, saveAccessibilitySettings } from '../src/shared/libs/accessibility-settings.ts'

test('접근성 설정 파서는 저장되지 않았거나 깨진 값에 기본값을 적용한다', () => {
  assert.deepEqual(parseAccessibilitySettings(null), { textSize: 'normal', highContrast: false })
  assert.deepEqual(parseAccessibilitySettings('{'), { textSize: 'normal', highContrast: false })
})

test('접근성 설정은 유효한 글자 크기와 고대비 값만 유지한다', () => {
  assert.deepEqual(parseAccessibilitySettings(JSON.stringify({ textSize: 'larger', highContrast: true })), {
    textSize: 'larger', highContrast: true,
  })
  assert.deepEqual(parseAccessibilitySettings(JSON.stringify({ textSize: 'giant', highContrast: 1 })), {
    textSize: 'normal', highContrast: false,
  })
})

test('접근성 설정은 저장 후 다시 읽히고 같은 화면에 변경 이벤트를 보낸다', () => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const stored = new Map<string, string>()
  const events: string[] = []
  const browserWindow = {
    localStorage: {
      getItem: (key: string) => stored.get(key) ?? null,
      setItem: (key: string, value: string) => stored.set(key, value),
    },
    dispatchEvent: (event: Event) => { events.push(event.type); return true },
  } as unknown as Window
  Object.defineProperty(globalThis, 'window', { configurable: true, value: browserWindow })

  try {
    saveAccessibilitySettings({ textSize: 'larger', highContrast: true })
    assert.deepEqual(readAccessibilitySettings(), { textSize: 'larger', highContrast: true })
    assert.deepEqual(events, [ACCESSIBILITY_SETTINGS_EVENT])
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow)
    else Reflect.deleteProperty(globalThis, 'window')
  }
})
