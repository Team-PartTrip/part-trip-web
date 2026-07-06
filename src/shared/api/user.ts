import { apiClient } from './client'

const USER_API_PATHS = {
  surveyComplete: '/users/survey-complete',
} as const

export async function completeSurvey(): Promise<string> {
  const { data } = await apiClient.post<string>(USER_API_PATHS.surveyComplete)
  return data
}
