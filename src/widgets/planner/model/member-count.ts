export function isValidPlannerMemberCount(value: number, isSolo: boolean) {
  return Number.isSafeInteger(value) && value >= (isSolo ? 1 : 2) && value <= 30
}
