import { Button as PartTripButton } from '@/shared/ui/parttrip'
import type { PlannerCityResponseDto } from '@/entities/planner'

import { type usePlannerFlow } from '../model/usePlannerFlow'
import * as S from './PlannerPage.styles'

type CandidateFlow = ReturnType<typeof usePlannerFlow>['candidate']

type Props = Pick<
  CandidateFlow,
  | 'canVotePlaces'
  | 'handleLoadMorePlaces'
  | 'handleTogglePlaceVote'
  | 'hasMorePlaces'
  | 'isLoadingMorePlaces'
  | 'isSavingPlaceVote'
  | 'places'
  | 'setVoteCategory'
  | 'voteCategory'
  | 'plannerCategories'
  | 'voteOptions'
> & {
  onOpenProgress: () => void
  onSelectCity: (countryName: string, cityName: string) => void
  placeCountryName: string
  placeCityName: string
  plannerCities: PlannerCityResponseDto[]
}

export function PlannerExploreStep({
  canVotePlaces,
  handleLoadMorePlaces,
  handleTogglePlaceVote,
  hasMorePlaces,
  isLoadingMorePlaces,
  isSavingPlaceVote,
  onOpenProgress,
  onSelectCity,
  placeCountryName,
  placeCityName,
  plannerCities,
  places,
  plannerCategories: categories,
  setVoteCategory,
  voteCategory,
  voteOptions,
}: Props) {
  const voteOptionByPlaceId = new Map(voteOptions.flatMap((option) =>
    option.tourPlaceId == null ? [] : [[option.tourPlaceId, option] as const],
  ))

  return (
    <>
      {plannerCities.length > 1 ? (
        <S.VoteCategoryChips aria-label="여행 도시">
          {plannerCities.map((city, index) => {
            const countryName = city.countryName ?? ''
            const cityName = city.cityName ?? ''
            const selected = countryName === placeCountryName && cityName === placeCityName
            return (
              <S.CategoryChip
                key={`${countryName}-${cityName}-${index}`}
                type="button"
                className={selected ? 'active' : ''}
                $active={selected}
                onClick={() => onSelectCity(countryName, cityName)}
              >
                {cityName}
              </S.CategoryChip>
            )
          })}
        </S.VoteCategoryChips>
      ) : null}
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
            <span>{placeCityName || '여행지'} 장소 {places.length}곳 · 내 투표 {voteOptions.filter((option) => option.selectedByMe).length}곳</span>
          </S.PlaceListHeader>
          {places.map((item, index) => {
            const voteOption = item.tourPlaceId == null ? undefined : voteOptionByPlaceId.get(item.tourPlaceId)
            const isSelected = voteOption?.selectedByMe === true
            return (
              <S.PlaceRow
                key={item.tourPlaceId ?? `${item.placeName}-${item.address}-${index}`}
                type="button"
                $active={isSelected}
                aria-pressed={isSelected}
                disabled={!canVotePlaces || isSavingPlaceVote || item.tourPlaceId == null}
                onClick={() => void handleTogglePlaceVote(item.tourPlaceId, isSelected)}
              >
                <S.PlaceThumb $imageUrl={item.imageUrl}>{!item.imageUrl ? '이미지 없음' : null}</S.PlaceThumb>
                <S.PlaceDetails>
                  <strong>{item.placeName || '장소'}</strong>
                  <span>{item.category || voteCategory} · {item.address || '장소 정보'}</span>
                </S.PlaceDetails>
                <S.PlaceAction $active={isSelected} aria-hidden="true">
                  <span>{isSelected ? '투표 취소' : '투표'}</span>
                  <b aria-hidden="true">{voteOption?.voteCount ?? 0}표</b>
                </S.PlaceAction>
              </S.PlaceRow>
            )
          })}
          {places.length === 0 ? <S.Empty>표시할 장소가 없습니다.</S.Empty> : null}
        </S.PlaceListPanel>
        <S.PanelActions>
          <PartTripButton
            type="button"
            $variant="secondary"
            onClick={onOpenProgress}
          >
            진행·확정 현황
          </PartTripButton>
          {hasMorePlaces ? (
            <PartTripButton type="button" $variant="secondary" disabled={isLoadingMorePlaces} onClick={() => void handleLoadMorePlaces()}>
              {isLoadingMorePlaces ? '추가 장소 조회 중' : '장소 더 보기'}
            </PartTripButton>
          ) : null}
        </S.PanelActions>
      </S.PlaceBody>
    </>
  )
}
