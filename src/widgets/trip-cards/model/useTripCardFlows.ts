import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { useDeleteTravelCardsMutation, useMyTravelRecords } from '@/entities/trip-card'

export function useTripCardDeleteFlow() {
  const navigate = useNavigate()
  const { trips: cards, isLoading, hasError, refetch, isFetching } = useMyTravelRecords()
  const [selected, setSelected] = useState<number[]>([])
  const [message, setMessage] = useState('')
  const deleteMutation = useDeleteTravelCardsMutation()

  const handleDelete = async () => {
    if (selected.length === 0) {
      setMessage('삭제할 여행카드를 선택해주세요.')
      return
    }
    try {
      await deleteMutation.mutateAsync({ cardIds: selected })
      setSelected([])
      setMessage('선택한 카드가 삭제됐어요.')
    } catch {
      setMessage('여행카드를 삭제하지 못했어요.')
    }
  }

  return { refetch, isFetching, cards, handleDelete, hasError, isLoading, message, navigate, selected, setSelected }
}
