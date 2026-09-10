import { Button as PartTripButton } from '@/shared/ui/parttrip'

import { type usePlannerFlow } from '../model/usePlannerFlow'
import { normalizeStatus } from '../model/status'
import * as S from './PlannerPage.styles'

type Flow = ReturnType<typeof usePlannerFlow>
type CandidateFlow = Flow['candidate']
type VoteFlow = Flow['vote']
type VoteOption = VoteFlow['votes'][number]['options'][number]

type Props = Pick<
  VoteFlow,
  | 'activeVote'
  | 'canCloseVotes'
  | 'handleCastBallot'
  | 'handleCloseVote'
  | 'handleDeleteVoteOption'
> & Pick<VoteFlow, 'canManagePlanner'> & Pick<CandidateFlow, 'plannerCategories' | 'setVoteCategory' | 'voteCategory'> & {
  castBallotPending: boolean
  closeVotePending: boolean
  deleteVoteOptionPending: boolean
  nextCategory: CandidateFlow['voteCategory']
  onNextCategory: () => void
  profileId?: string
  selectedOptionId?: number
  voteOptions: VoteOption[]
}

export function PlannerVoteStep({
  activeVote,
  canCloseVotes,
  canManagePlanner,
  castBallotPending,
  closeVotePending,
  deleteVoteOptionPending,
  handleCastBallot,
  handleCloseVote,
  handleDeleteVoteOption,
  nextCategory,
  onNextCategory,
  plannerCategories: categories,
  profileId,
  selectedOptionId,
  setVoteCategory,
  voteCategory,
  voteOptions,
}: Props) {
  const canVote = normalizeStatus(activeVote?.status) === 'OPEN' && activeVote?.deadlinePassed !== true

  return (
    <>
      <S.VoteStatusRow>
        <S.VoteStatus $active>진행 중</S.VoteStatus>
        <S.VoteStatus>내 투표 {voteOptions.filter((option) => option.selectedByMe === true).length}곳</S.VoteStatus>
      </S.VoteStatusRow>
      <S.VoteCategoryChips aria-label="투표 카테고리">
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
      </S.VoteCategoryChips>
      <S.VoteBody>
        <S.CandidatePanel>
          {activeVote && !canVote ? (
            <S.Notice>
              이 투표는 {activeVote.deadlinePassed === true ? '마감' : normalizeStatus(activeVote.status) === 'CONFIRMED' ? '확정' : '마감'}되어 참여할 수 없습니다.
            </S.Notice>
          ) : null}
          {voteOptions.map((option, index) => {
            const isSelected = selectedOptionId === option.optionId || option.selectedByMe === true
            return (
              <S.CandidateRow key={option.optionId ?? index} $selected={isSelected}>
                <S.PlaceDetails>
                  <strong>{option.placeName || '장소'}</strong>
                  <span>{option.voteCount ?? 0}표</span>
                  {(canManagePlanner || (profileId != null && option.addedByUserId === profileId)) && normalizeStatus(activeVote?.status) === 'OPEN' ? (
                    <S.DeleteOptionButton
                      type="button"
                      disabled={deleteVoteOptionPending || option.optionId == null}
                      onClick={() => {
                        if (window.confirm('이 후보를 삭제할까요?')) void handleDeleteVoteOption(option.optionId)
                      }}
                    >
                      후보 삭제
                    </S.DeleteOptionButton>
                  ) : null}
                </S.PlaceDetails>
                <S.VoteMeta $selected={isSelected}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    disabled={!canVote || castBallotPending || option.optionId == null}
                    onClick={() => void handleCastBallot(option.optionId)}
                  >
                    {isSelected ? '투표 완료' : '투표'}
                  </button>
                </S.VoteMeta>
              </S.CandidateRow>
            )
          })}
          {!activeVote || voteOptions.length === 0 ? <S.Empty>아직 등록된 후보가 없습니다.</S.Empty> : null}
        </S.CandidatePanel>
        <S.PanelActions>
          <PartTripButton type="button" onClick={onNextCategory}>다음: {nextCategory}</PartTripButton>
          <PartTripButton
            type="button"
            $variant="secondary"
            disabled={!canCloseVotes || !canManagePlanner || closeVotePending}
            onClick={() => void handleCloseVote()}
          >
            {closeVotePending ? '투표 종료 중' : canCloseVotes ? '투표 종료하기' : '모든 카테고리 투표 후 종료'}
          </PartTripButton>
        </S.PanelActions>
      </S.VoteBody>
    </>
  )
}
