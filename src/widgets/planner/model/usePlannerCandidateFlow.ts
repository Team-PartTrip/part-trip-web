import { type useNavigate } from '@tanstack/react-router'

import { type usePlannerData } from './usePlannerData'
import { type usePlannerMutations } from './usePlannerMutations'
import { getCandidateManagementState, getSelectedPlaceIndexes } from './selectors'
import { type usePlannerState } from './usePlannerState'
import { ACTIVE_VOTE_CATEGORY_KEY, paths } from '@/shared/config'
import { writeSessionValue } from '@/shared/libs/session-storage'
import { getErrorMessage, isPositiveSafeInteger } from '@/shared/utils'

type Data = ReturnType<typeof usePlannerData>
type Mutations = ReturnType<typeof usePlannerMutations>
type State = ReturnType<typeof usePlannerState>
type Navigate = ReturnType<typeof useNavigate>

type Props = {
  data: Data
  navigate: Navigate
  mutations: Mutations
  placeId?: string
  state: State
}

export function usePlannerCandidateFlow({ data, navigate, mutations, placeId, state }: Props) {
  const {
    activePlannerId,
    clearSelected,
    resetVoteSession,
    selectedPlacesByCategory,
    setErrorMessage,
    setLineupChoice,
    setLineupMode,
    setSelectedPlacesByCategory,
    voteCategory,
  } = state
  const { places, votes, votesError, votesLoading } = data
  const {
    addPlannerPlacesMutation,
    selectRandomPlannerPlaceMutation,
  } = mutations
  const selectedItems = selectedPlacesByCategory[voteCategory] ?? []
  const selected = getSelectedPlaceIndexes(places, selectedItems)
  const { canManageCandidates, candidateManagementError } = getCandidateManagementState(votes, votesLoading, votesError)
  const selectedPlaces = places.flatMap((item, index) => selected.includes(index) ? [{ index, item }] : [])
  const allSelectedPlaces = Object.values(selectedPlacesByCategory).flat()
  const selectedPlaceCount = allSelectedPlaces.length
  const place = places.find((item) => item.tourPlaceId === Number(placeId))

  const updateSelected = (next: number[] | ((current: number[]) => number[])) => {
    setSelectedPlacesByCategory((current) => {
      const currentIndexes = getSelectedPlaceIndexes(places, current[voteCategory] ?? [])
      const nextIndexes = typeof next === 'function' ? next(currentIndexes) : next
      return {
        ...current,
        [voteCategory]: nextIndexes.map((index) => places[index]).filter((item): item is NonNullable<typeof item> => Boolean(item)),
      }
    })
  }

  const handleSaveCandidates = async () => {
    const plannerId = activePlannerId
    if (candidateManagementError) {
      setErrorMessage(candidateManagementError)
      return
    }
    const placeIds = [...new Set(allSelectedPlaces
      .map((item) => item.tourPlaceId)
      .filter((id): id is number => isPositiveSafeInteger(id)))]

    if (!isPositiveSafeInteger(plannerId)) {
      setErrorMessage('먼저 여행 계획을 저장해주세요.')
      return
    }
    if (placeIds.length === 0) {
      setErrorMessage('검색 결과를 선택해주세요.')
      return
    }
    if (placeIds.length !== allSelectedPlaces.length) {
      setErrorMessage('실제 API 장소 정보가 없어 후보를 저장할 수 없습니다.')
      return
    }

    try {
      setErrorMessage('')
      await addPlannerPlacesMutation.mutateAsync({ plannerId, payload: { placeIds } })
      resetVoteSession()
      writeSessionValue(ACTIVE_VOTE_CATEGORY_KEY, voteCategory)
      clearSelected()
      navigate({ to: paths.plannerVote })
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const handleAddPlaceCandidate = async () => {
    const placeId = place?.tourPlaceId
    if (candidateManagementError) {
      setErrorMessage(candidateManagementError)
      return
    }
    if (!isPositiveSafeInteger(activePlannerId)) {
      setErrorMessage('먼저 여행 계획을 저장해주세요.')
      return
    }
    if (!isPositiveSafeInteger(placeId)) {
      setErrorMessage('추가할 장소 정보를 확인할 수 없습니다.')
      return
    }

    try {
      setErrorMessage('')
      await addPlannerPlacesMutation.mutateAsync({ plannerId: activePlannerId, payload: { placeIds: [placeId] } })
      resetVoteSession()
      writeSessionValue(ACTIVE_VOTE_CATEGORY_KEY, voteCategory)
      navigate({ to: paths.plannerVote })
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const handleRemoveFromLineup = (index: number) => {
    updateSelected((current) => current.filter((item) => item !== index))
    if (state.lineupChoice === index) {
      setLineupChoice(null)
      setLineupMode('direct')
    }
  }

  const handleRandomLineup = async () => {
    if (selectedPlaces.length === 0) {
      setErrorMessage('먼저 장바구니에 장소를 담아주세요.')
      return
    }
    const placeIds = [...new Set(selectedPlaces
      .map(({ item }) => item.tourPlaceId)
      .filter((id): id is number => isPositiveSafeInteger(id)))]
    if (!isPositiveSafeInteger(activePlannerId) || placeIds.length !== selectedPlaces.length) {
      setErrorMessage('랜덤으로 선택할 장소 정보를 확인할 수 없습니다.')
      return
    }

    try {
      setErrorMessage('')
      await addPlannerPlacesMutation.mutateAsync({ plannerId: activePlannerId, payload: { placeIds } })
      const randomPlace = await selectRandomPlannerPlaceMutation.mutateAsync(activePlannerId)
      const choiceIndex = places.findIndex((item) => item.tourPlaceId === randomPlace.placeId)
      if (choiceIndex < 0) throw new Error('랜덤으로 선택한 장소를 현재 목록에서 찾을 수 없습니다.')
      setLineupMode('random')
      setLineupChoice(choiceIndex)
      updateSelected([choiceIndex])
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return {
    canManageCandidates,
    candidateManagementError,
    handleAddPlaceCandidate,
    handleRandomLineup,
    handleRemoveFromLineup,
    handleSaveCandidates,
    isSavingCandidates: addPlannerPlacesMutation.isPending || selectRandomPlannerPlaceMutation.isPending,
    isSavingPlace: addPlannerPlacesMutation.isPending,
    place,
    places,
    selected,
    selectedPlaceCount,
    selectedPlaces,
    setSelected: updateSelected,
  }
}
