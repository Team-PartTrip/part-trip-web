import type {
  CountryInfoResponseDto,
  DdayResponseDto,
  FestivalResponseDto,
  TourPlaceResponseDto,
} from './api'

export const mockCountries: CountryInfoResponseDto[] = [
  { countryInfoId: 1, countryName: '일본', cityName: '오사카', summary: '도시와 미식이 함께하는 여행지' },
  { countryInfoId: 2, countryName: '태국', cityName: '방콕', summary: '시장과 사원이 있는 도시' },
  { countryInfoId: 3, countryName: '대만', cityName: '타이베이', summary: '골목과 야시장을 즐기는 여행지' },
  { countryInfoId: 4, countryName: '베트남', cityName: '다낭', summary: '바다와 휴식을 위한 여행지' },
]

export const mockCountrySearchAliases: Record<number, string[]> = {
  1: ['japan', 'osaka'],
  2: ['thailand', 'bangkok'],
  3: ['taiwan', 'taipei'],
  4: ['vietnam', 'danang', 'da nang'],
}

export const mockTourPlaces: TourPlaceResponseDto[] = [
  { category: '맛집', address: '도톤보리', rating: 4.6, placeName: '이치란 라멘', description: '오사카에서 즐기는 대표 라멘' },
  { category: '맛집', address: '신세카이', rating: 4.4, placeName: '쿠시카츠 다루마', description: '바삭한 쿠시카츠 전문점' },
  { category: '맛집', address: '난바', rating: 4.7, placeName: '하리주 그릴', description: '오래된 오사카식 그릴' },
  { category: '맛집', address: '도톤보리', rating: 4.5, placeName: '미즈노 오코노미야키', description: '현지식 오코노미야키' },
  { category: '명소', address: '주오구', rating: 4.7, placeName: '오사카성', description: '오사카를 대표하는 역사 명소' },
  { category: '숙소', address: '신사이바시', rating: 4.3, placeName: '호텔 닛코 오사카', description: '도심 이동이 편한 숙소' },
  { category: '카페', address: '난바', rating: 4.5, placeName: '리로 커피 로스터스', description: '여행 중 쉬어가기 좋은 카페' },
  { category: '액티비티', address: '고노하나구', rating: 4.8, placeName: '유니버설 스튜디오 재팬', description: '하루 종일 즐기는 테마파크' },
  { category: '쇼핑', address: '난바', rating: 4.4, placeName: '난바 파크스', description: '쇼핑과 식사를 함께 즐기는 공간' },
]

export const mockFestivals: FestivalResponseDto[] = [
  { festivalId: 1, title: '텐진 마츠리 불꽃', category: '축제', startDate: '2026-08-25', startTime: '19:30', location: '오사카성 공원' },
  { festivalId: 2, title: '난바 재즈 나이트', category: '공연', startDate: '2026-08-26', startTime: '20:00', location: '난바 홀' },
  { festivalId: 3, title: '구로몬 야시장', category: '마켓', startDate: '2026-08-27', startTime: '17:00', location: '구로몬 시장' },
]

export const mockDday: DdayResponseDto = {
  cityName: '오사카',
  countryName: '일본',
  dday: 'D-3',
  endDate: '2026-08-27',
  headcount: 4,
  startDate: '2026-08-23',
}
