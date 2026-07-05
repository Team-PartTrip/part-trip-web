import recordCityUrl from '@shared/assets/record-city.jpg'
import recordEuropeUrl from '@shared/assets/record-europe.jpg'
import recordSeaUrl from '@shared/assets/record-sea.jpg'
import recordSingaporeUrl from '@shared/assets/record-singapore.jpg'

import {
  MOCK_STORAGE_KEYS,
  readMockStorage,
  waitForMock,
  writeMockStorage,
} from './storage'

export type TravelRecordSchedule = {
  day: string
  items: readonly string[]
}

export type TravelLogEntry = {
  description: string
  id: string
  imageUrl: string
  recordedAt: string
  title: string
}

export type TravelRecord = {
  destination: string
  endDate: string
  id: string
  imageUrl: string
  memo: string
  schedule: readonly TravelRecordSchedule[]
  startDate: string
  title: string
}

export type CreateTravelRecordRequest = Pick<
  TravelRecord,
  'destination' | 'endDate' | 'memo' | 'startDate' | 'title'
>

export const seedTravelRecords: readonly TravelRecord[] = [
  {
    destination: '싱가포르',
    endDate: '2026-06-12',
    id: 'singapore-2026',
    imageUrl: recordEuropeUrl,
    memo: '습한 날씨였지만 야경과 음식이 모두 좋았던 여행. 다음에는 센토사에서 하루 더 머물고 싶다.',
    schedule: [
      { day: 'DAY 1', items: ['마리나 베이 체크인', '멀라이언 파크 산책'] },
      { day: 'DAY 2', items: ['가든스 바이 더 베이', '슈퍼트리 라이트쇼'] },
      { day: 'DAY 3', items: ['차이나타운', '호커 센터 칠리크랩'] },
    ],
    startDate: '2026-06-08',
    title: '2026 여름의 싱가포르 🇸🇬',
  },
  {
    destination: '프랑스 · 스위스 · 이탈리아',
    endDate: '2024-06-27',
    id: 'europe-backpack',
    imageUrl: recordSeaUrl,
    memo: '한 달 동안 기차로 이동하며 작은 도시들을 천천히 기록한 배낭여행.',
    schedule: [{ day: 'WEEK 1', items: ['파리', '리옹', '인터라켄'] }],
    startDate: '2024-05-27',
    title: '유럽 한달 배낭여행 🎒',
  },
  {
    destination: '괌',
    endDate: '2025-07-14',
    id: 'guam-2025',
    imageUrl: recordCityUrl,
    memo: '바다에서 쉬고 드라이브하며 보낸 여름휴가.',
    schedule: [{ day: 'DAY 1', items: ['투몬 비치', '선셋 드라이브'] }],
    startDate: '2025-06-30',
    title: '괌으로 가자 !!!!!',
  },
  {
    destination: '도쿄, 일본',
    endDate: '2025-12-30',
    id: 'tokyo-daytrip',
    imageUrl: recordSingaporeUrl,
    memo: '혼자 걷고 먹고 쇼핑하며 꽉 채운 당일치기.',
    schedule: [{ day: 'DAY 1', items: ['시부야', '오모테산도', '도쿄역'] }],
    startDate: '2025-12-30',
    title: '혼자 일본 당일치기',
  },
]

export const seedTravelLogEntries: readonly TravelLogEntry[] = [
  {
    description:
      '멋있는 싱가포르의 라이트쇼를 보았다. 내가 아는 익숙한 해리포터 노래가 나와서 굉장히 흥미로웠다...',
    id: 'supertree-lightshow',
    imageUrl: recordSingaporeUrl,
    recordedAt: '오후 19:40 · 2024.05.12',
    title: '슈퍼트리 라이트쇼',
  },
  {
    description:
      '보드 등 다양한 수상레저를 즐겼다. 아무리 더운 나라여도 바다는 시원했다...',
    id: 'singapore-blue-sea',
    imageUrl: recordSingaporeUrl,
    recordedAt: '오후 19:40 · 2024.05.12',
    title: '싱가포르의 푸른 바다가',
  },
  {
    description:
      '이렇게 높은 대관람차는 처음이다. 엄청 높았고, 야경이 훌륭했다...',
    id: 'flyer-review',
    imageUrl: recordSingaporeUrl,
    recordedAt: '오후 19:40 · 2024.05.12',
    title: '플라이어 탑승 후기',
  },
]

const readRecords = () =>
  readMockStorage<readonly TravelRecord[]>(
    MOCK_STORAGE_KEYS.travelRecords,
    seedTravelRecords,
  )

export async function getTravelRecordMock(recordId: string) {
  await waitForMock(250)
  return readRecords().find((record) => record.id === recordId) ?? null
}

export async function createTravelRecordMock(
  request: CreateTravelRecordRequest,
) {
  await waitForMock(450)
  const records = readRecords()
  const record: TravelRecord = {
    ...request,
    id: `record-${Date.now()}`,
    imageUrl: recordSingaporeUrl,
    schedule: [{ day: 'DAY 1', items: ['새로운 여행 기록을 시작했습니다.'] }],
  }

  writeMockStorage(MOCK_STORAGE_KEYS.travelRecords, [record, ...records])
  return record
}
