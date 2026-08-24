import { apiClient } from './client'

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
  travelId: number
  imageFile: File
  latitude: number
  longitude: number
}

export type GuideCameraRecordRequestDto = {
  photoId: number
  commTitle: string
  commContent: string
  photoDate: string
}

const GUIDE_CAMERA_API_PATHS = {
  images: '/guide-camera/images',
  result: (imageId: number) => `/guide-camera/results/${imageId}`,
  records: '/guide-camera/records',
} as const

export async function uploadGuideCameraImage(
  payload: GuideCameraUploadRequestDto,
): Promise<GuideCameraImageResponseDto> {
  const { data } = await apiClient.postForm<GuideCameraImageResponseDto>(
    GUIDE_CAMERA_API_PATHS.images,
    payload,
  )
  return data
}

export async function getGuideCameraResult(imageId: number): Promise<PhotoAnalysisResponseDto> {
  const { data } = await apiClient.get<PhotoAnalysisResponseDto>(GUIDE_CAMERA_API_PATHS.result(imageId))
  return data
}

export async function saveGuideCameraRecord(
  payload: GuideCameraRecordRequestDto,
): Promise<PhotoAnalysisResponseDto> {
  const { data } = await apiClient.post<PhotoAnalysisResponseDto>(
    GUIDE_CAMERA_API_PATHS.records,
    payload,
  )
  return data
}
