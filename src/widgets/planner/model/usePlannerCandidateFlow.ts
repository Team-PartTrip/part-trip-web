import { getActiveVote } from './selectors'
import { type usePlannerData } from './usePlannerData'
import { type usePlannerMutations } from './usePlannerMutations'
import { type usePlannerState } from './usePlannerState'
import { getErrorMessage, isPositiveSafeInteger } from '@/shared/utils'
import { normalizeStatus } from './status'

type Data = ReturnType<typeof usePlannerData>
type Mutations = ReturnType<typeof usePlannerMutations>
type State = ReturnType<typeof usePlannerState>

type Props = {
  data: Data
  mutations: Mutations
  placeId?: string
  state: State
}

export function usePlannerCandidateFlow({ data, mutations, placeId, state }: Props) {
  const { activePlannerId, setErrorMessage, voteCategory } = state
  const { places, votes, votesError, votesLoading } = data
  const { cancelPlaceVoteMutation, castPlaceVoteMutation } = mutations
  const activeVote = getActiveVote(votes, data.voteDetail, voteCategory, state.activeVoteId)
  const plannerIsConfirmed = state.hasConfirmedLocally || normalizeStatus(data.plannerDetail?.status) === 'CONFIRMED'
  const canVotePlaces = isPositiveSafeInteger(activePlannerId) &&
    !plannerIsConfirmed &&
    !votesLoading &&
    !votesError &&
    (!activeVote || (normalizeStatus(activeVote.status) === 'OPEN' && activeVote.deadlinePassed !== true))
  const place = places.find((item) => item.tourPlaceId === Number(placeId))

  const handleTogglePlaceVote = async (tourPlaceId?: number, selected = false) => {
    if (!canVotePlaces || !isPositiveSafeInteger(tourPlaceId)) {
      setErrorMessage('지금은 이 장소에 투표할 수 없습니다.')
      return
    }
    try {
      setErrorMessage('')
      if (selected) {
        await cancelPlaceVoteMutation.mutateAsync({ plannerId: activePlannerId, tourPlaceId })
      } else {
        await castPlaceVoteMutation.mutateAsync({ plannerId: activePlannerId, tourPlaceId })
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const handleLoadMorePlaces = async () => {
    try {
      setErrorMessage('')
      await data.fetchMorePlaces()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return {
    canVotePlaces,
    handleLoadMorePlaces,
    handleTogglePlaceVote,
    hasMorePlaces: data.hasMorePlaces,
    isLoadingMorePlaces: data.isLoadingMorePlaces,
    isSavingPlaceVote: castPlaceVoteMutation.isPending || cancelPlaceVoteMutation.isPending,
    morePlacesError: data.morePlacesError,
    place,
    places,
    voteOptions: activeVote?.options ?? [],
  }
}
