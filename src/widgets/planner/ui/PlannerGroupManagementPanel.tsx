import type {
  PlannerInvitationResponseDto,
  PlannerMemberResponseDto,
} from '@/entities/planner'

import { normalizeStatus } from '../model/status'
import * as S from './PlannerPage.styles'

type Props = {
  invitationLoading: boolean
  invitationError: boolean
  pendingInvitations: PlannerInvitationResponseDto[]
  otherMembers: PlannerMemberResponseDto[]
  members: PlannerMemberResponseDto[]
  isManagingMembers: boolean
  canManagePlanner: boolean
  onAcceptInvitation: (invitationId?: number) => Promise<void>
  onRejectInvitation: (invitationId?: number) => Promise<void>
  onCancelInvitation: (invitationId?: number) => Promise<void>
  onRemoveMember: (userId?: string) => Promise<void>
}

export function PlannerGroupManagementPanel({
  invitationLoading,
  invitationError,
  pendingInvitations,
  otherMembers,
  members,
  isManagingMembers,
  canManagePlanner,
  onAcceptInvitation,
  onRejectInvitation,
  onCancelInvitation,
  onRemoveMember,
}: Props) {
  return (
    <>
      {invitationLoading ? (
        <S.InvitationPanel>
          <S.SectionTitle>받은 플래너 초대</S.SectionTitle>
          <S.Notice>초대 정보를 불러오는 중입니다.</S.Notice>
        </S.InvitationPanel>
      ) : invitationError ? (
        <S.InvitationPanel>
          <S.SectionTitle>받은 플래너 초대</S.SectionTitle>
          <S.Notice>초대 정보를 불러오지 못했습니다.</S.Notice>
        </S.InvitationPanel>
      ) : pendingInvitations.length ? (
        <S.InvitationPanel>
          <S.SectionTitle>받은 플래너 초대</S.SectionTitle>
          {pendingInvitations.map((invitation, index) => (
            <S.InvitationRow key={invitation.invitationId ?? index}>
              <strong>{invitation.plannerTitle || `플래너 #${invitation.plannerId ?? '-'}`}</strong>
              <span>{invitation.invitedByUserId || '그룹장'}님의 초대</span>
              <S.SmallActionButton
                type="button"
                disabled={isManagingMembers}
                onClick={() => void onAcceptInvitation(invitation.invitationId)}
              >
                수락
              </S.SmallActionButton>
              <S.SmallActionButton
                type="button"
                disabled={isManagingMembers}
                onClick={() => void onRejectInvitation(invitation.invitationId)}
              >
                거절
              </S.SmallActionButton>
            </S.InvitationRow>
          ))}
        </S.InvitationPanel>
      ) : null}
      {otherMembers.length ? (
        <S.InvitePanel>
          <S.SectionTitle>멤버 관리</S.SectionTitle>
          {members.length ? (
            <S.MemberList>
              {otherMembers.map((member, index) => {
                const memberStatus = normalizeStatus(member.status)
                const isPendingMember = member.invitationId != null && !['ACCEPTED', 'JOINED', 'ACTIVE'].includes(memberStatus)

                return (
                  <S.MemberRow key={`${member.userId ?? member.nickName}-${index}`}>
                    <S.Avatar>{(member.nickName || member.userId || '멤버').slice(0, 2).toUpperCase()}</S.Avatar>
                    <S.MemberDetails>
                      <strong>{member.nickName || member.userId || '멤버'}</strong>
                      <span>{memberStatus || '상태 확인 중'}</span>
                    </S.MemberDetails>
                    {canManagePlanner && isPendingMember ? (
                      <S.SmallActionButton
                        type="button"
                        disabled={isManagingMembers}
                        onClick={() => {
                          if (window.confirm('이 초대를 취소할까요?')) void onCancelInvitation(member.invitationId)
                        }}
                      >
                        초대 취소
                      </S.SmallActionButton>
                    ) : canManagePlanner && member.userId ? (
                      <S.SmallActionButton
                        type="button"
                        disabled={isManagingMembers}
                        onClick={() => {
                          if (window.confirm('이 멤버를 내보낼까요?')) void onRemoveMember(member.userId)
                        }}
                      >
                        내보내기
                      </S.SmallActionButton>
                    ) : null}
                  </S.MemberRow>
                )
              })}
            </S.MemberList>
          ) : null}
        </S.InvitePanel>
      ) : null}
    </>
  )
}
