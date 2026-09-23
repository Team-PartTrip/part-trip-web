import { ACTIVE_PLANNER_ID_KEY } from '@/shared/config'
import { removeSessionValue, writeSessionValue } from '@/shared/libs/session-storage'

export function activatePlannerSession(plannerId: number) {
  writeSessionValue(ACTIVE_PLANNER_ID_KEY, String(plannerId))
}

export function clearPlannerSession() {
  removeSessionValue(ACTIVE_PLANNER_ID_KEY)
}
