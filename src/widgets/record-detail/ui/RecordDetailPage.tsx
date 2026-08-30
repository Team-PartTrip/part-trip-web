import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useTripQuery } from '@/entities/trip-plan'
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
  const recordImages = record?.images?.length ? record.images : [figmaRecordDetail]
  const [photoIndex, setPhotoIndex] = useState(0)
  const currentPhotoIndex = Math.min(photoIndex, recordImages.length - 1)
  const selectedEntry = record?.timeline?.find((item) => item.imageUrl === recordImages[currentPhotoIndex]) ?? record?.timeline?.find((item) => item.imageUrl)

  return (
    <AppShell>
      <S.Content>
        {!isLoading ? <S.TopBar><div><h1>촬영 기록 상세</h1>{record ? <p>사진 {currentPhotoIndex + 1} / {record.photoCount ?? recordImages.length}</p> : null}</div></S.TopBar> : null}
        {hasRecordError ? <S.ErrorMessage role="alert">여행 기록을 불러오지 못했습니다.</S.ErrorMessage> : null}
        {isLoading ? <S.LoadingLayout aria-busy="true" aria-label="여행 기록 로딩 중"><S.LoadingHeader /><S.LoadingBody><S.LoadingPhoto /><S.LoadingDetail /></S.LoadingBody></S.LoadingLayout> : record ? <S.DetailBody><S.RecordPhoto><img src={recordImages[currentPhotoIndex] || figmaRecordDetail} alt={`${record.cityName || record.countryName || '여행'} 기록 사진`} /><S.PhotoControls><S.PhotoButton type="button" aria-label="이전 사진" disabled={currentPhotoIndex === 0} onClick={() => setPhotoIndex((current) => Math.max(0, current - 1))}>‹ 이전</S.PhotoButton><S.PhotoButton type="button" aria-label="다음 사진" disabled={currentPhotoIndex >= recordImages.length - 1} onClick={() => setPhotoIndex((current) => Math.min(recordImages.length - 1, current + 1))}>다음 ›</S.PhotoButton></S.PhotoControls></S.RecordPhoto><S.RecordDetailCard><h1>{placeTitle}</h1><p>{[selectedEntry?.takenAt || selectedEntry?.date || formatDate(record.startDate), selectedEntry?.address || record.cityName || record.countryName].filter(Boolean).join(' · ')}</p><S.Badge>AI 해설</S.Badge><S.RecordDescription>{record.content || '기록 내용이 없습니다.'}</S.RecordDescription><S.CommentHeading>코멘트</S.CommentHeading><S.RecordDescription>{recordComment || '이 사진에 대한 메모를 남겨보세요'}</S.RecordDescription><S.RecordAction type="button" onClick={() => navigate({ params: { recordId }, to: '/record/$recordId/edit' })}>{recordComment ? '수정' : '작성'}</S.RecordAction></S.RecordDetailCard></S.DetailBody> : <S.StateCard><h1>여행 기록을 찾을 수 없습니다.</h1><p>목록에서 다른 기록을 선택해주세요.</p><button type="button" onClick={() => navigate({ to: paths.record })}>목록으로 돌아가기</button></S.StateCard>}
      </S.Content>
    </AppShell>
  )
}
