import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useDeleteTripMutation, useTripQuery } from '@/entities/trip-plan'
import { figmaRecordDetail } from '@/shared/assets'
import { paths } from '@/shared/config'
import { formatDate } from '@/shared/utils'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordDetailPage.styles'

export function RecordDetailPage() {
  const navigate = useNavigate()
  const { recordId = '' } = useParams({ strict: false })
  const { data: record, isLoading, isError: hasRecordError } = useTripQuery(Number(recordId))
  const placeTitle = record?.places?.[0]?.placeName || record?.title || '여행 기록'
  const recordComment = record?.timeline?.find((item) => item.comment?.trim())?.comment
  const deleteMutation = useDeleteTripMutation()
  const [errorMessage, setErrorMessage] = useState('')

  const handleDelete = async () => {
    if (!record?.tripId || !window.confirm('이 여행 기록을 삭제하시겠습니까?')) return
    try {
      setErrorMessage('')
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
        {isLoading ? <S.LoadingLayout aria-busy="true" aria-label="여행 기록 로딩 중"><S.LoadingHeader /><S.LoadingBody><S.LoadingPhoto /><S.LoadingDetail /></S.LoadingBody></S.LoadingLayout> : record ? <S.DetailBody><S.RecordPhoto><img src={record.images?.[0] || figmaRecordDetail} alt={`${record.cityName || record.countryName || '여행'} 기록 사진`} /></S.RecordPhoto><S.RecordDetailCard><h1>{placeTitle}</h1><p>{[formatDate(record.startDate), record.cityName || record.countryName].filter(Boolean).join(' · ')}</p><S.Badge>AI 해설</S.Badge><S.RecordDescription>{record.content || '기록 내용이 없습니다.'}</S.RecordDescription><span>코멘트</span><S.RecordDescription>{recordComment || '코멘트가 없습니다.'}</S.RecordDescription><button type="button" onClick={() => navigate({ params: { recordId }, to: '/record/$recordId/edit' })}>코멘트 수정</button><button type="button" onClick={() => void handleDelete()} disabled={deleteMutation.isPending}>{deleteMutation.isPending ? '삭제 중' : '기록 삭제'}</button></S.RecordDetailCard></S.DetailBody> : <S.StateCard><h1>여행 기록을 찾을 수 없습니다.</h1><p>목록에서 다른 기록을 선택해주세요.</p><button type="button" onClick={() => navigate({ to: paths.record })}>목록으로 돌아가기</button></S.StateCard>}
      </S.Content>
    </AppShell>
  )
}
