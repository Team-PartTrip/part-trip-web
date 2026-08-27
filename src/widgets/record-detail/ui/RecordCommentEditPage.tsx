import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useTripQuery, useUpdateTripMutation } from '@/entities/trip-plan'
import { figmaRecordMapPhoto } from '@/shared/assets'
import { paths } from '@/shared/config'
import { formatDate } from '@/shared/utils'

import { toTripUpdateRequest } from '../model/tripForm'
import * as S from './RecordDetailPage.styles'

export function RecordCommentEditPage() {
  const navigate = useNavigate()
  const { recordId = '' } = useParams({ strict: false })
  const { data: record, isError, isLoading } = useTripQuery(Number(recordId))
  const [content, setContent] = useState<string>()
  const [message, setMessage] = useState('')
  const updateMutation = useUpdateTripMutation()

  const contentValue = content ?? record?.content ?? ''

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!record?.tripId || !contentValue.trim()) {
      setMessage('기록 내용을 입력해주세요.')
      return
    }
    try {
      setMessage('')
      await updateMutation.mutateAsync({
        tripId: record.tripId,
        payload: toTripUpdateRequest(record, {
          content: contentValue.trim(),
          endDate: record.endDate ?? '',
          startDate: record.startDate ?? '',
          title: record.title ?? record.cityName ?? '여행 기록',
        }),
      })
      navigate({ params: { recordId: String(record.tripId) }, to: '/record/$recordId' })
    } catch {
      setMessage('코멘트를 수정하지 못했습니다.')
    }
  }

  return (
    <S.Content>
      <S.TopBar><div><h1>코멘트 수정</h1><p>기존 코멘트를 수정하면 수정 이력이 함께 기록됩니다.</p></div></S.TopBar>
      {isLoading ? <S.StateCard>기록을 불러오고 있습니다.</S.StateCard> : null}
      {isError ? <S.ErrorMessage role="alert">기록을 불러오지 못했습니다.</S.ErrorMessage> : null}
      {record ? <><S.CommentEditLayout><S.CommentPhoto><img src={record.images?.[0] || figmaRecordMapPhoto} alt="여행 사진" /><span>여행 사진을 대표 이미지로 사용합니다.</span><button type="button" disabled>사진 바꾸기</button></S.CommentPhoto><S.CommentForm onSubmit={(event) => void handleSubmit(event)}><h2>기록 내용</h2><p>장소 · {record.cityName || record.countryName || 'Dotonbori'}</p><textarea value={contentValue} onChange={(event) => setContent(event.target.value)} placeholder="오늘의 순간을 기록해보세요." maxLength={1000} /><button type="submit" disabled={updateMutation.isPending}>{updateMutation.isPending ? '저장 중' : '수정 저장'}</button>{message ? <small role="alert">{message}</small> : null}</S.CommentForm></S.CommentEditLayout><S.EditHistory><h2>수정 이력</h2><div><strong>최초 작성</strong><span>{record.createDate ? formatDate(record.createDate) : '기록 생성일'}</span></div><p>수정 이력 조회 API가 연결되면 변경 내역이 표시됩니다.</p></S.EditHistory></> : null}
      {!isLoading && !isError && !record ? <S.StateCard><p>기록을 찾을 수 없습니다.</p><button type="button" onClick={() => navigate({ to: paths.record })}>목록으로</button></S.StateCard> : null}
    </S.Content>
  )
}
