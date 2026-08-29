export function isMockApiMode() {
  return import.meta.env?.VITE_API_MODE?.toLocaleLowerCase() === 'mock'
}

export async function requestWithMockFallback<T>(
  request: () => Promise<T>,
  mock: () => T | Promise<T>,
): Promise<T> {
  return isMockApiMode() ? mock() : request()
}
