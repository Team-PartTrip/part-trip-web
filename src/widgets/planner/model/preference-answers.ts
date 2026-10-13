import type { TravelPreferenceRequestDto, TravelPreferenceResponseDto } from '@/entities/user'

export type Mobility = 'WHEELCHAIR' | 'WALKING' | 'STAIRS'
export type AvoidFood = NonNullable<TravelPreferenceRequestDto['avoidFoods']>[number]

export function togglePreference<T>(selected: T[] | null, value: T | null): T[] {
  if (value === null) return []
  return selected?.includes(value) ? selected.filter(item => item !== value) : [...(selected ?? []), value]
}

export function getPreferenceAnswers(
  preferences: TravelPreferenceResponseDto | undefined,
  mobility: Mobility[] | null,
  foods: AvoidFood[] | null,
): TravelPreferenceRequestDto | undefined {
  if (!preferences) return
  const answers: Partial<TravelPreferenceRequestDto> = {}
  if (preferences.usesWheelchair == null && preferences.limitedWalking == null && mobility !== null) {
    answers.usesWheelchair = mobility.includes('WHEELCHAIR')
    answers.limitedWalking = mobility.includes('WALKING')
    if (answers.usesWheelchair || mobility.includes('STAIRS')) answers.canUseStairs = false
  }
  if (preferences.avoidFoods == null && foods !== null) answers.avoidFoods = foods
  if (!Object.keys(answers).length) return
  return {
    preferredTransport: preferences.preferredTransport ?? 'PUBLIC_TRANSIT',
    dailyScheduleCount: preferences.dailyScheduleCount ?? 3,
    canUseStairs: preferences.canUseStairs ?? true,
    ...answers,
  }
}
