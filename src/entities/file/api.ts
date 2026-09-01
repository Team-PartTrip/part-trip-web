import { createUnsupportedApiError } from '@/shared/libs/unsupported-api-error'

export { resolveApiAssetUrl } from '@/shared/libs/api-client'

export async function uploadImage(file: File): Promise<Record<string, string>> {
  void file
  throw createUnsupportedApiError('커뮤니티 이미지')
}
