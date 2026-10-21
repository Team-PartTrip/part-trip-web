import { useState } from 'react'
import type { PlannerSchedulePlaceDto } from '@/entities/planner'
import { getKakaoMapUrl } from '../model/schedule-edit'
import { PlannerPlaceAccessibility } from './PlannerPlaceAccessibility'
import { RestroomNote } from './RestroomNote'
import * as S from './PlannerAiFlow.styles'

export function PlannerSchedulePlaceCard({ place, index, confirmed }: { place: PlannerSchedulePlaceDto; index: number; confirmed: boolean }) {
  const [open, setOpen] = useState(false)
  return <S.PlaceDetails onToggle={(event) => setOpen(event.currentTarget.open)}>
    <summary>
      <b aria-hidden="true">{index + 1}</b>
      <span><small>{place.typeLabel ?? place.categoryLabel ?? place.category}</small><strong>{place.name}</strong>{confirmed && place.tourPlaceId ? <RestroomNote tourPlaceId={place.tourPlaceId} /> : null}<small className="place-preview">{place.description || place.address}</small></span>
    </summary>
    <div className="place-details-body">
      {place.imageUrl ? <img src={place.imageUrl} alt={`${place.name} 사진`} loading="lazy" onError={event => { event.currentTarget.hidden = true }} /> : null}
      <dl>
        <div><dt>분류</dt><dd>{place.typeLabel ?? place.categoryLabel ?? place.category ?? '등록된 분류가 없어요'}</dd></div>
        <div><dt>평점</dt><dd>{place.rating ?? '등록된 평점이 없어요'}</dd></div>
        <div><dt>주소</dt><dd>{place.address || '등록된 주소가 없어요'}</dd></div>
        <div><dt>설명</dt><dd>{place.description || '등록된 설명이 없어요'}</dd></div>
      </dl>
      {open && place.tourPlaceId ? <PlannerPlaceAccessibility tourPlaceId={place.tourPlaceId} /> : null}
      <a href={getKakaoMapUrl('PUBLIC_TRANSIT', place.name, place.latitude, place.longitude)} target="_blank" rel="noreferrer">지도로 보기</a>
    </div>
  </S.PlaceDetails>
}
