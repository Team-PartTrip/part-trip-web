import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
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
  const { data: record, isError, isLoading } = useTripQuery(Number(recordId))
  const [content, setContent] = useState<string>()
  const [message, setMessage] = useState('')
  const updateMutation = useUpdateTravelCardEntryCommentMutation()
  const editableEntry = record?.timeline?.find((item) => item.entryId != null)
  const contentValue = content ?? editableEntry?.comment ?? ''

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
        <S.TopBar><div><h1>코멘트 수정</h1><p>여행 카드 사진 코멘트를 수정합니다.</p></div><div><button type="button" onClick={() => navigate({ params: { recordId }, to: '/record/$recordId' })}>완료</button></div></S.TopBar>
        {isLoading ? <S.LoadingLayout aria-busy="true" aria-label="코멘트 기록 로딩 중"><S.LoadingHeader /><S.LoadingBody><S.LoadingPhoto /><S.LoadingDetail /></S.LoadingBody></S.LoadingLayout> : null}
        {isError ? <S.ErrorMessage role="alert">기록을 불러오지 못했습니다.</S.ErrorMessage> : null}
        {record ? <><S.CommentEditLayout><S.CommentPhoto><img src={editableEntry?.imageUrl || record.images?.[0] || figmaRecordMapPhoto} alt="여행 사진" /><span>여행 카드에 저장된 사진입니다.</span></S.CommentPhoto><S.CommentForm onSubmit={(event) => void handleSubmit(event)}><h2>기록 내용</h2><p>장소 · {record.cityName || record.countryName || '여행지 정보 없음'}</p><textarea value={contentValue} onChange={(event) => setContent(event.target.value)} placeholder="오늘의 순간을 기록해보세요." maxLength={500} disabled={editableEntry?.entryId == null} /><button type="submit" disabled={updateMutation.isPending || editableEntry?.entryId == null}>{updateMutation.isPending ? '저장 중' : '수정 저장'}</button>{message ? <small role="alert">{message}</small> : null}</S.CommentForm></S.CommentEditLayout><S.EditHistory><h2>수정 이력</h2><div><strong>최초 작성</strong><span>{record.createDate ? formatDate(record.createDate) : '기록 생성일'}</span></div><p>이력 조회 API가 연결되면 변경 내역이 표시됩니다.</p></S.EditHistory></> : null}
        {!isLoading && !isError && !record ? <S.StateCard><p>기록을 찾을 수 없습니다.</p><button type="button" onClick={() => navigate({ to: paths.record })}>목록으로</button></S.StateCard> : null}
      </S.Content>
    </AppShell>
  )
}
