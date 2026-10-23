import { useRef, useState, type Dispatch, type SetStateAction } from 'react'
import type { TravelCardTimelineItemDto, TravelRecordDto } from '@/entities/trip-card'
import type { UseNavigateResult } from '@tanstack/react-router'
import { resolveApiAssetUrl } from '@/shared/libs/api-client'
import { Button as PartTripButton } from '@/shared/ui/parttrip'

import { formatDateRange, formatTripDuration, getErrorMessage } from '@/shared/utils'

import { paths } from '@/shared/config'
import { isTripEnded, TRIP_ENDED_NOTICE } from '../model/photo-composer-state'
import * as S from './TripCardsPage.styles'

type TripCard = TravelRecordDto
type Navigate = UseNavigateResult<'/'>
type SetSelected = Dispatch<SetStateAction<number[]>>
type TimelineItem = TravelCardTimelineItemDto
type TripCardDetail = TravelRecordDto

export function TripCardListView({ cards, navigate }: { cards: TripCard[]; navigate: Navigate }) {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [message, setMessage] = useState('')
  const selected = cards[Math.min(active, Math.max(0, cards.length - 1))]
  const share = async () => {
    if (!selected) return
    const text = [selected.title || '여행카드', selected.cityName || selected.regionName, formatDateRange(selected.startDate, selected.endDate), `사진 ${selected.photoCount ?? selected.images?.length ?? 0}장`].filter(Boolean).join(' · ')
    try {
      if (navigator.share) await navigator.share({ title: selected.title || '여행카드', text })
      else { await navigator.clipboard.writeText(text); setMessage('여행카드 내용을 복사했어요. 가족에게 보내주세요.') }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
      setMessage(getErrorMessage(error, '공유하지 못했어요. 잠시 후 다시 시도해주세요.'))
    }
  }
  const go = (index: number) => {
    const element = track.current
    if (element) element.scrollTo({ left: element.clientWidth * index, behavior: 'smooth' })
  }
  return <S.CarouselSection>
    {cards.length ? <>
      <S.CardTrack ref={track} aria-label="여행카드 목록" onScroll={event => {
        const element = event.currentTarget
        setActive(Math.round(element.scrollLeft / element.clientWidth))
      }}>
        {cards.map((card, index) => <S.CardSlide key={card.tripId ?? index} role="group" aria-label={`${index + 1} / ${cards.length}`}>
          <S.TravelCard type="button" onClick={() => card.tripId && navigate({ params: { tripId: String(card.tripId) }, to: '/trip-cards/$tripId' })}>
            <S.TravelCardImage>{card.images?.[0] ? <img src={resolveApiAssetUrl(card.images[0]) || card.images[0]} alt="" onError={event => { event.currentTarget.hidden = true }} /> : null}</S.TravelCardImage>
            <S.TravelCardInfo>
              <S.TravelCardTitle><span><strong>{card.title || `${card.cityName || card.regionName || '여행'} 여행`}</strong><small>{[card.cityName || card.regionName, formatDateRange(card.startDate, card.endDate)].filter(Boolean).join(' · ')}</small></span></S.TravelCardTitle>
              <S.MetricList>
                <span><small>여행 기간</small><strong>{formatTripDuration(card.startDate, card.endDate) || '기간 미설정'}</strong></span>
                <span><small>남긴 사진</small><strong>{card.photoCount ?? card.images?.length ?? 0}장</strong></span>
              </S.MetricList>
            </S.TravelCardInfo>
          </S.TravelCard>
        </S.CardSlide>)}
      </S.CardTrack>
      <S.CarouselControls aria-label="여행카드 넘기기">
        <PartTripButton type="button" $variant="secondary" disabled={active <= 0} onClick={() => go(active - 1)}>이전</PartTripButton>
        <span aria-live="polite">{Math.min(active + 1, cards.length)} / {cards.length}</span>
        <PartTripButton type="button" $variant="secondary" disabled={active >= cards.length - 1} onClick={() => go(active + 1)}>다음</PartTripButton>
      </S.CarouselControls>
      <S.CardDots aria-label="여행카드 선택">{cards.map((card, index) => <button key={card.tripId ?? index} type="button" aria-label={`${index + 1}번째 여행카드`} aria-current={active === index ? 'true' : undefined} onClick={() => go(index)} />)}</S.CardDots>
      <S.CarouselControls>
        <PartTripButton type="button" onClick={() => void share()}>여행카드 공유하기</PartTripButton>
        <PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: '/trip-cards/delete' })}>관리 · 삭제</PartTripButton>
      </S.CarouselControls>
    </> : <S.Empty>여행카드가 없어요.</S.Empty>}
    {message ? <p role="status">{message}</p> : null}
    <S.AddButton type="button" onClick={() => navigate({ to: paths.tripCardCreate })}>사진 · 코멘트 추가</S.AddButton>
  </S.CarouselSection>
}

type TripCardDetailViewProps = {
  detail?: TripCardDetail
  firstPhoto?: TimelineItem
  firstPlace?: TimelineItem
  navigate: Navigate
}

export function TripCardDetailView({ detail, firstPhoto, firstPlace, navigate }: TripCardDetailViewProps) {
  return (
    <S.DetailLayout>
      {detail ? (
        <>
          <S.PlaceOverview>
            <S.DetailHeading><h2>방문 장소</h2></S.DetailHeading>
            <S.PlaceOverviewImage>{firstPhoto?.imageUrl ? <img src={resolveApiAssetUrl(firstPhoto.imageUrl) || firstPhoto.imageUrl} alt={firstPlace?.placeName ? `${firstPlace.placeName} 여행 사진` : '여행 사진'} /> : <span>{firstPlace?.placeName || '장소 이미지 없음'}</span>}</S.PlaceOverviewImage>
            <S.PlaceCopy><strong>{firstPlace?.placeName || '장소 정보 없음'}</strong><span>{firstPlace?.address || '상세 주소 정보 없음'}</span><small>{[firstPlace?.date || detail.startDate, firstPlace?.rating == null ? '' : `★ ${firstPlace.rating}`].filter(Boolean).join(' | ') || '여행 정보 없음'}</small></S.PlaceCopy>
          </S.PlaceOverview>
          <S.CapturedInfo>
            <S.CapturedPanel><h2>촬영된 이미지</h2><S.CapturedImage>{firstPhoto?.imageUrl ? <img src={resolveApiAssetUrl(firstPhoto.imageUrl) || firstPhoto.imageUrl} alt="여행 사진" /> : <span>촬영된 이미지</span>}</S.CapturedImage><small>{firstPhoto?.takenAt || firstPhoto?.date || detail.startDate || '촬영일 정보 없음'}</small></S.CapturedPanel>
            <S.CapturedPanel><h2>사진에 포함된 위치 정보</h2><strong>{firstPlace?.placeName || '위치 정보 없음'}</strong><small>{[firstPlace?.address, firstPlace?.rating == null ? '' : `★ ${firstPlace.rating}`].filter(Boolean).join(' | ') || '위치 정보 없음'}</small></S.CapturedPanel>
            <S.AddPhoto>{isTripEnded(detail.endDate)
              ? <p role="status">{TRIP_ENDED_NOTICE}</p>
              : <><PartTripButton type="button" onClick={() => navigate({ to: paths.tripCardCreate, search: { cardId: String(detail.tripId) } })}>사진 추가하기</PartTripButton><small>갤러리에서 기록하고 싶은 사진 업로드</small></>}</S.AddPhoto>
          </S.CapturedInfo>
        </>
      ) : <S.Empty>여행카드를 찾을 수 없어요.</S.Empty>}
    </S.DetailLayout>
  )
}

type TripCardDeleteViewProps = {
  isDeleting: boolean
  cards: TripCard[]
  handleDelete: () => void
  navigate: Navigate
  selected: number[]
  setSelected: SetSelected
}

export function TripCardDeleteView({ cards, handleDelete, isDeleting, navigate, selected, setSelected }: TripCardDeleteViewProps) {
  const allCardIds = cards.flatMap((card) => card.tripId == null ? [] : [card.tripId])

  return (
    <>
      <S.Toolbar>
        <strong>{selected.length}개 선택됨</strong>
        <div>
          <button type="button" disabled={isDeleting} onClick={() => setSelected(allCardIds)}>전체 선택</button>
          <button type="button" disabled={isDeleting} onClick={() => setSelected([])}>선택 해제</button>
        </div>
      </S.Toolbar>
      <S.DeleteLayout>
        <S.DeleteList>
          <h2>여행카드 {cards.length}개</h2>
          {cards.map((card, index) => (
            <S.DeleteRow key={card.tripId ?? index} $selected={card.tripId != null && selected.includes(card.tripId)}>
              <input
                type="checkbox"
                checked={card.tripId != null && selected.includes(card.tripId)}
                disabled={isDeleting || card.tripId == null}
                onChange={() => {
                  const tripId = card.tripId
                  if (tripId == null) return
                  setSelected((current) => current.includes(tripId) ? current.filter((id) => id !== tripId) : [...current, tripId])
                }}
              />
              <span>IMG</span>
              <div>
                <strong>{card.title || '여행카드'}</strong>
                <small>{formatDateRange(card.startDate, card.endDate)} · 사진 {card.photoCount ?? card.images?.length ?? 0}장</small>
              </div>
            </S.DeleteRow>
          ))}
          {cards.length === 0 ? <S.Empty>삭제할 여행카드가 없어요.</S.Empty> : null}
        </S.DeleteList>
        <S.DeletePanel>
          <h2>삭제 확인</h2>
          <S.Warning><strong>! 삭제하면 되돌릴 수 없어요</strong><span>카드에 담긴 사진과 코멘트가 함께 삭제돼요.</span></S.Warning>
          <S.DeleteSummary><strong>선택한 카드 {selected.length}개</strong><span>{cards.filter((card) => card.tripId != null && selected.includes(card.tripId)).map((card) => card.title || '여행카드').join(' · ') || '선택된 카드가 없어요.'}</span><span>사진과 코멘트가 함께 삭제돼요.</span></S.DeleteSummary>
          <S.DeleteActions>
            <S.DeleteButton type="button" disabled={isDeleting || selected.length === 0} onClick={handleDelete}>{isDeleting ? '삭제 중…' : `${selected.length}개 삭제하기`}</S.DeleteButton>
            <PartTripButton type="button" $variant="secondary" disabled={isDeleting} onClick={() => navigate({ to: paths.tripCards })}>취소</PartTripButton>
          </S.DeleteActions>
        </S.DeletePanel>
      </S.DeleteLayout>
    </>
  )
}
