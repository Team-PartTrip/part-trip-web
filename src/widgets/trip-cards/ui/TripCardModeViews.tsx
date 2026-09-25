import { resolveApiAssetUrl } from '@/shared/libs/api-client'
import { Button as PartTripButton } from '@/shared/ui/parttrip'

import { paths } from '@/shared/config'
import type { useTripCardsFlow } from '../model/useTripCardsFlow'
import * as S from './TripCardsPage.styles'

type TripCard = ReturnType<typeof useTripCardsFlow>['cards'][number]
type Navigate = ReturnType<typeof useTripCardsFlow>['navigate']
type SetSelected = ReturnType<typeof useTripCardsFlow>['setSelected']

type TimelineItem = {
  address?: string | null
  date?: string | null
  imageUrl?: string | null
  placeName?: string | null
  rating?: number | null
  takenAt?: string | null
}

type TripCardDetail = {
  startDate?: string | null
}

type TripCardListViewProps = {
  card?: TripCard
  imageUrl?: string
  navigate: Navigate
}

export function TripCardListView({ card, imageUrl, navigate }: TripCardListViewProps) {
  return (
    <S.CarouselSection>
      {card ? (
        <S.TravelCard
          type="button"
          onClick={() => card.tripId && navigate({ params: { tripId: String(card.tripId) }, to: '/trip-cards/$tripId' })}
        >
          <S.TravelCardImage>
            {imageUrl ? <img src={resolveApiAssetUrl(imageUrl) || imageUrl} alt="여행 카드 표지" /> : <span>이미지 없음</span>}
          </S.TravelCardImage>
          <S.TravelCardInfo>
            <S.TravelCardTitle>
              <span><strong>{(card.cityName || card.countryName || '여행').toUpperCase()}</strong><small>{[card.countryName, card.startDate, card.endDate].filter(Boolean).join(' · ') || '여행 일정 정보 없음'}</small></span>
              <S.FavoriteBadge aria-label="즐겨찾기">★</S.FavoriteBadge>
            </S.TravelCardTitle>
            <S.MetricList>
              <span><small>함께한 사람</small><strong>정보 없음</strong></span>
              <span><small>방문 장소</small><strong>{card.places ? `${card.places.length}곳` : '정보 없음'}</strong></span>
              <span><small>남긴 사진</small><strong>{card.photoCount ?? card.images?.length ?? 0}장</strong></span>
              <span><small>이동 거리</small><strong>정보 없음</strong></span>
            </S.MetricList>
          </S.TravelCardInfo>
        </S.TravelCard>
      ) : <S.Empty>여행 카드가 없습니다.</S.Empty>}
      <S.Pagination aria-label="여행 카드 페이지"><span className="active" /><span /><span /></S.Pagination>
      <PartTripButton type="button" onClick={() => navigate({ to: paths.tripCardCreate })}>사진 · 코멘트 추가</PartTripButton>
    </S.CarouselSection>
  )
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
            <S.AddPhoto><PartTripButton type="button" onClick={() => navigate({ to: paths.tripCardCreate })}>사진 추가하기</PartTripButton><small>갤러리에서 기록하고 싶은 사진 업로드</small></S.AddPhoto>
          </S.CapturedInfo>
        </>
      ) : <S.Empty>여행 카드를 찾을 수 없습니다.</S.Empty>}
    </S.DetailLayout>
  )
}

type TripCardDeleteViewProps = {
  cards: TripCard[]
  handleDelete: () => void
  navigate: Navigate
  selected: number[]
  setSelected: SetSelected
}

export function TripCardDeleteView({ cards, handleDelete, navigate, selected, setSelected }: TripCardDeleteViewProps) {
  const allCardIds = cards.flatMap((card) => card.tripId == null ? [] : [card.tripId])

  return (
    <>
      <S.Toolbar>
        <strong>{selected.length}개 선택됨</strong>
        <div>
          <button type="button" onClick={() => setSelected(allCardIds)}>전체 선택</button>
          <button type="button" onClick={() => setSelected([])}>선택 해제</button>
        </div>
      </S.Toolbar>
      <S.DeleteLayout>
        <S.DeleteList>
          <h2>여행 카드 {cards.length}개</h2>
          {cards.map((card, index) => (
            <S.DeleteRow key={card.tripId ?? index} $selected={card.tripId != null && selected.includes(card.tripId)}>
              <input
                type="checkbox"
                checked={card.tripId != null && selected.includes(card.tripId)}
                disabled={card.tripId == null}
                onChange={() => {
                  const tripId = card.tripId
                  if (tripId == null) return
                  setSelected((current) => current.includes(tripId) ? current.filter((id) => id !== tripId) : [...current, tripId])
                }}
              />
              <span>IMG</span>
              <div>
                <strong>{card.title || '여행 카드'}</strong>
                <small>{card.startDate || '-'} – {card.endDate || '-'} · 사진 {card.photoCount ?? card.images?.length ?? 0}장</small>
              </div>
            </S.DeleteRow>
          ))}
          {cards.length === 0 ? <S.Empty>삭제할 여행 카드가 없습니다.</S.Empty> : null}
        </S.DeleteList>
        <S.DeletePanel>
          <h2>삭제 확인</h2>
          <S.Warning><strong>! 삭제하면 되돌릴 수 없어요</strong><span>카드에 담긴 사진과 코멘트가 함께 삭제됩니다.</span></S.Warning>
          <S.DeleteSummary><strong>선택한 카드 {selected.length}개</strong><span>{cards.filter((card) => card.tripId != null && selected.includes(card.tripId)).map((card) => card.title || '여행 카드').join(' · ') || '선택된 카드가 없습니다.'}</span><span>사진과 코멘트가 함께 삭제됩니다.</span></S.DeleteSummary>
          <S.DeleteActions>
            <S.DeleteButton type="button" disabled={selected.length === 0} onClick={handleDelete}>{selected.length}개 삭제하기</S.DeleteButton>
            <PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.tripCards })}>취소</PartTripButton>
          </S.DeleteActions>
        </S.DeletePanel>
      </S.DeleteLayout>
    </>
  )
}
