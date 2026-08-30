import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useDeleteTravelCardEntryMutation } from '@/entities/trip-card'
import { useMyTrips, useTripQuery } from '@/entities/trip-plan'
import { paths } from '@/shared/config'
import { Skeleton } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordDeletePage.styles'

export function RecordDeletePage() {
  const navigate = useNavigate()
  const { hasError: hasTripsError, isLoading: isTripsLoading, trips } = useMyTrips()
  const [selected, setSelected] = useState<number[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const trip = trips[0]
  const detailQuery = useTripQuery(trip?.tripId ?? 0)
  const record = detailQuery.data ?? trip
  const photos = record?.timeline?.filter((item) => item.entryId != null && item.imageUrl) ?? []
  const deleteMutation = useDeleteTravelCardEntryMutation()
  const isLoading = isTripsLoading || detailQuery.isLoading
  const hasError = hasTripsError || detailQuery.isError
  const photoIds = photos.flatMap((photo) => photo.entryId == null ? [] : [photo.entryId])

  const toggleAll = () => setSelected((current) => current.length === photoIds.length ? [] : photoIds)

  const handleDelete = async () => {
    if (record?.tripId == null || selected.length === 0) {
      setErrorMessage('삭제할 사진을 선택해주세요.')
      return
    }
    try {
      setErrorMessage('')
      setSuccessMessage('')
      for (const entryId of selected) {
        await deleteMutation.mutateAsync({ cardId: record.tripId, entryId })
        setSelected((current) => current.filter((item) => item !== entryId))
      }
      setSelected([])
      setSuccessMessage('선택한 사진을 삭제했습니다.')
    } catch {
      setErrorMessage('사진을 삭제하지 못했습니다. 여행 기간 중인 기록만 삭제할 수 있습니다.')
    }
  }

  if (!isLoading && !hasError && photos.length === 0) {
    return <AppShell><S.Page><S.Header><S.Title>기록 사진 삭제</S.Title><S.Subtitle>삭제할 사진이 없습니다.</S.Subtitle></S.Header><S.State>남겨진 사진이 생기면 이곳에서 삭제할 수 있습니다.</S.State></S.Page></AppShell>
  }

  return (
    <AppShell>
      <S.Page>
        <S.Header><S.Title>기록 사진 삭제</S.Title><S.Subtitle>삭제할 사진을 선택하세요. 여러 장을 한 번에 지울 수 있어요.</S.Subtitle></S.Header>
        {errorMessage ? <S.Error role="alert">{errorMessage}</S.Error> : null}
        {successMessage ? <S.Error role="status">{successMessage}</S.Error> : null}
        {isLoading ? <Skeleton aria-busy="true" aria-label="여행 기록 로딩 중" $height="374px" $radius="16px" /> : null}
        {hasError ? <S.State role="alert">여행 기록을 불러오지 못했습니다.</S.State> : null}
        {!isLoading && !hasError ? <S.DeleteLayout><S.DeleteList><S.Toolbar><strong>{selected.length}개 선택됨</strong><button type="button" onClick={toggleAll}>{selected.length === photoIds.length ? '선택 해제' : '전체 선택'}</button></S.Toolbar><h2>{record?.title || '여행 기록'} · 사진 {photos.length}장</h2><S.PhotoGrid>{photos.map((photo, index) => { const entryId = photo.entryId as number; return <S.PhotoButton key={entryId} type="button" $selected={selected.includes(entryId)} onClick={() => setSelected((current) => current.includes(entryId) ? current.filter((item) => item !== entryId) : [...current, entryId])}><img src={photo.imageUrl} alt={`여행 사진 ${index + 1}`} /><span aria-hidden="true">{selected.includes(entryId) ? '✓' : ''}</span></S.PhotoButton> })}</S.PhotoGrid></S.DeleteList><S.DeletePanel><h2>삭제 확인</h2><S.Warning><strong>! 삭제하면 되돌릴 수 없어요</strong><span>사진을 지우면 해당 기록은 기본 로고 이미지로 대체됩니다.</span></S.Warning><strong>선택한 사진 {selected.length}장</strong><span>여행 기간 중인 사진만 삭제할 수 있습니다.</span><S.DeleteActions><S.DeleteButton type="button" disabled={selected.length === 0 || deleteMutation.isPending} onClick={() => void handleDelete()}>{deleteMutation.isPending ? '삭제 중' : `${selected.length}개 삭제하기`}</S.DeleteButton><button type="button" onClick={() => navigate({ to: paths.record })}>취소</button></S.DeleteActions></S.DeletePanel></S.DeleteLayout> : null}
      </S.Page>
    </AppShell>
  )
}
