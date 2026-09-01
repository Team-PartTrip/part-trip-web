import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'

import { useDeleteTravelCardsMutation } from '@/entities/trip-card'
import { useMyTrips, useTripQuery } from '@/entities/trip-plan'
import { paths } from '@/shared/config'

export type TripCardsMode = 'list' | 'detail' | 'create' | 'delete'

export function useTripCardsFlow(mode: TripCardsMode) {
  const navigate = useNavigate()
  const { tripId } = useParams({ strict: false })
  const [selected, setSelected] = useState<number[]>([])
  const [message, setMessage] = useState('')
  const tripQuery = useTripQuery(Number(tripId))
  const myTripsQuery = useMyTrips(mode !== 'detail')
  const deleteMutation = useDeleteTravelCardsMutation()
  const cards = myTripsQuery.trips
  const mine = myTripsQuery.trips
  const detail = tripQuery.data
  const isLoading = mode === 'detail' ? tripQuery.isLoading : myTripsQuery.isLoading
  const hasQueryError = mode === 'detail' ? tripQuery.isError : myTripsQuery.hasError

  const handleDelete = async () => {
    if (selected.length === 0) {
      setMessage('삭제할 여행 카드를 선택해주세요.')
      return
    }
    try {
      await deleteMutation.mutateAsync({ cardIds: selected })
      setSelected([])
      setMessage('선택한 카드가 삭제되었습니다.')
    } catch {
      setMessage('여행 카드를 삭제하지 못했습니다.')
    }
  }

  return {
    cards,
    deleteMutation,
    detail,
    handleDelete,
    hasQueryError,
    isLoading,
    message,
    mine,
    myTripsQuery,
    navigate,
    paths,
    selected,
    setSelected,
  }
}
