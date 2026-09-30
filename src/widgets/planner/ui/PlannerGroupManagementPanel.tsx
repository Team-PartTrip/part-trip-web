import type { PlannerMemberResponseDto } from '@/entities/planner'

import { getPlannerMemberDisplayName } from '../model/member'
import { normalizeStatus } from '../model/status'
import * as S from './PlannerPage.styles'

type Props = {
  otherMembers: PlannerMemberResponseDto[]
  isManagingMembers: boolean
  canManagePlanner: boolean
  onRemoveMember: (userId?: string) => Promise<void>
}

export function PlannerGroupManagementPanel({
  otherMembers,
  isManagingMembers,
  canManagePlanner,
  onRemoveMember,
}: Props) {
  return (
    <>
      {otherMembers.length ? (
        <S.InvitePanel>
          <S.SectionTitle>멤버 관리</S.SectionTitle>
          <S.MemberList>
            {otherMembers.map((member, index) => {
              const memberStatus = normalizeStatus(member.status)
              const isPendingMember = member.invitationId != null && !['ACCEPTED', 'JOINED', 'ACTIVE'].includes(memberStatus)

              return (
                <S.MemberRow key={`${member.userId ?? member.nickName}-${index}`}>
                  <S.Avatar>{getPlannerMemberDisplayName(member).slice(0, 2).toUpperCase()}</S.Avatar>
                  <S.MemberDetails>
                    <strong>{getPlannerMemberDisplayName(member)}</strong>
                    <span>{memberStatus || '상태 확인 중'}</span>
                  </S.MemberDetails>
                  {canManagePlanner && !isPendingMember && member.userId ? (
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
        </S.InvitePanel>
      ) : null}
    </>
  )
}
