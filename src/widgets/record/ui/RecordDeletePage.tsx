import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMyTrips } from '@/entities/trip-plan'
import { figmaRecordDetail, figmaRecordDotonbori, figmaRecordNamba, figmaRecordOsakaCastle } from '@/shared/assets'
import { paths } from '@/shared/config'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordDeletePage.styles'

const fallbackPhotos = [figmaRecordDotonbori, figmaRecordOsakaCastle, figmaRecordNamba, figmaRecordDetail]

export function RecordDeletePage() {
  const navigate = useNavigate()
  const { hasError, isLoading, trips } = useMyTrips()
  const [selected, setSelected] = useState<number[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const trip = trips[0]
  const photos = trip?.images?.length ? trip.images : Array.from({ length: 8 }, (_, index) => fallbackPhotos[index % fallbackPhotos.length])

  const toggleAll = () => setSelected((current) => current.length === photos.length ? [] : photos.map((_, index) => index))

  return (
    <AppShell>
      <S.Page>
        <S.Header><S.Title>기록 사진 삭제</S.Title><S.Subtitle>삭제할 사진을 선택하세요. 여러 장을 한 번에 지울 수 있어요.</S.Subtitle></S.Header>
        {errorMessage ? <S.Error role="alert">{errorMessage}</S.Error> : null}
        {isLoading ? <S.State aria-busy="true">여행 기록을 불러오는 중입니다.</S.State> : null}
        {hasError ? <S.State role="alert">여행 기록을 불러오지 못했습니다.</S.State> : null}
        {!isLoading && !hasError ? <S.DeleteLayout><S.DeleteList><S.Toolbar><strong>{selected.length}개 선택됨</strong><button type="button" onClick={toggleAll}>{selected.length === photos.length ? '선택 해제' : '전체 선택'}</button></S.Toolbar><h2>{trip?.title || '오사카 4박 5일'} · 사진 {photos.length}장</h2><S.PhotoGrid>{photos.map((photo, index) => <S.PhotoButton key={`${photo}-${index}`} type="button" $selected={selected.includes(index)} onClick={() => setSelected((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])}><img src={photo} alt={`여행 사진 ${index + 1}`} /><span aria-hidden="true">{selected.includes(index) ? '✓' : ''}</span></S.PhotoButton>)}</S.PhotoGrid></S.DeleteList><S.DeletePanel><h2>삭제 확인</h2><S.Warning><strong>! 삭제하면 되돌릴 수 없어요</strong><span>사진을 지우면 해당 기록은 기본 로고 이미지로 대체됩니다.</span></S.Warning><strong>선택한 사진 {selected.length}장</strong><span>사진별 삭제 API가 연결되기 전까지 실제 삭제는 지원되지 않습니다.</span><S.DeleteActions><S.DeleteButton type="button" disabled={selected.length === 0} onClick={() => setErrorMessage('사진별 삭제 API가 연결되지 않아 삭제할 수 없습니다.')}>{selected.length}개 삭제하기</S.DeleteButton><button type="button" onClick={() => navigate({ to: paths.record })}>취소</button></S.DeleteActions></S.DeletePanel></S.DeleteLayout> : null}
      </S.Page>
    </AppShell>
  )
}
