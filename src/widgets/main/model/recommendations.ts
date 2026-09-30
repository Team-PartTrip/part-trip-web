import type { TourPlaceResponseDto } from '../../../entities/travel/api.ts'

function recommendationKey(place: TourPlaceResponseDto) {
  return String(place.tourPlaceId ?? `${place.placeName ?? ''}|${place.address ?? ''}|${place.latitude ?? ''}|${place.longitude ?? ''}`)
}

function shuffle<T>(items: T[]) {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]]
  }
  return shuffled
}

export function pickRecommendations(places: TourPlaceResponseDto[], current: TourPlaceResponseDto[] = []) {
  const rated = shuffle(places.filter((place) => (place.rating ?? 0) >= 4))
  const remaining = shuffle(places.filter((place) => (place.rating ?? 0) < 4))
  const candidates = rated.length >= 3 ? rated : [...rated, ...remaining]
  const selected: TourPlaceResponseDto[] = []
  for (const pool of [rated, remaining]) {
    for (const place of pool) {
      if (selected.length === 3) break
      if (place.category && selected.some((item) => item.category === place.category)) continue
      selected.push(place)
    }
    for (const place of pool) {
      if (selected.length === 3) break
      if (!selected.includes(place)) selected.push(place)
    }
    if (selected.length === 3) break
  }
  if (selected.length > 1 && current.length === selected.length && selected.every((place, index) => recommendationKey(place) === recommendationKey(current[index]))) {
    const currentKeys = new Set(current.map(recommendationKey))
    const alternatives = shuffle(candidates.filter((place) => !currentKeys.has(recommendationKey(place))))
    const replacement = alternatives.find((place) => (place.rating ?? 0) >= 4) ?? alternatives[0]
    if (replacement) {
      const sameCategory = selected.findIndex((place) => place.category === replacement.category)
      const lowerRated = selected.findIndex((place) => (place.rating ?? 0) < 4)
      selected[sameCategory >= 0 ? sameCategory : lowerRated >= 0 ? lowerRated : selected.length - 1] = replacement
    }
    else selected.push(selected.shift()!)
  }
  return selected
}

export function readRecommendations(city: string, places: TourPlaceResponseDto[]) {
  try {
    const stored = window.localStorage.getItem(`parttrip:main-recommendations:${encodeURIComponent(city)}`)
    if (!stored) return undefined
    const saved = JSON.parse(stored)
    if (!Array.isArray(saved) || !saved.every((key) => typeof key === 'string')) return undefined
    const byKey = new Map(places.map((place) => [recommendationKey(place), place]))
    const selected = [...new Set(saved)].flatMap((key) => byKey.has(key) ? [byKey.get(key)!] : []).slice(0, 3)
    return [...selected, ...pickRecommendations(places.filter((place) => !selected.includes(place)))].slice(0, 3)
  } catch {
    return undefined
  }
}

export function saveRecommendations(city: string, places: TourPlaceResponseDto[]) {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(`parttrip:main-recommendations:${encodeURIComponent(city)}`, JSON.stringify(places.map(recommendationKey)))
  } catch {
    // Storage can be unavailable in private browsing; recommendations still work for this page view.
  }
}
