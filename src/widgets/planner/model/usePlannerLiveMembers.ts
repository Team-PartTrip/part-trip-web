import { useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { usePlannerMembersQuery, type PlannerDetailResponseDto } from '@/entities/planner'
import { paths } from '@/shared/config'
import { clearPlannerSession } from './planner-session'

export { isPlannerFinished } from './planner-role'
import { shouldPollPlannerMembers } from './planner-role'

export function usePlannerLiveMembers(plannerId: number, detail?: PlannerDetailResponseDto) {
  const navigate = useNavigate()
  const notified = useRef<number | null>(null)
  const poll = shouldPollPlannerMembers(detail)
  const query = usePlannerMembersQuery(plannerId, detail != null, poll)
  const status = (query.error as { response?: { status?: number } } | null)?.response?.status
  useEffect(() => {
    if (!poll || !status || ![400, 403, 404].includes(status) || notified.current === plannerId) return
    notified.current = plannerId
    clearPlannerSession()
    window.alert('이 플래너에서 나가졌어요')
    void navigate({ to: paths.planner, replace: true })
  }, [navigate, plannerId, poll, status])
  return query
}
