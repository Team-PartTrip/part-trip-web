import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'

import { useImportTripMutation, useSharedTripQuery, useSharedTripsQuery, useShareTripMutation } from '@/entities/trip-card'
import { useMyTrips } from '@/entities/trip-plan'
import { paths } from '@/shared/config'

import { addHiddenTripIds, parseHiddenTripIds } from './storage'

const HIDDEN_TRIP_CARDS_KEY = 'parttrip:hidden-trip-cards'

export type TripCardsMode = 'list' | 'detail' | 'create' | 'delete'
export type TripCardCreateTab = 'share' | 'photo'

function readHiddenTripIds() {
  if (typeof window === 'undefined') return []
  return parseHiddenTripIds(window.localStorage.getItem(HIDDEN_TRIP_CARDS_KEY))
}

export function useTripCardsFlow(mode: TripCardsMode) {
  const navigate = useNavigate()
  const { tripId } = useParams({ strict: false })
  const [selected, setSelected] = useState<number[]>([])
  const [hiddenTripIds, setHiddenTripIds] = useState(readHiddenTripIds)
  const [createTab, setCreateTab] = useState<TripCardCreateTab>('photo')
  const [message, setMessage] = useState('')
  const sharedTripsQuery = useSharedTripsQuery(mode !== 'detail' && mode !== 'create')
  const sharedTripQuery = useSharedTripQuery(Number(tripId))
  const myTripsQuery = useMyTrips(mode === 'create')
  const shareMutation = useShareTripMutation()
  const importMutation = useImportTripMutation()
  const cards = [...(sharedTripsQuery.data?.content ?? [])]
    .filter((card) => card.tripId == null || !hiddenTripIds.includes(card.tripId))
    .sort((a, b) => (b.startDate ?? b.createDate ?? '').localeCompare(a.startDate ?? a.createDate ?? ''))
  const mine = myTripsQuery.trips
  const detail = sharedTripQuery.data
  const isLoading = mode === 'detail' ? sharedTripQuery.isLoading : mode === 'create' ? myTripsQuery.isLoading : sharedTripsQuery.isLoading
  const hasQueryError = mode === 'detail' ? sharedTripQuery.isError : mode === 'create' ? myTripsQuery.hasError : sharedTripsQuery.isError

  const handleShare = async (id?: number) => {
    if (!id) return
    try {
      await shareMutation.mutateAsync({ tripId: id })
      navigate({ to: paths.tripCards })
    } catch {
      setMessage('여행 카드를 공유하지 못했습니다.')
    }
  }

  const handleImport = async () => {
    if (!detail?.tripId) return
    try {
      await importMutation.mutateAsync(detail.tripId)
      setMessage('공유 여행을 내 여행으로 가져왔습니다.')
    } catch {
      setMessage('공유 여행을 가져오지 못했습니다.')
    }
  }

  const handleDelete = () => {
    const nextIds = addHiddenTripIds(hiddenTripIds, selected)
    if (nextIds.length === hiddenTripIds.length) {
      setMessage('삭제할 여행 카드를 선택해주세요.')
      return
    }
    window.localStorage.setItem(HIDDEN_TRIP_CARDS_KEY, JSON.stringify(nextIds))
    setHiddenTripIds(nextIds)
    setSelected([])
    setMessage('선택한 카드가 이 브라우저에서 삭제되었습니다.')
  }

  return {
    cards,
    createTab,
    detail,
    handleDelete,
    handleImport,
    handleShare,
    hasQueryError,
    importMutation,
    isLoading,
    message,
    mine,
    myTripsQuery,
    navigate,
    paths,
    selected,
    setCreateTab,
    setSelected,
    sharedTripQuery,
    shareMutation,
  }
}
