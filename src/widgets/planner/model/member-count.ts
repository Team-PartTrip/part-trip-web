import type { PlannerBlockDto } from '@/entities/planner'

export function isValidPlannerMemberCount(value: number, isSolo: boolean) {
  return Number.isSafeInteger(value) && value >= (isSolo ? 1 : 2) && value <= 30
}

export function getPlannerTravelParty(blocks: PlannerBlockDto[]) {
  const companion = blocks.find((block) => block.type === 'COMPANION')?.value.trim()
  if (!companion) return undefined

  const isSolo = /혼자|나홀로|solo/i.test(companion)
  const count = Number(blocks.find((block) => block.type === 'PARTY_SIZE')?.value.match(/\d+/)?.[0])
  return { isSolo, memberCount: isSolo ? 1 : Number.isInteger(count) && count >= 2 && count <= 30 ? count : 2 }
}
