import { useState, type FormEvent } from 'react'
import {
  useAcceptGuardianInviteMutation,
  useCreateGuardianInviteMutation,
  useGuardianLinksQuery,
  useLinkedSeniorsQuery,
  useSeniorLocationQuery,
  useSeniorPlannersQuery,
  useSeniorScheduleQuery,
  useUnlinkGuardianMutation,
} from '@/entities/guardian'
import type { GuardianInviteDto, GuardianLinkDto } from '@/entities/guardian/api'
import { Button, Input } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'
import * as S from './GuardiansPage.styles'

const dateTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

function labelFor(link: GuardianLinkDto) {
  return link.nickName?.trim() || link.userId || '연결된 가족'
}

export function GuardiansPage() {
  const guardians = useGuardianLinksQuery()
  const seniors = useLinkedSeniorsQuery()
  const inviteMutation = useCreateGuardianInviteMutation()
  const acceptMutation = useAcceptGuardianInviteMutation()
  const unlinkMutation = useUnlinkGuardianMutation()
  const [invite, setInvite] = useState<GuardianInviteDto>()
  const [code, setCode] = useState('')
  const [selectedSeniorUserId, setSelectedSeniorUserId] = useState('')
  const [selectedPlannerId, setSelectedPlannerId] = useState(0)
  const [message, setMessage] = useState('')
  const [hasError, setHasError] = useState(false)
  const selectedSenior = seniors.data?.find((link) => link.userId === selectedSeniorUserId) ?? seniors.data?.[0]
  const seniorUserId = selectedSenior?.userId
  const seniorPlanners = useSeniorPlannersQuery(seniorUserId)
  const selectedPlanner = seniorPlanners.data?.find((planner) => planner.plannerId === selectedPlannerId) ?? seniorPlanners.data?.[0]
  const seniorSchedule = useSeniorScheduleQuery(seniorUserId, selectedPlanner?.plannerId)
  const seniorLocation = useSeniorLocationQuery(seniorUserId)

  const createInvite = async () => {
    setMessage('')
    setHasError(false)
    try {
      setInvite(await inviteMutation.mutateAsync())
    } catch {
      setHasError(true)
      setMessage('초대 코드를 만들지 못했어요. 잠시 후 다시 시도해주세요.')
    }
  }

  const acceptInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (code.trim().length !== 6) {
      setHasError(true)
      setMessage('6자리 초대 코드를 입력해주세요.')
      return
    }
    setMessage('')
    setHasError(false)
    try {
      await acceptMutation.mutateAsync(code.trim())
      setCode('')
      setMessage('가족 계정과 연결했어요.')
    } catch {
      setHasError(true)
      setMessage('코드를 확인하지 못했어요. 만료되었거나 이미 사용된 코드일 수 있어요.')
    }
  }

  const unlink = async (link: GuardianLinkDto) => {
    if (!link.linkId || !window.confirm(`${labelFor(link)} 연결을 끊을까요?`)) return
    try {
      await unlinkMutation.mutateAsync(link.linkId)
      setMessage('가족 연결을 끊었어요.')
      setHasError(false)
    } catch {
      setMessage('연결을 끊지 못했어요. 다시 시도해주세요.')
      setHasError(true)
    }
  }

  const expiryLabel = invite?.expiresAt
    ? dateTimeFormatter.format(new Date(invite.expiresAt))
    : ''

  return (
    <AppShell>
      <S.Page>
        <S.Header>
          <h1>보호자 연결</h1>
          <p>가족과 여행 일정을 공유하고, 필요할 때 현재 위치를 확인할 수 있어요.</p>
        </S.Header>
        <S.Grid>
          <S.Card>
            <h2>가족에게 연결 코드 보내기</h2>
            <p>코드는 한 번만 사용할 수 있고 24시간 후 만료돼요.</p>
            {invite ? <><S.Code aria-label={`초대 코드 ${invite.code}`}>{invite.code}</S.Code><S.Message>만료 시간: {expiryLabel}</S.Message></> : null}
            <Button type="button" disabled={inviteMutation.isPending} onClick={() => void createInvite()}>
              {inviteMutation.isPending ? '코드 만드는 중…' : invite ? '새 코드 만들기' : '초대 코드 만들기'}
            </Button>
          </S.Card>
          <S.Card>
            <h2>받은 코드 입력하기</h2>
            <p>가족이 보낸 6자리 코드를 입력하면 계정이 연결돼요.</p>
            <S.Form onSubmit={(event) => void acceptInvite(event)}>
              <Input aria-label="보호자 연결 코드" autoComplete="one-time-code" inputMode="text" maxLength={6}
                value={code} onChange={(event) => setCode(event.target.value.replace(/[^0-9a-z]/gi, '').slice(0, 6))} />
              <Button type="submit" disabled={acceptMutation.isPending || code.length !== 6}>
                {acceptMutation.isPending ? '연결 중…' : '연결하기'}
              </Button>
            </S.Form>
          </S.Card>
          <S.Card>
            <h2>나와 연결된 보호자</h2>
            {guardians.isLoading ? <S.Message role="status">불러오는 중이에요.</S.Message> : guardians.isError ? <S.Message $error role="alert">보호자 목록을 불러오지 못했어요.</S.Message> : guardians.data?.length ? (
              <S.List>{guardians.data.map((link) => <S.Person key={link.linkId ?? link.userId}>
                <span>{labelFor(link)}</span><Button type="button" $variant="secondary" onClick={() => void unlink(link)}>연결 끊기</Button>
              </S.Person>)}</S.List>
            ) : <S.Message>연결된 보호자가 아직 없어요.</S.Message>}
          </S.Card>
          <S.Card>
            <h2>내가 돌보는 가족</h2>
            {seniors.isLoading ? <S.Message role="status">불러오는 중이에요.</S.Message> : seniors.isError ? <S.Message $error role="alert">연결된 가족 목록을 불러오지 못했어요.</S.Message> : seniors.data?.length ? (
              <S.List>{seniors.data.map((link) => <S.Person key={link.linkId ?? link.userId}>
                <span>{labelFor(link)}</span><S.PersonActions><Button type="button" $variant="secondary" aria-pressed={link.userId === selectedSenior?.userId} onClick={() => setSelectedSeniorUserId(link.userId ?? '')}>일정 보기</Button><Button type="button" $variant="secondary" onClick={() => void unlink(link)}>연결 끊기</Button></S.PersonActions>
              </S.Person>)}</S.List>
            ) : <S.Message>연결된 가족이 아직 없어요.</S.Message>}
          </S.Card>
          {selectedSenior ? <S.Card>
            <h2>{labelFor(selectedSenior)}의 일정과 현재 위치</h2>
            <p>여행 중 앱을 열면 최근 위치를 확인할 수 있어요. 위치는 12시간 후 삭제돼요.</p>
            <S.GuardianDetails>
              <section>
                <h3>현재 위치</h3>
                {seniorLocation.isLoading ? <S.Message role="status">위치를 확인하고 있어요.</S.Message> : seniorLocation.isError || !seniorLocation.data ? <S.Message>여행 중 앱을 열면 현재 위치가 여기에 표시돼요.</S.Message> : <>
                  <S.Message>마지막 확인 {dateTimeFormatter.format(new Date(seniorLocation.data.recordedAt))}</S.Message>
                  <S.MapLink href={`https://maps.google.com/?q=${seniorLocation.data.latitude},${seniorLocation.data.longitude}`} target="_blank" rel="noreferrer">지도에서 위치 보기</S.MapLink>
                </>}
              </section>
              <section>
                <h3>여행 일정</h3>
                {seniorPlanners.isLoading ? <S.Message role="status">여행 계획을 불러오고 있어요.</S.Message> : seniorPlanners.isError ? <S.Message $error role="alert">여행 계획을 불러오지 못했어요.</S.Message> : seniorPlanners.data?.length ? <>
                  <S.PlannerSelect aria-label={`${labelFor(selectedSenior)}의 여행 선택`} value={selectedPlanner?.plannerId ?? ''} onChange={(event) => setSelectedPlannerId(Number(event.target.value))}>
                    {seniorPlanners.data.map((planner) => <option key={planner.plannerId} value={planner.plannerId}>{planner.title || `${planner.cityName || '여행'} 일정`}</option>)}
                  </S.PlannerSelect>
                  {seniorSchedule.isLoading ? <S.Message role="status">일정을 불러오고 있어요.</S.Message> : seniorSchedule.isError ? <S.Message $error role="alert">일정을 불러오지 못했어요.</S.Message> : <S.ScheduleList>
                    {(seniorSchedule.data?.days ?? []).map((day, index) => <li key={day.date ?? index}><strong>{day.date || `${index + 1}일차`}</strong><span>{(day.slots ?? []).map((slot) => slot.place?.name).filter(Boolean).join(' · ') || '등록된 장소가 없어요.'}</span></li>)}
                    {!seniorSchedule.data?.days?.length ? <S.Message>등록된 일정이 없어요.</S.Message> : null}
                  </S.ScheduleList>}
                </> : <S.Message>아직 공유된 여행 계획이 없어요.</S.Message>}
              </section>
            </S.GuardianDetails>
          </S.Card> : null}
        </S.Grid>
        {message ? <S.Message role="status" $error={hasError}>{message}</S.Message> : null}
      </S.Page>
    </AppShell>
  )
}
