import { MOCK_STORAGE_KEYS, readMockStorage, waitForMock, writeMockStorage } from './storage'

export type Destination = {
  country: string
  countryInfoId?: number
  currency: string
  id: string
  imageUrl?: string
  name: string
}

export type TravelInfoSection = {
  id: 'population' | 'places' | 'food' | 'etiquette'
  items: readonly string[]
  summary: string
  title: string
}

export const travelInfoSections: readonly TravelInfoSection[] = [
  { id: 'population', title: '인구 구성', items: ['중국계 75%', '말레이계 14%', '인도계 9%'], summary: '여러 문화가 공존하는 다문화 국가입니다.' },
  { id: 'places', title: '관광 장소', items: ['마리나 베이', '가든스 바이 더 베이', '센토사'], summary: '도심과 자연을 하루 안에 함께 경험할 수 있습니다.' },
  { id: 'food', title: '대표 음식', items: ['칠리 크랩', '카야 토스트', '치킨 라이스'], summary: '호커 센터에서 다양한 현지 음식을 합리적으로 즐길 수 있습니다.' },
  { id: 'etiquette', title: '현지 에티켓', items: ['대중교통 내 음식 금지', '공공장소 청결 유지', '줄 서기 문화 존중'], summary: '공공질서와 청결 규칙을 지키는 것이 중요합니다.' },
]

export const todayTravelInfo = {
  exchange: { base: '1 SGD', converted: '1200 KRW' },
  phrase: { day: 1, local: 'Hello', translated: '안녕하세요' },
  weather: { city: 'Singapore', condition: 'Partly Cloudy', feelsLike: 32, temperature: 29 },
} as const

export const destinations: readonly Destination[] = [
  { country: '싱가포르', currency: 'SGD', id: 'singapore', name: '싱가포르' },
  { country: '베트남', currency: 'VND', id: 'da-nang', name: '다낭' },
  { country: '일본', currency: 'JPY', id: 'tokyo', name: '도쿄' },
  { country: '태국', currency: 'THB', id: 'bangkok', name: '방콕' },
]

export async function getDestinationsMock(query = '') {
  await waitForMock(250)
  const keyword = query.trim().toLocaleLowerCase()
  return keyword
    ? destinations.filter((destination) =>
        `${destination.name} ${destination.country}`.toLocaleLowerCase().includes(keyword),
      )
    : destinations
}

export async function getSelectedDestinationMock() {
  await waitForMock(200)
  return readMockStorage(MOCK_STORAGE_KEYS.selectedDestination, destinations[0])
}

export async function selectDestinationMock(destination: Destination) {
  await waitForMock(250)
  return writeMockStorage(MOCK_STORAGE_KEYS.selectedDestination, destination)
}
