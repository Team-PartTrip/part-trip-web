import { Button as PartTripButton } from '@/shared/ui/parttrip'

import { type usePlannerFlow } from '../model/usePlannerFlow'
import { getPlannerMemberDisplayName } from '../model/member'
import { normalizeStatus } from '../model/status'
import { PlannerProgressManagementPanel } from './PlannerProgressManagementPanel'
import * as S from './PlannerPage.styles'

type Flow = ReturnType<typeof usePlannerFlow>
type CommonFlow = Flow['common']
type CandidateFlow = Flow['candidate']
type GroupFlow = Flow['group']
type PlannerFlow = Flow['planner']
type VoteFlow = Flow['vote']

type Props = Pick<
  VoteFlow,
  | 'canCloseVotes'
  | 'handleCloseVote'
  | 'handleConfirmVote'
  | 'handleRemindMembers'
  | 'isRemindAvailable'
  | 'votes'
> & Pick<CandidateFlow, 'canManageCandidates' | 'plannerCategories'>
  & Pick<CommonFlow, 'plannerDetail' | 'plannerInviteLink'>
  & Pick<VoteFlow, 'canManagePlanner'>
  & Pick<GroupFlow, 'members'>
  & Pick<PlannerFlow, 'handleConfirmPlan' | 'handleDeletePlanner'> & {
  closeVotePending: boolean
  confirmPlannerPending: boolean
  confirmVotePending: boolean
  currentUserInitial: string
  currentUserName: string
  deletePlannerPending: boolean
  hasOpenVote: boolean
  inviteLinkError: string
  inviteLinkFeedback: string
  isConfirmed: boolean
  onCopyInviteLink: () => void
  onOpenExplore: () => void
  onOpenFinal: () => void
  onOpenGroupManagement: () => void
  remindFeedback: string
  remindPending: boolean
  confirmedCount: number
  votingCount: number
}

export function PlannerProgressStep({
  canCloseVotes,
  canManageCandidates,
  canManagePlanner,
  closeVotePending,
  confirmPlannerPending,
  confirmVotePending,
  currentUserInitial,
  currentUserName,
  deletePlannerPending,
  handleCloseVote,
  handleConfirmPlan,
  handleConfirmVote,
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
  onOpenFinal,
  onOpenGroupManagement,
  plannerDetail,
  plannerInviteLink,
  plannerCategories: categories,
  remindFeedback,
  remindPending,
  votes,
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
            const confirmed = vote?.confirmedOptionId != null || status === 'CONFIRMED'
            const closed = status === 'CLOSED'
            const confirmedPlace = vote?.options?.find((option) => option.optionId === vote.confirmedOptionId || option.confirmed)?.placeName
            return (
              <S.StatusLine key={category}>
                <span>{category}</span>
                <strong>{confirmed ? confirmedPlace || '확정' : closed ? '마감됨' : vote ? `진행 중 · ${vote.votedMemberCount ?? 0}/${vote.eligibleMemberCount ?? 0}` : '후보 없음'}</strong>
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
          <S.ActionRow>
            {!isConfirmed ? (
              <PartTripButton type="button" $variant="secondary" disabled={!canManageCandidates} onClick={onOpenExplore}>
                {votes.length ? '후보 장소 관리' : '장소 후보 추가'}
              </PartTripButton>
            ) : null}
            <PartTripButton
              type="button"
              disabled={!hasOpenVote || !canCloseVotes || !canManagePlanner || closeVotePending}
              onClick={() => void handleCloseVote()}
            >
              {closeVotePending ? '마감 중' : hasOpenVote ? canCloseVotes ? '투표 마감하기' : '모든 카테고리 투표 후 마감' : '마감할 투표 없음'}
            </PartTripButton>
            <PartTripButton type="button" $variant="secondary" disabled={!isRemindAvailable || remindPending} onClick={() => void handleRemindMembers()}>
              {remindPending ? '알림 전송 중' : '재촉 알림 보내기'}
            </PartTripButton>
            <PartTripButton
              type="button"
              $variant="secondary"
              disabled={!votes.length || hasOpenVote || !canManagePlanner || confirmPlannerPending}
              onClick={() => void handleConfirmPlan().then((confirmed) => { if (confirmed) onOpenFinal() })}
            >
              일정 확정하기
            </PartTripButton>
            <PartTripButton type="button" $variant="secondary" disabled={!plannerInviteLink} onClick={onCopyInviteLink}>
              초대링크 복사
            </PartTripButton>
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
          </S.ActionRow>
          {remindFeedback ? <S.ActionFeedback role="status">{remindFeedback}</S.ActionFeedback> : null}
          {inviteLinkFeedback ? <S.ActionFeedback role="status">{inviteLinkFeedback}</S.ActionFeedback> : null}
          {inviteLinkError ? <S.Error role="alert">{inviteLinkError}</S.Error> : null}
        </S.MemberResponses>
      </S.ProgressBody>
      <PlannerProgressManagementPanel
        closedVotes={votes.filter((vote) => normalizeStatus(vote.status) === 'CLOSED')}
        canManagePlanner={canManagePlanner}
        confirmVotePending={confirmVotePending}
        onConfirmVote={handleConfirmVote}
        onOpenGroupManagement={onOpenGroupManagement}
      />
    </>
  )
}
