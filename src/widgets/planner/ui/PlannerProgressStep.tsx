import { Button as PartTripButton } from '@/shared/ui/parttrip'

import { type usePlannerFlow } from '../model/usePlannerFlow'
import { getPlannerMemberDisplayName } from '../model/member'
import { getTopVoteOptions, isConfirmedPlannerOption } from '../model/selectors'
import { normalizeStatus } from '../model/status'
import { PlannerProgressManagementPanel } from './PlannerProgressManagementPanel'
import * as S from './PlannerPage.styles'

type Flow = ReturnType<typeof usePlannerFlow>
type CommonFlow = Flow['common']
type GroupFlow = Flow['group']
type PlannerFlow = Flow['planner']
type VoteFlow = Flow['vote']

type Props = Pick<
  VoteFlow,
  | 'canCloseVotes'
  | 'handleCloseVote'
  | 'handleRemindMembers'
  | 'isRemindAvailable'
  | 'votes'
> & Pick<Flow['candidate'], 'plannerCategories'>
  & Pick<CommonFlow, 'plannerDetail' | 'plannerInviteLink'>
  & Pick<VoteFlow, 'canManagePlanner'>
  & Pick<GroupFlow, 'members'>
  & Pick<PlannerFlow, 'canConfirmPlan' | 'confirmedPlaces' | 'handleConfirmPlan' | 'handleDeletePlanner'> & {
  closeVotePending: boolean
  confirmPlannerPending: boolean
  currentUserInitial: string
  currentUserName: string
  deletePlannerPending: boolean
  hasOpenVote: boolean
  inviteLinkError: string
  inviteLinkFeedback: string
  isConfirmed: boolean
  onCopyInviteLink: () => void
  onOpenExplore: () => void
  onOpenGroupManagement: () => void
  remindFeedback: string
  remindPending: boolean
  confirmedCount: number
  votingCount: number
}

export function PlannerProgressStep({
  canCloseVotes,
  canManagePlanner,
  closeVotePending,
  confirmPlannerPending,
  canConfirmPlan,
  currentUserInitial,
  currentUserName,
  deletePlannerPending,
  handleCloseVote,
  handleConfirmPlan,
  handleDeletePlanner,
  handleRemindMembers,
  hasOpenVote,
  inviteLinkError,
  inviteLinkFeedback,
  isConfirmed,
  isRemindAvailable,
  members,
  onCopyInviteLink,
  onOpenExplore,
  onOpenGroupManagement,
  plannerDetail,
  plannerInviteLink,
  plannerCategories: categories,
  remindFeedback,
  remindPending,
  votes,
  confirmedPlaces,
  confirmedCount,
  votingCount,
}: Props) {
  return (
    <>
      <S.ProgressStats>
        <S.ProgressStat><strong>{confirmedCount}</strong><span>확정</span></S.ProgressStat>
        <S.ProgressStat><strong>{votingCount}</strong><span>투표 중</span></S.ProgressStat>
        <S.ProgressStat><strong>{Math.max(0, categories.length - votes.length)}</strong><span>미정</span></S.ProgressStat>
      </S.ProgressStats>
      <S.ProgressBody>
        <S.CategoryStatusPanel>
          <S.SectionTitle>카테고리별 현황</S.SectionTitle>
          {categories.map((category) => {
            const vote = votes.find((item) => item.categoryLabel === category || item.category === category)
            const status = normalizeStatus(vote?.status)
            const closed = status === 'CLOSED'
            const confirmedOptions = vote?.options.filter((option) => isConfirmedPlannerOption(vote, option)) ?? []
            const finalOptions = confirmedOptions.length
              ? confirmedOptions
              : closed && vote
                ? getTopVoteOptions(vote)
                : []
            const confirmed = confirmedOptions.length > 0 || status === 'CONFIRMED'
            const finalPlaceNames = finalOptions.map((option) => option.placeName).filter(Boolean).join(', ')
            return (
              <S.StatusLine key={category}>
                <span>{category}</span>
                <strong>
                  {confirmed
                    ? `확정 ${confirmedOptions.length || 1}곳${finalPlaceNames ? ` · ${finalPlaceNames}` : ''}`
                    : closed
                      ? `최다 득표 ${finalOptions.length}곳 확정 예정${finalPlaceNames ? ` · ${finalPlaceNames}` : ''}`
                      : vote
                        ? `진행 중 · ${vote.votedMemberCount ?? 0}/${vote.eligibleMemberCount ?? 0}`
                        : '후보 없음'}
                </strong>
              </S.StatusLine>
            )
          })}
        </S.CategoryStatusPanel>
        <S.MemberResponses>
          <S.SectionTitle>멤버 응답</S.SectionTitle>
          {(members.length ? members : [{ nickName: currentUserName, userId: currentUserInitial, role: '완료' }]).map((member, index) => (
            <S.ResponseRow key={member.userId ?? member.nickName ?? index}>
              <S.Avatar>{getPlannerMemberDisplayName(member).slice(0, 2).toUpperCase()}</S.Avatar>
              <strong>{getPlannerMemberDisplayName(member)}</strong>
              <span>{member.role || '대기 중'}</span>
            </S.ResponseRow>
          ))}
          <S.ProgressActions>
            <S.ProgressActionGroup>
              {!isConfirmed ? (
                <PartTripButton type="button" $variant="secondary" onClick={onOpenExplore}>
                  장소·투표 보기
                </PartTripButton>
              ) : null}
              {hasOpenVote && canManagePlanner ? (
                <PartTripButton
                  type="button"
                  disabled={!canCloseVotes || closeVotePending}
                  onClick={() => void handleCloseVote()}
                >
                  {closeVotePending ? '마감 중' : canCloseVotes ? '투표 마감하기' : '모든 카테고리 투표 후 마감'}
                </PartTripButton>
              ) : null}
              {!isConfirmed && votes.length > 0 && !hasOpenVote && canManagePlanner ? (
                <PartTripButton
                  type="button"
                  $variant="secondary"
                  disabled={confirmPlannerPending || !canConfirmPlan}
                  onClick={() => void handleConfirmPlan()}
                >
                  일정 확정하기
                </PartTripButton>
              ) : null}
            </S.ProgressActionGroup>
            <S.ProgressActionGroup>
              {isRemindAvailable ? (
                <PartTripButton type="button" $variant="secondary" disabled={remindPending} onClick={() => void handleRemindMembers()}>
                  {remindPending ? '알림 전송 중' : '재촉 알림 보내기'}
                </PartTripButton>
              ) : null}
              {plannerInviteLink ? (
                <PartTripButton type="button" $variant="secondary" onClick={onCopyInviteLink}>
                  초대링크 복사
                </PartTripButton>
              ) : null}
              {canManagePlanner ? (
                <S.DeletePlannerButton
                  type="button"
                  aria-label="현재 플래너 삭제"
                  disabled={deletePlannerPending}
                  onClick={() => { if (window.confirm('이 플래너를 삭제할까요?')) void handleDeletePlanner(plannerDetail?.plannerId) }}
                >
                  {deletePlannerPending ? '삭제 중' : '삭제'}
                </S.DeletePlannerButton>
              ) : null}
            </S.ProgressActionGroup>
          </S.ProgressActions>
          {remindFeedback ? <S.ActionFeedback role="status">{remindFeedback}</S.ActionFeedback> : null}
          {inviteLinkFeedback ? <S.ActionFeedback role="status">{inviteLinkFeedback}</S.ActionFeedback> : null}
          {inviteLinkError ? <S.Error role="alert">{inviteLinkError}</S.Error> : null}
        </S.MemberResponses>
      </S.ProgressBody>
      <PlannerProgressManagementPanel
        closedVotes={votes.filter((vote) => normalizeStatus(vote.status) === 'CLOSED')}
        onOpenGroupManagement={onOpenGroupManagement}
      />
      {isConfirmed ? (
        <S.InvitePanel>
          <S.SectionTitle>확정된 여행 일정</S.SectionTitle>
          {confirmedPlaces.map((place, index) => (
            <S.StatusLine key={`${place.voteId ?? 'place'}-${place.optionId ?? index}`}>
              <span>{place.categoryLabel || place.category || '장소'}</span>
              <strong>{place.placeName || '확정 장소'}</strong>
              <small>{place.address || ''}</small>
            </S.StatusLine>
          ))}
          {confirmedPlaces.length === 0 ? <S.Empty>확정 일정을 불러오는 중입니다.</S.Empty> : null}
        </S.InvitePanel>
      ) : null}
    </>
  )
}
