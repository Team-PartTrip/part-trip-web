import type { PlannerMemberResponseDto } from '@/entities/planner'

import { getPlannerMemberDisplayName } from '../model/member'
import { normalizeStatus } from '../model/status'
import * as S from './PlannerPage.styles'
import { PlannerMemberAvatar } from './PlannerMemberAvatar'

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
                  <PlannerMemberAvatar name={getPlannerMemberDisplayName(member)} imgUrl={member.imgUrl} />
                  <S.MemberDetails>
                    <strong>{getPlannerMemberDisplayName(member)}</strong>
                    <span>{member.role?.toUpperCase() === 'OWNER' ? '그룹장' : isPendingMember ? '초대 대기 중' : '멤버'}</span>
                  </S.MemberDetails>
                  {canManagePlanner && member.role?.toUpperCase() !== 'OWNER' && !isPendingMember && member.userId ? (
                    <S.SmallActionButton
                      type="button"
                      disabled={isManagingMembers}
                      onClick={() => {
                        if (window.confirm('이 멤버를 내보내면 해당 멤버의 여행카드와 사진·장소 기록이 함께 삭제돼요. 내보낼까요?')) void onRemoveMember(member.userId)
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
