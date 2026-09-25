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
    const isSolo = stored.isSolo === true
    const memberCount = stored.memberCount
    const defaultMemberCount = isSolo ? 1 : 2

    if (typeof memberCount !== 'number' || !Number.isSafeInteger(memberCount) || memberCount < 1 || memberCount > 30) {
      return { isSolo, memberCount: defaultMemberCount }
    }
    return { isSolo, memberCount: isSolo ? memberCount : Math.max(2, memberCount) }
  } catch {
    return { isSolo: false, memberCount: 2 }
  }
}
