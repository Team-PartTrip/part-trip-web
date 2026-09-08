import {
  ACTIVE_PLANNER_ID_KEY,
  ACTIVE_VOTE_ID_KEY,
  PLANNER_CONFIRMED_KEY,
  PLANNER_SELECTED_KEY,
} from '@/shared/config'
import { removeSessionValue, writeSessionValue } from '@/shared/libs/session-storage'

export function activatePlannerSession(plannerId: number) {
  writeSessionValue(ACTIVE_PLANNER_ID_KEY, String(plannerId))
  removeSessionValue(ACTIVE_VOTE_ID_KEY)
  removeSessionValue(PLANNER_SELECTED_KEY)
}

export function clearPlannerVoteSession() {
  removeSessionValue(ACTIVE_VOTE_ID_KEY)
}

export function clearPlannerSession(plannerId?: number) {
  removeSessionValue(ACTIVE_PLANNER_ID_KEY)
  removeSessionValue(ACTIVE_VOTE_ID_KEY)
  removeSessionValue(PLANNER_SELECTED_KEY)
  if (plannerId != null) {
    removeSessionValue(`${PLANNER_CONFIRMED_KEY}:${plannerId}`)
  }
}
