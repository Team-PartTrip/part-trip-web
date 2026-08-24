import { useNavigate } from 'react-router-dom'
import { useMyTrips } from '@shared/lib'
import { figmaRecordMapPhoto } from '@shared/assets'
import { paths } from '@shared/config'
import { AppShell } from '@widgets/app-shell'

import * as S from './RecordMapPage.styles'

export function RecordMapPage() {
  const navigate = useNavigate()
  const { isLoading, trips } = useMyTrips()

  return (
    <AppShell>
      <S.Page>
        <S.Header>
          <div><S.Title>여행 기록 지도</S.Title><S.Subtitle>여행에서 남긴 장소와 사진을 지도에서 확인하세요.</S.Subtitle></div>
          <S.BackButton type="button" onClick={() => navigate(paths.record)}>목록으로</S.BackButton>
        </S.Header>
        <S.Body>
          <S.Map aria-label="여행 기록 지도">
            <img src={figmaRecordMapPhoto} alt="" />
            {trips.slice(0, 5).map((trip, index) => <S.Pin key={trip.tripId ?? index} $index={index} aria-label={trip.title || '여행 기록'} />)}
          </S.Map>
          <S.List>
            <h2>촬영 위치</h2>
            {isLoading ? <p>기록을 불러오는 중입니다.</p> : null}
            {!isLoading && trips.length === 0 ? <p>표시할 여행 기록이 없습니다.</p> : null}
            {trips.map((trip) => <button key={trip.tripId ?? trip.title} type="button" onClick={() => trip.tripId && navigate(`/record/${trip.tripId}`)}><strong>{trip.title || '여행 기록'}</strong><span>{trip.cityName || trip.countryName || '여행지'}</span></button>)}
          </S.List>
        </S.Body>
      </S.Page>
    </AppShell>
  )
}
