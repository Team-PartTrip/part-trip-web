export const MOCK_STORAGE_KEYS = {
  diagnosisResult: 'parttrip.demo.diagnosis-result',
} as const

export function waitForMock(delay = 450) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, delay)
  })
}

export function readMockStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeMockStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
  return value
}
