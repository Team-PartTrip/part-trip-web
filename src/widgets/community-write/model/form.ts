export type DestinationCountry = {
  cityName?: string
  countryInfoId?: number
  countryName?: string
}

export function findCountryForDestination(
  countries: readonly DestinationCountry[],
  destination: string,
) {
  const normalizedDestination = destination.trim().toLocaleLowerCase()
  if (!normalizedDestination) return undefined

  return countries.find((country) =>
    [country.countryName, country.cityName]
      .filter((value): value is string => Boolean(value))
      .some((value) => normalizedDestination.includes(value.toLocaleLowerCase())),
  )
}

export function formatBoardContent(destination: string, content: string) {
  const normalizedDestination = destination.trim()
  const normalizedContent = content.trim()
  return normalizedDestination
    ? `[${normalizedDestination}]\n${normalizedContent}`
    : normalizedContent
}
