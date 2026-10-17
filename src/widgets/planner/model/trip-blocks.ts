import type { PlannerBlockDto, PlannerBlockResponseDto } from '@/entities/planner'
import type { Mobility } from './preference-answers'
import type { PlannerCreationDraft } from './planner-creation'
import { getPlannerTravelParty } from './member-count.ts'

export function tripBlockOptions(block: PlannerBlockResponseDto, draft: PlannerCreationDraft) {
  const options = block.options ?? []
  const solo = draft.isSolo ?? getPlannerTravelParty(draft.blocks ?? [])?.isSolo
  if (block.type === 'COMPANION' && solo != null) return solo ? ['혼자'] : options.filter(value => !/혼자|나홀로|solo/i.test(value))
  if (block.type === 'LODGING_TYPE') return draft.startDate === draft.endDate ? ['숙박 없음'] : options.filter(value => value !== '숙박 없음')
  return options
}

export function tripBlocks(blocks: PlannerBlockDto[], draft: PlannerCreationDraft, mobility: Mobility[] | null) {
  const values = blocks.filter(block => block.type !== 'WALKING').filter(block => {
    if (!['COMPANION', 'LODGING_TYPE'].includes(block.type)) return true
    return tripBlockOptions({ type: block.type, options: [block.value] }, draft).includes(block.value)
  })
  if ((draft.isSolo ?? getPlannerTravelParty(draft.blocks ?? [])?.isSolo) === true && !values.some(block => block.type === 'COMPANION')) values.push({ type: 'COMPANION', value: '혼자' })
  if (draft.startDate === draft.endDate && !values.some(block => block.type === 'LODGING_TYPE')) values.push({ type: 'LODGING_TYPE', value: '숙박 없음' })
  if (mobility !== null) values.push({ type: 'WALKING', value: mobility.some(value => value === 'WHEELCHAIR' || value === 'WALKING') ? '걷기 최소화' : '조금 걷기' })
  return values
}
