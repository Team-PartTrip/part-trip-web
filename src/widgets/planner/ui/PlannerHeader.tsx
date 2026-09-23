import { usePlannerMembersQuery } from '@/entities/planner'
import { Button as PartTripButton } from '@/shared/ui/parttrip'

import { getPlannerMemberDisplayName } from '../model/member'
import type { PlannerStep } from '../model/types'
import * as S from './PlannerPage.styles'

export function PlannerMemberAvatars({ plannerId }: { plannerId?: number }) {
  const { data: members = [] } = usePlannerMembersQuery(plannerId ?? 0, plannerId != null)
  const visibleMembers = members.slice(0, 4)
  if (!visibleMembers.length) return null

  return (
    <S.PlanMemberAvatars aria-label={`${members.length}명 참여`}>
      {visibleMembers.map((member, index) => (
        <S.Avatar key={member.userId ?? member.nickName ?? index}>
          {getPlannerMemberDisplayName(member).slice(0, 1).toUpperCase()}
        </S.Avatar>
      ))}
      {members.length > visibleMembers.length ? (
        <S.PlanMemberOverflow>+{members.length - visibleMembers.length}</S.PlanMemberOverflow>
      ) : null}
    </S.PlanMemberAvatars>
  )
}

type PlannerHeaderProps = {
  onNewTrip?: () => void
  showNewTrip?: boolean
  step: PlannerStep
  isLoading: boolean
}

export function PlannerHeader({ onNewTrip, showNewTrip, step, isLoading }: PlannerHeaderProps) {
  const [title, subtitle] = step === 'list'
    ? ['플래너', '']
    : ['여행 그룹 정하기', '여행 방식과 함께할 인원을 설정해요']

  return (
    <S.Header $hasSubtitle={Boolean(subtitle)}>
      {isLoading ? (
        <S.LoadingHeader />
      ) : (
        <>
          <div>
            <S.Title>{title}</S.Title>
            {subtitle ? <S.Subtitle>{subtitle}</S.Subtitle> : null}
          </div>
          {showNewTrip ? (
            <PartTripButton type="button" onClick={onNewTrip}>여행 계획 만들기</PartTripButton>
          ) : null}
        </>
      )}
    </S.Header>
  )
}
