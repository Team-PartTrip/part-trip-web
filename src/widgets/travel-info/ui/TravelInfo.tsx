import { useState } from 'react'
import { travelInfoSections, type TravelInfoSection } from '@shared/api'
import { GroupIcon } from '@shared/assets'

import * as S from './TravelInfo.styles'

const populationItems = [
  { flag: '🇨🇳', group: '중국계', value: 75, barValue: 67.33, color: '#0b73ce' },
  { flag: '🇲🇲', group: '말레이계', value: 14, barValue: 16.63, color: '#e9d9dd' },
  { flag: '🇮🇳', group: '인도계', value: 9, barValue: 10.69, color: '#11a987' },
]

const TravelInfo = () => {
  const [activeSectionId, setActiveSectionId] = useState<TravelInfoSection['id']>('population')
  const activeSection = travelInfoSections.find((section) => section.id === activeSectionId) ?? travelInfoSections[0]

  return (
    <S.Card>
      <S.TitleRow>
        <GroupIcon aria-hidden="true" />
        <h2>여행지 정보</h2>
      </S.TitleRow>

      <S.Tabs aria-label="여행지 정보 분류">
        {travelInfoSections.map((section) => (
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
        {populationItems.map((item) => (
          <S.PopulationItem key={item.group}>
            <S.PopulationMeta>
              <S.PopulationCountry>{item.flag} {item.group}</S.PopulationCountry>
              <span>{item.value}%</span>
            </S.PopulationMeta>
            <S.ProgressTrack>
              <S.ProgressFill $color={item.color} $value={item.barValue} />
            </S.ProgressTrack>
          </S.PopulationItem>
        ))}
      </S.PopulationList> : null}

      <S.CultureSummary>
        <strong>{activeSection.title}</strong>
        <p>
          {activeSection.items.join(' · ')}<br />
          {activeSection.summary}
        </p>
      </S.CultureSummary>
    </S.Card>
  )
}

export default TravelInfo
