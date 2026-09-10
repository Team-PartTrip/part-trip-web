import { type usePlannerFlow } from '../model/usePlannerFlow'
import { normalizeStatus } from '../model/status'
import * as S from './PlannerPage.styles'

type CandidateFlow = ReturnType<typeof usePlannerFlow>['candidate']
type VoteFlow = ReturnType<typeof usePlannerFlow>['vote']
type Place = CandidateFlow['places'][number]

type Props = Pick<
  CandidateFlow,
  | 'handleVotePlace'
  | 'isVotingPlace'
  | 'places'
  | 'setVoteCategory'
  | 'voteCategory'
  | 'plannerCategories'
> & Pick<VoteFlow, 'activeVote' | 'canManagePlanner'>

export function PlannerExploreStep({
  activeVote,
  canManagePlanner,
  handleVotePlace,
  isVotingPlace,
  places,
  plannerCategories: categories,
  setVoteCategory,
  voteCategory,
}: Props) {
  const canVote = normalizeStatus(activeVote?.status) === 'OPEN' && activeVote?.deadlinePassed !== true
  const optionForPlace = (place: Place) => activeVote?.options.find((option) =>
    (place.tourPlaceId != null && option.tourPlaceId === place.tourPlaceId)
      || (place.tourPlaceId == null && option.placeName?.trim() === place.placeName?.trim()),
  )

  return (
    <>
      <S.CategoryChips aria-label="장소 카테고리">
        {categories.map((category) => (
          <S.CategoryChip
            key={category}
            type="button"
            className={voteCategory === category ? 'active' : ''}
            $active={voteCategory === category}
            onClick={() => setVoteCategory(category)}
          >
            {category}
          </S.CategoryChip>
        ))}
      </S.CategoryChips>
      <S.PlaceBody>
        <S.PlaceListPanel>
          <S.PlaceListHeader>
            <span>장소 리스트</span>
            <span>장소에서 바로 투표해요</span>
          </S.PlaceListHeader>
          {places.map((item, index) => {
            const option = optionForPlace(item)
            const isSelected = option?.selectedByMe === true
            const canStartVote = activeVote == null && canManagePlanner
            const buttonDisabled = isVotingPlace || (!canVote && !canStartVote) || (option?.optionId == null && !canStartVote)
            const actionLabel = isSelected
              ? '투표 완료'
              : activeVote == null
                ? canManagePlanner ? '투표 열기' : '그룹장 대기'
                : canVote ? '투표' : '마감됨'
            return (
              <S.PlaceRow key={index} $active={isSelected}>
                <S.PlaceThumb $imageUrl={item.imageUrl}>{!item.imageUrl ? '이미지 없음' : null}</S.PlaceThumb>
                <S.PlaceDetails>
                  <strong>{item.placeName || '장소'}</strong>
                  <span>{item.category || voteCategory} · {item.address || '장소 정보'}</span>
                </S.PlaceDetails>
                <S.PlaceAction
                  type="button"
                  $active={isSelected}
                  aria-pressed={isSelected}
                  disabled={buttonDisabled}
                  onClick={() => void handleVotePlace(item)}
                >
                  <span>{actionLabel}</span>
                  <b aria-hidden="true">{isSelected ? '✓' : '+'}</b>
                </S.PlaceAction>
              </S.PlaceRow>
            )
          })}
          {places.length === 0 ? <S.Empty>연동된 장소 후보가 없습니다.</S.Empty> : null}
        </S.PlaceListPanel>
      </S.PlaceBody>
    </>
  )
}
