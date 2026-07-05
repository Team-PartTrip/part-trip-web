import { useNavigate } from 'react-router-dom'
import { seedTravelLogEntries } from '@shared/api'
import logoUrl from '@shared/assets/logo.png'
import { createRecordDetailPath, paths } from '@shared/config'
import { MENUS, Sidebar } from '@widgets/sidebar'

import * as S from './RecordPage.styles'

export function RecordPage() {
  const navigate = useNavigate()

  return (
    <S.Page>
      <Sidebar logo={<S.Logo src={logoUrl} alt="PartTrip" />} menus={MENUS} />
      <S.Content>
        <S.TopBar>
          <S.TripTitle type="button" onClick={() => navigate(paths.main)}>
            <span aria-hidden="true">‹</span>
            2026 여름의 싱가포르 🇸🇬
          </S.TripTitle>
          <S.SearchBar aria-label="여행 기록 검색">
            <S.SearchIcon aria-hidden="true" />
            <span>어디로 여행을 떠나시나요?</span>
          </S.SearchBar>
        </S.TopBar>
        <S.Workspace>
          <S.RecordCard>
            <S.RecordList>
              {seedTravelLogEntries.map((record) => (
                <S.RecordRow key={record.id}>
                  <img src={record.imageUrl} alt="" />
                  <S.RecordText>
                    <h2>{record.title}</h2>
                    <p>{record.description}</p>
                    <span>{record.recordedAt}</span>
                  </S.RecordText>
                  <S.RowActions>
                    <S.MenuButton type="button" aria-label={`${record.title} 메뉴`}>⋮</S.MenuButton>
                    <S.ViewButton type="button" onClick={() => navigate(createRecordDetailPath('singapore-2026'))}>보기</S.ViewButton>
                  </S.RowActions>
                </S.RecordRow>
              ))}
            </S.RecordList>
            <S.MoreButton type="button">더 많은 기록 보기</S.MoreButton>
          </S.RecordCard>
          <S.CreateButton type="button" onClick={() => navigate(paths.recordWrite)}>+ 기록 작성</S.CreateButton>
        </S.Workspace>
      </S.Content>
    </S.Page>
  )
}
