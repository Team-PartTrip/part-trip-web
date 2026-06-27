import { GroupIcon } from '@shared/assets'

import * as S from './TravelInfo.styles'

const populationItems = [
  { flag: '🇨🇳', group: '중국계', value: 75, color: '#1478c8' },
  { flag: '🇲🇾', group: '말레이계', value: 14, color: '#eadde1' },
  { flag: '🇮🇳', group: '인도계', value: 9, color: '#17ad8b' },
]

const TravelInfo = () => {
  return (
    <S.Card>
      <S.TitleRow>
        <GroupIcon aria-hidden="true" />
        <h2>여행지 정보</h2>
      </S.TitleRow>

      <S.Tabs aria-label="여행지 정보 분류">
        <S.Tab type="button" $active>인구 구성</S.Tab>
        <S.Tab type="button">관광 장소</S.Tab>
        <S.Tab type="button">대표 음식</S.Tab>
        <S.Tab type="button">현지 에티켓</S.Tab>
      </S.Tabs>

      <S.PopulationList>
        {populationItems.map((item) => (
          <S.PopulationItem key={item.group}>
            <S.PopulationMeta>
              <S.PopulationCountry>{item.flag} {item.group}</S.PopulationCountry>
              <span>{item.value}%</span>
            </S.PopulationMeta>
            <S.ProgressTrack>
              <S.ProgressFill $color={item.color} $value={item.value} />
            </S.ProgressTrack>
          </S.PopulationItem>
        ))}
      </S.PopulationList>

      <S.CultureSummary>
        <strong>문화 요약</strong>
        <p>
          중국계가 75%, 말레이계 14%, 인도계는 9%로<br />
          중국계가 주류 구성되어 있으며<br />
          여러 문화가 공존하는 다문화 국가입니다.
        </p>
      </S.CultureSummary>
    </S.Card>
  )
}

export default TravelInfo
