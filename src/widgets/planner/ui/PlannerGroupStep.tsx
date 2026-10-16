import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { PlannerMemberResponseDto } from '@/entities/planner'
import { Button as PartTripButton } from '@/shared/ui/parttrip'

import { getPlannerMemberDisplayName } from '../model/member'
import * as S from './PlannerPage.styles'

type Props = {
  currentUserInitial: string
  currentUserName: string
  isSaving: boolean
  isSolo: boolean
  memberCount: string
  members: PlannerMemberResponseDto[]
  saveGroupSettings: (event: FormEvent<HTMLFormElement>) => Promise<void>
  setIsSolo: Dispatch<SetStateAction<boolean>>
  setMemberCount: Dispatch<SetStateAction<string>>
}

export function PlannerGroupStep({
  currentUserInitial,
  currentUserName,
  isSaving,
  isSolo,
  memberCount,
  members,
  saveGroupSettings,
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
        <PartTripButton type="submit" disabled={isSaving}>{isSaving ? '저장 중' : '다음: 여행지'}</PartTripButton>
      </S.GroupActions>
    </S.GroupForm>
  )
}
