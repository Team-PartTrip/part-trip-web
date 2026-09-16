import type { VoteStatusResponseDto } from '@/entities/planner'
import { Button as PartTripButton } from '@/shared/ui/parttrip'

import * as S from './PlannerPage.styles'

type Props = {
  closedVotes: VoteStatusResponseDto[]
  canManagePlanner: boolean
  confirmVotePending: boolean
  onConfirmVote: (voteId?: number, optionId?: number) => Promise<void>
  onOpenGroupManagement: () => void
}

export function PlannerProgressManagementPanel({
  closedVotes,
  canManagePlanner,
  confirmVotePending,
  onConfirmVote,
  onOpenGroupManagement,
}: Props) {
  if (!closedVotes.length) return null

  return (
    <S.InvitePanel>
      <S.SectionTitle>마감 투표 확정</S.SectionTitle>
      {closedVotes.map((vote, index) => {
        const options = vote.options ?? []
        const highestVoteCount = Math.max(...options.map((option) => option.voteCount ?? 0), 0)
        const topOptions = options.filter((option) => (option.voteCount ?? 0) === highestVoteCount)

        return (
          <div key={vote.voteId ?? index}>
            <S.StatusLine>
              <span>{vote.categoryLabel || vote.category || '카테고리'}</span>
              <strong>{vote.confirmedOptionId ? '확정 후보 선택됨' : '확정할 후보를 선택하세요'}</strong>
              <small>마감</small>
            </S.StatusLine>
            <S.ConfirmOptions>
              {topOptions.map((option, optionIndex) => (
                <S.ConfirmOptionButton
                  key={option.optionId ?? optionIndex}
                  type="button"
                  $confirmed={option.optionId === vote.confirmedOptionId || option.confirmed === true}
                  disabled={!canManagePlanner || confirmVotePending || option.optionId == null || vote.confirmedOptionId != null}
                  onClick={() => void onConfirmVote(vote.voteId, option.optionId)}
                >
                  {option.placeName || '장소'} · {option.voteCount ?? 0}표
                </S.ConfirmOptionButton>
              ))}
            </S.ConfirmOptions>
          </div>
        )
      })}
      <S.ActionRow>
        <PartTripButton type="button" $variant="secondary" onClick={onOpenGroupManagement}>
          그룹 관리
        </PartTripButton>
      </S.ActionRow>
    </S.InvitePanel>
  )
}
