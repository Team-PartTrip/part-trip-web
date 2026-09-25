import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useUpdateCurrentLocationMutation } from '@/entities/guardian'
import { useDdayQuery } from '@/entities/travel'
import { Button } from '@/shared/ui/parttrip'
import { startLocationReporting, type LocationReportState } from '../model'

const Banner = styled.aside`
  display: flex;
  min-height: 3rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border-bottom: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  padding: 0.5rem 1.5rem;
  background: ${({ theme }) => theme.colors.background.info};
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 0.875rem;
  line-height: 1.25rem;
  @media (max-width: 35rem) { align-items: flex-start; flex-direction: column; }
`

function stateMessage(state: LocationReportState) {
  if (state === 'requesting') return '현재 위치를 확인하고 보호자에게 공유하고 있어요.'
  if (state === 'shared') return '현재 위치를 보호자와 공유 중이에요. 위치는 12시간 후 삭제돼요.'
  if (state === 'denied') return '위치 권한이 꺼져 있어요. 브라우저 설정에서 허용한 뒤 다시 시도해주세요.'
  if (state === 'unavailable') return '이 기기에서 위치를 확인할 수 없어요. 위치 서비스를 확인해주세요.'
  return '위치를 보호자에게 보내지 못했어요. 연결을 확인하고 다시 시도해주세요.'
}

export function LocationReporter() {
  const trip = useDdayQuery()
  const mutation = useUpdateCurrentLocationMutation()
  const mutationRef = useRef(mutation.mutateAsync)
  const reporterRef = useRef<ReturnType<typeof startLocationReporting> | undefined>(undefined)
  const [state, setState] = useState<LocationReportState>()

  useEffect(() => { mutationRef.current = mutation.mutateAsync }, [mutation.mutateAsync])

  useEffect(() => {
    if (trip.data?.status !== 'DURING') return
    const reporter = startLocationReporting({
      onState: setState,
      updateLocation: (location) => mutationRef.current(location),
    })
    reporterRef.current = reporter
    return () => {
      reporter.stop()
      if (reporterRef.current === reporter) reporterRef.current = undefined
    }
  }, [trip.data?.status])

  if (trip.isError) return <Banner role="status">여행 상태를 확인하지 못해 위치를 전송하지 않았어요.</Banner>
  if (trip.data?.status !== 'DURING' || !state) return null

  return <Banner role="status" aria-live="polite">
    <span>{stateMessage(state)}</span>
    {state !== 'shared' && state !== 'requesting' ? <Button type="button" $variant="secondary" onClick={() => {
      reporterRef.current?.retry()
    }}>다시 시도</Button> : null}
  </Banner>
}
