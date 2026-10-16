import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/shared/ui/parttrip'
import { getErrorMessage } from '@/shared/utils'
import { hasMapCoordinates, loadKakaoMaps, type KakaoMaps } from '@/shared/libs/kakao-maps'
import type { getRecordLocations } from '../model/record-map'
import * as S from './RecordMapPage.styles'

type Props = {
  locations: ReturnType<typeof getRecordLocations>
  selectedIndex: number | null
  onSelect: (index: number) => void
}

export function RecordLocationMap({ locations, selectedIndex, onSelect }: Props) {
  const container = useRef<HTMLDivElement>(null)
  const mapRef = useRef<InstanceType<KakaoMaps['Map']> | null>(null)
  const pins = useRef<Array<{ index: number; position: InstanceType<KakaoMaps['LatLng']>; button: HTMLButtonElement }>>([])
  const [attempt, setAttempt] = useState(0)
  const [mapState, setMapState] = useState<{ status: 'loading' | 'ready' | 'error'; error?: string }>({ status: 'loading' })
  const { status, error } = mapState
  const points = useMemo(() => locations.flatMap((location, index) => hasMapCoordinates(location) ? [{ ...location, index }] : []), [locations])

  useEffect(() => {
    if (!points.length || !container.current) return
    let cancelled = false
    const items: Array<{ setMap(map: null): void }> = []
    let resize: ResizeObserver | undefined
    const element = container.current
    void loadKakaoMaps().then(maps => {
      if (cancelled) return
      const positions = points.map(point => new maps.LatLng(point.latitude, point.longitude))
      const map = new maps.Map(element, { center: positions[0], level: 4 })
      mapRef.current = map
      const bounds = new maps.LatLngBounds()
      positions.forEach(position => bounds.extend(position))
      const fit = () => { map.relayout(); if (points.length > 1) map.setBounds(bounds); else map.setCenter(positions[0]) }
      pins.current = points.map((point, index) => {
        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'record-map-pin'
        button.textContent = `${point.index + 1}. ${point.name}`
        button.title = point.name
        button.setAttribute('aria-label', `${point.name} 지도 핀`)
        button.onclick = () => onSelect(point.index)
        items.push(new maps.Marker({ map, position: positions[index], title: point.name }))
        items.push(new maps.CustomOverlay({ map, position: positions[index], content: button, yAnchor: 2 }))
        return { index: point.index, position: positions[index], button }
      })
      fit()
      resize = new ResizeObserver(fit)
      resize.observe(element)
      setMapState({ status: 'ready' })
    }).catch(reason => {
      if (!cancelled) { setMapState({ status: 'error', error: getErrorMessage(reason) }) }
    })
    return () => {
      cancelled = true
      resize?.disconnect()
      items.forEach(item => item.setMap(null))
      pins.current = []
      mapRef.current = null
      element.replaceChildren()
    }
  }, [onSelect, points, attempt])

  useEffect(() => {
    pins.current.forEach(pin => pin.button.setAttribute('aria-pressed', String(pin.index === selectedIndex)))
    const selected = pins.current.find(pin => pin.index === selectedIndex)
    if (selected) mapRef.current?.setCenter(selected.position)
  }, [selectedIndex, mapState])

  if (!points.length) return <S.MapState>지도에 표시할 좌표가 없어요. 장소를 확인하고 사진 위치를 등록해주세요.</S.MapState>
  return <S.MapFrame>
    <S.LiveMap ref={container} role="region" aria-label="방문 장소 지도" aria-busy={status === 'loading'} />
    {status === 'loading' ? <S.MapState role="status">방문 장소 지도를 불러오고 있어요.</S.MapState> : null}
    {status === 'error' ? <S.MapState role="alert">{error}<Button type="button" onClick={() => { setMapState({ status: 'loading' }); setAttempt(value => value + 1) }}>지도 다시 불러오기</Button></S.MapState> : null}
  </S.MapFrame>
}
