import { usePlannerMembersQuery } from '@/entities/planner'
import { Button as PartTripButton } from '@/shared/ui/parttrip'
import { formatTripDuration } from '@/shared/utils'

import { getPlannerMemberDisplayName } from '../model/member'
import type { PlannerStep } from '../model/types'
import * as S from './PlannerPage.styles'

function deadlineTime(deadline?: string) {
  const time = deadline?.slice(11, 16)
  return time && /^\d{2}:\d{2}$/.test(time) ? `${time} 마감` : ''
}

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
  plan?: {
    cityName?: string
    countryName?: string
    startDate?: string
    endDate?: string
    cities?: Array<{ cityName?: string; countryName?: string }>
  }
  showNewTrip?: boolean
  wide?: boolean
  step: PlannerStep
  voteCategory: string
  vote?: {
    votedMemberCount?: number
    eligibleMemberCount?: number
    deadline?: string
  }
  memberCount?: number
  isLoading: boolean
}

export function PlannerHeader({
  onNewTrip,
  plan,
  showNewTrip,
  wide,
  step,
  voteCategory,
  vote,
  memberCount,
  isLoading,
}: PlannerHeaderProps) {
  const destinations = plan?.cities?.map((city) => city.cityName).filter(Boolean).join(' · ')
  const destination = destinations || plan?.cityName || plan?.countryName || '여행지'
  const duration = formatTripDuration(plan?.startDate, plan?.endDate)
  const voteMembers = vote
    ? `${vote.votedMemberCount ?? 0} / ${vote.eligibleMemberCount ?? memberCount ?? 0}명 참여`
    : ''
  const voteDeadline = deadlineTime(vote?.deadline)
  const copy: Record<PlannerStep, [string, string]> = {
    list: ['플래너', ''],
    group: ['여행 그룹 정하기', '여행 방식과 인원을 설정하고 동행자를 초대해요'],
    destination: ['여행지 & 기간', '1 / 3 단계 · 도시별 일정과 인원을 정해요'],
    explore: ['장소·투표', `2 / 3 단계 · ${destination} · 목록에서 바로 여러 장소에 투표해요`],
    vote: [
      `${voteCategory} 투표`,
      voteMembers
        ? `2 / 3 단계 · ${voteMembers}${voteDeadline ? ` · ${voteDeadline}` : ''}`
        : '2 / 3 단계 · 여러 장소에 투표할 수 있어요.',
    ],
    progress: [
      '진행·확정 계획',
      `3 / 3 단계 · ${destination}${duration ? ` · ${duration}` : ''}${memberCount ? ` · ${memberCount}명` : ''}`,
    ],
    place: ['장소 상세', '장소 정보와 설명을 확인하세요.'],
  }
  const [title, subtitle] = copy[step]
  const activeStep = step === 'destination'
    ? 1
    : ['explore', 'vote', 'place'].includes(step)
      ? 2
      : step === 'progress'
        ? 3
        : 0

  return (
    <S.Header $hasSubtitle={Boolean(subtitle)} $wide={wide}>
      {isLoading ? (
        <S.LoadingHeader />
      ) : (
        <>
          <div>
            <S.Title>{title}</S.Title>
            {subtitle ? <S.Subtitle>{subtitle}</S.Subtitle> : null}
          </div>
          {showNewTrip ? (
            <PartTripButton type="button" onClick={onNewTrip}>+ 생성</PartTripButton>
          ) : null}
          {activeStep > 0 ? (
            <S.FlowStepper aria-label="여행 플래너 진행 단계">
              {['여행지·기간', '장소·투표', '진행·확정'].map((label, index) => (
                <S.FlowStep
                  key={label}
                  $active={index + 1 === activeStep}
                  $complete={index + 1 < activeStep}
                >
                  {index + 1} {label}
                </S.FlowStep>
              ))}
            </S.FlowStepper>
          ) : null}
        </>
      )}
    </S.Header>
  )
}
