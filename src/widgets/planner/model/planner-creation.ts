import type { PlannerBlockDto } from '@/entities/planner'
import { readSessionValue, removeSessionValue, writeSessionValue } from '@/shared/libs/session-storage'

const PLANNER_CREATION_DRAFT_KEY = 'parttrip:planner-creation-draft'

export type PlannerCreationDraft = {
  cityName: string
  startDate: string
  endDate: string
  blocks?: PlannerBlockDto[]
  isSolo?: boolean
  memberCount?: number
}

export function readPlannerCreationDraft(): PlannerCreationDraft | undefined {
  try {
    const value = JSON.parse(readSessionValue(PLANNER_CREATION_DRAFT_KEY) ?? 'null') as Partial<PlannerCreationDraft> | null
    if (!value || typeof value.cityName !== 'string' || typeof value.startDate !== 'string' || typeof value.endDate !== 'string') return undefined
    return {
      cityName: value.cityName,
      startDate: value.startDate,
      endDate: value.endDate,
      blocks: Array.isArray(value.blocks) ? value.blocks : [],
      isSolo: value.isSolo,
      memberCount: value.memberCount,
    }
  } catch {
    return undefined
  }
}

export function writePlannerCreationDraft(draft: PlannerCreationDraft) {
  writeSessionValue(PLANNER_CREATION_DRAFT_KEY, JSON.stringify(draft))
}

export function clearPlannerCreationDraft() {
  removeSessionValue(PLANNER_CREATION_DRAFT_KEY)
}
