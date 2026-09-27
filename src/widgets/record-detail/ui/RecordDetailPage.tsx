import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useTravelRecordQuery, useUpdateTravelCardEntryMetadataMutation } from '@/entities/trip-card'
import { figmaRecordDetail } from '@/shared/assets'
import { paths } from '@/shared/config'
import { formatDate, formatTravelDateTime, getDetailState, getErrorMessage } from '@/shared/utils'
import { shareKakaoCardNews } from '@/shared/libs/kakao-share'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordDetailPage.styles'

function toLocalDateTime(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
}

export function RecordDetailPage() {
  const navigate = useNavigate()
  const { recordId = '' } = useParams({ strict: false })
  const { data: record, isLoading, isError: hasRecordError } = useTravelRecordQuery(Number(recordId))
  const recordState = getDetailState({
    hasData: Boolean(record),
    isError: hasRecordError,
    isLoading,
  })
  const placeTitle = record?.places?.[0]?.placeName || record?.title || '여행 기록'
  const recordImages = record?.images?.filter((image): image is string => Boolean(image)) ?? []
  const [photoIndex, setPhotoIndex] = useState(0)
  const [shareError, setShareError] = useState('')
  const [metadataError, setMetadataError] = useState('')
  const [metadataEditor, setMetadataEditor] = useState<{ cardId: number; entryId: number; mode: 'location' | 'time' } | null>(null)
  const metadataMutation = useUpdateTravelCardEntryMetadataMutation()
  const currentPhotoIndex = recordImages.length ? Math.min(photoIndex, recordImages.length - 1) : 0
  const selectedEntry = recordImages.length > 0
    ? record?.timeline?.find((item) => item.imageUrl === recordImages[currentPhotoIndex])
    : undefined
  const selectedEntryRef = useRef({ cardId: record?.tripId, entry: selectedEntry })
  useLayoutEffect(() => {
    selectedEntryRef.current = { cardId: record?.tripId, entry: selectedEntry }
  }, [record?.tripId, selectedEntry])
  let selectedEntryDate = formatDate(record?.startDate)
  if (selectedEntry?.date) selectedEntryDate = formatDate(selectedEntry.date)
  if (selectedEntry?.takenAt) {
    selectedEntryDate = formatTravelDateTime(selectedEntry.takenAt, undefined, record?.regionName || record?.countryName, record?.cityName)
  }
  const selectedEntrySummary = [
    selectedEntryDate,
    selectedEntry?.address || record?.cityName || record?.regionName || record?.countryName,
  ].filter(Boolean).join(' · ')
  const hasRecordPhotos = recordImages.length > 0 && record?.photoCount !== 0
  const canEditLocation = selectedEntry?.locationSource == null || selectedEntry.locationSource === 'MANUAL'
  const canEditTakenAt = selectedEntry?.takenAtSource == null || selectedEntry.takenAtSource === 'MANUAL'
  const metadataMode = metadataEditor && metadataEditor.cardId === record?.tripId && metadataEditor.entryId === selectedEntry?.entryId ? metadataEditor.mode : null

  const handleMetadataSubmit = async (cardId: number, entryId: number, mode: 'location' | 'time', event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { cardId: selectedCardId, entry } = selectedEntryRef.current
    if (selectedCardId !== cardId || !entry || entry.entryId !== entryId) return
    if (mode === 'location'
      ? entry.locationSource != null && entry.locationSource !== 'MANUAL'
      : entry.takenAtSource != null && entry.takenAtSource !== 'MANUAL') return
    const data = new FormData(event.currentTarget)
    const payload = mode === 'location'
      ? { latitude: Number(data.get('latitude')), longitude: Number(data.get('longitude')), placeName: String(data.get('placeName') ?? '').trim() }
      : { takenAt: new Date(String(data.get('takenAt'))).toISOString() }
    try {
      await metadataMutation.mutateAsync({ cardId, entryId, payload })
      setMetadataError('')
      setMetadataEditor((current) => current?.cardId === cardId && current.entryId === entryId ? null : current)
    } catch (error) {
      setMetadataError(getErrorMessage(error))
    }
  }

  const handleKakaoShare = () => {
    const imageUrl = recordImages[currentPhotoIndex]
    if (!record?.tripId || !imageUrl) {
      setShareError('공유할 사진이 없습니다.')
      return
    }

    try {
      shareKakaoCardNews({
        title: `${record.cityName || record.regionName || record.countryName || '여행'} 여행 기록`,
        description: [formatDate(record.startDate), selectedEntry?.comment].filter(Boolean).join(' · ') || '여행의 순간을 확인해보세요.',
        imageUrl,
        linkUrl: `${window.location.origin}/record/${record.tripId}`,
      })
      setShareError('')
    } catch (error) {
      setShareError(getErrorMessage(error))
    }
  }

  useEffect(() => {
    // The route changes the record while this component stays mounted.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhotoIndex(0)
  }, [recordId])

  return (
    <AppShell>
      <S.Content>
        {!isLoading ? (
          <S.TopBar>
            <div>
              <h1>촬영 기록 상세</h1>
              {record && hasRecordPhotos ? <p>사진 {currentPhotoIndex + 1} / {recordImages.length}</p> : null}
            </div>
            {record?.tripId != null ? <div><button type="button" disabled={!hasRecordPhotos} onClick={handleKakaoShare}>카카오로 공유</button><button type="button" onClick={() => navigate({ search: { cardId: String(record.tripId) }, to: paths.recordWrite })}>사진 추가</button></div> : null}
          </S.TopBar>
        ) : null}
        {shareError ? <S.ErrorMessage role="alert">{shareError}</S.ErrorMessage> : null}
        {recordState === 'error' ? (
          <S.StateCard role="alert">
            <h1>여행 기록을 불러오지 못했습니다.</h1>
            <p>연결을 확인하고 다시 시도해주세요.</p>
            <button type="button" onClick={() => navigate({ to: paths.record })}>목록으로 돌아가기</button>
          </S.StateCard>
        ) : null}
        {recordState === 'loading' ? (
          <S.LoadingLayout aria-busy="true" aria-label="여행 기록 로딩 중">
            <S.LoadingHeader />
            <S.LoadingBody><S.LoadingPhoto /><S.LoadingDetail /></S.LoadingBody>
          </S.LoadingLayout>
        ) : null}
        {recordState === 'ready' && record ? (
          <S.DetailBody>
            <S.RecordPhoto>
              <img
                width={696}
                height={560}
                src={recordImages[currentPhotoIndex] || figmaRecordDetail}
                alt={`${record.cityName || record.regionName || record.countryName || '여행'} 기록 사진`}
              />
              {hasRecordPhotos ? (
                <S.PhotoControls>
                  <S.PhotoButton type="button" aria-label="이전 사진" disabled={currentPhotoIndex === 0} onClick={() => { setMetadataEditor(null); setPhotoIndex((current) => Math.max(0, current - 1)) }}>‹ 이전</S.PhotoButton>
                  <S.PhotoButton type="button" aria-label="다음 사진" disabled={currentPhotoIndex >= recordImages.length - 1} onClick={() => { setMetadataEditor(null); setPhotoIndex((current) => Math.min(recordImages.length - 1, current + 1)) }}>다음 ›</S.PhotoButton>
                </S.PhotoControls>
              ) : null}
            </S.RecordPhoto>
            <S.RecordDetailCard>
              <h1>{placeTitle}</h1>
              <p>{selectedEntrySummary}</p>
              <S.Badge>AI 해설</S.Badge>
              <S.CommentHeading>사진 코멘트</S.CommentHeading>
              <S.RecordDescription>{selectedEntry?.comment || '이 사진에 대한 메모를 남겨보세요'}</S.RecordDescription>
              <S.RecordAction type="button" disabled={selectedEntry?.entryId == null} onClick={() => navigate({ params: { recordId }, search: selectedEntry?.entryId != null ? { entryId: String(selectedEntry.entryId) } : undefined, to: '/record/$recordId/edit' })}>{selectedEntry?.comment ? '수정' : '작성'}</S.RecordAction>
              {canEditLocation ? <S.RecordAction type="button" disabled={record.tripId == null || selectedEntry?.entryId == null} onClick={() => record.tripId != null && selectedEntry?.entryId != null && setMetadataEditor({ cardId: record.tripId, entryId: selectedEntry.entryId, mode: 'location' })}>위치 수정</S.RecordAction> : null}
              {canEditTakenAt ? <S.RecordAction type="button" disabled={record.tripId == null || selectedEntry?.entryId == null} onClick={() => record.tripId != null && selectedEntry?.entryId != null && setMetadataEditor({ cardId: record.tripId, entryId: selectedEntry.entryId, mode: 'time' })}>촬영 시각 수정</S.RecordAction> : null}
              {metadataError ? <S.ErrorMessage role="alert">{metadataError}</S.ErrorMessage> : null}
              {metadataMode && metadataEditor ? <S.MetadataForm key={`${metadataEditor.cardId}-${metadataEditor.entryId}`} onSubmit={(event) => void handleMetadataSubmit(metadataEditor.cardId, metadataEditor.entryId, metadataEditor.mode, event)}>
                {metadataMode === 'location' ? <>
                  <label>장소명<input name="placeName" required defaultValue={selectedEntry?.placeName ?? ''} /></label>
                  <label>위도<input name="latitude" type="number" min="-90" max="90" step="any" required defaultValue={selectedEntry?.latitude ?? ''} /></label>
                  <label>경도<input name="longitude" type="number" min="-180" max="180" step="any" required defaultValue={selectedEntry?.longitude ?? ''} /></label>
                </> : <label>촬영 시각<input name="takenAt" type="datetime-local" required defaultValue={toLocalDateTime(selectedEntry?.takenAt)} /></label>}
                <div><button type="button" onClick={() => setMetadataEditor(null)}>취소</button><button type="submit" disabled={metadataMutation.isPending}>{metadataMutation.isPending ? '저장 중' : '저장'}</button></div>
              </S.MetadataForm> : null}
            </S.RecordDetailCard>
          </S.DetailBody>
        ) : null}
        {recordState === 'empty' ? (
          <S.StateCard>
            <h1>여행 기록을 찾을 수 없습니다.</h1>
            <p>목록에서 다른 기록을 선택해주세요.</p>
            <button type="button" onClick={() => navigate({ to: paths.record })}>목록으로 돌아가기</button>
          </S.StateCard>
        ) : null}
      </S.Content>
    </AppShell>
  )
}
