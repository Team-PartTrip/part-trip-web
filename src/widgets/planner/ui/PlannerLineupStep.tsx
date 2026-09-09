import { Button as PartTripButton } from '@/shared/ui/parttrip'

import { type usePlannerFlow } from '../model/usePlannerFlow'
import * as S from './PlannerPage.styles'

type CandidateFlow = ReturnType<typeof usePlannerFlow>['candidate']

type Props = Pick<
  CandidateFlow,
  | 'handleRandomLineup'
  | 'handleRemoveFromLineup'
  | 'handleSaveCandidates'
  | 'lineupChoice'
  | 'lineupMode'
  | 'selectedPlaces'
  | 'setLineupChoice'
  | 'setLineupMode'
  | 'setSelected'
  | 'voteCategory'
> & {
  isSavingCandidates: boolean
}

export function PlannerLineupStep({
  handleRandomLineup,
  handleRemoveFromLineup,
  handleSaveCandidates,
  isSavingCandidates,
  lineupChoice,
  lineupMode,
  selectedPlaces,
  setLineupChoice,
  setLineupMode,
  setSelected,
  voteCategory,
}: Props) {
  return (
    <>
      <S.LineupModeRow aria-label="장소 선택 방식">
        <S.SegmentButton
          type="button"
          disabled={selectedPlaces.length === 0}
          data-active={lineupMode === 'direct'}
          $active={lineupMode === 'direct'}
          onClick={() => {
            setLineupMode('direct')
            const first = selectedPlaces[0]?.index
            if (first != null) {
              setLineupChoice(first)
              setSelected([first])
            }
          }}
        >
          직접 선택
        </S.SegmentButton>
        <S.SegmentButton
          type="button"
          disabled={selectedPlaces.length === 0 || isSavingCandidates}
          data-active={lineupMode === 'random'}
          $active={lineupMode === 'random'}
          onClick={() => void handleRandomLineup()}
        >
          랜덤 뽑기
        </S.SegmentButton>
      </S.LineupModeRow>
      <S.CartBody>
        <S.SelectedPanel>
          <S.SectionTitle>담은 장소 {selectedPlaces.length}</S.SectionTitle>
          <S.SelectedPlaces>
            {selectedPlaces.map(({ index, item }) => (
              <S.SelectedPlaceRow key={`${item.placeName}-${index}`}>
                <S.PlaceDetails>
                  <strong>{item.placeName || '장소'}</strong>
                  <span>{voteCategory}</span>
                </S.PlaceDetails>
                <button type="button" aria-label={`${item.placeName || '장소'} 후보 제거`} onClick={() => handleRemoveFromLineup(index)}>
                  {lineupChoice === index ? '✓' : '✕'}
                </button>
              </S.SelectedPlaceRow>
            ))}
          </S.SelectedPlaces>
          {selectedPlaces.length === 0 ? <S.Empty>투표 화면에서 장소를 선택하세요.</S.Empty> : null}
        </S.SelectedPanel>
        <S.NextPanel>
          <S.SectionTitle>선택을 확정할까요?</S.SectionTitle>
          <p>담은 장소 중 지금 고른 장소로 일정을 확정해요</p>
          <S.ActionRow>
            <PartTripButton
              type="button"
              disabled={isSavingCandidates || selectedPlaces.length === 0}
              onClick={() => void handleSaveCandidates()}
            >
              선택 확정하기
            </PartTripButton>
          </S.ActionRow>
        </S.NextPanel>
      </S.CartBody>
    </>
  )
}
