import { createUnsupportedApiError } from '@/shared/libs/unsupported-api-error'

export type GuideCameraImageResponseDto = {
  imageId?: number
  analysisId?: number
}

export type PhotoAnalysisResponseDto = {
  analysisId?: number
  photoId?: number
  title?: string
  era?: string
  designation?: string
  overview?: string
  background?: string
  features?: string
  current_status?: string
  sourceName?: string
  sourceUrl?: string
  photoAnalysisAccuracyCategory?: string
  imageUrl?: string
  commTitle?: string
  commContent?: string
  photoDate?: string
}

export type GuideCameraUploadRequestDto = {
  travelId: string
  imageFile: File
  latitude: string
  longitude: string
}

export type GuideCameraRecordRequestDto = {
  photoId: number
  commTitle: string
  commContent: string
  photoDate: string
}

export async function uploadGuideCameraImage(
  payload: GuideCameraUploadRequestDto,
): Promise<GuideCameraImageResponseDto> {
  void payload
  throw createUnsupportedApiError('촬영 분석')
}

export async function getGuideCameraResult(_imageId: number): Promise<PhotoAnalysisResponseDto> {
  void _imageId
  throw createUnsupportedApiError('촬영 분석')
}

export async function saveGuideCameraRecord(
  payload: GuideCameraRecordRequestDto,
): Promise<PhotoAnalysisResponseDto> {
  void payload
  throw createUnsupportedApiError('촬영 분석')
}
