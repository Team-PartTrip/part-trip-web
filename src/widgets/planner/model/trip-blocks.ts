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
  const values = blocks.filter(block => {
    if (!['COMPANION', 'LODGING_TYPE'].includes(block.type)) return true
    return tripBlockOptions({ type: block.type, options: [block.value] }, draft).includes(block.value)
  })
  if ((draft.isSolo ?? getPlannerTravelParty(draft.blocks ?? [])?.isSolo) === true && !values.some(block => block.type === 'COMPANION')) values.push({ type: 'COMPANION', value: '혼자' })
  if (draft.startDate === draft.endDate && !values.some(block => block.type === 'LODGING_TYPE')) values.push({ type: 'LODGING_TYPE', value: '숙박 없음' })
  if (mobility?.includes('WALKING') && !values.some(block => block.type === 'WALKING')) values.push({ type: 'WALKING', value: '30분 이내' })
  return values
}

export function supportedPlannerBlocks(blocks: PlannerBlockDto[], definitions: PlannerBlockResponseDto[]) {
  const seen = new Map<string, Set<string>>()
  return blocks.flatMap(block => {
    const definition = definitions.find(item => item.type === block.type)
    const value = block.value.trim()
    const freeText = ['MUST_INCLUDE', 'EXCLUDE', 'DEPARTURE_PLACE'].includes(block.type)
    const numericDensity = block.type === 'DAILY_DENSITY' && /^(?:[1-6]|하루 [1-6]곳)$/.test(value)
    if (!definition || !value || (!freeText && !numericDensity && !definition.options?.includes(value))) return []
    const selected = seen.get(block.type) ?? new Set<string>()
    if (selected.has(value) || (!definition.multiple && selected.size > 0)) return []
    selected.add(value)
    seen.set(block.type, selected)
    return [{ ...block, value }]
  })
}
