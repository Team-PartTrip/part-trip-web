import type { PlannerScheduleResponseDto } from '../../../entities/planner/types.ts'

export function withRouteTimeout(schedule: PlannerScheduleResponseDto, timedOut: boolean): PlannerScheduleResponseDto {
  if (!timedOut) return schedule
  return {
    ...schedule,
    days: schedule.days?.map(day => ({
      ...day,
      slots: day.slots?.map(slot => slot.routeStatus === 'CALCULATING' ? { ...slot, routeStatus: 'API_ERROR' } : slot),
    })),
  }
}
