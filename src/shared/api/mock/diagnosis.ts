import { MOCK_STORAGE_KEYS, readMockStorage, waitForMock, writeMockStorage } from './storage'

export type DiagnosisResult = {
  description: string
  highlights: readonly string[]
  title: string
}

export const defaultDiagnosisResult: DiagnosisResult = {
  description: '계획을 세우되 현지의 새로운 제안도 즐길 줄 아는 여행자입니다.',
  highlights: ['필수 일정은 미리 준비', '현지 문화와 음식에 적극적', '기록과 경험을 균형 있게 선택'],
  title: '균형 잡힌 탐험가',
}

export async function saveDiagnosisResultMock() {
  await waitForMock(300)
  return writeMockStorage(MOCK_STORAGE_KEYS.diagnosisResult, defaultDiagnosisResult)
}

export async function getDiagnosisResultMock() {
  await waitForMock(300)
  return readMockStorage(MOCK_STORAGE_KEYS.diagnosisResult, defaultDiagnosisResult)
}
