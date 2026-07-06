import { apiClient } from './client'
import { runtimeConfig } from '@shared/config'

export type LikeRequestDto = {
  targetType?: string
  targetId?: number
}

export type LikeResponseDto = {
  liked?: boolean
  likeCount?: number
}

const COMMON_API_PATHS = {
  like: '/community/likes',
  image: '/community/images',
  test: '/test',
} as const

export function resolveApiAssetUrl(url: string): string {
  if (!url.startsWith('/')) return url
  const apiBaseUrl = new URL(apiClient.defaults.baseURL ?? '/', window.location.origin)
  return new URL(url, apiBaseUrl.origin).href
}

export async function toggleLike(payload: LikeRequestDto): Promise<LikeResponseDto> {
  if (runtimeConfig.useMockApi) {
    return {
      liked: true,
      likeCount: 10,
    }
  }
  const { data } = await apiClient.post<LikeResponseDto>(COMMON_API_PATHS.like, payload)
  return data
}

export async function uploadImage(file: File): Promise<Record<string, string>> {
  if (runtimeConfig.useMockApi) {
    return {
      url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&auto=format&fit=crop'
    }
  }
  const { data } = await apiClient.postForm<Record<string, string>>(COMMON_API_PATHS.image, { file })
  return Object.fromEntries(Object.entries(data).map(([key, url]) => [key, resolveApiAssetUrl(url)]))
}

export async function getTest(): Promise<string> {
  if (runtimeConfig.useMockApi) {
    return 'Mock test endpoints works'
  }
  const { data } = await apiClient.get<string>(COMMON_API_PATHS.test)
  return data
}
