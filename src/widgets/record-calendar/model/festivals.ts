import type { FestivalResponseDto } from '../../../entities/travel/api.ts'
import { formatDate } from '../../../shared/utils/date.ts'

export function festivalMatchesCity(address: string | undefined, city: string | undefined) {
  const name = city?.trim().toLowerCase()
  return !name || (address ?? '').trim().toLowerCase().split(/\s+/).slice(0, 2).some((word) => word.startsWith(name))
}

export function eventDateLabel(event: FestivalResponseDto) {
  const start = formatDate(event.startDate).slice(5)
  const end = event.endDate && event.endDate !== event.startDate ? ` – ${formatDate(event.endDate).slice(5)}` : ''
  return [event.startDate ? `${start}${end}` : undefined, event.startTime].filter(Boolean).join(' · ')
}
