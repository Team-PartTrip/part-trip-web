type DatedTravelCard = { startDate?: string | null }
type DatedTimelineItem = { date?: string | null; takenAt?: string | null }

export function sortTravelRecordsNewestFirst<T extends DatedTravelCard>(records: readonly T[]) {
  return records
    .map((record, index) => ({ index, timestamp: record.startDate ? Date.parse(record.startDate) : Number.NaN, record }))
    .sort((left, right) => {
      const leftHasDate = Number.isFinite(left.timestamp)
      const rightHasDate = Number.isFinite(right.timestamp)
      if (leftHasDate && rightHasDate) return right.timestamp - left.timestamp
      if (leftHasDate !== rightHasDate) return leftHasDate ? -1 : 1
      return left.index - right.index
    })
    .map(({ record }) => record)
}

export function sortTravelTimelineChronologically<T extends DatedTimelineItem>(items: readonly T[]) {
  const timestampOf = (item: T) => {
    const takenAt = item.takenAt ? Date.parse(item.takenAt) : Number.NaN
    if (Number.isFinite(takenAt)) return takenAt
    const date = item.date ? Date.parse(item.date) : Number.NaN
    return Number.isFinite(date) ? date : undefined
  }

  return items
    .map((item, index) => ({ index, item, timestamp: timestampOf(item) }))
    .sort((left, right) => {
      if (left.timestamp != null && right.timestamp != null) return left.timestamp - right.timestamp
      if (left.timestamp != null || right.timestamp != null) return left.timestamp != null ? -1 : 1
      return left.index - right.index
    })
    .map(({ item }) => item)
}
