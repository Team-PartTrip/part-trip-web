import { useNavigate } from '@tanstack/react-router'
import { useMyTrips } from '@/entities/trip-plan'
import { figmaRecordDotonbori, figmaRecordNamba, figmaRecordOsakaCastle } from '@/shared/assets'
import { paths } from '@/shared/config'
import { formatDate } from '@/shared/utils'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordPage.styles'

const fallbackItems = [
  { description: '도착 후 첫 번째로 남긴 기록', image: figmaRecordNamba, name: 'Namba', time: '09:20' },
  { description: '도시의 풍경과 함께한 오후', image: figmaRecordOsakaCastle, name: 'Osaka Castle', time: '13:40' },
  { description: '오늘의 마지막 기록', image: figmaRecordDotonbori, name: 'Dotonbori', time: '19:10' },
]

export function RecordPage() {
  const navigate = useNavigate()
  const { hasError, isLoading, trips } = useMyTrips()

  return (
    <AppShell>
      <S.Page>
        <S.Header><S.Title>여행 기록 타임라인</S.Title><S.Subtitle>장소와 사진을 시간순으로 다시 만나보세요.</S.Subtitle></S.Header>
        {isLoading ? <S.State aria-busy="true">여행 기록을 불러오는 중입니다.</S.State> : null}
        {hasError ? <S.State role="alert">여행 기록을 불러오지 못했습니다.</S.State> : null}
        {!isLoading && !hasError && trips.length === 0 ? <S.Empty><strong>아직 여행 기록이 없습니다.</strong><span>첫 여행의 순간을 남겨보세요.</span></S.Empty> : null}
        {!isLoading && !hasError ? trips.map((trip, tripIndex) => {
          const items = trip.images?.length
            ? trip.images.slice(0, 3).map((image, index) => ({
                description: trip.content || fallbackItems[index]?.description,
                image,
                name: trip.places?.[index]?.placeName || fallbackItems[index]?.name || '여행 기록',
                time: fallbackItems[index]?.time || '',
              }))
            : fallbackItems
          return <S.TimelineCard key={trip.tripId ?? tripIndex}><S.TimelineHeading>{formatDate(trip.startDate)} · {trip.cityName || trip.countryName || '여행지'}</S.TimelineHeading><S.TimelineItems>{items.map((item, index) => <S.TimelineItem key={`${item.name}-${index}`}><S.Dot aria-hidden="true" /><img src={item.image} alt={`${item.name} 여행 사진`} /><S.TimelineCopy><small>{item.time}</small><strong>{item.name}</strong><span>{item.description}</span></S.TimelineCopy><S.ViewButton type="button" disabled={!trip.tripId} onClick={() => trip.tripId && navigate({ params: { recordId: String(trip.tripId) }, to: '/record/$recordId' })}>기록 보기</S.ViewButton></S.TimelineItem>)}</S.TimelineItems></S.TimelineCard>
        }) : null}
        {!isLoading && !hasError && trips.length > 0 ? <S.FooterActions><button type="button" onClick={() => navigate({ to: paths.recordMap })}>지도 보기</button><button type="button" onClick={() => navigate({ to: paths.recordCalendar })}>캘린더</button><button type="button" onClick={() => navigate({ to: paths.recordReport })}>리포트</button><button type="button" onClick={() => navigate({ to: paths.recordDelete })}>사진 삭제</button><button type="button" onClick={() => navigate({ to: paths.recordWrite })}>기록 작성</button></S.FooterActions> : null}
      </S.Page>
    </AppShell>
  )
}
