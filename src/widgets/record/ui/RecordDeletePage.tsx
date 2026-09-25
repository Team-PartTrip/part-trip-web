import { useMyTravelRecords, useTravelRecordQuery } from '@/entities/trip-card'
import { Skeleton } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'

import { PhotoDeletionPanel, type DeletablePhoto } from './PhotoDeletionPanel'
import * as S from './RecordDeletePage.styles'

export function RecordDeletePage() {
  const { hasError: hasTripsError, isLoading: isTripsLoading, trips } = useMyTravelRecords()
  const trip = trips[0]
  const detailQuery = useTravelRecordQuery(trip?.tripId ?? 0)
  const record = detailQuery.data ?? trip
  const photos: DeletablePhoto[] = (record?.timeline ?? []).flatMap((item) =>
    item.entryId != null && item.imageUrl ? [{ entryId: item.entryId, imageUrl: item.imageUrl }] : [],
  )
  const isLoading = isTripsLoading || detailQuery.isLoading
  const hasError = hasTripsError || detailQuery.isError

  if (!isLoading && !hasError && photos.length === 0) {
    return (
      <AppShell>
        <S.Page>
          <S.Header>
            <S.Title>기록 사진 삭제</S.Title>
            <S.Subtitle>삭제할 사진이 없습니다.</S.Subtitle>
          </S.Header>
          <S.State>남겨진 사진이 생기면 이곳에서 삭제할 수 있습니다.</S.State>
        </S.Page>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <S.Page>
        <S.Header>
          <S.Title>기록 사진 삭제</S.Title>
          <S.Subtitle>삭제할 사진을 선택하세요. 여러 장을 한 번에 지울 수 있어요.</S.Subtitle>
        </S.Header>
        {isLoading ? <Skeleton aria-busy="true" aria-label="여행 기록 로딩 중" $height="23.375rem" $radius="1rem" /> : null}
        {hasError ? <S.State role="alert">여행 기록을 불러오지 못했습니다.</S.State> : null}
        {!isLoading && !hasError && record ? (
          <PhotoDeletionPanel photos={photos} recordId={record.tripId} title={record.title} />
        ) : null}
      </S.Page>
    </AppShell>
  )
}
