import { useState } from 'react'
import {
  DashboardCalendarIcon,
  DashboardChevronLeftIcon,
  DashboardChevronRightIcon,
} from '@shared/assets'
import type { FestivalResponseDto } from '@shared/api'

import * as S from './Festival.styles'

const calendarDays = [
  '28', '29', '30', '30', '30', '1', '2',
  '3', '4', '5', '6', '7', '8', '9',
  '10', '11', '12', '13', '14', '15', '16',
  "17", "18", "19", "20", "21", "22", "23",
]

type Props = {
  festivals?: FestivalResponseDto[]
}

const Festival = ({ festivals = [] }: Props) => {
  const [monthOffset, setMonthOffset] = useState(0)
  const month = 6 + monthOffset
  const eventDays = new Set(
    festivals
      .filter((festival) => Number(festival.startDate?.slice(5, 7)) === month)
      .map((festival) => String(Number(festival.startDate?.slice(8, 10)))),
  )

  return (
    <S.Card>
      <S.Header>
        <DashboardCalendarIcon aria-hidden="true" />
        <h2>축제 캘린더</h2>
      </S.Header>
      <S.Calendar>
        <S.CalendarTop>
          <strong>2026년 {month}월</strong>
          <div>
            <button type="button" aria-label="이전 달" onClick={() => setMonthOffset((value) => Math.max(-1, value - 1))}><DashboardChevronLeftIcon /></button>
            <button type="button" aria-label="다음 달" onClick={() => setMonthOffset((value) => Math.min(1, value + 1))}><DashboardChevronRightIcon /></button>
          </div>
        </S.CalendarTop>
        <S.Grid>
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <S.Weekday key={day}>{day}</S.Weekday>
          ))}
          {calendarDays.map((day, index) => (
            <S.Day key={`${day}-${index}`} $muted={index < 5} $event={eventDays.has(day)} $selected={day === '8'}>
              {day}
            </S.Day>
          ))}
        </S.Grid>
      </S.Calendar>
    </S.Card>
  )
}

export default Festival
