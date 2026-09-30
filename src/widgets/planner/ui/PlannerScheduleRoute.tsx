import type { PlannerScheduleRouteDto, PlannerScheduleRouteStepDto } from '@/entities/planner'
import { hasCoordinates, getKakaoMapUrl, type RoutePoint } from '../model/schedule-edit'
import odsayAttributionUrl from '@/shared/assets/odsay-attribution.png'
import * as S from './PlannerAiFlow.styles'

const routeModeLabels = {
  PUBLIC_TRANSIT: '대중교통',
  CAR: '자동차',
  TAXI: '택시',
  WALKING: '도보',
} satisfies Record<NonNullable<PlannerScheduleRouteDto['transportMode']>, string>

function RouteModeIcon({ mode }: { mode?: PlannerScheduleRouteDto['transportMode'] }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {mode === 'PUBLIC_TRANSIT' ? <>
      <rect x="5" y="3" width="14" height="16" rx="2" />
      <path d="M5 7h14M7 19v2m10-2v2M8 13h.01M16 13h.01" />
    </> : mode === 'CAR' || mode === 'TAXI' ? <>
      {mode === 'TAXI' ? <path d="M9.5 3.5h5v2h-5z" /> : null}
      <path d="M4 16v-3.8c0-.7.5-1.2 1.1-1.4l1.6-3.7A1.6 1.6 0 0 1 8.2 6h7.6a1.6 1.6 0 0 1 1.5 1.1l1.6 3.7c.6.2 1.1.7 1.1 1.4V16H4Z" />
      <path d="M5 11h14M7 16v2m10-2v2M7.5 13.5h.01M16.5 13.5h.01" />
    </> : mode === 'WALKING' ? <>
      <circle cx="13" cy="4" r="2" />
      <path d="m11.5 7.5-2.3 5.2 3.2 2.1 1.2 5M11.3 8l4 1.2 1.4 3.3M9.2 12.7 6.5 16" />
    </> : <>
      <circle cx="6" cy="6" r="1.7" />
      <circle cx="18" cy="18" r="1.7" />
      <path d="M8 6h2a4 4 0 0 1 4 4v4a4 4 0 0 0 4 4" />
    </>}
  </svg>
}

function formatRouteStep(step: PlannerScheduleRouteStepDto) {
  const stops = step.boardingStop && step.alightingStop
    ? `${step.boardingStop} → ${step.alightingStop}`
    : step.boardingStop || step.alightingStop
  return [
    step.name?.trim() || step.type?.trim(),
    stops,
    typeof step.stopCount === 'number' && step.stopCount > 0 ? `${step.stopCount}정거장` : undefined,
    typeof step.durationMinutes === 'number' && step.durationMinutes > 0 ? `${step.durationMinutes}분` : undefined,
  ].filter(Boolean).join(' · ')
}

export function PlannerScheduleDepartureIcon({ kind }: { kind: 'bed' | 'home' | 'train' | 'pin' }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'bed' ? <path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 14h18M5 9V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3M3 18v2m18-2v2" /> : null}
    {kind === 'home' ? <path d="m3 11 9-8 9 8M5 10v10h14V10M9 20v-6h6v6" /> : null}
    {kind === 'train' ? <><rect x="5" y="3" width="14" height="16" rx="3" /><path d="M5 8h14M8 14h.01M16 14h.01M8 19l-2 2m10-2 2 2" /></> : null}
    {kind === 'pin' ? <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></> : null}
  </svg>
}

export function PlannerScheduleRouteLine({
  route,
  placeName,
  latitude,
  longitude,
  origin,
}: {
  route: PlannerScheduleRouteDto
  placeName?: string
  latitude?: number
  longitude?: number
  origin?: RoutePoint
}) {
  const modeLabel = route.transportMode ? routeModeLabels[route.transportMode] ?? '이동' : '이동'
  const summary = [
    typeof route.durationMinutes === 'number' && route.durationMinutes > 0 ? `${route.durationMinutes}분` : undefined,
    typeof route.walkingMinutes === 'number' && route.walkingMinutes > 0 ? `도보 ${route.walkingMinutes}분` : undefined,
  ].filter(Boolean).join(' · ')
  const steps = (route.steps ?? []).map(formatRouteStep).filter(Boolean)
  const kakaoMapUrl = getKakaoMapUrl(route.transportMode, placeName, latitude, longitude, origin)

  return <S.RouteLine>
    <S.RouteModeIcon><RouteModeIcon mode={route.transportMode} /></S.RouteModeIcon>
    <div>
      <S.RouteSummary>
        <strong>{modeLabel}</strong>
        {summary ? <span>{summary}</span> : null}
        {kakaoMapUrl ? <a href={kakaoMapUrl} target="_blank" rel="noopener noreferrer" aria-label={`${placeName} 카카오맵에서 길 안내 열기`}>길 안내</a> : null}
      </S.RouteSummary>
      {steps.length ? <details>
        <summary>경로 상세</summary>
        <ol>{steps.map((step, index) => <li key={`${step}-${index}`}>{step}</li>)}</ol>
      </details> : null}
    </div>
  </S.RouteLine>
}

export function PlannerScheduleRouteFallback({
  placeName,
  latitude,
  longitude,
  origin,
}: {
  placeName?: string
  latitude?: number
  longitude?: number
  origin?: RoutePoint
}) {
  const kakaoMapUrl = origin && hasCoordinates(origin)
    ? getKakaoMapUrl('PUBLIC_TRANSIT', placeName, latitude, longitude, origin)
    : undefined

  return <S.RouteLine>
    <S.RouteModeIcon><RouteModeIcon mode="PUBLIC_TRANSIT" /></S.RouteModeIcon>
    <div>
      <S.RouteSummary>
        <strong>대중교통</strong>
        <span>경로 정보를 불러오지 못했어요.</span>
        {kakaoMapUrl ? <a href={kakaoMapUrl} target="_blank" rel="noopener noreferrer">카카오맵에서 길 찾기</a> : null}
      </S.RouteSummary>
    </div>
  </S.RouteLine>
}


export function PlannerScheduleAttribution() {
  return <S.ScheduleAttribution>
    <span>대중교통 정보: 아로정보기술 컨텐츠</span>
    <S.ODsayMark><img src={odsayAttributionUrl} alt="Powered by ODsay" /></S.ODsayMark>
  </S.ScheduleAttribution>
}
