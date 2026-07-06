import { apiClient } from './client'
import { runtimeConfig } from '@shared/config'

const USER_API_PATHS = {
  surveyComplete: '/users/survey-complete',
} as const

export async function completeSurvey(): Promise<string> {
  if (runtimeConfig.useMockApi) return '설문이 완료 처리되었습니다.'
  const { data } = await apiClient.post<string>(USER_API_PATHS.surveyComplete)
  return data
}
