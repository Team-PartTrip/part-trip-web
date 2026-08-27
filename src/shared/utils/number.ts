export function isPositiveSafeInteger(
  value: number | undefined,
): value is number {
  return value != null && Number.isSafeInteger(value) && value > 0
}
