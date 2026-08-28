import axios from 'axios'

const mockFallbackStatuses = new Set([404, 405, 501])

type MockFallbackOptions = {
  mockFirst?: boolean
}

export function isMockApiMode() {
  return import.meta.env?.VITE_API_MODE?.toLocaleLowerCase() === 'mock'
}

export async function requestWithMockFallback<T>(
  request: () => Promise<T>,
  mock: () => T | Promise<T>,
  options?: MockFallbackOptions,
): Promise<T> {
  if (isMockApiMode() || options?.mockFirst) return mock()

  try {
    return await request()
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined
    if (status != null && mockFallbackStatuses.has(status)) return mock()
    throw error
  }
}
