import { useState, type FormEvent } from 'react'
import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { useUpdateTravelCardEntryCommentMutation } from '@/entities/trip-card'
import { useTripQuery } from '@/entities/trip-plan'
import { figmaRecordMapPhoto } from '@/shared/assets'
import { paths } from '@/shared/config'
import { formatDate } from '@/shared/utils'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordDetailPage.styles'

export function RecordCommentEditPage() {
  const navigate = useNavigate()
  const { recordId = '' } = useParams({ strict: false })
  const search = useSearch({ strict: false }) as { entryId?: string }
  const { data: record, isError, isLoading } = useTripQuery(Number(recordId))
  const [content, setContent] = useState<string>()
  const [message, setMessage] = useState('')
  const updateMutation = useUpdateTravelCardEntryCommentMutation()
  const editableEntry = record?.timeline?.find((item) => search.entryId != null && String(item.entryId) === search.entryId) ?? record?.timeline?.find((item) => item.entryId != null)
  const contentValue = content ?? editableEntry?.comment ?? ''
  const placeTitle = record?.places?.[0]?.placeName || record?.title || '여행 기록'
  const photoDate = editableEntry?.takenAt || editableEntry?.date || record?.startDate

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!record?.tripId || editableEntry?.entryId == null || !contentValue.trim()) {
      setMessage('수정할 사진 코멘트를 확인해주세요.')
      return
    }
    try {
      setMessage('')
      await updateMutation.mutateAsync({
        cardId: record.tripId,
        entryId: editableEntry.entryId,
        payload: { comment: contentValue.trim() },
      })
      navigate({ params: { recordId: String(record.tripId) }, to: '/record/$recordId' })
    } catch {
      setMessage('코멘트를 수정하지 못했습니다.')
    }
  }

  return (
    <AppShell>
      <S.Content>
        <S.TopBar $comment><div><h1>코멘트 작성</h1></div><div><button type="submit" form="record-comment-form" disabled={updateMutation.isPending || editableEntry?.entryId == null}>저장</button></div></S.TopBar>
        {isLoading ? <S.LoadingLayout aria-busy="true" aria-label="코멘트 기록 로딩 중"><S.LoadingHeader /><S.LoadingBody><S.LoadingPhoto /><S.LoadingDetail /></S.LoadingBody></S.LoadingLayout> : null}
        {isError ? <S.ErrorMessage role="alert">기록을 불러오지 못했습니다.</S.ErrorMessage> : null}
        {record ? <S.CommentEditLayout><S.CommentPhoto><img src={editableEntry?.imageUrl || record.images?.[0] || figmaRecordMapPhoto} alt="여행 사진" /><h2>{placeTitle}</h2><span>{photoDate ? formatDate(photoDate) : '촬영일 정보 없음'}</span></S.CommentPhoto><S.CommentForm id="record-comment-form" onSubmit={(event) => void handleSubmit(event)}><h2>코멘트</h2><textarea value={contentValue} onChange={(event) => setContent(event.target.value)} placeholder="이 사진에 대해 짧게 남겨보세요." maxLength={500} disabled={editableEntry?.entryId == null} /><p>{contentValue.length} / 500</p><button type="submit" disabled={updateMutation.isPending || editableEntry?.entryId == null}>{updateMutation.isPending ? '저장 중' : '코멘트 저장'}</button>{message ? <small role="alert">{message}</small> : null}</S.CommentForm></S.CommentEditLayout> : null}
        {!isLoading && !isError && !record ? <S.StateCard><p>기록을 찾을 수 없습니다.</p><button type="button" onClick={() => navigate({ to: paths.record })}>목록으로</button></S.StateCard> : null}
      </S.Content>
    </AppShell>
  )
}
