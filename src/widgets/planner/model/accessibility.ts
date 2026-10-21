import type { AccessibilityResponseDto } from '@/entities/travel/api'

export function accessibilityMessage(data?: AccessibilityResponseDto, isError = false) {
  if (isError || data?.status === 'UNAVAILABLE') return '지금은 확인할 수 없어요'
  if (data?.status === 'NOT_FOUND' || (!data?.status && data?.matched === false)) return '무장애 정보 없음'
}
