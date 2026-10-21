import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { formatCalendarDate, getMonthCalendarDays } from '@/shared/utils'
import * as S from './DatePicker.styles'

type DatePickerProps = {
  id: string
  label: string
  value: string
  min?: string
  max?: string
  isDateDisabled?: (date: string) => boolean
  onChange: (value: string) => void
}

function CalendarIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4M17 3v4M3 11h18M8 15h2M14 15h2" /></svg>
}

export function DatePicker({ id, label, value, min, max, isDateDisabled, onChange }: DatePickerProps) {
  const panelId = useId()
  const headingId = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(() => new Date())
  const now = new Date()
  const today = formatCalendarDate(now.getFullYear(), now.getMonth(), now.getDate())
  const allowed = (date: string) => (!min || date >= min) && (!max || date <= max) && !isDateDisabled?.(date)
  const days = getMonthCalendarDays(month.getFullYear(), month.getMonth())
  const dateFor = (day: number) => formatCalendarDate(month.getFullYear(), month.getMonth(), day)
  const firstAvailable = days.find((day) => day && allowed(dateFor(day)))
  const tabDate = days.some((day) => day && dateFor(day) === value && allowed(value))
    ? value : firstAvailable ? dateFor(firstAvailable) : ''

  useLayoutEffect(() => {
    if (!open) return
    const popup = panel.current!
    const position = () => {
      const field = trigger.current!.getBoundingClientRect()
      const bounds = popup.getBoundingClientRect()
      popup.style.left = `${Math.max(8, Math.min(field.left, window.innerWidth - bounds.width - 8))}px`
      const below = field.bottom + 8
      popup.style.top = `${Math.max(8, Math.min(below + bounds.height <= window.innerHeight - 8 ? below : field.top - bounds.height - 8, window.innerHeight - bounds.height - 8))}px`
    }
    popup.showPopover()
    position()
    const observer = new ResizeObserver(position)
    observer.observe(popup)
    popup.querySelector<HTMLButtonElement>('[data-date][tabindex="0"]')?.focus({ preventScroll: true })
    window.addEventListener('resize', position)
    window.addEventListener('scroll', position, true)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', position)
      window.removeEventListener('scroll', position, true)
    }
  }, [open])

  const close = () => {
    panel.current?.hidePopover()
    setOpen(false)
    trigger.current?.focus({ preventScroll: true })
  }

  const select = (date: string) => {
    if (date && !allowed(date)) return
    onChange(date)
    close()
  }

  const moveMonth = (offset: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + offset, 1))
  const previousEnd = formatCalendarDate(month.getFullYear(), month.getMonth(), 1)
  const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1)
  const nextMonthDate = formatCalendarDate(nextMonth.getFullYear(), nextMonth.getMonth(), 1)

  const navigateDays = (event: KeyboardEvent<HTMLButtonElement>, date: string) => {
    const next = new Date(`${date}T12:00:00`)
    const offsets: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, Home: -next.getDay(), End: 6 - next.getDay() }
    if (event.key === 'PageUp' || event.key === 'PageDown') next.setMonth(next.getMonth() + (event.key === 'PageUp' ? -1 : 1), 1)
    else if (event.key in offsets) next.setDate(next.getDate() + offsets[event.key])
    else return
    event.preventDefault()
    let nextDate = formatCalendarDate(next.getFullYear(), next.getMonth(), next.getDate())
    if (min && nextDate < min) nextDate = min
    if (max && nextDate > max) nextDate = max
    const direction = nextDate < date ? -1 : 1
    const target = new Date(`${nextDate}T12:00:00`)
    const targetMonth = target.getMonth()
    while (!allowed(nextDate)) {
      target.setDate(target.getDate() + direction)
      if (target.getMonth() !== targetMonth) return
      nextDate = formatCalendarDate(target.getFullYear(), target.getMonth(), target.getDate())
    }
    setMonth(new Date(target.getFullYear(), target.getMonth(), 1))
    requestAnimationFrame(() => panel.current?.querySelector<HTMLButtonElement>(`[data-date="${nextDate}"]`)?.focus())
  }

  return <S.Field>
    <S.Trigger ref={trigger} id={id} type="button" $empty={!value} aria-label={`${label}: ${value ? value.replaceAll('-', '.') : '날짜 선택'}`} aria-haspopup="dialog" aria-expanded={open} aria-controls={panelId} onClick={() => {
      if (open) return close()
      const initial = value && (!min || value >= min) ? value : min || today
      const bounded = max && initial > max ? max : initial
      const date = new Date(`${bounded}T12:00:00`)
      setMonth(new Date(date.getFullYear(), date.getMonth(), 1))
      setOpen(true)
    }}><span>{value ? value.replaceAll('-', '. ') : '날짜 선택'}</span><CalendarIcon /></S.Trigger>
    <S.Panel ref={panel} id={panelId} popover="auto" role="dialog" aria-labelledby={headingId} onToggle={(event) => { if (event.newState === 'closed') setOpen(false) }}>
      <S.Header>
        <div><S.Label>{label} 선택</S.Label><h3 id={headingId} aria-live="polite">{month.getFullYear()}년 {month.getMonth() + 1}월</h3></div>
        <S.Navigation>
          <button type="button" aria-label="이전 달" disabled={Boolean(min && previousEnd <= min.slice(0, 7) + '-01')} onClick={() => moveMonth(-1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg></button>
          <button type="button" aria-label="다음 달" disabled={Boolean(max && nextMonthDate > max)} onClick={() => moveMonth(1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg></button>
        </S.Navigation>
      </S.Header>
      <S.Weekdays aria-hidden="true">{['일', '월', '화', '수', '목', '금', '토'].map((day) => <span key={day}>{day}</span>)}</S.Weekdays>
      <S.Days>{days.map((day, index) => {
        if (!day) return <span key={`empty-${index}`} />
        const date = dateFor(day)
        return <S.Day key={date} type="button" data-date={date} disabled={!allowed(date)} tabIndex={date === tabDate ? 0 : -1} $selected={date === value} $today={date === today} aria-label={`${month.getFullYear()}년 ${month.getMonth() + 1}월 ${day}일`} aria-pressed={date === value} aria-current={date === today ? 'date' : undefined} onKeyDown={(event) => navigateDays(event, date)} onClick={() => select(date)}>{day}</S.Day>
      })}</S.Days>
      <S.Footer><button type="button" disabled={!value} onClick={() => select('')}>선택 해제</button><button type="button" disabled={!allowed(today)} onClick={() => select(today)}>오늘</button></S.Footer>
    </S.Panel>
  </S.Field>
}
