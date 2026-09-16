import { Button as PartTripButton, Input as PartTripInput } from '@/shared/ui/parttrip'

import { type usePlannerFlow } from '../model/usePlannerFlow'
import { getPlannerMemberDisplayName } from '../model/member'
import * as S from './PlannerPage.styles'

type GroupFlow = ReturnType<typeof usePlannerFlow>['group']

type Props = {
  currentUserInitial: string
  currentUserName: string
  handleCopyInviteLink: () => void
  handleJoinPlanner: GroupFlow['handleJoinPlanner']
  inviteCode: string
  isInviteOpen: boolean
  isSaving: boolean
  isSolo: boolean
  joinPlannerPending: boolean
  memberCount: string
  members: GroupFlow['members']
  plannerInviteLink: string
  saveGroupSettings: GroupFlow['saveGroupSettings']
  setInviteCode: GroupFlow['setInviteCode']
  setIsInviteOpen: (value: (current: boolean) => boolean) => void
  setIsSolo: GroupFlow['setIsSolo']
  setMemberCount: GroupFlow['setMemberCount']
}

export function PlannerGroupStep({
  currentUserInitial,
  currentUserName,
  handleCopyInviteLink,
  handleJoinPlanner,
  inviteCode,
  isInviteOpen,
  isSaving,
  isSolo,
  joinPlannerPending,
  memberCount,
  members,
  plannerInviteLink,
  saveGroupSettings,
  setInviteCode,
  setIsInviteOpen,
  setIsSolo,
  setMemberCount,
}: Props) {
  return (
    <S.GroupForm as="form" onSubmit={(event) => void saveGroupSettings(event)}>
      <S.GroupTypeRow>
        <S.GroupTypeButton type="button" $active={isSolo} onClick={() => setIsSolo(true)}>
          혼자 여행
        </S.GroupTypeButton>
        <S.GroupTypeButton type="button" $active={!isSolo} onClick={() => setIsSolo(false)}>
          함께 여행
        </S.GroupTypeButton>
      </S.GroupTypeRow>
      <S.CountRow>
        <label htmlFor="planner-member-count">나를 포함한 인원</label>
        <S.Stepper>
          <button
            type="button"
            aria-label="인원 줄이기"
            onClick={() => setMemberCount(String(Math.max(1, Number(memberCount) - 1)))}
            disabled={isSolo}
          >
            −
          </button>
          <span id="planner-member-count">{isSolo ? 1 : memberCount}</span>
          <button
            type="button"
            aria-label="인원 늘리기"
            onClick={() => setMemberCount(String(Math.min(30, Number(memberCount) + 1)))}
            disabled={isSolo}
          >
            +
          </button>
        </S.Stepper>
      </S.CountRow>
      {isInviteOpen ? (
        <S.InvitePanel>
          <S.SectionTitle>초대하기</S.SectionTitle>
          {plannerInviteLink ? (
            <S.InviteLinkRow>
              <PartTripInput aria-label="생성된 초대 링크" value={plannerInviteLink} readOnly />
              <PartTripButton type="button" $variant="secondary" onClick={() => void handleCopyInviteLink()}>
                링크 복사
              </PartTripButton>
            </S.InviteLinkRow>
          ) : (
            <S.Notice>플래너를 생성하면 멤버 초대 링크가 표시됩니다.</S.Notice>
          )}
          <S.InviteCodeRow>
            <S.StepField>
              <label htmlFor="planner-invite-code">초대 코드로 참여</label>
              <PartTripInput
                id="planner-invite-code"
                value={inviteCode}
                onChange={(event) => setInviteCode(event.target.value)}
                placeholder="초대 코드를 입력하세요"
              />
            </S.StepField>
            <PartTripButton
              type="button"
              $variant="secondary"
              disabled={joinPlannerPending}
              onClick={() => void handleJoinPlanner()}
            >
              {joinPlannerPending ? '참여 중' : '그룹 참여'}
            </PartTripButton>
          </S.InviteCodeRow>
        </S.InvitePanel>
      ) : null}
      <S.MemberPanel>
        <S.SectionTitle>함께할 사람</S.SectionTitle>
        <S.MemberList>
          <S.MemberRow>
            <S.Avatar>{currentUserInitial.slice(0, 1)}</S.Avatar>
            <S.MemberDetails><strong>{currentUserName}</strong></S.MemberDetails>
            <S.MemberState>나</S.MemberState>
          </S.MemberRow>
          {members.map((member, index) => (
            <S.MemberRow key={`${member.userId ?? member.nickName}-${index}`}>
              <S.Avatar>{getPlannerMemberDisplayName(member).slice(0, 1).toUpperCase()}</S.Avatar>
              <S.MemberDetails><strong>{getPlannerMemberDisplayName(member)}</strong></S.MemberDetails>
              <S.MemberState>{member.role || '초대 대기'}</S.MemberState>
            </S.MemberRow>
          ))}
        </S.MemberList>
      </S.MemberPanel>
      <S.GroupActions>
        <PartTripButton type="button" $variant="secondary" onClick={() => setIsInviteOpen((current) => !current)}>
          {isInviteOpen ? '초대 닫기' : '+ 링크로 초대하기'}
        </PartTripButton>
        <PartTripButton type="submit" disabled={isSaving}>{isSaving ? '저장 중' : '다음: 여행지'}</PartTripButton>
      </S.GroupActions>
    </S.GroupForm>
  )
}
