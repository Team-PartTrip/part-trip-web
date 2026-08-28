import { apiClient } from '@/shared/libs/api-client'
import { requestWithMockFallback } from '@/shared/libs/api-fallback'

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

const GUIDE_CAMERA_API_PATHS = {
  images: '/guide-camera/images',
  result: (imageId: number) => `/guide-camera/results/${imageId}`,
  records: '/guide-camera/records',
} as const

const mockAnalyses = new Map<number, PhotoAnalysisResponseDto>()

function createMockAnalysis(imageId: number) {
  return {
    analysisId: imageId,
    background: '여행 사진을 바탕으로 생성한 임시 분석 결과입니다.',
    designation: '여행 장소',
    features: '장소의 주요 특징을 확인할 수 있습니다.',
    imageUrl: '',
    overview: '사진 분석 API가 연결되면 상세 설명이 표시됩니다.',
    photoId: imageId,
    sourceName: 'PartTrip 임시 분석',
    title: '분석된 여행 장소',
  }
}

function getMockAnalysis(imageId: number) {
  const analysis = mockAnalyses.get(imageId)
  if (!analysis) throw new Error('분석 결과를 찾을 수 없습니다.')
  return analysis
}

export async function uploadGuideCameraImage(
  payload: GuideCameraUploadRequestDto,
): Promise<GuideCameraImageResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.postForm<GuideCameraImageResponseDto>(
        GUIDE_CAMERA_API_PATHS.images,
        payload,
      )
      return data
    },
    () => {
      const imageId = Date.now()
      mockAnalyses.set(imageId, createMockAnalysis(imageId))
      return { analysisId: imageId, imageId }
    },
  )
}

export async function getGuideCameraResult(imageId: number): Promise<PhotoAnalysisResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<PhotoAnalysisResponseDto>(GUIDE_CAMERA_API_PATHS.result(imageId))
      return data
    },
    () => getMockAnalysis(imageId),
  )
}

export async function saveGuideCameraRecord(
  payload: GuideCameraRecordRequestDto,
): Promise<PhotoAnalysisResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.post<PhotoAnalysisResponseDto>(
        GUIDE_CAMERA_API_PATHS.records,
        payload,
      )
      return data
    },
    () => {
      const saved = { ...getMockAnalysis(payload.photoId), commContent: payload.commContent, commTitle: payload.commTitle, photoDate: payload.photoDate }
      mockAnalyses.set(payload.photoId, saved)
      return saved
    },
  )
}
