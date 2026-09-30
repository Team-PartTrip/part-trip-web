import type { PlannerListResponseDto } from '@/entities/planner'
import { formatDateRange } from '@/shared/utils'

import { plannerMatchesTab, plannerStatusKey, plannerStatusLabel } from '../model/status'
import { PlannerMemberAvatars } from './PlannerHeader'
import * as S from './PlannerPage.styles'

export type PlannerTab = 'active' | 'planned' | 'completed'

type Props = {
  isLoading: boolean
  onSelectPlanner: (plannerId?: number) => void
  onTabChange: (tab: PlannerTab) => void
  plannerTab: PlannerTab
  planners: PlannerListResponseDto[]
}

export function PlannerListStep({
  isLoading,
  onSelectPlanner,
  onTabChange,
  plannerTab,
  planners,
}: Props) {
  const availablePlanners = planners.filter((planner) =>
    plannerMatchesTab(planner.status, planner.startDate, planner.endDate, plannerTab),
  )

  return (
    <>
      <S.PlannerTabs aria-label="여행 계획 상태" role="tablist">
        {[
          ['active', '진행 중'],
          ['planned', '예정'],
          ['completed', '완료'],
        ].map(([tab, label]) => (
          <button
            aria-selected={plannerTab === tab}
            key={tab}
            role="tab"
            type="button"
            className={plannerTab === tab ? 'active' : ''}
            onClick={() => onTabChange(tab as PlannerTab)}
          >
            {label}
          </button>
        ))}
      </S.PlannerTabs>
      <S.PlannerListLayout>
        <S.PlanListPanel>
          {availablePlanners.map((planner, index) => {
            const title = planner.title || `${planner.cityName || planner.regionName || '여행'} 여행`
            return (
              <S.PlanItem key={planner.plannerId ?? index}>
                <S.PlanRow
                  type="button"
                  $state={plannerStatusKey(planner.status, planner.endDate)}
                  onClick={() => onSelectPlanner(planner.plannerId)}
                >
                  <S.PlanContent>
                    <S.PlanDetails>
                      <strong>{title}</strong>
                      <span>{formatDateRange(planner.startDate, planner.endDate)}</span>
                      <S.PlanStatusRow>
                        <S.PlanStatus $state={plannerStatusKey(planner.status, planner.endDate)}>
                          {plannerStatusLabel(planner.status, planner.endDate)}
                        </S.PlanStatus>
                        <S.PlanParticipation>
                          {planner.joinedMemberCount ?? 0}/{planner.memberCount ?? 0}명 참여
                        </S.PlanParticipation>
                      </S.PlanStatusRow>
                    </S.PlanDetails>
                    <S.PlanAside>
                      <PlannerMemberAvatars plannerId={planner.plannerId} />
                      <S.RowArrow aria-hidden="true">›</S.RowArrow>
                    </S.PlanAside>
                  </S.PlanContent>
                </S.PlanRow>
              </S.PlanItem>
            )
          })}
          {!isLoading && availablePlanners.length === 0 ? (
            <S.Empty>등록된 여행 계획이 없습니다.</S.Empty>
          ) : null}
        </S.PlanListPanel>
      </S.PlannerListLayout>
    </>
  )
}
