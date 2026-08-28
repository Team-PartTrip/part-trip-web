import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useDeleteTripMutation, useTripQuery, useUpdateTripMutation } from '@/entities/trip-plan'
import { figmaRecordDetail } from '@/shared/assets'
import { paths } from '@/shared/config'
import { formatDate } from '@/shared/utils'
import { AppShell } from '@/widgets/app-shell'

import { toTripUpdateRequest } from '../model/tripForm'
import * as S from './RecordDetailPage.styles'

export function RecordDetailPage() {
  const navigate = useNavigate()
  const { recordId = '' } = useParams({ strict: false })
  const { data: record, isLoading, isError: hasRecordError } = useTripQuery(Number(recordId))
  const placeTitle = record?.places?.[0]?.placeName || record?.title || '여행 기록'
  const [isEditing, setIsEditing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [draft, setDraft] = useState({ content: '', endDate: '', startDate: '', title: '' })
  const updateMutation = useUpdateTripMutation()
  const deleteMutation = useDeleteTripMutation()

  const startEditing = () => {
    if (!record) return
    setDraft({ content: record.content ?? '', endDate: record.endDate ?? '', startDate: record.startDate ?? '', title: record.title ?? '' })
    setIsEditing(true)
  }

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!record?.tripId || !draft.title.trim() || !draft.startDate || !draft.endDate || draft.startDate > draft.endDate) {
      setErrorMessage('제목과 올바른 여행 기간을 입력해주세요.')
      return
    }
    try {
      setErrorMessage('')
      await updateMutation.mutateAsync({ tripId: record.tripId, payload: toTripUpdateRequest(record, { ...draft, content: draft.content.trim(), title: draft.title.trim() }) })
      setIsEditing(false)
    } catch {
      setErrorMessage('여행 기록을 수정하지 못했습니다.')
    }
  }

  const handleDelete = async () => {
    if (!record?.tripId || !window.confirm('이 여행 기록을 삭제하시겠습니까?')) return
    try {
      await deleteMutation.mutateAsync(record.tripId)
      navigate({ to: paths.record, replace: true })
    } catch {
      setErrorMessage('여행 기록을 삭제하지 못했습니다.')
    }
  }

  return (
    <AppShell>
      <S.Content>
        {!isLoading ? <S.TopBar><div><h1>촬영 기록 상세</h1>{record ? <p>사진 {record.images?.length ?? 0}</p> : null}</div></S.TopBar> : null}
        {errorMessage || hasRecordError ? <S.ErrorMessage role="alert">{errorMessage || '여행 기록을 불러오지 못했습니다.'}</S.ErrorMessage> : null}
        {isLoading ? <S.LoadingLayout aria-busy="true" aria-label="여행 기록 로딩 중"><S.LoadingHeader /><S.LoadingBody><S.LoadingPhoto /><S.LoadingDetail /></S.LoadingBody></S.LoadingLayout> : record ? isEditing ? <S.EditForm onSubmit={(event) => void handleUpdate(event)}><h1>여행 기록 수정</h1><label>제목<input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} maxLength={60} /></label><S.DateFields><label>시작일<input type="date" value={draft.startDate} onChange={(event) => setDraft((current) => ({ ...current, startDate: event.target.value }))} /></label><label>종료일<input type="date" value={draft.endDate} onChange={(event) => setDraft((current) => ({ ...current, endDate: event.target.value }))} /></label></S.DateFields><label>여행 메모<textarea value={draft.content} onChange={(event) => setDraft((current) => ({ ...current, content: event.target.value }))} maxLength={1000} /></label><div><button type="button" onClick={() => setIsEditing(false)}>취소</button><button type="submit" disabled={updateMutation.isPending}>{updateMutation.isPending ? '저장 중' : '저장'}</button></div></S.EditForm> : <S.DetailBody><S.RecordPhoto><img src={record.images?.[0] || figmaRecordDetail} alt={`${record.cityName || record.countryName || '여행'} 기록 사진`} /></S.RecordPhoto><S.RecordDetailCard><h1>{placeTitle}</h1><p>{[formatDate(record.startDate), record.cityName || record.countryName].filter(Boolean).join(' · ')}</p><S.Badge>AI 해설</S.Badge><S.RecordDescription>{record.content || '기록 내용이 없습니다.'}</S.RecordDescription><span>코멘트</span><S.RecordDescription>{record.content || '코멘트가 없습니다.'}</S.RecordDescription><button type="button" onClick={() => navigate({ params: { recordId }, to: '/record/$recordId/edit' })}>작성</button><button type="button" onClick={startEditing}>기록 편집</button><button type="button" onClick={() => void handleDelete()} disabled={deleteMutation.isPending}>기록 삭제</button></S.RecordDetailCard></S.DetailBody> : <S.StateCard><h1>여행 기록을 찾을 수 없습니다.</h1><p>목록에서 다른 기록을 선택해주세요.</p><button type="button" onClick={() => navigate({ to: paths.record })}>목록으로 돌아가기</button></S.StateCard>}
      </S.Content>
    </AppShell>
  )
}
