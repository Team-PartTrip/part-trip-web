import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteTrip, getTrip, updateTrip, type TripResponseDto } from '@shared/api'
import logoUrl from '@shared/assets/logo.png'
import fallbackRecordImageUrl from '@shared/assets/record-singapore.jpg'
import { paths } from '@shared/config'
import { MENUS, Sidebar } from '@widgets/sidebar'

import { toTripUpdateRequest } from '../model/tripForm'
import * as S from './RecordDetailPage.styles'

const formatDate = (value: string) => value.replaceAll('-', '.')

export function RecordDetailPage() {
  const navigate = useNavigate()
  const { recordId = '' } = useParams()
  const [record, setRecord] = useState<TripResponseDto | null>(null)
  const [isLoading, setIsLoading] = useState(() => Number.isInteger(Number(recordId)))
  const [isEditing, setIsEditing] = useState(false)
  const [isMutating, setIsMutating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [draft, setDraft] = useState({ content: '', endDate: '', startDate: '', title: '' })

  useEffect(() => {
    let isMounted = true

    const tripId = Number(recordId)
    if (!Number.isInteger(tripId)) return () => { isMounted = false }

    void getTrip(tripId)
      .then((nextRecord) => { if (isMounted) setRecord(nextRecord) })
      .catch(() => { if (isMounted) setRecord(null) })
      .finally(() => { if (isMounted) setIsLoading(false) })

    return () => {
      isMounted = false
    }
  }, [recordId])

  const startEditing = () => {
    if (!record) return
    setDraft({
      content: record.content ?? '',
      endDate: record.endDate ?? '',
      startDate: record.startDate ?? '',
      title: record.title ?? '',
    })
    setIsEditing(true)
  }

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!record?.tripId || !draft.title.trim() || !draft.startDate || !draft.endDate || draft.startDate > draft.endDate) {
      setErrorMessage('제목과 올바른 여행 기간을 입력해주세요.')
      return
    }
    try {
      setIsMutating(true)
      setErrorMessage('')
      const updated = await updateTrip(record.tripId, toTripUpdateRequest(record, {
        ...draft,
        content: draft.content.trim(),
        title: draft.title.trim(),
      }))
      setRecord(updated)
      setIsEditing(false)
    } catch {
      setErrorMessage('여행 기록을 수정하지 못했습니다.')
    } finally {
      setIsMutating(false)
    }
  }

  const handleDelete = async () => {
    if (!record?.tripId || !window.confirm('이 여행 기록을 삭제하시겠습니까?')) return
    try {
      setIsMutating(true)
      await deleteTrip(record.tripId)
      navigate(paths.record, { replace: true })
    } catch {
      setErrorMessage('여행 기록을 삭제하지 못했습니다.')
      setIsMutating(false)
    }
  }

  return (
    <S.Page>
      <Sidebar logo={<S.Logo src={logoUrl} alt="PartTrip" />} menus={MENUS} />
      <S.Content>
        <S.TopBar>
          <button type="button" onClick={() => navigate(paths.record)}>← 여행 기록</button>
          <div><button type="button" onClick={() => navigate(paths.recordWrite)}>새 기록 작성</button>{record ? <><button type="button" onClick={startEditing}>수정</button><button type="button" disabled={isMutating} onClick={() => void handleDelete()}>삭제</button></> : null}</div>
        </S.TopBar>

        {errorMessage ? <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage> : null}

        {isLoading ? (
          <S.StateCard>여행 기록을 불러오고 있습니다.</S.StateCard>
        ) : record ? (
          isEditing ? (
          <S.EditForm onSubmit={(event) => void handleUpdate(event)}>
            <h1>여행 기록 수정</h1>
            <label>제목<input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} maxLength={60} /></label>
            <S.DateFields><label>시작일<input type="date" value={draft.startDate} onChange={(event) => setDraft((current) => ({ ...current, startDate: event.target.value }))} /></label><label>종료일<input type="date" value={draft.endDate} onChange={(event) => setDraft((current) => ({ ...current, endDate: event.target.value }))} /></label></S.DateFields>
            <label>여행 메모<textarea value={draft.content} onChange={(event) => setDraft((current) => ({ ...current, content: event.target.value }))} maxLength={1000} /></label>
            <div><button type="button" onClick={() => setIsEditing(false)}>취소</button><button type="submit" disabled={isMutating}>{isMutating ? '저장 중' : '저장'}</button></div>
          </S.EditForm>
        ) : (
          <S.Layout>
            <S.Hero>
              <img src={record.images?.[0] || fallbackRecordImageUrl} alt={`${record.countryName ?? ''} 여행`} />
              <S.HeroOverlay>
                <span>{[record.cityName, record.countryName].filter(Boolean).join(', ')}</span>
                <h1>{record.title}</h1>
                <p>{formatDate(record.startDate ?? '-')} - {formatDate(record.endDate ?? '-')}</p>
              </S.HeroOverlay>
            </S.Hero>
            <S.Body>
              <S.Memo><h2>여행 메모</h2><p>{record.content ?? '작성된 여행 메모가 없습니다.'}</p></S.Memo>
              <S.Schedule>
                <h2>여행 일정</h2>
                {(record.places ?? []).map((place, index) => (
                  <article key={place.tripPlaceId ?? `${place.dayNumber}-${index}`}><strong>DAY {place.dayNumber ?? index + 1}</strong><ul><li>{place.placeName}{place.placeSub ? ` · ${place.placeSub}` : ''}</li></ul></article>
                ))}
                {(record.places ?? []).length === 0 ? <p>등록된 세부 일정이 없습니다.</p> : null}
              </S.Schedule>
            </S.Body>
            <S.MapPanel aria-label={`${record.countryName ?? '여행지'} 지도 미리보기`}>
              <S.MapGrid aria-hidden />
              <S.MapPin aria-hidden>●</S.MapPin>
              <div><strong>{[record.cityName, record.countryName].filter(Boolean).join(', ')}</strong><span>여행 경로 지도</span></div>
            </S.MapPanel>
          </S.Layout>
          )
        ) : (
          <S.StateCard>
            <h1>여행 기록을 찾을 수 없습니다.</h1>
            <p>목록에서 다른 기록을 선택해주세요.</p>
            <button type="button" onClick={() => navigate(paths.record)}>목록으로 돌아가기</button>
          </S.StateCard>
        )}
      </S.Content>
    </S.Page>
  )
}
