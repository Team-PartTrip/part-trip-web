import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { usePlaceSearchQuery, type PlaceSearchResponseDto } from '@/entities/travel'
import { Button, Input } from '@/shared/ui/parttrip'
import * as S from './PlaceSearchDialog.styles'

type Props = {
  isOpen: boolean
  returnFocusRef: RefObject<HTMLButtonElement | null>
  onClose: () => void
  onSelect: (place: PlaceSearchResponseDto) => void
  title?: string
}

export function PlaceSearchDialog({ isOpen, returnFocusRef, onClose, onSelect, title = '장소 찾기' }: Props) {
  const titleId = useId()
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const wasOpen = useRef(false)
  const placeQuery = usePlaceSearchQuery(debouncedSearchText, isOpen)
  const searchTermIsCurrent = searchText.trim() === debouncedSearchText

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearchText(searchText.trim()), 400)
    return () => window.clearTimeout(timeout)
  }, [searchText])

  useEffect(() => {
    const dialog = dialogRef.current
    if (isOpen) {
      if (dialog && !dialog.open) dialog.showModal()
      inputRef.current?.focus()
    } else {
      if (dialog?.open) dialog.close()
      if (wasOpen.current) returnFocusRef.current?.focus()
    }
    wasOpen.current = isOpen
    return () => { if (dialog?.open) dialog.close() }
  }, [isOpen, returnFocusRef])

  const close = () => {
    setSearchText('')
    setDebouncedSearchText('')
    onClose()
  }
  const select = (place: PlaceSearchResponseDto) => {
    setSearchText('')
    setDebouncedSearchText('')
    onSelect(place)
  }

  if (!isOpen) return null

  return createPortal(<S.Dialog ref={dialogRef} aria-labelledby={titleId}
    onCancel={(event) => { event.preventDefault(); close() }}
    onClick={(event) => { if (event.target === event.currentTarget) close() }}>
    <h2 id={titleId}>{title}</h2>
    <Input ref={inputRef} name="placeSearch" maxLength={50} autoComplete="off" aria-label="장소 검색" value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="예: 서울역, 부산시청…" />
    <S.Results aria-label="장소 검색 결과">
      {searchTermIsCurrent && debouncedSearchText && placeQuery.isFetching ? <p role="status">장소를 찾고 있어요.</p> : null}
      {searchTermIsCurrent && placeQuery.isError ? <S.Error role="alert">검색이 잠시 안 돼요</S.Error> : null}
      {!debouncedSearchText ? <small>장소 이름이나 주소를 입력해 검색해보세요.</small> : null}
      {searchTermIsCurrent && debouncedSearchText && !placeQuery.isFetching && !placeQuery.isError && !placeQuery.data?.length ? <small>검색 결과가 없어요.</small> : null}
      {searchTermIsCurrent ? placeQuery.data?.map((place) => <S.Place key={`${place.name}-${place.address}-${place.latitude}-${place.longitude}`} type="button" onClick={() => select(place)}>
        <strong>{place.name}</strong><span>{place.address}</span>
      </S.Place>) : null}
    </S.Results>
    <div><Button type="button" $variant="secondary" onClick={close}>닫기</Button></div>
  </S.Dialog>, document.body)
}
