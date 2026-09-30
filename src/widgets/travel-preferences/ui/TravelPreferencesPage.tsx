import { useRef, useState, type FormEvent } from 'react'
import { useDeleteHomeMutation, useTravelPreferencesQuery, useUpdateHomeMutation, useUpdateTravelPreferencesMutation } from '@/entities/user'
import type { PlaceSearchResponseDto } from '@/entities/travel'
import type { TravelPreferenceRequestDto } from '@/entities/user/api'
import { Button } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'
import { PlaceSearchDialog } from '@/widgets/place-search'
import * as S from './TravelPreferencesPage.styles'

const transportOptions: Array<{ value: TravelPreferenceRequestDto['preferredTransport']; label: string }> = [
  { value: 'CAR', label: '차량 우선' },
  { value: 'PUBLIC_TRANSIT', label: '대중교통' },
  { value: 'WALKING', label: '걷기 적게' },
  { value: 'TAXI', label: '택시' },
]

export function TravelPreferencesPage() {
  const { data, isError, isLoading, refetch } = useTravelPreferencesQuery()
  const updatePreferences = useUpdateTravelPreferencesMutation()
  const updateHome = useUpdateHomeMutation()
  const deleteHome = useDeleteHomeMutation()
  const homeButtonRef = useRef<HTMLButtonElement>(null)
  const [homeSearchOpen, setHomeSearchOpen] = useState(false)
  const [homeFeedback, setHomeFeedback] = useState('')
  const [homeError, setHomeError] = useState(false)
  const [preferredTransportOverride, setPreferredTransportOverride] = useState<TravelPreferenceRequestDto['preferredTransport']>()
  const [dailyScheduleCountOverride, setDailyScheduleCountOverride] = useState<number>()
  const [canUseStairsOverride, setCanUseStairsOverride] = useState<boolean>()
  const [feedback, setFeedback] = useState('')
  const [hasError, setHasError] = useState(false)
  const preferredTransport = preferredTransportOverride ?? data?.preferredTransport ?? 'CAR'
  const dailyScheduleCount = dailyScheduleCountOverride ?? data?.dailyScheduleCount ?? 3
  const canUseStairs = canUseStairsOverride ?? data?.canUseStairs ?? true
  const isHomeMutationPending = updateHome.isPending || deleteHome.isPending

  const selectHome = async (place: PlaceSearchResponseDto) => {
    setHomeSearchOpen(false)
    setHomeFeedback('')
    setHomeError(false)
    try {
      await updateHome.mutateAsync({ name: '우리 집', address: place.address, latitude: place.latitude, longitude: place.longitude })
      setHomeFeedback('우리 집 위치를 저장했어요.')
    } catch {
      setHomeError(true)
      setHomeFeedback('우리 집 위치를 저장하지 못했어요. 연결을 확인하고 다시 시도해주세요.')
    }
  }

  const removeHome = async () => {
    if (!window.confirm('등록한 우리 집 위치를 삭제할까요?')) return
    setHomeFeedback('')
    setHomeError(false)
    try {
      await deleteHome.mutateAsync()
      setHomeFeedback('우리 집 위치를 삭제했어요.')
    } catch {
      setHomeError(true)
      setHomeFeedback('우리 집 위치를 삭제하지 못했어요. 연결을 확인하고 다시 시도해주세요.')
    }
  }

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (updatePreferences.isPending) return
    setFeedback('')
    setHasError(false)
    try {
      const saved = await updatePreferences.mutateAsync({ preferredTransport, dailyScheduleCount, canUseStairs })
      setPreferredTransportOverride(saved.preferredTransport ?? preferredTransport)
      setDailyScheduleCountOverride(saved.dailyScheduleCount ?? dailyScheduleCount)
      setCanUseStairsOverride(saved.canUseStairs ?? canUseStairs)
      setFeedback('여행 편의 설정을 저장했어요.')
    } catch {
      setHasError(true)
      setFeedback('저장하지 못했어요. 연결을 확인하고 다시 시도해주세요.')
    }
  }

  return (
    <AppShell>
      <S.Page>
        <S.Header>
          <h1>여행 편의 설정</h1>
          <p>여행 일정 추천에 사용할 기본 조건을 정해주세요. 일정별로 고른 조건이 있으면 그 조건을 우선 적용해요.</p>
        </S.Header>
        {isLoading ? <p role="status">설정을 불러오는 중이에요.</p> : isError ? (
          <p role="alert">설정을 불러오지 못했어요. <button type="button" onClick={() => void refetch()}>다시 시도</button></p>
        ) : (
          <>
          <S.Home>
            <div><h2>우리 집</h2><p>{data?.home?.address || (data?.home ? '주소 정보가 없어요.' : '등록한 집이 없어요.')}</p></div>
            <S.HomeActions>
              <Button ref={homeButtonRef} type="button" $variant="secondary" disabled={isHomeMutationPending} onClick={() => { setHomeSearchOpen(true); setHomeFeedback(''); setHomeError(false) }}>
                {updateHome.isPending ? '저장 중…' : data?.home ? '변경' : '등록'}
              </Button>
              {data?.home ? <Button type="button" $variant="secondary" disabled={isHomeMutationPending} onClick={() => void removeHome()}>{deleteHome.isPending ? '삭제 중…' : '삭제'}</Button> : null}
            </S.HomeActions>
            {homeFeedback ? <S.HomeFeedback role={homeError ? 'alert' : 'status'} $error={homeError}>{homeFeedback}</S.HomeFeedback> : null}
          </S.Home>
          <PlaceSearchDialog isOpen={homeSearchOpen} returnFocusRef={homeButtonRef} title="우리 집 위치 찾기" onClose={() => setHomeSearchOpen(false)} onSelect={(place) => void selectHome(place)} />
          <S.Panel onSubmit={(event) => void save(event)}>
            <S.Row>
              <S.Copy><legend>선호하는 이동수단</legend><p>가장 편한 이동 방법을 선택해주세요.</p></S.Copy>
              <S.Options role="group" aria-label="선호하는 이동수단">
                {transportOptions.map((option) => (
                  <S.Option key={option.value} type="button" disabled={updatePreferences.isPending} $active={preferredTransport === option.value}
                    aria-pressed={preferredTransport === option.value} onClick={() => setPreferredTransportOverride(option.value)}>
                    {option.label}
                  </S.Option>
                ))}
              </S.Options>
            </S.Row>
            <S.Row>
              <S.Copy><legend>하루 일정 개수</legend><p>하루에 무리 없이 둘러볼 장소 수예요.</p></S.Copy>
              <S.Options role="group" aria-label="하루 일정 개수">
                {[2, 3, 4].map((count) => (
                  <S.Option key={count} type="button" disabled={updatePreferences.isPending} $active={dailyScheduleCount === count}
                    aria-pressed={dailyScheduleCount === count} onClick={() => setDailyScheduleCountOverride(count)}>
                    {count}곳
                  </S.Option>
                ))}
              </S.Options>
            </S.Row>
            <S.Row>
              <S.Copy><legend>계단 이용</legend><p>계단이나 경사로를 이용할 수 있는지 알려주세요.</p></S.Copy>
              <S.Options role="group" aria-label="계단 이용 가능 여부">
                {[{ value: true, label: '가능해요' }, { value: false, label: '어려워요' }].map((option) => (
                  <S.Option key={option.label} type="button" disabled={updatePreferences.isPending} $active={canUseStairs === option.value}
                    aria-pressed={canUseStairs === option.value} onClick={() => setCanUseStairsOverride(option.value)}>
                    {option.label}
                  </S.Option>
                ))}
              </S.Options>
            </S.Row>
            <S.Feedback role={feedback ? 'status' : undefined} $error={hasError}>{feedback}</S.Feedback>
            <S.Actions><Button type="submit" disabled={updatePreferences.isPending}>
              {updatePreferences.isPending ? '저장 중…' : '저장'}
            </Button></S.Actions>
          </S.Panel>
          </>
        )}
      </S.Page>
    </AppShell>
  )
}
