import { useState } from 'react'
import type {
  FoodInfoResponseDto,
  PopulationInfoResponseDto,
  TourPlaceResponseDto,
  TravelInfoSection,
} from '@shared/api'
import { GroupIcon } from '@shared/assets'

import * as S from './TravelInfo.styles'

type Props = {
  countrySummary?: string
  foodInfo?: FoodInfoResponseDto[]
  populationInfo?: PopulationInfoResponseDto[]
  tourPlaces?: TourPlaceResponseDto[]
}

const TravelInfo = ({ countrySummary = '', foodInfo = [], populationInfo = [], tourPlaces = [] }: Props) => {
  const [activeSectionId, setActiveSectionId] = useState<TravelInfoSection['id']>('population')
  const sections: readonly TravelInfoSection[] = [
    {
      id: 'population',
      items: populationInfo.map((item) => `${item.nationName ?? '구성'} ${item.percent ?? 0}%`),
      summary: populationInfo.length > 0 ? '서로 다른 문화가 함께 어우러져 있습니다.' : '인구 정보를 준비 중입니다.',
      title: '인구 구성',
    },
    {
      id: 'places',
      items: tourPlaces.map((item) => item.placeName ?? '관광지'),
      summary: tourPlaces[0]?.description ?? '관광지 정보를 준비 중입니다.',
      title: '관광 장소',
    },
    {
      id: 'food',
      items: foodInfo.map((item) => item.foodName ?? '대표 음식'),
      summary: foodInfo[0]?.description ?? '음식 정보를 준비 중입니다.',
      title: '대표 음식',
    },
    {
      id: 'etiquette',
      items: [],
      summary: countrySummary || '국가 정보를 준비 중입니다.',
      title: '국가 정보',
    },
  ]
  const activeSection = sections.find((section) => section.id === activeSectionId) ?? sections[0]

  return (
    <S.Card>
      <S.TitleRow>
        <GroupIcon aria-hidden="true" />
        <h2>여행지 정보</h2>
      </S.TitleRow>

      <S.Tabs aria-label="여행지 정보 분류">
        {sections.map((section) => (
          <S.Tab
            key={section.id}
            type="button"
            $active={section.id === activeSectionId}
            aria-pressed={section.id === activeSectionId}
            onClick={() => setActiveSectionId(section.id)}
          >
            {section.title}
          </S.Tab>
        ))}
      </S.Tabs>

      {activeSectionId === 'population' ? <S.PopulationList>
        {populationInfo.map((item, index) => (
          <S.PopulationItem key={`${item.nationCode}-${index}`}>
            <S.PopulationMeta>
              <S.PopulationCountry>{item.nationName ?? item.nationCode ?? '구성'}</S.PopulationCountry>
              <span>{item.percent ?? 0}%</span>
            </S.PopulationMeta>
            <S.ProgressTrack>
              <S.ProgressFill $color={['#0b73ce', '#e9d9dd', '#11a987'][index % 3]} $value={item.percent ?? 0} />
            </S.ProgressTrack>
          </S.PopulationItem>
        ))}
      </S.PopulationList> : null}

      <S.CultureSummary>
        <strong>{activeSection.title}</strong>
        <p>
          {activeSection.items.length > 0 ? <>{activeSection.items.join(' · ')}<br /></> : null}
          {activeSection.summary}
        </p>
      </S.CultureSummary>
    </S.Card>
  )
}

export default TravelInfo
