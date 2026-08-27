import { useNavigate } from '@tanstack/react-router'
import { paths } from '@/shared/config'
import { Button as PartTripButton, Input as PartTripInput, Select as PartTripSelect, Textarea as PartTripTextarea } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'

import { useCommunityWriteForm } from '../model/useCommunityWriteForm'
import * as S from './CommunityWritePage.styles'

export function CommunityWritePage() {
  const navigate = useNavigate()
  const {
    categories,
    category,
    content,
    destination,
    errorMessage,
    file,
    hasCountriesError,
    hasTripsError,
    handleSubmit,
    isSubmitting,
    selectedTripValue,
    setCategory,
    setContent,
    setDestination,
    setFile,
    setSelectedTripId,
    setTitle,
    title,
    trips,
  } = useCommunityWriteForm()

  return (
    <AppShell>
      <S.Page>
      <S.Content>
        <S.Header><div><h1>게시글 작성</h1><p>여행 경험과 궁금한 점을 공유해보세요.</p></div><PartTripButton type="button" $variant="ghost" onClick={() => navigate({ to: paths.community })}>취소</PartTripButton></S.Header>
        <S.Form onSubmit={(event) => void handleSubmit(event)} noValidate>
          <S.Field>
            <span>게시판</span>
            <S.CategoryRow>{categories.map((item) => <button key={item} type="button" className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</S.CategoryRow>
          </S.Field>
          {category === '경로/일정 공유' ? (
            <S.Field>
              <label htmlFor="community-trip">공유할 여행 기록</label>
              <PartTripSelect id="community-trip" value={selectedTripValue} onChange={(event) => setSelectedTripId(event.target.value)}>
                {trips.map((trip) => <option key={trip.tripId} value={trip.tripId}>{trip.title ?? `${trip.countryName ?? ''} 여행`}</option>)}
              </PartTripSelect>
            </S.Field>
          ) : (
            <>
              <S.Field><label htmlFor="community-title">제목</label><PartTripInput id="community-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="제목을 입력하세요." maxLength={80} /></S.Field>
              <S.Field><label htmlFor="community-destination">여행지</label><PartTripInput id="community-destination" value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="예: 교토, 일본" maxLength={40} /></S.Field>
              <S.Field><label htmlFor="community-content">내용</label><PartTripTextarea id="community-content" value={content} onChange={(event) => setContent(event.target.value)} placeholder="여행 이야기를 자유롭게 작성하세요." maxLength={1200} /></S.Field>
              <S.UploadArea>
                <span>{file?.name || '사진을 추가할 수 있습니다.'}</span>
                <label>사진 선택<input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label>
              </S.UploadArea>
            </>
          )}
          {errorMessage || hasTripsError || hasCountriesError ? <S.ErrorMessage role="alert">{errorMessage || '작성에 필요한 정보를 불러오지 못했습니다.'}</S.ErrorMessage> : null}
          <S.Actions><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.community })}>취소</PartTripButton><PartTripButton type="submit" disabled={isSubmitting}>{isSubmitting ? '등록 중' : '게시글 등록'}</PartTripButton></S.Actions>
        </S.Form>
      </S.Content>
      </S.Page>
    </AppShell>
  )
}
