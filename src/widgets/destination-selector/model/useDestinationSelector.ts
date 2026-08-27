import { useState } from 'react'

import {
  useChangeTravelCountryMutation,
  useDeleteRecentSearchMutation,
  useDestinationDataQuery,
  useSaveRecentSearchMutation,
  useSaveTravelPlanMutation,
  type Destination,
} from '@/entities/travel'

type DestinationSelectorOptions = {
  onBack: () => void
}

export function useDestinationSelector({ onBack }: DestinationSelectorOptions) {
  const [query, setQuery] = useState('')
  const [selectingId, setSelectingId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const destinationQuery = useDestinationDataQuery()
  const saveTravelPlanMutation = useSaveTravelPlanMutation()
  const changeTravelCountryMutation = useChangeTravelCountryMutation()
  const saveRecentSearchMutation = useSaveRecentSearchMutation()
  const deleteRecentSearchMutation = useDeleteRecentSearchMutation()
  const destinations = destinationQuery.data?.destinations ?? []
  const recentDestinations = destinationQuery.data?.recentDestinations ?? []
  const isLoading = destinationQuery.isLoading
  const keyword = query.trim().toLocaleLowerCase()
  const results = keyword
    ? destinations.filter((destination) =>
        `${destination.name} ${destination.country}`.toLocaleLowerCase().includes(keyword),
      )
    : destinations

  const handleSelect = async (destination: Destination) => {
    try {
      setSelectingId(destination.id)
      setErrorMessage('')
      const travelPlanId = destinationQuery.data?.travelPlanId
      if (travelPlanId != null && destination.countryInfoId != null) {
        await changeTravelCountryMutation.mutateAsync({
          countryInfoId: destination.countryInfoId,
          travelPlanId,
        })
      } else {
        await saveTravelPlanMutation.mutateAsync({
          cityName: destination.name,
          countryName: destination.country,
        })
      }
      if (destination.countryInfoId != null) {
        await saveRecentSearchMutation.mutateAsync({
          countryInfoId: destination.countryInfoId,
        })
      }
      onBack()
    } catch {
      setErrorMessage('여행지를 저장하지 못했습니다. 다시 시도해주세요.')
      setSelectingId(null)
    }
  }

  const handleDeleteRecent = async (destination: Destination) => {
    if (destination.recentSearchId == null) return
    try {
      setErrorMessage('')
      await deleteRecentSearchMutation.mutateAsync(destination.recentSearchId)
    } catch {
      setErrorMessage('최근 검색을 삭제하지 못했습니다.')
    }
  }

  const handleDeleteAllRecent = async () => {
    try {
      setErrorMessage('')
      await Promise.all(
        recentDestinations.flatMap((item) =>
          item.recentSearchId == null
            ? []
            : [deleteRecentSearchMutation.mutateAsync(item.recentSearchId)],
        ),
      )
    } catch {
      setErrorMessage('최근 검색을 모두 삭제하지 못했습니다.')
    }
  }

  return {
    destinationQuery,
    destinations,
    errorMessage,
    handleDeleteAllRecent,
    handleDeleteRecent,
    handleSelect,
    isLoading,
    query,
    recentDestinations,
    results,
    selectingId,
    setQuery,
  }
}
