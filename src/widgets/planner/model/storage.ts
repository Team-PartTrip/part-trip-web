export type PlannerGroupSettings = {
  isSolo: boolean
  memberCount: number
}

export const ACTIVE_VOTE_ID_KEY = 'parttrip:active-vote-id'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function parsePlannerGroupSettings(value: string | null): PlannerGroupSettings {
  try {
    const parsed: unknown = JSON.parse(value ?? '{}')
    const stored = isRecord(parsed) ? parsed : {}
    const isSolo = stored.isSolo === true
    const memberCount = stored.memberCount

    return {
      isSolo,
      memberCount:
        typeof memberCount === 'number' &&
        Number.isSafeInteger(memberCount) &&
        memberCount >= 1 &&
        memberCount <= 30
          ? isSolo ? memberCount : Math.max(2, memberCount)
          : isSolo ? 1 : 2,
    }
  } catch {
    return { isSolo: false, memberCount: 2 }
  }
}

export function parsePlannerSelectedIndexes(value: string | null) {
  try {
    const parsed: unknown = JSON.parse(value ?? '[]')
    return Array.isArray(parsed) &&
      parsed.every((item): item is number => Number.isSafeInteger(item) && item >= 0)
      ? parsed
      : []
  } catch {
    return []
  }
}
