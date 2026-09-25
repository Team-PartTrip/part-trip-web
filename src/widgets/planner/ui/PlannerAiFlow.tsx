import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import {
  plannerQueryKeys,
  useConfirmPlannerMutation,
  useGeneratePlannerMutation,
  usePlannerBlocksQuery,
  usePlannerDetailQuery,
  usePlannerScheduleQuery,
  type PlannerBlockDto,
  type PlannerBlockResponseDto,
} from '@/entities/planner'
import { ACTIVE_PLANNER_ID_KEY, PLANNER_CONFIRMED_KEY, paths } from '@/shared/config'
import { readSessionId, readSessionValue, writeSessionValue } from '@/shared/libs/session-storage'
import { Button, Input } from '@/shared/ui/parttrip'
import { formatDateRange, normalizeStatus } from '@/shared/utils'
import { isPositiveSafeInteger } from '@/shared/utils/number'
import { AppShell } from '@/widgets/app-shell'
import { activatePlannerSession } from '../model/planner-session'
import { clearPlannerCreationDraft, readPlannerCreationDraft, writePlannerCreationDraft, type PlannerCreationDraft } from '../model/planner-creation'
import { getPlannerTravelParty } from '../model/member-count'
import { canManagePlanner } from '../model/planner-role'
import * as S from './PlannerAiFlow.styles'
import { PlannerDestinationStep } from './PlannerDestinationStep'
import { PlannerScheduleEditor } from './PlannerScheduleEditor'

type Step = 'destination' | 'criteria' | 'schedule' | 'invite'
type SelectionMap = Record<string, string[]>

const suggestedBlockTypes = ['TRAVEL_TYPE', 'COMPANION', 'WALK_PREFERENCE', 'DAILY_DENSITY', 'FOOD_TYPE', 'LODGING_TYPE', 'MUST_INCLUDE', 'EXCLUDE']
const stepIndex: Record<Step, number> = { destination: 1, criteria: 2, schedule: 3, invite: 4 }
const stepLabels = ['여행지·기간', '여행 기준', 'AI 일정', '초대']
const stepCopy: Record<Step, [string, string]> = {
  destination: ['국내 도시 & 기간', '여행 도시와 날짜를 정해주세요. 최대 14일까지 계획할 수 있어요.'],
  criteria: ['여행 기준을 선택해 주세요', '선택한 조건은 AI 일정 생성에 사용됩니다. 도시와 날짜는 앞 단계에서 정한 값이에요.'],
  schedule: ['AI 일정 초안', '날짜별 추천 장소를 확인하고 여행 일정을 확정해주세요.'],
  invite: ['함께할 사람 초대', '초대 링크를 가족에게 보내면 같은 일정을 볼 수 있어요.'],
}

function toSelectionMap(blocks: PlannerBlockDto[] = []): SelectionMap {
  return blocks.reduce<SelectionMap>((result, block) => {
    result[block.type] = [...(result[block.type] ?? []), block.value]
    return result
  }, {})
}

function getBlockValues(selections: SelectionMap): PlannerBlockDto[] {
  return Object.entries(selections).flatMap(([type, values]) => values.map((value) => ({ type, value })))
}

export function PlannerAiFlow({ step }: { step: Step }) {
  const navigate = useNavigate()
  const [currentDraft] = useState(readPlannerCreationDraft)
  const [title, subtitle] = stepCopy[step]
  let stepContent: ReactNode

  useEffect(() => {
    if (step === 'criteria' && !currentDraft) void navigate({ to: paths.plannerDestination, replace: true })
  }, [currentDraft, navigate, step])

  switch (step) {
    case 'destination':
      stepContent = <PlannerDestinationStep initialDraft={currentDraft} />
      break
    case 'criteria':
      stepContent = currentDraft
        ? <PlannerCriteriaStep draft={currentDraft} />
        : <S.Card role="status"><p>여행 정보를 확인하는 중이에요.</p></S.Card>
      break
    case 'schedule':
      stepContent = <PlannerScheduleStep currentDraft={currentDraft} />
      break
    case 'invite':
      stepContent = <PlannerInviteStep currentDraft={currentDraft} />
      break
  }

  return (
    <AppShell>
      <S.Page>
        <S.Header>
          <div><h1>{title}</h1><p>{subtitle}</p></div>
          <S.Steps aria-label="여행 플래너 진행 단계">
            {stepLabels.map((label, index) => (
              <S.Step key={label} $active={stepIndex[step] === index + 1} aria-current={stepIndex[step] === index + 1 ? 'step' : undefined}>
                {index + 1} {label}
              </S.Step>
            ))}
          </S.Steps>
        </S.Header>
        {stepContent}
      </S.Page>
    </AppShell>
  )
}

function PlannerCriteriaStep({ draft }: { draft: PlannerCreationDraft }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const blocksQuery = usePlannerBlocksQuery()
  const generateMutation = useGeneratePlannerMutation()
  const [selections, setSelections] = useState<SelectionMap>(() => toSelectionMap(draft.blocks))
  const [message, setMessage] = useState('')
  const blocks = useMemo(() => getBlockValues(selections), [selections])
  const availableBlocks = blocksQuery.data ?? []
  const priorityBlocks = availableBlocks.filter((block) => suggestedBlockTypes.includes(block.type ?? ''))
  const otherBlocks = availableBlocks.filter((block) => !suggestedBlockTypes.includes(block.type ?? ''))

  const selectBlockOption = (block: PlannerBlockResponseDto, value: string) => {
    const type = block.type
    if (!type) return
    setSelections((current) => {
      const selected = current[type] ?? []
      const next = block.multiple
        ? selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]
        : selected.includes(value) ? [] : [value]
      return { ...current, [type]: next }
    })
  }

  const renderBlock = (block: PlannerBlockResponseDto) => {
    const type = block.type
    if (!type) return null
    return (
      <S.Block key={type}>
        <h3>{block.label ?? type}</h3>
        <S.Options role="group" aria-label={block.label ?? type}>
          {(block.options ?? []).map((value) => (
            <S.Option key={value} type="button" $active={Boolean(selections[type]?.includes(value))}
              aria-pressed={Boolean(selections[type]?.includes(value))} onClick={() => selectBlockOption(block, value)}>
              {value}
            </S.Option>
          ))}
        </S.Options>
      </S.Block>
    )
  }

  const generate = async () => {
    if (generateMutation.isPending) return
    setMessage('')
    const party = getPlannerTravelParty(blocks)
    if (!party) {
      setMessage('혼자 여행인지, 동행이 있는지 선택해주세요.')
      return
    }
    const payload = {
      ...party,
      title: `${draft.cityName} 여행`,
      cityName: draft.cityName,
      startDate: draft.startDate,
      endDate: draft.endDate,
      blocks,
    }
    writePlannerCreationDraft({ ...draft, blocks, ...party })
    try {
      const schedule = await generateMutation.mutateAsync(payload)
      if (!isPositiveSafeInteger(schedule.plannerId)) throw new Error('plannerId is missing')
      activatePlannerSession(schedule.plannerId)
      queryClient.setQueryData(plannerQueryKeys.schedule(schedule.plannerId), schedule)
      void navigate({ to: paths.plannerProgress })
    } catch {
      setMessage('AI 일정을 만들지 못했어요. 도시와 날짜를 확인하고 다시 시도해주세요.')
    }
  }

  return (
    <S.Grid>
      <S.Card>
        {blocksQuery.isLoading ? <p role="status">여행 기준을 불러오는 중이에요.</p> : blocksQuery.isError ? (
          <S.Error role="alert">여행 기준을 불러오지 못했어요. 새로고침 후 다시 시도해주세요.</S.Error>
        ) : (
          <>
            <S.BlockList>{priorityBlocks.map(renderBlock)}</S.BlockList>
            {otherBlocks.length ? <S.MoreBlocks><summary>다른 여행 기준 더 보기 ({otherBlocks.length})</summary><S.BlockList>{otherBlocks.map(renderBlock)}</S.BlockList></S.MoreBlocks> : null}
            {message ? <S.Error role="alert">{message}</S.Error> : null}
            <S.ButtonRow>
              <Button type="button" $variant="secondary" onClick={() => void navigate({ to: paths.plannerDestination })}>이전</Button>
              <Button type="button" disabled={generateMutation.isPending || blocksQuery.isLoading} onClick={() => void generate()}>
                {generateMutation.isPending ? 'AI가 일정을 만드는 중…' : 'AI 여행 플래너 만들기'}
              </Button>
            </S.ButtonRow>
            {generateMutation.isPending ? <p role="status" aria-live="polite">선택한 여행지와 조건으로 일정을 만들고 있어요. 잠시 기다려주세요.</p> : null}
          </>
        )}
      </S.Card>
      <S.Summary>
        <h2>선택한 여행</h2>
        <dl>
          <div><dt>여행지</dt><dd>{draft.cityName}</dd></div>
          <div><dt>기간</dt><dd>{formatDateRange(draft.startDate, draft.endDate)}</dd></div>
          <div><dt>선택한 기준</dt><dd>{blocks.length ? blocks.map((block) => block.value).join(' · ') : '기본 조건으로 만들어요'}</dd></div>
        </dl>
      </S.Summary>
    </S.Grid>
  )
}

function PlannerScheduleStep({ currentDraft }: { currentDraft?: PlannerCreationDraft }) {
  const navigate = useNavigate()
  const plannerId = readSessionId(ACTIVE_PLANNER_ID_KEY)
  const scheduleQuery = usePlannerScheduleQuery(plannerId)
  const detailQuery = usePlannerDetailQuery(plannerId)
  const confirmMutation = useConfirmPlannerMutation()
  const [message, setMessage] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const serverConfirmed = ['CONFIRMED', 'TRAVELING', 'COMPLETED'].includes(normalizeStatus(detailQuery.data?.status))
  const isConfirmed = confirmed || serverConfirmed || readSessionValue(`${PLANNER_CONFIRMED_KEY}:${plannerId}`) === 'true'
  const canManageCurrentPlanner = canManagePlanner(detailQuery.data?.role)

  const confirmSchedule = async () => {
    if (!canManageCurrentPlanner || !isPositiveSafeInteger(plannerId) || !scheduleQuery.data) return
    setMessage('')
    try {
      await confirmMutation.mutateAsync(plannerId)
      setConfirmed(true)
      writeSessionValue(`${PLANNER_CONFIRMED_KEY}:${plannerId}`, 'true')
      if (currentDraft?.isSolo) {
        clearPlannerCreationDraft()
        void navigate({ to: paths.planner })
      } else {
        void navigate({ to: paths.plannerInvite })
      }
    } catch {
      setMessage('일정을 확정하지 못했어요. 잠시 후 다시 시도해주세요.')
    }
  }

  let content: ReactNode
  if (!isPositiveSafeInteger(plannerId)) {
    content = <p role="alert">확인할 일정이 없어요. 플래너 목록에서 여행을 선택해주세요.</p>
  } else if (scheduleQuery.isLoading || detailQuery.isLoading) {
    content = <p role="status" aria-busy="true">AI 일정을 불러오는 중이에요.</p>
  } else if (scheduleQuery.isError) {
    content = <><S.Error role="alert">일정을 불러오지 못했어요.</S.Error><S.ButtonRow><Button type="button" $variant="secondary" onClick={() => void scheduleQuery.refetch()}>다시 시도</Button></S.ButtonRow></>
  } else {
    let action: ReactNode = null
    if (isConfirmed && canManageCurrentPlanner) {
      action = <Button type="button" onClick={() => void navigate({ to: paths.plannerInvite })}>초대 단계로</Button>
    } else if (!isConfirmed && canManageCurrentPlanner) {
      action = <Button type="button" disabled={confirmMutation.isPending || !scheduleQuery.data?.days?.length} onClick={() => void confirmSchedule()}>
        {confirmMutation.isPending ? '확정 중…' : '일정 확정'}
      </Button>
    } else if (!isConfirmed && !canManageCurrentPlanner) {
      action = <p role="status">리더가 일정을 확정하면 초대 단계가 열립니다.</p>
    }

    content = <>
      {detailQuery.isError ? <S.Error role="alert">플래너 권한을 확인하지 못해 일정은 읽기 전용으로 표시됩니다.</S.Error> : null}
      {scheduleQuery.data ? <PlannerScheduleEditor
        plannerId={plannerId}
        cityName={detailQuery.data?.cityName ?? scheduleQuery.data.cityName}
        schedule={scheduleQuery.data}
        canManage={canManageCurrentPlanner}
        isConfirmed={isConfirmed}
      /> : <p role="alert">일정 응답에 표시할 내용이 없습니다.</p>}
      {message ? <S.Error role="alert">{message}</S.Error> : null}
      <S.ButtonRow>
        <Button type="button" $variant="secondary" onClick={() => void navigate({ to: paths.planner })}>플래너 목록</Button>
        {action}
      </S.ButtonRow>
    </>
  }

  return <S.Card>{content}</S.Card>
}

function PlannerInviteStep({ currentDraft }: { currentDraft?: PlannerCreationDraft }) {
  const navigate = useNavigate()
  const plannerId = readSessionId(ACTIVE_PLANNER_ID_KEY)
  const detailQuery = usePlannerDetailQuery(plannerId)
  const [inviteFeedback, setInviteFeedback] = useState('')
  const isConfirmed = ['CONFIRMED', 'TRAVELING', 'COMPLETED'].includes(normalizeStatus(detailQuery.data?.status))
    || readSessionValue(`${PLANNER_CONFIRMED_KEY}:${plannerId}`) === 'true'

  const copyInviteLink = async () => {
    const link = detailQuery.data?.inviteLink
    if (!link) {
      setInviteFeedback('서버에서 초대 링크를 불러오지 못했어요.')
      return
    }
    try {
      await navigator.clipboard.writeText(link)
      setInviteFeedback('초대 링크를 복사했어요.')
    } catch {
      setInviteFeedback('링크를 선택해 복사해주세요.')
    }
  }

  return (
    <S.Grid>
      <S.Card>
        <h2>초대 링크로 함께 일정 보기</h2>
        <p>링크를 카카오톡이나 문자로 보내 가족을 초대할 수 있어요. 혼자 여행이면 초대를 건너뛰어도 됩니다.</p>
        {detailQuery.isLoading ? <p role="status">초대 링크를 불러오는 중이에요.</p> : (
          <S.LinkBox>
            <Input aria-label="여행 초대 링크" readOnly value={detailQuery.data?.inviteLink ?? ''} placeholder="초대 링크가 아직 없어요" />
            <Button type="button" disabled={!detailQuery.data?.inviteLink} onClick={() => void copyInviteLink()}>링크 복사</Button>
          </S.LinkBox>
        )}
        {inviteFeedback ? <p role="status">{inviteFeedback}</p> : null}
        <S.ButtonRow><Button type="button" $variant="secondary" onClick={() => {
          clearPlannerCreationDraft()
          void navigate({ to: paths.planner })
        }}>완료</Button></S.ButtonRow>
      </S.Card>
      <S.Summary>
        <h2>확정한 일정</h2>
        <dl>
          <div><dt>여행지</dt><dd>{detailQuery.data?.cityName ?? currentDraft?.cityName ?? '여행지'}</dd></div>
          <div><dt>기간</dt><dd>{formatDateRange(detailQuery.data?.startDate ?? currentDraft?.startDate, detailQuery.data?.endDate ?? currentDraft?.endDate)}</dd></div>
          <div><dt>상태</dt><dd>{isConfirmed ? '확정됨' : '일정 확정 전'}</dd></div>
        </dl>
      </S.Summary>
    </S.Grid>
  )
}
