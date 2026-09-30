export function festivalMatchesCity(address: string | undefined, city: string | undefined) {
  const name = city?.trim().toLowerCase()
  return !name || (address ?? '').trim().toLowerCase().split(/\s+/).slice(0, 2).some((word) => word.startsWith(name))
}
