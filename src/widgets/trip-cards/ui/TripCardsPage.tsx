import type { ReactNode } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useMyTravelRecords, useTravelRecordQuery } from '@/entities/trip-card'
import { Button } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'

import { useTripCardDeleteFlow } from '../model/useTripCardFlows'
import { TripCardPhotoComposer } from './TripCardPhotoComposer'
import { TripCardDeleteView, TripCardDetailView, TripCardListView } from './TripCardModeViews'
import * as S from './TripCardsPage.styles'

export function TripCardsPage() {
  const navigate = useNavigate()
  const { trips: cards, hasError, isLoading, refetch, isFetching } = useMyTravelRecords()
  return (
    <TripCardsPageFrame onRetry={() => void refetch()} isRetrying={isFetching} title="여행카드" isLoading={isLoading} hasError={hasError}>
      <TripCardListView cards={cards} navigate={navigate} />
    </TripCardsPageFrame>
  )
}

export function TripCardDetailPage() {
  const navigate = useNavigate()
  const { tripId } = useParams({ strict: false })
  const { data: detail, isError: hasError, isLoading, refetch, isFetching } = useTravelRecordQuery(Number(tripId))
  const timeline = detail?.timeline ?? []
  const firstPlace = timeline.find((item) => item.type === 'PLACE' && item.placeName) ?? timeline.find((item) => item.placeName)
  const firstPhoto = timeline.find((item) => item.type === 'PHOTO' && item.imageUrl) ?? timeline.find((item) => item.imageUrl)
  return (
    <TripCardsPageFrame onRetry={() => void refetch()} isRetrying={isFetching} title={detail?.title || '여행카드'} subtitle="방문 장소와 촬영 기록을 앱과 동일한 순서로 확인하세요." detail isLoading={isLoading} hasError={hasError}>
      <TripCardDetailView detail={detail} firstPhoto={firstPhoto} firstPlace={firstPlace} navigate={navigate} />
    </TripCardsPageFrame>
  )
}

export function TripCardCreatePage() {
  const { trips: cards, hasError, isLoading, refetch, isFetching } = useMyTravelRecords()
  return (
    <TripCardsPageFrame onRetry={() => void refetch()} isRetrying={isFetching} title="사진 · 코멘트 추가" subtitle="여행 계획을 확정하면 여행카드가 만들어져요." wide create isLoading={isLoading} hasError={hasError}>
      <TripCardPhotoComposer cards={cards} />
    </TripCardsPageFrame>
  )
}

export function TripCardDeletePage() {
  const { cards, handleDelete, hasError, isLoading, message, navigate, selected, setSelected, refetch, isFetching } = useTripCardDeleteFlow()
  return (
    <TripCardsPageFrame onRetry={() => void refetch()} isRetrying={isFetching} title="여행카드 삭제" subtitle="삭제할 여행카드를 선택하세요. 여러 개를 한 번에 지울 수 있어요." wide isLoading={isLoading} hasError={hasError} message={message}>
      <TripCardDeleteView cards={cards} handleDelete={handleDelete} navigate={navigate} selected={selected} setSelected={setSelected} />
    </TripCardsPageFrame>
  )
}

function TripCardsPageFrame({ onRetry, isRetrying, children, title, subtitle, wide = false, create = false, detail = false, isLoading, hasError, message }: {
  onRetry: () => void
  isRetrying: boolean
  children: ReactNode
  title: string
  subtitle?: string
  wide?: boolean
  create?: boolean
  detail?: boolean
  isLoading: boolean
  hasError: boolean
  message?: string
}) {
  return (
    <AppShell>
      <S.Page $wide={wide}>
        <S.Header $wide={wide} $create={create} $detail={detail}>
          {isLoading ? <S.LoadingHeader /> : <div><S.Title>{title}</S.Title>{subtitle ? <S.Subtitle>{subtitle}</S.Subtitle> : null}</div>}
        </S.Header>
        {message || hasError ? <S.Notice role={hasError ? 'alert' : 'status'}>{message || '여행카드를 불러오지 못했어요.'}{hasError ? <Button type="button" disabled={isRetrying} onClick={onRetry}>다시 시도</Button> : null}</S.Notice> : null}
        {isLoading ? <S.LoadingLayout aria-busy="true" aria-label="여행카드 로딩 중"><S.LoadingCard /></S.LoadingLayout> : null}
        {!isLoading ? children : null}
      </S.Page>
    </AppShell>
  )
}
