import { Fragment, useState } from 'react'
import type { PlannerScheduleSlotDto } from '@/entities/planner'
import { Button } from '@/shared/ui/parttrip'
import { getKakaoMapUrl, getRouteFailureMessage } from '@/widgets/planner/model/schedule-edit'
import { PlannerScheduleAttribution, PlannerScheduleRouteLine } from '@/widgets/planner/ui/PlannerScheduleRoute'
import { RestroomNote } from '@/widgets/planner/ui/RestroomNote'
import { readVisitedStops, saveVisitedStops } from '../model/visited-stops'
import * as S from './MainPage.styles'

export function TodaySchedule({ date, slots }: { date: string; slots: PlannerScheduleSlotDto[] }) {
  const [visited, setVisited] = useState(() => readVisitedStops(date))
  const [storageError, setStorageError] = useState(false)
  const places = slots.filter((slot) => slot.place || slot.tourPlaceId)
  const nextIndex = places.findIndex((slot) => !slot.slotId || !visited.includes(slot.slotId))

  return <S.TodaySchedule aria-label="오늘 갈 곳">
    <S.SectionTitle>오늘 갈 곳</S.SectionTitle>
    {!places.length ? <p>오늘 확정된 일정이 없어요.</p> : nextIndex < 0 ? <p role="status">오늘 일정을 모두 다녀왔어요.</p> : null}
    {places.map((slot, index) => {
      const place = slot.place
      const name = place?.name?.trim() || `장소 ${slot.tourPlaceId ?? place?.tourPlaceId ?? index + 1}`
      const origin = places[index - 1]?.place
      const placeId = place?.tourPlaceId ?? slot.tourPlaceId
      const visitedSlot = slot.slotId != null && visited.includes(slot.slotId)
      const directions = getKakaoMapUrl(slot.routeFromPrevious?.transportMode ?? 'PUBLIC_TRANSIT', name, place?.latitude, place?.longitude, origin ?? undefined)
      const routeMessage = slot.routeStatus === 'CALCULATING' ? '경로를 계산하고 있어요.' : getRouteFailureMessage(slot.routeStatus)
      return <Fragment key={slot.slotId ?? index}>
        {slot.routeFromPrevious ? <PlannerScheduleRouteLine route={slot.routeFromPrevious} placeName={name}
          latitude={place?.latitude} longitude={place?.longitude} origin={origin ?? undefined} /> : routeMessage ? <p>{routeMessage}</p> : null}
        <S.TodayStop $visited={visitedSlot} $next={index === nextIndex} aria-label={name}>
          <div>
            <small>{index === nextIndex ? '다음 갈 곳' : `${index + 1}번째 장소`}</small>
            <h3>{name}</h3>
            {place?.categoryLabel || place?.category ? <small>{place.categoryLabel || place.category}</small> : null}
            {placeId ? <RestroomNote tourPlaceId={placeId} /> : null}
            {!slot.routeFromPrevious && directions ? <a href={directions} target="_blank" rel="noopener noreferrer" aria-label={`${name} 카카오맵에서 길 안내 열기`}>길 안내</a> : null}
          </div>
          <Button type="button" $variant="secondary" aria-pressed={visitedSlot} aria-label={`${name} 다녀왔어요`}
            disabled={!Number.isSafeInteger(slot.slotId) || (slot.slotId ?? 0) <= 0} onClick={() => {
              const next = visitedSlot ? visited.filter((id) => id !== slot.slotId) : [...visited, slot.slotId!]
              setVisited(next)
              setStorageError(!saveVisitedStops(date, next))
            }}>{visitedSlot ? '✓ 다녀왔어요' : '다녀왔어요'}</Button>
        </S.TodayStop>
      </Fragment>
    })}
    {slots.some((slot) => slot.routeFromPrevious?.transportMode === 'PUBLIC_TRANSIT') ? <PlannerScheduleAttribution /> : null}
    {storageError ? <p role="alert">방문 표시를 저장하지 못했어요. 이 화면에서는 유지되지만 새로고침하면 사라질 수 있어요.</p> : null}
  </S.TodaySchedule>
}
