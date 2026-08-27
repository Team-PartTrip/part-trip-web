export type PlannerGroupSettings = {
  isSolo: boolean
  memberCount: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function parsePlannerGroupSettings(value: string | null): PlannerGroupSettings {
  try {
    const parsed: unknown = JSON.parse(value ?? '{}')
    const stored = isRecord(parsed) ? parsed : {}
    const memberCount = stored.memberCount

    return {
      isSolo: stored.isSolo === true,
      memberCount:
        typeof memberCount === 'number' &&
        Number.isSafeInteger(memberCount) &&
        memberCount >= 1 &&
        memberCount <= 30
          ? memberCount
          : 1,
    }
  } catch {
    return { isSolo: false, memberCount: 1 }
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
