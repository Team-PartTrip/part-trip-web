type LatLng = { getLat(): number; getLng(): number }
type Bounds = { extend(position: LatLng): void }
type MapView = { setBounds(bounds: Bounds): void; setCenter(position: LatLng): void; relayout(): void }
type MapItem = { setMap(map: MapView | null): void }
type GeocodedAddress = { road_address?: { address_name?: string } | null; address?: { address_name?: string } | null }

export type KakaoMaps = {
  load(callback: () => void): void
  LatLng: new (latitude: number, longitude: number) => LatLng
  LatLngBounds: new () => Bounds
  Map: new (container: HTMLElement, options: { center: LatLng; level: number }) => MapView
  Marker: new (options: { map: MapView; position: LatLng; title: string }) => MapItem
  CustomOverlay: new (options: { map: MapView; position: LatLng; content: HTMLElement; yAnchor: number }) => MapItem
  services: {
    Status: { OK: string }
    Geocoder: new () => { coord2Address(longitude: number, latitude: number, callback: (addresses: GeocodedAddress[], status: string) => void): void }
  }
}

let sdkPromise: Promise<KakaoMaps> | undefined

export function hasMapCoordinates(point: { latitude?: number | null; longitude?: number | null }): point is { latitude: number; longitude: number } {
  return typeof point.latitude === 'number' && Number.isFinite(point.latitude) && Math.abs(point.latitude) <= 90
    && typeof point.longitude === 'number' && Number.isFinite(point.longitude) && Math.abs(point.longitude) <= 180
}

export function loadKakaoMaps(): Promise<KakaoMaps> {
  if (sdkPromise) return sdkPromise
  sdkPromise = new Promise((resolve, reject) => {
    const key = import.meta.env?.VITE_KAKAO_JAVASCRIPT_KEY?.trim()
    if (!key) { reject(new Error('카카오 지도 설정을 확인해주세요.')); return }
    const script = document.createElement('script')
    const timer = window.setTimeout(() => fail(), 15000)
    const fail = () => {
      window.clearTimeout(timer)
      script.remove()
      reject(new Error('카카오 지도를 불러오지 못했어요. 잠시 후 다시 시도해주세요.'))
    }
    script.async = true
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&autoload=false&libraries=services`
    script.onerror = fail
    script.onload = () => {
      const maps = (window as Window & { kakao?: { maps?: KakaoMaps } }).kakao?.maps
      if (!maps) { fail(); return }
      maps.load(() => {
        window.clearTimeout(timer)
        resolve(maps)
      })
    }
    document.head.append(script)
  })
  void sdkPromise.catch(() => { sdkPromise = undefined })
  return sdkPromise
}

export async function addressForCoordinates(latitude: number, longitude: number) {
  if (!hasMapCoordinates({ latitude, longitude })) throw new Error('현재 위치 좌표가 올바르지 않아요.')
  const maps = await loadKakaoMaps()
  return new Promise<{ name: string; address: string; latitude: number; longitude: number }>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error('현재 위치의 주소를 확인하지 못했어요. 다시 시도하거나 다른 곳 찾기를 이용해주세요.')), 10000)
    new maps.services.Geocoder().coord2Address(longitude, latitude, (addresses, status) => {
      window.clearTimeout(timer)
      const first = Array.isArray(addresses) ? addresses[0] : undefined
      const value = first?.road_address?.address_name || first?.address?.address_name
      const address = typeof value === 'string' ? value.trim() : undefined
      if (status !== maps.services.Status.OK || !address) {
        reject(new Error('현재 위치의 주소를 확인하지 못했어요. 다른 곳 찾기를 이용해주세요.'))
        return
      }
      resolve({ name: address, address, latitude, longitude })
    })
  })
}
