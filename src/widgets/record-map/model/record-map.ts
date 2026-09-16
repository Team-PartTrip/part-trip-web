type MapPosition = {
  left: number
  top: number
}

const OSAKA_MAP_BOUNDS = {
  east: 135.6,
  north: 34.75,
  south: 34.6,
  west: 135.42,
}

export function mapPosition(latitude?: number, longitude?: number): MapPosition | null {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
  if (latitude! < OSAKA_MAP_BOUNDS.south || latitude! > OSAKA_MAP_BOUNDS.north || longitude! < OSAKA_MAP_BOUNDS.west || longitude! > OSAKA_MAP_BOUNDS.east) return null
  return {
    left: (longitude! - OSAKA_MAP_BOUNDS.west) / (OSAKA_MAP_BOUNDS.east - OSAKA_MAP_BOUNDS.west) * 100,
    top: (OSAKA_MAP_BOUNDS.north - latitude!) / (OSAKA_MAP_BOUNDS.north - OSAKA_MAP_BOUNDS.south) * 100,
  }
}

export function routeSegment(start: MapPosition, end: MapPosition) {
  const deltaX = end.left - start.left
  const deltaY = end.top - start.top
  return {
    angle: Math.atan2(deltaY, deltaX) * 180 / Math.PI,
    left: start.left,
    length: Math.hypot(deltaX, deltaY),
    top: start.top,
  }
}
