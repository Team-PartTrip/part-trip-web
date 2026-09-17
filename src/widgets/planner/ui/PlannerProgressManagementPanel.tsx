import type { VoteStatusResponseDto } from '@/entities/planner'
import { Button as PartTripButton } from '@/shared/ui/parttrip'

import { getTopVoteOptions } from '../model/selectors'
import * as S from './PlannerPage.styles'

type Props = {
  closedVotes: VoteStatusResponseDto[]
  onOpenGroupManagement: () => void
}

export function PlannerProgressManagementPanel({
  closedVotes,
  onOpenGroupManagement,
}: Props) {
  if (!closedVotes.length) return null

  return (
    <S.InvitePanel>
      <S.SectionTitle>마감 투표 확정</S.SectionTitle>
      {closedVotes.map((vote, index) => {
        const topOptions = getTopVoteOptions(vote)

        return (
          <div key={vote.voteId ?? index}>
            <S.StatusLine>
              <span>{vote.categoryLabel || vote.category || '카테고리'}</span>
              <strong>{topOptions.length ? `최다 득표 ${topOptions.length}곳${topOptions.length > 1 ? ' 공동 확정 예정' : ''}` : '최다 득표 장소 없음'}</strong>
              <small>마감</small>
            </S.StatusLine>
            <S.ConfirmOptions>
              {topOptions.map((option, optionIndex) => (
                <S.ConfirmOptionButton
                  key={option.optionId ?? optionIndex}
                  type="button"
                  $confirmed
                  disabled
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
