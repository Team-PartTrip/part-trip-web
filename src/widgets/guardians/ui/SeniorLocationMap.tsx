import { useEffect, useRef, useState } from 'react'
import { loadKakaoMaps, type KakaoMaps } from '@/shared/libs/kakao-maps'
import { Button } from '@/shared/ui/parttrip'
import * as S from './GuardiansPage.styles'

type Point = { latitude: number; longitude: number }

export function SeniorLocationMap({ latitude, longitude, label }: Point & { label: string }) {
  const container = useRef<HTMLDivElement>(null)
  const latest = useRef<Point>({ latitude, longitude })
  const view = useRef<{ maps: KakaoMaps; map: InstanceType<KakaoMaps['Map']>; marker: InstanceType<KakaoMaps['Marker']>; point: Point } | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    latest.current = { latitude, longitude }
    const current = view.current
    if (!current || (current.point.latitude === latitude && current.point.longitude === longitude)) return
    const position = new current.maps.LatLng(latitude, longitude)
    current.marker.setPosition(position)
    current.map.setCenter(position)
    current.point = { latitude, longitude }
  }, [latitude, longitude])

  useEffect(() => {
    let cancelled = false
    let observer: ResizeObserver | undefined
    const element = container.current!
    void loadKakaoMaps().then(maps => {
      if (cancelled) return
      const point = latest.current
      const center = new maps.LatLng(point.latitude, point.longitude)
      const map = new maps.Map(element, { center, level: 4 })
      const marker = new maps.Marker({ map, position: center, title: `${label}의 현재 위치` })
      view.current = { maps, map, marker, point }
      observer = new ResizeObserver(() => { map.relayout(); map.setCenter(new maps.LatLng(latest.current.latitude, latest.current.longitude)) })
      observer.observe(element)
      setStatus('ready')
    }).catch(() => { if (!cancelled) setStatus('error') })
    return () => {
      cancelled = true
      observer?.disconnect()
      view.current?.marker.setMap(null)
      view.current = null
      element.replaceChildren()
    }
  }, [attempt, label])

  return <S.LocationMapFrame>
    <S.LocationMap ref={container} role="region" aria-label={`${label}의 현재 위치 지도`} aria-busy={status === 'loading'} />
    {status === 'loading' ? <S.LocationMapState role="status">지도를 불러오고 있어요.</S.LocationMapState> : null}
    {status === 'error' ? <S.LocationMapState role="alert">지도를 불러오지 못했어요. 아래 링크로 위치를 확인할 수 있어요.<Button type="button" $variant="secondary" onClick={() => { setStatus('loading'); setAttempt(value => value + 1) }}>지도 다시 불러오기</Button></S.LocationMapState> : null}
  </S.LocationMapFrame>
}
