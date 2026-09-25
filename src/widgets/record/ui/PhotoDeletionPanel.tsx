import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useDeleteTravelCardEntryMutation } from '@/entities/trip-card'
import { paths } from '@/shared/config'
import * as S from './RecordDeletePage.styles'

export type DeletablePhoto = { entryId: number; imageUrl: string }

export function PhotoDeletionPanel({ photos, recordId, title }: { photos: DeletablePhoto[]; recordId?: number; title?: string }) {
  const navigate = useNavigate()
  const deleteMutation = useDeleteTravelCardEntryMutation()
  const [selected, setSelected] = useState<number[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const photoIds = photos.map((photo) => photo.entryId)

  const togglePhoto = (entryId: number) => {
    setSelected((current) => current.includes(entryId)
      ? current.filter((item) => item !== entryId)
      : [...current, entryId])
  }

  const handleDelete = async () => {
    if (recordId == null || selected.length === 0) {
      setErrorMessage('삭제할 사진을 선택해주세요.')
      return
    }
    let deletedCount = 0
    try {
      setErrorMessage('')
      setSuccessMessage('')
      for (const entryId of selected) {
        await deleteMutation.mutateAsync({ cardId: recordId, entryId })
        deletedCount += 1
        setSelected((current) => current.filter((item) => item !== entryId))
      }
      setSelected([])
      setSuccessMessage('선택한 사진을 삭제했습니다.')
    } catch {
      setErrorMessage(deletedCount > 0
        ? `사진 ${deletedCount}장을 삭제했지만 나머지 사진은 삭제하지 못했습니다.`
        : '사진을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <>
      {errorMessage ? <S.Error role="alert">{errorMessage}</S.Error> : null}
      {successMessage ? <S.Error role="status">{successMessage}</S.Error> : null}
      <S.Toolbar>
        <strong>{selected.length}개 선택됨</strong>
        <div>
          <button type="button" onClick={() => setSelected(photoIds)}>전체 선택</button>
          <button type="button" onClick={() => setSelected([])}>선택 해제</button>
        </div>
      </S.Toolbar>
      <S.DeleteLayout>
        <S.DeleteList>
          <h2>{title || '여행 기록'} · 사진 {photos.length}장</h2>
          <S.PhotoGrid>
            {photos.map((photo, index) => (
              <S.PhotoButton
                key={photo.entryId}
                type="button"
                $selected={selected.includes(photo.entryId)}
                onClick={() => togglePhoto(photo.entryId)}
              >
                <img src={photo.imageUrl} alt={`여행 사진 ${index + 1}`} />
                <span aria-hidden="true">{selected.includes(photo.entryId) ? '✓' : ''}</span>
              </S.PhotoButton>
            ))}
          </S.PhotoGrid>
        </S.DeleteList>
        <S.DeletePanel>
          <h2>삭제 확인</h2>
          <S.Warning>
            <strong>! 삭제하면 되돌릴 수 없어요</strong>
            <span>삭제한 사진 대신 기본 대체 이미지가 표시됩니다.</span>
          </S.Warning>
          <S.DeleteSummary>
            <strong>선택한 사진 {selected.length}장</strong>
            <span>여행 기간 중인 사진만 삭제할 수 있습니다.</span>
          </S.DeleteSummary>
          <S.DeleteActions>
            <S.DeleteButton
              type="button"
              disabled={selected.length === 0 || deleteMutation.isPending}
              onClick={() => void handleDelete()}
            >
              {deleteMutation.isPending ? '삭제 중' : `${selected.length}개 삭제하기`}
            </S.DeleteButton>
            <button type="button" onClick={() => void navigate({ to: paths.record })}>취소</button>
          </S.DeleteActions>
        </S.DeletePanel>
      </S.DeleteLayout>
    </>
  )
}
