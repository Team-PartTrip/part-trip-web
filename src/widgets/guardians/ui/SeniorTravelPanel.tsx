import { useState, type ReactNode } from 'react'
import {
  useSeniorLocationQuery,
  useSeniorPlannersQuery,
  useSeniorScheduleQuery,
} from '@/entities/guardian'
import type { GuardianLinkDto } from '@/entities/guardian/api'
import { Button } from '@/shared/ui/parttrip'
import * as S from './GuardiansPage.styles'

export function SeniorTravelPanel({
  senior,
  seniorLabel,
  dateTimeFormatter,
}: {
  senior: GuardianLinkDto
  seniorLabel: string
  dateTimeFormatter: Intl.DateTimeFormat
}) {
  const [selectedPlannerId, setSelectedPlannerId] = useState(0)
  const seniorPlanners = useSeniorPlannersQuery(senior.userId)
  const selectedPlanner = seniorPlanners.data?.find((planner) => planner.plannerId === selectedPlannerId) ?? seniorPlanners.data?.[0]
  const seniorSchedule = useSeniorScheduleQuery(senior.userId, selectedPlanner?.plannerId)
  const seniorLocation = useSeniorLocationQuery(senior.userId)
  let locationContent: ReactNode

  if (seniorLocation.isLoading) {
    locationContent = <S.Message role="status">위치를 확인하고 있어요.</S.Message>
  } else if (seniorLocation.isError) {
    locationContent = <>
      <S.Message $error role="alert">현재 위치를 불러오지 못했어요.</S.Message>
      <Button type="button" $variant="secondary" onClick={() => void seniorLocation.refetch()}>다시 시도</Button>
    </>
  } else if (!seniorLocation.data) {
    locationContent = <S.Message>여행 중 앱을 열면 현재 위치가 여기에 표시돼요.</S.Message>
  } else {
    locationContent = <>
      <S.Message>마지막 확인 {dateTimeFormatter.format(new Date(seniorLocation.data.recordedAt))}</S.Message>
      <S.MapLink
        href={`https://maps.google.com/?q=${seniorLocation.data.latitude},${seniorLocation.data.longitude}`}
        target="_blank"
        rel="noreferrer"
      >
        지도에서 위치 보기
      </S.MapLink>
    </>
  }

  let plannerContent: ReactNode
  if (seniorPlanners.isLoading) {
    plannerContent = <S.Message role="status">여행 계획을 불러오고 있어요.</S.Message>
  } else if (seniorPlanners.isError) {
    plannerContent = <S.Message $error role="alert">여행 계획을 불러오지 못했어요.</S.Message>
  } else if (!seniorPlanners.data?.length) {
    plannerContent = <S.Message>아직 공유된 여행 계획이 없어요.</S.Message>
  } else {
    let scheduleContent: ReactNode
    if (seniorSchedule.isLoading) {
      scheduleContent = <S.Message role="status">일정을 불러오고 있어요.</S.Message>
    } else if (seniorSchedule.isError) {
      scheduleContent = <S.Message $error role="alert">일정을 불러오지 못했어요.</S.Message>
    } else {
      const days = seniorSchedule.data?.days ?? []
      scheduleContent = <S.ScheduleList>
        {days.map((day, index) => (
          <li key={day.date ?? index}>
            <strong>{day.date || `${index + 1}일차`}</strong>
            <span>{(day.slots ?? []).map((slot) => slot.place?.name).filter(Boolean).join(' · ') || '등록된 장소가 없어요.'}</span>
          </li>
        ))}
        {!days.length ? <S.Message>등록된 일정이 없어요.</S.Message> : null}
      </S.ScheduleList>
    }

    plannerContent = <>
      <S.PlannerSelect
        aria-label={`${seniorLabel}의 여행 선택`}
        value={selectedPlanner?.plannerId ?? ''}
        onChange={(event) => setSelectedPlannerId(Number(event.target.value))}
      >
        {seniorPlanners.data.map((planner) => (
          <option key={planner.plannerId} value={planner.plannerId}>
            {planner.title || `${planner.cityName || '여행'} 일정`}
          </option>
        ))}
      </S.PlannerSelect>
      {scheduleContent}
    </>
  }

  return (
    <S.Card>
      <h2>{seniorLabel}의 일정과 현재 위치</h2>
      <p>여행 중 앱을 열면 최근 위치를 확인할 수 있어요. 위치는 12시간 후 삭제돼요.</p>
      <S.GuardianDetails>
        <section>
          <h3>현재 위치</h3>
          {locationContent}
        </section>
        <section>
          <h3>여행 일정</h3>
          {plannerContent}
        </section>
      </S.GuardianDetails>
    </S.Card>
  )
}
