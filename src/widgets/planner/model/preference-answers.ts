import type { TravelPreferenceRequestDto, TravelPreferenceResponseDto } from '@/entities/user'

export type Mobility = 'WHEELCHAIR' | 'WALKING' | 'STAIRS'
export type AvoidFood = NonNullable<TravelPreferenceRequestDto['avoidFoods']>[number]

export function togglePreference<T>(selected: T[] | null, value: T | null): T[] {
  if (value === null) return []
  return selected?.includes(value) ? selected.filter(item => item !== value) : [...(selected ?? []), value]
}

export function mobilityOf(preferences?: TravelPreferenceResponseDto): Mobility[] | null {
  if (!preferences || (preferences.usesWheelchair == null && preferences.limitedWalking == null)) return null
  const answers: Mobility[] = []
  if (preferences.usesWheelchair) answers.push('WHEELCHAIR')
  if (preferences.limitedWalking) answers.push('WALKING')
  if (!preferences.usesWheelchair && preferences.canUseStairs === false) answers.push('STAIRS')
  return answers
}

export function getPreferenceAnswers(
  preferences: TravelPreferenceResponseDto | undefined,
  mobility: Mobility[] | null,
  foods: AvoidFood[] | null,
): TravelPreferenceRequestDto | undefined {
  if (!preferences) return
  const answers: Partial<TravelPreferenceRequestDto> = {}
  if (mobility !== null) {
    const previous = mobilityOf(preferences)
    const changed = previous === null || previous.length !== mobility.length || previous.some(value => !mobility.includes(value))
    if (changed) {
      answers.usesWheelchair = mobility.includes('WHEELCHAIR')
      answers.limitedWalking = mobility.includes('WALKING')
      if (answers.usesWheelchair || mobility.includes('STAIRS')) answers.canUseStairs = false
      else if (previous?.includes('STAIRS')) answers.canUseStairs = true
    }
  }
  if (foods !== null && (preferences.avoidFoods == null || preferences.avoidFoods.length !== foods.length || preferences.avoidFoods.some(food => !foods.includes(food)))) answers.avoidFoods = foods
  if (!Object.keys(answers).length) return
  return {
    preferredTransport: preferences.preferredTransport ?? 'PUBLIC_TRANSIT',
    dailyScheduleCount: preferences.dailyScheduleCount ?? 3,
    canUseStairs: preferences.canUseStairs ?? true,
    ...answers,
  }
}
