import { useState } from 'react'

import { formatCalendarDate, getMonthCalendarDays } from '@/shared/utils'

type DateSetter = (value: string) => void

export function usePlannerCalendar(
  selectedStartDate: string,
  selectedEndDate: string,
  setStartDate: DateSetter,
  setEndDate: DateSetter,
) {
  const [calendarMonthOverride, setCalendarMonthOverride] = useState<Date>()
  const calendarMonth =
    calendarMonthOverride ??
    (() => {
      const baseDate = selectedStartDate
        ? new Date(`${selectedStartDate}T00:00:00`)
        : new Date()
      return Number.isNaN(baseDate.getTime())
        ? new Date()
        : new Date(baseDate.getFullYear(), baseDate.getMonth(), 1)
    })()
  const calendarDays = getMonthCalendarDays(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth(),
  )
  const handleCalendarDay = (day: number) => {
    const date = formatCalendarDate(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
    if (!selectedStartDate || selectedEndDate) {
      setStartDate(date)
      setEndDate('')
      return
    }
    if (date < selectedStartDate) {
      setStartDate(date)
      setEndDate(selectedStartDate)
      return
    }
    setEndDate(date)
  }

  return {
    calendarDays,
    calendarMonth,
    handleCalendarDay,
    setCalendarMonthOverride,
  }
}
