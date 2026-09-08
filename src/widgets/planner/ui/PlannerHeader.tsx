import { usePlannerMembersQuery } from '@/entities/planner'
import { Button as PartTripButton } from '@/shared/ui/parttrip'
import { formatDate, formatDateRange, formatTripDuration } from '@/shared/utils'

import type { PlannerStep } from '../model/types'
import * as S from './PlannerPage.styles'

function shortDateRange(startDate?: string, endDate?: string) {
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  return start.length >= 10 && end.length >= 10
    ? `${start.slice(5)} – ${end.slice(5)}`
    : formatDateRange(startDate, endDate)
}

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
          {(member.nickName || member.userId || '멤버').slice(0, 1).toUpperCase()}
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
  const destination = plan?.cityName || plan?.countryName || '여행지'
  const duration = formatTripDuration(plan?.startDate, plan?.endDate)
  const voteMembers = vote
    ? `${vote.votedMemberCount ?? 0} / ${vote.eligibleMemberCount ?? memberCount ?? 0}명 참여`
    : ''
  const voteDeadline = deadlineTime(vote?.deadline)
  const isFinal = step === 'final'
  const copy: Record<PlannerStep, [string, string]> = {
    list: ['플래너', ''],
    group: ['여행 그룹 정하기', '1 / 4 단계 · 여행 방식과 인원'],
    destination: ['여행지 & 기간', '2 / 4 단계 · 여행지와 날짜를 정해요'],
    explore: ['장소 둘러보기', `${destination} · ${shortDateRange(plan?.startDate, plan?.endDate)}`],
    vote: [
      `${voteCategory} 투표`,
      voteMembers
        ? `${voteMembers} · 카테고리별 1곳 선택${voteDeadline ? ` · ${voteDeadline}` : ''}`
        : '카테고리별 후보 중 1곳을 선택하세요.',
    ],
    lineup: ['장바구니', '소수 인원이라 투표 대신 직접 고르거나 랜덤으로 정할 수 있어요'],
    progress: [
      duration ? `${destination} ${duration}` : `${destination} 여행`,
      `${shortDateRange(plan?.startDate, plan?.endDate)}${memberCount ? ` · ${memberCount}명` : ''}`,
    ],
    final: ['', ''],
    place: ['장소 상세', '후보 장소의 정보와 설명을 확인하세요.'],
  }
  const [title, subtitle] = copy[step]
  const activeStep = step === 'group'
    ? 1
    : step === 'destination'
      ? 2
      : ['explore', 'vote'].includes(step)
        ? 3
        : step === 'final'
          ? 4
          : 0

  return (
    <S.Header $final={isFinal} $hasSubtitle={Boolean(subtitle)} $wide={wide}>
      {isLoading ? (
        <S.LoadingHeader />
      ) : (
        <>
          {!isFinal ? (
            <div>
              <S.Title>{title}</S.Title>
              {subtitle ? <S.Subtitle>{subtitle}</S.Subtitle> : null}
            </div>
          ) : null}
          {showNewTrip ? (
            <PartTripButton type="button" onClick={onNewTrip}>+ 생성</PartTripButton>
          ) : null}
          {activeStep > 0 ? (
            <S.FlowStepper $final={isFinal} aria-label="여행 플래너 진행 단계">
              {['그룹', '여행지·기간', '장소·투표', '확정'].map((label, index) => (
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
