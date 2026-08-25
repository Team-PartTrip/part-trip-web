import { apiClient } from '@/shared/libs/api-client'

const FILE_API_PATHS = {
  image: '/community/images',
} as const

export function resolveApiAssetUrl(url: string): string {
  if (!url.startsWith('/')) return url
  const apiBaseUrl = new URL(apiClient.defaults.baseURL ?? '/', window.location.origin)
  return new URL(url, apiBaseUrl.origin).href
}

export async function uploadImage(file: File): Promise<Record<string, string>> {
  const { data } = await apiClient.postForm<Record<string, string>>(FILE_API_PATHS.image, { file })
  return Object.fromEntries(Object.entries(data).map(([key, url]) => [key, resolveApiAssetUrl(url)]))
}
