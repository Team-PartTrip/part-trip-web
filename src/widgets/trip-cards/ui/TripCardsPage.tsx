import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useImportTripMutation, useSharedTripQuery, useSharedTripsQuery, useShareTripMutation } from '@/entities/trip-card'
import { useMyTrips } from '@/entities/trip-plan'
import { figmaCardActive, figmaCardCompleted, figmaCardJapan } from '@/shared/assets'
import { paths } from '@/shared/config'
import { Button as PartTripButton } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'

import * as S from './TripCardsPage.styles'

const fallbackImages = [figmaCardJapan, figmaCardActive, figmaCardCompleted]

type CardPageProps = { mode: 'list' | 'detail' | 'create' | 'delete' }

export function TripCardsPage() { return <TripCardsFlow mode="list" /> }
export function TripCardDetailPage() { return <TripCardsFlow mode="detail" /> }
export function TripCardCreatePage() { return <TripCardsFlow mode="create" /> }
export function TripCardDeletePage() { return <TripCardsFlow mode="delete" /> }

function TripCardsFlow({ mode }: CardPageProps) {
  const navigate = useNavigate()
  const { tripId } = useParams({ strict: false })
  const [selected, setSelected] = useState<number[]>([])
  const [message, setMessage] = useState('')
  const sharedTripsQuery = useSharedTripsQuery(mode !== 'detail' && mode !== 'create')
  const sharedTripQuery = useSharedTripQuery(Number(tripId))
  const myTripsQuery = useMyTrips(mode === 'create')
  const shareMutation = useShareTripMutation()
  const importMutation = useImportTripMutation()
  const cards = sharedTripsQuery.data?.content ?? []
  const mine = myTripsQuery.trips
  const detail = sharedTripQuery.data
  const isLoading = mode === 'detail' ? sharedTripQuery.isLoading : mode === 'create' ? myTripsQuery.isLoading : sharedTripsQuery.isLoading
  const hasQueryError = mode === 'detail' ? sharedTripQuery.isError : mode === 'create' ? myTripsQuery.hasError : sharedTripsQuery.isError

  const handleShare = async (id?: number) => {
    if (!id) return
    try {
      await shareMutation.mutateAsync({ tripId: id })
      navigate({ to: paths.tripCards })
    } catch { setMessage('여행 카드를 공유하지 못했습니다.') }
  }

  const handleImport = async () => {
    if (!detail?.tripId) return
    try {
      await importMutation.mutateAsync(detail.tripId)
      setMessage('공유 여행을 내 여행으로 가져왔습니다.')
    } catch { setMessage('공유 여행을 가져오지 못했습니다.') }
  }

  return (
    <AppShell>
      <S.Page>
        <S.Header>
          <div><S.Title>{mode === 'detail' ? detail?.title || '여행 카드 상세' : mode === 'create' ? '여행 카드 작성' : mode === 'delete' ? '여행 카드 삭제' : '여행 카드'}</S.Title><S.Subtitle>여행 계획을 카드로 공유하고 다시 확인하세요.</S.Subtitle></div>
          <S.ActionRow><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.tripCards })}>목록</PartTripButton>{mode === 'list' ? <PartTripButton type="button" onClick={() => navigate({ to: paths.tripCardCreate })}>여행 카드 공유하기</PartTripButton> : null}</S.ActionRow>
        </S.Header>
        {message || hasQueryError ? <S.Notice role={hasQueryError ? 'alert' : 'status'}>{message || '여행 카드를 불러오지 못했습니다.'}</S.Notice> : null}
        {isLoading ? <S.State aria-busy="true">여행 카드를 불러오는 중입니다.</S.State> : null}

        {mode === 'list' && !isLoading ? <S.CardGrid>{cards.map((card, index) => <S.Card type="button" key={card.tripId ?? index} onClick={() => card.tripId && navigate({ params: { tripId: String(card.tripId) }, to: '/trip-cards/$tripId' })}><img src={card.images?.[0] || fallbackImages[index % fallbackImages.length]} alt="" /><div><strong>{card.title || '공유 여행'}</strong><span>{card.startDate || '-'} – {card.endDate || '-'}</span><small>{card.cityName || card.countryName || '여행지'}</small></div></S.Card>)}{cards.length === 0 ? <S.Empty>공유된 여행 카드가 없습니다.</S.Empty> : null}</S.CardGrid> : null}

        {mode === 'detail' && !isLoading ? <S.Detail>{detail ? <><S.DetailHero><img src={detail.images?.[0] || figmaCardJapan} alt="" /><div><S.Badge>공유 여행</S.Badge><h2>{detail.title || '여행 카드'}</h2><p>{detail.startDate || '-'} – {detail.endDate || '-'}</p></div></S.DetailHero><S.DetailBody><h3>여행 일정</h3>{detail.places?.map((place, index) => <p key={place.tripPlaceId ?? index}>DAY {place.dayNumber ?? index + 1} · {place.placeName || '장소'} {place.placeSub ? `· ${place.placeSub}` : ''}</p>)}{!detail.places?.length ? <S.Empty>등록된 일정이 없습니다.</S.Empty> : null}<PartTripButton type="button" disabled={importMutation.isPending} onClick={() => void handleImport()}>내 여행으로 가져오기</PartTripButton></S.DetailBody></> : <S.Empty>여행 카드를 찾을 수 없습니다.</S.Empty>}</S.Detail> : null}

        {mode === 'create' && !isLoading ? <S.SelectList>{mine.map((trip, index) => <S.SelectRow key={trip.tripId ?? index}><div><strong>{trip.title || '여행 기록'}</strong><span>{trip.cityName || trip.countryName || '여행지'}</span></div><PartTripButton type="button" disabled={shareMutation.isPending} onClick={() => void handleShare(trip.tripId)}>공유하기</PartTripButton></S.SelectRow>)}{mine.length === 0 ? <S.Empty>공유할 내 여행이 없습니다.</S.Empty> : null}</S.SelectList> : null}

        {mode === 'delete' && !isLoading ? <S.SelectList><S.Notice>공유 여행 카드 삭제 API가 현재 저장소 계약에 없습니다. 선택 UI만 제공하며 삭제 요청은 보내지 않습니다.</S.Notice>{cards.map((card, index) => <S.SelectRow key={card.tripId ?? index}><label><input type="checkbox" checked={selected.includes(card.tripId ?? -1)} onChange={() => setSelected((current) => current.includes(card.tripId ?? -1) ? current.filter((id) => id !== (card.tripId ?? -1)) : [...current, card.tripId ?? -1])} /><span>{card.title || '여행 카드'}</span></label></S.SelectRow>)}<PartTripButton type="button" $variant="secondary" disabled>선택한 카드 삭제 ({selected.length})</PartTripButton></S.SelectList> : null}
      </S.Page>
    </AppShell>
  )
}
