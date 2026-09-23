import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import {
  plannerQueryKeys,
  useConfirmPlannerMutation,
  useGeneratePlannerMutation,
  useMyPlannersQuery,
  usePlannerBlocksQuery,
  usePlannerDetailQuery,
  usePlannerScheduleQuery,
  type PlannerBlockDto,
  type PlannerBlockResponseDto,
} from '@/entities/planner'
import { useCountriesQuery } from '@/entities/travel'
import { ACTIVE_PLANNER_ID_KEY, PLANNER_CONFIRMED_KEY, paths } from '@/shared/config'
import { readSessionId, readSessionValue, writeSessionValue } from '@/shared/libs/session-storage'
import { Button, Input } from '@/shared/ui/parttrip'
import { formatDateRange } from '@/shared/utils'
import { isPositiveSafeInteger } from '@/shared/utils/number'
import { AppShell } from '@/widgets/app-shell'
import { activatePlannerSession } from '../model/planner-session'
import { clearPlannerCreationDraft, readPlannerCreationDraft, writePlannerCreationDraft } from '../model/planner-creation'
import { getPlannerTravelParty } from '../model/member-count'
import { getDomesticCityNames } from '../model/domestic-cities'
import { isValidPlannerDateRange, overlapsExistingTrip } from '../model/planner-date'
import { canManagePlanner } from '../model/planner-role'
import * as S from './PlannerAiFlow.styles'
import { PlannerScheduleEditor } from './PlannerScheduleEditor'

type Step = 'destination' | 'criteria' | 'schedule' | 'invite'
type SelectionMap = Record<string, string[]>

const suggestedBlockTypes = ['TRAVEL_TYPE', 'COMPANION', 'WALK_PREFERENCE', 'DAILY_DENSITY', 'FOOD_TYPE', 'LODGING_TYPE', 'MUST_INCLUDE', 'EXCLUDE']
const stepIndex: Record<Step, number> = { destination: 1, criteria: 2, schedule: 3, invite: 4 }

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
  const queryClient = useQueryClient()
  const [currentDraft] = useState(readPlannerCreationDraft)
  const plannerId = readSessionId(ACTIVE_PLANNER_ID_KEY)
  const plannersQuery = useMyPlannersQuery(step === 'destination')
  const blocksQuery = usePlannerBlocksQuery(step === 'criteria')
  const scheduleQuery = usePlannerScheduleQuery(plannerId, step === 'schedule')
  const detailQuery = usePlannerDetailQuery(plannerId, step === 'schedule' || step === 'invite')
  const generateMutation = useGeneratePlannerMutation()
  const confirmMutation = useConfirmPlannerMutation()
  const [cityName, setCityName] = useState(currentDraft?.cityName ?? '')
  const cityQuery = useCountriesQuery(cityName.trim(), step === 'destination')
  const domesticCities = getDomesticCityNames(cityQuery.data ?? [])
  const [startDate, setStartDate] = useState(currentDraft?.startDate ?? '')
  const [endDate, setEndDate] = useState(currentDraft?.endDate ?? '')
  const [selections, setSelections] = useState<SelectionMap>(() => toSelectionMap(currentDraft?.blocks))
  const [message, setMessage] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [inviteFeedback, setInviteFeedback] = useState('')
  const today = new Date().toLocaleDateString('sv-SE')
  const maxEndDate = useMemo(() => {
    if (!startDate) return undefined
    const date = new Date(`${startDate}T00:00:00`)
    date.setDate(date.getDate() + 13)
    return date.toLocaleDateString('sv-SE')
  }, [startDate])
  const blocks = useMemo(() => getBlockValues(selections), [selections])
  const existingTripConflict = plannersQuery.data
    ? overlapsExistingTrip(plannersQuery.data, startDate, endDate)
    : false
  const serverConfirmed = ['CONFIRMED', 'TRAVELING', 'COMPLETED'].includes((detailQuery.data?.status ?? '').toUpperCase())
  const isConfirmed = confirmed || serverConfirmed || readSessionValue(`${PLANNER_CONFIRMED_KEY}:${plannerId}`) === 'true'
  const canManageCurrentPlanner = canManagePlanner(detailQuery.data?.role)

  useEffect(() => {
    if (step === 'criteria' && !currentDraft) void navigate({ to: paths.plannerDestination, replace: true })
  }, [currentDraft, navigate, step])

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

  const goToCriteria = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    if (plannersQuery.isLoading) return
    if (plannersQuery.isError) {
      setMessage('기존 여행 날짜를 확인하지 못했어요. 다시 불러온 뒤 계속해주세요.')
      return
    }
    if (!cityName.trim()) {
      setMessage('국내 여행 도시를 선택해주세요.')
      return
    }
    if (cityQuery.isLoading || cityQuery.isFetching) {
      setMessage('국내 도시 목록을 불러오는 중이에요. 잠시 후 다시 시도해주세요.')
      return
    }
    if (cityQuery.isError) {
      setMessage('국내 도시 목록을 불러오지 못했어요. 다시 시도해주세요.')
      return
    }
    if (!domesticCities.includes(cityName.trim())) {
      setMessage('검색 결과에서 대한민국 도시를 선택해주세요.')
      return
    }
    if (startDate < today || !isValidPlannerDateRange(startDate, endDate)) {
      setMessage('여행 날짜를 확인해주세요. 과거 날짜는 선택할 수 없고 최대 14일까지 계획할 수 있어요.')
      return
    }
    if (existingTripConflict) {
      setMessage('선택한 기간에 다른 여행이 있어요. 날짜를 바꿔주세요.')
      return
    }
    writePlannerCreationDraft({ cityName: cityName.trim(), startDate, endDate, blocks: [] })
    void navigate({ to: paths.plannerExplore })
  }

  const generate = async () => {
    if (!currentDraft || generateMutation.isPending) return
    setMessage('')
    const party = getPlannerTravelParty(blocks)
    if (!party) {
      setMessage('혼자 여행인지, 동행이 있는지 선택해주세요.')
      return
    }
    const payload = {
      ...party,
      title: `${currentDraft.cityName} 여행`,
      cityName: currentDraft.cityName,
      startDate: currentDraft.startDate,
      endDate: currentDraft.endDate,
      blocks,
    }
    writePlannerCreationDraft({ ...currentDraft, blocks, ...party })
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

  const pageTitle: Record<Step, [string, string]> = {
    destination: ['국내 도시 & 기간', '여행 도시와 날짜를 정해주세요. 최대 14일까지 계획할 수 있어요.'],
    criteria: ['여행 기준을 선택해 주세요', '선택한 조건은 AI 일정 생성에 사용됩니다. 도시와 날짜는 앞 단계에서 정한 값이에요.'],
    schedule: ['AI 일정 초안', '날짜별 추천 장소를 확인하고 여행 일정을 확정해주세요.'],
    invite: ['함께할 사람 초대', '초대 링크를 가족에게 보내면 같은 일정을 볼 수 있어요.'],
  }
  const [title, subtitle] = pageTitle[step]
  const availableBlocks = blocksQuery.data ?? []
  const priorityBlocks = availableBlocks.filter((block) => suggestedBlockTypes.includes(block.type ?? ''))
  const otherBlocks = availableBlocks.filter((block) => !suggestedBlockTypes.includes(block.type ?? ''))

  return (
    <AppShell>
      <S.Page>
        <S.Header>
          <div><h1>{title}</h1><p>{subtitle}</p></div>
          <S.Steps aria-label="여행 플래너 진행 단계">
            {['여행지·기간', '여행 기준', 'AI 일정', '초대'].map((label, index) => (
              <S.Step key={label} $active={stepIndex[step] === index + 1} aria-current={stepIndex[step] === index + 1 ? 'step' : undefined}>
                {index + 1} {label}
              </S.Step>
            ))}
          </S.Steps>
        </S.Header>

        {step === 'destination' ? (
          <S.Grid>
            <S.Card>
              <S.Form onSubmit={goToCriteria}>
                <S.Field>
                  <label htmlFor="planner-city-name">여행 도시 · 대한민국</label>
                  <Input id="planner-city-name" autoComplete="off" maxLength={50}
                    value={cityName} onChange={(event) => setCityName(event.target.value)} placeholder="도시를 선택하거나 입력하세요" />
                  <S.CityGrid aria-label="대한민국 도시 검색 결과">
                    {cityQuery.isFetching ? <p role="status">국내 도시를 찾고 있어요.</p> : null}
                    {cityQuery.isError ? <S.Error role="alert">국내 도시 목록을 불러오지 못했어요.</S.Error> : null}
                    {!cityQuery.isFetching && !cityQuery.isError && !domesticCities.length ? <small>일치하는 국내 도시가 없습니다.</small> : null}
                    {!cityQuery.isFetching && domesticCities.map((city) => <S.City key={city} type="button" $active={cityName.trim() === city} aria-pressed={cityName.trim() === city} onClick={() => setCityName(city)}>
                      <strong>{city}</strong><span>대한민국</span>
                    </S.City>)}
                  </S.CityGrid>
                </S.Field>
                <S.Field>
                  <span>여행 기간</span>
                  <S.DateGrid>
                    <div><label htmlFor="planner-start-date">출발일</label><Input id="planner-start-date" type="date" min={today} max={maxEndDate} value={startDate} onChange={(event) => {
                      const nextStartDate = event.target.value
                      const lastAllowedDate = new Date(`${nextStartDate}T00:00:00`)
                      lastAllowedDate.setDate(lastAllowedDate.getDate() + 13)
                      setStartDate(nextStartDate)
                      if (endDate && endDate > lastAllowedDate.toLocaleDateString('sv-SE')) setEndDate('')
                    }} /></div>
                    <div><label htmlFor="planner-end-date">도착일</label><Input id="planner-end-date" type="date" min={startDate || today} max={maxEndDate} value={endDate} onChange={(event) => setEndDate(event.target.value)} /></div>
                  </S.DateGrid>
                  <small>이미 다른 여행이 있는 날짜는 선택할 수 없어요. 날짜는 필수예요.</small>
                </S.Field>
                {message ? <S.Error role="alert">{message}</S.Error> : null}
                <S.ButtonRow>
                  <Button type="submit" disabled={plannersQuery.isLoading || plannersQuery.isError}>
                    {plannersQuery.isLoading ? '여행 일정 확인 중…' : '다음'}
                  </Button>
                </S.ButtonRow>
              </S.Form>
            </S.Card>
            <S.Summary>
              <h2>여행 정보</h2>
              <dl>
                <div><dt>여행지</dt><dd>{cityName || '도시를 선택해주세요'}</dd></div>
                <div><dt>기간</dt><dd>{startDate && endDate ? formatDateRange(startDate, endDate) : '날짜를 선택해주세요'}</dd></div>
                <div><dt>여행 유형</dt><dd>국내 여행</dd></div>
              </dl>
            </S.Summary>
          </S.Grid>
        ) : null}

        {step === 'criteria' ? (
          !currentDraft ? <S.Card role="status"><p>여행 정보를 확인하는 중이에요.</p></S.Card> : (
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
                  <div><dt>여행지</dt><dd>{currentDraft.cityName}</dd></div>
                  <div><dt>기간</dt><dd>{formatDateRange(currentDraft.startDate, currentDraft.endDate)}</dd></div>
                  <div><dt>선택한 기준</dt><dd>{blocks.length ? blocks.map((block) => block.value).join(' · ') : '기본 조건으로 만들어요'}</dd></div>
                </dl>
              </S.Summary>
            </S.Grid>
          )
        ) : null}

        {step === 'schedule' ? (
          <S.Card>
            {!isPositiveSafeInteger(plannerId) ? <p role="alert">확인할 일정이 없어요. 플래너 목록에서 여행을 선택해주세요.</p> : scheduleQuery.isLoading || detailQuery.isLoading ? (
              <p role="status" aria-busy="true">AI 일정을 불러오는 중이에요.</p>
            ) : scheduleQuery.isError ? (
              <><S.Error role="alert">일정을 불러오지 못했어요.</S.Error><S.ButtonRow><Button type="button" $variant="secondary" onClick={() => void scheduleQuery.refetch()}>다시 시도</Button></S.ButtonRow></>
            ) : (
              <>
                {detailQuery.isError ? <S.Error role="alert">플래너 권한을 확인하지 못해 일정은 읽기 전용으로 표시됩니다.</S.Error> : null}
                {scheduleQuery.data ? <PlannerScheduleEditor
                  plannerId={Number(plannerId)}
                  cityName={detailQuery.data?.cityName ?? scheduleQuery.data.cityName}
                  schedule={scheduleQuery.data}
                  canManage={canManageCurrentPlanner}
                  isConfirmed={isConfirmed}
                /> : <p role="alert">일정 응답에 표시할 내용이 없습니다.</p>}
                {message ? <S.Error role="alert">{message}</S.Error> : null}
                <S.ButtonRow>
                  <Button type="button" $variant="secondary" onClick={() => void navigate({ to: paths.planner })}>플래너 목록</Button>
                  {isConfirmed && canManageCurrentPlanner ? <Button type="button" onClick={() => void navigate({ to: paths.plannerInvite })}>초대 단계로</Button> : !isConfirmed && canManageCurrentPlanner ? (
                    <Button type="button" disabled={confirmMutation.isPending || !scheduleQuery.data?.days?.length} onClick={() => void confirmSchedule()}>
                      {confirmMutation.isPending ? '확정 중…' : '일정 확정'}
                    </Button>
                  ) : !isConfirmed && !canManageCurrentPlanner ? <p role="status">리더가 일정을 확정하면 초대 단계가 열립니다.</p> : null}
                </S.ButtonRow>
              </>
            )}
          </S.Card>
        ) : null}

        {step === 'invite' ? (
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
        ) : null}
      </S.Page>
    </AppShell>
  )
}
