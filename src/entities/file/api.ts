import { apiClient, resolveApiAssetUrl } from '@/shared/libs/api-client'
import { requestWithMockFallback } from '@/shared/libs/api-fallback'

export { resolveApiAssetUrl } from '@/shared/libs/api-client'

const FILE_API_PATHS = {
  image: '/community/images',
} as const

export async function uploadImage(file: File): Promise<Record<string, string>> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.postForm<Record<string, string>>(FILE_API_PATHS.image, { file })
      return Object.fromEntries(Object.entries(data).map(([key, url]) => [key, resolveApiAssetUrl(url) ?? url]))
    },
    () => ({ imageUrl: typeof URL.createObjectURL === 'function' ? URL.createObjectURL(file) : '' }),
  )
}
