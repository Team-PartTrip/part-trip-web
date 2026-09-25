import { useState, type FormEvent, type ReactNode } from 'react'
import {
  useAcceptGuardianInviteMutation,
  useCreateGuardianInviteMutation,
  useGuardianLinksQuery,
  useLinkedSeniorsQuery,
  useUnlinkGuardianMutation,
} from '@/entities/guardian'
import type { GuardianInviteDto, GuardianLinkDto } from '@/entities/guardian/api'
import { sanitizeGuardianInviteCode } from '@/entities/guardian/invite-code'
import { Button, Input } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'
import { SeniorTravelPanel } from './SeniorTravelPanel'
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
  const [message, setMessage] = useState('')
  const [hasError, setHasError] = useState(false)
  const selectedSenior = seniors.data?.find((link) => link.userId === selectedSeniorUserId) ?? seniors.data?.[0]

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

  const copyInviteCode = async () => {
    if (!invite?.code) return
    try {
      await navigator.clipboard.writeText(invite.code)
      setHasError(false)
      setMessage('초대 코드를 복사했어요. 가족에게 보내주세요.')
    } catch {
      setHasError(true)
      setMessage('초대 코드를 직접 선택해 복사해주세요.')
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
  let inviteButtonLabel = '초대 코드 만들기'
  if (invite) inviteButtonLabel = '새 코드 만들기'
  if (inviteMutation.isPending) inviteButtonLabel = '코드 만드는 중…'
  let guardiansContent: ReactNode
  if (guardians.isLoading) {
    guardiansContent = <S.Message role="status">불러오는 중이에요.</S.Message>
  } else if (guardians.isError) {
    guardiansContent = <S.Message $error role="alert">보호자 목록을 불러오지 못했어요.</S.Message>
  } else if (guardians.data?.length) {
    guardiansContent = <S.List>{guardians.data.map((link) => (
      <S.Person key={link.linkId ?? link.userId}>
        <span>{labelFor(link)}</span>
        <Button type="button" $variant="secondary" onClick={() => void unlink(link)}>연결 끊기</Button>
      </S.Person>
    ))}</S.List>
  } else {
    guardiansContent = <S.Message>연결된 보호자가 아직 없어요.</S.Message>
  }

  let seniorsContent: ReactNode
  if (seniors.isLoading) {
    seniorsContent = <S.Message role="status">불러오는 중이에요.</S.Message>
  } else if (seniors.isError) {
    seniorsContent = <S.Message $error role="alert">연결된 가족 목록을 불러오지 못했어요.</S.Message>
  } else if (seniors.data?.length) {
    seniorsContent = <S.List>{seniors.data.map((link) => (
      <S.Person key={link.linkId ?? link.userId}>
        <span>{labelFor(link)}</span>
        <S.PersonActions>
          <Button type="button" $variant="secondary" aria-pressed={link.userId === selectedSenior?.userId}
            onClick={() => setSelectedSeniorUserId(link.userId ?? '')}>일정 보기</Button>
          <Button type="button" $variant="secondary" onClick={() => void unlink(link)}>연결 끊기</Button>
        </S.PersonActions>
      </S.Person>
    ))}</S.List>
  } else {
    seniorsContent = <S.Message>연결된 가족이 아직 없어요.</S.Message>
  }

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
            {invite ? <><S.Code aria-label={`초대 코드 ${invite.code}`}>{invite.code}</S.Code><Button type="button" $variant="secondary" onClick={() => void copyInviteCode()}>초대 코드 복사</Button><S.Message>만료 시간: {expiryLabel}</S.Message></> : null}
            <Button type="button" disabled={inviteMutation.isPending} onClick={() => void createInvite()}>
              {inviteButtonLabel}
            </Button>
          </S.Card>
          <S.Card>
            <h2>받은 코드 입력하기</h2>
            <p>가족이 보낸 6자리 코드를 입력하면 계정이 연결돼요.</p>
            <S.Form onSubmit={(event) => void acceptInvite(event)}>
              <Input aria-label="보호자 연결 코드" autoComplete="one-time-code" autoCapitalize="characters" inputMode="text" maxLength={6} spellCheck={false}
                value={code} onChange={(event) => setCode(sanitizeGuardianInviteCode(event.target.value))} />
              <Button type="submit" disabled={acceptMutation.isPending || code.length !== 6}>
                {acceptMutation.isPending ? '연결 중…' : '연결하기'}
              </Button>
            </S.Form>
          </S.Card>
          <S.Card>
            <h2>나와 연결된 보호자</h2>
            {guardiansContent}
          </S.Card>
          <S.Card>
            <h2>내가 돌보는 가족</h2>
            {seniorsContent}
          </S.Card>
          {selectedSenior ? (
            <SeniorTravelPanel
              senior={selectedSenior}
              seniorLabel={labelFor(selectedSenior)}
              dateTimeFormatter={dateTimeFormatter}
            />
          ) : null}
        </S.Grid>
        {message ? <S.Message role="status" $error={hasError}>{message}</S.Message> : null}
      </S.Page>
    </AppShell>
  )
}
