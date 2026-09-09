import { Button as PartTripButton } from '@/shared/ui/parttrip'

import { type usePlannerFlow } from '../model/usePlannerFlow'
import * as S from './PlannerPage.styles'

type CandidateFlow = ReturnType<typeof usePlannerFlow>['candidate']

type Props = Pick<
  CandidateFlow,
  | 'canManageCandidates'
  | 'handleSaveCandidates'
  | 'places'
  | 'selected'
  | 'selectedPlaceCount'
  | 'setSelected'
  | 'setVoteCategory'
  | 'voteCategory'
  | 'plannerCategories'
> & {
  isSavingCandidates: boolean
}

export function PlannerExploreStep({
  canManageCandidates,
  handleSaveCandidates,
  isSavingCandidates,
  places,
  plannerCategories: categories,
  selected,
  selectedPlaceCount,
  setSelected,
  setVoteCategory,
  voteCategory,
}: Props) {
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
            <span>선택한 장소 {selectedPlaceCount}</span>
            <button type="button" disabled={!canManageCandidates} onClick={() => setSelected(places.map((_, index) => index))}>
              전체 후보 담기
            </button>
          </S.PlaceListHeader>
          {places.map((item, index) => {
            const isSelected = selected.includes(index)
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
                  disabled={!canManageCandidates}
                  onClick={() => setSelected((current) => isSelected ? current.filter((value) => value !== index) : [...current, index])}
                >
                  <span>{isSelected ? '후보 담김' : '담기'}</span>
                  <b aria-hidden="true">{isSelected ? '✓' : '+'}</b>
                </S.PlaceAction>
              </S.PlaceRow>
            )
          })}
          {places.length === 0 ? <S.Empty>연동된 장소 후보가 없습니다.</S.Empty> : null}
        </S.PlaceListPanel>
        <S.PanelActions>
          <PartTripButton
            type="button"
            disabled={isSavingCandidates || !canManageCandidates || selectedPlaceCount === 0}
            onClick={() => void handleSaveCandidates()}
          >
            {isSavingCandidates ? '후보 저장 중' : '투표 시작하기'}
          </PartTripButton>
        </S.PanelActions>
      </S.PlaceBody>
    </>
  )
}
