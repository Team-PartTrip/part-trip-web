type TripSource = {
  countryInfoId?: number
  images?: string[]
  places?: Array<{ dayNumber?: number; placeName?: string; placeSub?: string }>
}

type TripDraft = {
  content: string
  endDate: string
  startDate: string
  title: string
}

export function toTripUpdateRequest(source: TripSource, draft: TripDraft) {
  return {
    ...draft,
    countryInfoId: source.countryInfoId,
    images: source.images ?? [],
    places: (source.places ?? []).map(({ dayNumber, placeName, placeSub }) => ({ dayNumber, placeName, placeSub })),
  }
}
