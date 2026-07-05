import logoUrl from '@shared/assets/logo.png'
import recordCityUrl from '@shared/assets/record-city.jpg'
import recordEuropeUrl from '@shared/assets/record-europe.jpg'
import recordSeaUrl from '@shared/assets/record-sea.jpg'
import recordSingaporeUrl from '@shared/assets/record-singapore.jpg'
import { MENUS, Sidebar } from '@widgets/sidebar'

import * as S from './RecordPage.styles'

const records = [
  { date: '2026.06.08 - 06.12', image: recordEuropeUrl, title: '2026 여름의 싱가포르 🇸🇬' },
  { date: '2024.05.27 ~ 2024.06.27', image: recordSeaUrl, title: '유럽 한달 배낭여행 🎒' },
  { date: '2025.06.30 ~ 2025.07.14', image: recordCityUrl, title: '괌으로 가자 !!!!!' },
  { date: '2025.12.30 ~ 2025.12.30', image: recordSingaporeUrl, title: '혼자 일본 당일치기' },
] as const

export function RecordPage() {
  return (
    <S.Page>
      <Sidebar logo={<S.Logo src={logoUrl} alt="PartTrip" />} menus={MENUS} />
      <S.Content>
        <S.SearchBar aria-label="여행 기록 검색">
          <S.SearchIcon aria-hidden="true" />
          <span>어디로 여행을 떠나시나요?</span>
        </S.SearchBar>
        <S.RecordCard>
          <S.CardHeader>
            <div><h1>여행별 기록</h1><p>최근 작성한 여행 기록 4개</p></div>
            <strong>총 7개</strong>
          </S.CardHeader>
          <S.RecordList>
            {records.map((record) => (
              <S.RecordRow key={record.title}>
                <img src={record.image} alt="" />
                <S.RecordText><h2>{record.title}</h2><p>{record.date}</p></S.RecordText>
                <S.ViewButton type="button">보기</S.ViewButton>
              </S.RecordRow>
            ))}
          </S.RecordList>
          <S.MoreButton type="button">더 많은 기록 보기</S.MoreButton>
        </S.RecordCard>
      </S.Content>
    </S.Page>
  )
}
