import { useNavigate } from 'react-router-dom'
import { seedTravelRecords } from '@shared/api'
import logoUrl from '@shared/assets/logo.png'
import { createRecordDetailPath, paths } from '@shared/config'
import { MENUS, Sidebar } from '@widgets/sidebar'

import * as S from './RecordPage.styles'

const formatDate = (value: string) => value.replaceAll('-', '.')

export function RecordPage() {
  const navigate = useNavigate()

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
            <S.HeaderActions><strong>총 7개</strong><button type="button" onClick={() => navigate(paths.recordWrite)}>새 기록 작성</button></S.HeaderActions>
          </S.CardHeader>
          <S.RecordList>
            {seedTravelRecords.map((record) => (
              <S.RecordRow key={record.title}>
                <img src={record.imageUrl} alt="" />
                <S.RecordText><h2>{record.title}</h2><p>{formatDate(record.startDate)} ~ {formatDate(record.endDate)}</p></S.RecordText>
                <S.ViewButton type="button" onClick={() => navigate(createRecordDetailPath(record.id))}>보기</S.ViewButton>
              </S.RecordRow>
            ))}
          </S.RecordList>
          <S.MoreButton type="button">더 많은 기록 보기</S.MoreButton>
        </S.RecordCard>
      </S.Content>
    </S.Page>
  )
}
