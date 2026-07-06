import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyTrips, type TripResponseDto } from '@shared/api'
import logoUrl from '@shared/assets/logo.png'
import fallbackRecordImageUrl from '@shared/assets/record-singapore.jpg'
import { createRecordDetailPath, paths } from '@shared/config'
import { MENUS, Sidebar } from '@widgets/sidebar'

import * as S from './RecordPage.styles'

export function RecordPage() {
  const navigate = useNavigate()
  const [trips, setTrips] = useState<TripResponseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true
    void getMyTrips()
      .then((nextTrips) => { if (isMounted) setTrips(nextTrips) })
      .catch(() => { if (isMounted) setErrorMessage('여행 기록을 불러오지 못했습니다.') })
      .finally(() => { if (isMounted) setIsLoading(false) })
    return () => { isMounted = false }
  }, [])

  const currentTrip = trips[0]

  return (
    <S.Page>
      <Sidebar logo={<S.Logo src={logoUrl} alt="PartTrip" />} menus={MENUS} />
      <S.Content>
        <S.TopBar>
          <S.TripTitle type="button" onClick={() => navigate(paths.main)}>
            <span aria-hidden="true">‹</span>
            {currentTrip?.title ?? '나의 여행 기록'}
          </S.TripTitle>
          <S.SearchBar aria-label="여행 기록 검색">
            <S.SearchIcon aria-hidden="true" />
            <span>어디로 여행을 떠나시나요?</span>
          </S.SearchBar>
        </S.TopBar>
        <S.Workspace>
          <S.RecordCard>
            <S.RecordList>
              {isLoading ? <S.StatusMessage>여행 기록을 불러오는 중입니다.</S.StatusMessage> : null}
              {errorMessage ? <S.StatusMessage role="alert">{errorMessage}</S.StatusMessage> : null}
              {!isLoading && !errorMessage && trips.length === 0 ? <S.StatusMessage>아직 작성한 여행 기록이 없습니다.</S.StatusMessage> : null}
              {trips.map((record) => (
                <S.RecordRow key={record.tripId ?? record.title}>
                  <img src={record.images?.[0] || fallbackRecordImageUrl} alt="" />
                  <S.RecordText>
                    <h2>{record.title ?? '제목 없는 여행 기록'}</h2>
                    <p>{record.content ?? '작성된 여행 메모가 없습니다.'}</p>
                    <span>{record.startDate ?? '-'} ~ {record.endDate ?? '-'}</span>
                  </S.RecordText>
                  <S.RowActions>
                    <S.MenuButton type="button" aria-label={`${record.title} 메뉴`}>⋮</S.MenuButton>
                    <S.ViewButton type="button" disabled={!record.tripId} onClick={() => record.tripId && navigate(createRecordDetailPath(String(record.tripId)))}>보기</S.ViewButton>
                  </S.RowActions>
                </S.RecordRow>
              ))}
            </S.RecordList>
            {trips.length > 0 ? <S.MoreButton type="button">총 {trips.length}개의 기록</S.MoreButton> : null}
          </S.RecordCard>
          <S.CreateButton type="button" onClick={() => navigate(paths.recordWrite)}>+ 기록 작성</S.CreateButton>
        </S.Workspace>
      </S.Content>
    </S.Page>
  )
}
