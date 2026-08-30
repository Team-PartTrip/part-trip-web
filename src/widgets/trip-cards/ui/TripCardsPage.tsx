import { Button as PartTripButton } from "@/shared/ui/parttrip";
import { resolveApiAssetUrl } from "@/entities/file/api";
import { AppShell } from "@/widgets/app-shell";

import {
  useTripCardsFlow,
  type TripCardsMode,
} from "../model/useTripCardsFlow";
import { TripCardPhotoComposer } from "./TripCardPhotoComposer";
import * as S from "./TripCardsPage.styles";

export function TripCardsPage() {
  return <TripCardsFlow mode="list" />;
}
export function TripCardDetailPage() {
  return <TripCardsFlow mode="detail" />;
}
export function TripCardCreatePage() {
  return <TripCardsFlow mode="create" />;
}
export function TripCardDeletePage() {
  return <TripCardsFlow mode="delete" />;
}

function TripCardsFlow({ mode }: { mode: TripCardsMode }) {
  const {
    cards,
    detail,
    handleDelete,
    hasQueryError,
    isLoading,
    message,
    mine,
    navigate,
    paths,
    selected,
    setSelected,
  } = useTripCardsFlow(mode);
  const allCardIds = cards.flatMap((card) =>
    card.tripId == null ? [] : [card.tripId],
  );
  const featuredCard = cards[0];
  const detailTimeline = detail?.timeline ?? [];
  const firstPlace = detailTimeline.find((item) => item.type === "PLACE" && item.placeName) ?? detailTimeline.find((item) => item.placeName);
  const firstPhoto = detailTimeline.find((item) => item.type === "PHOTO" && item.imageUrl) ?? detailTimeline.find((item) => item.imageUrl);
  const featuredImage = featuredCard?.coverImageUrl || featuredCard?.images?.[0];

  const selectAll = () => setSelected(allCardIds);
  const clearSelection = () => setSelected([]);

  return (
    <AppShell>
      <S.Page $wide={mode === "create" || mode === "delete"}>
        <S.Header $wide={mode === "create" || mode === "delete"} $create={mode === "create"} $detail={mode === "detail"}>
          {isLoading ? <S.LoadingHeader /> : <div>
            <S.Title>
              {mode === "detail"
                ? detail?.title || "여행 카드"
                : mode === "create"
                  ? "사진 · 코멘트 추가"
                  : mode === "delete"
                    ? "여행 카드 삭제"
                : "여행카드"}
            </S.Title>
            {mode !== "list" ? <S.Subtitle>
              {mode === "delete"
                ? "삭제할 여행 카드를 선택하세요. 여러 개를 한 번에 지울 수 있어요."
                : mode === "create"
                  ? "여행 카드는 여행 시작과 함께 자동으로 만들어져요."
                  : mode === "detail"
                    ? "방문 장소와 촬영 기록을 앱과 동일한 순서로 확인하세요."
                : "여행의 순간을 카드 한 장에 모아보세요."}
            </S.Subtitle> : null}
          </div>}
        </S.Header>
        {message || hasQueryError ? (
          <S.Notice role={hasQueryError ? "alert" : "status"}>
            {message || "여행 카드를 불러오지 못했습니다."}
          </S.Notice>
        ) : null}
        {isLoading ? <S.LoadingLayout aria-busy="true" aria-label="여행 카드 로딩 중"><S.LoadingCard /></S.LoadingLayout> : null}

        {mode === "list" && !isLoading ? (
          <S.CarouselSection>
            {featuredCard ? (
              <S.TravelCard
                type="button"
                onClick={() => featuredCard.tripId && navigate({ params: { tripId: String(featuredCard.tripId) }, to: "/trip-cards/$tripId" })}
              >
                <S.TravelCardImage>
                  {featuredImage ? <img src={resolveApiAssetUrl(featuredImage) || featuredImage} alt="여행 카드 표지" /> : <span>이미지 없음</span>}
                </S.TravelCardImage>
                <S.TravelCardInfo>
                  <S.TravelCardTitle>
                    <span><strong>{(featuredCard.cityName || featuredCard.countryName || "여행").toUpperCase()}</strong><small>{[featuredCard.countryName, featuredCard.startDate, featuredCard.endDate].filter(Boolean).join(" · ") || "여행 일정 정보 없음"}</small></span>
                    <S.FavoriteBadge aria-label="즐겨찾기">★</S.FavoriteBadge>
                  </S.TravelCardTitle>
                  <S.MetricList>
                    <span><small>함께한 사람</small><strong>정보 없음</strong></span>
                    <span><small>방문 장소</small><strong>{featuredCard.places?.length ?? 0}곳</strong></span>
                    <span><small>남긴 사진</small><strong>{featuredCard.photoCount ?? featuredCard.images?.length ?? 0}장</strong></span>
                    <span><small>이동 거리</small><strong>정보 없음</strong></span>
                  </S.MetricList>
                </S.TravelCardInfo>
              </S.TravelCard>
            ) : <S.Empty>공유된 여행 카드가 없습니다.</S.Empty>}
            <S.Pagination aria-label="여행 카드 페이지"><span className="active" /><span /><span /></S.Pagination>
            <PartTripButton type="button" onClick={() => navigate({ to: paths.tripCardCreate })}>여행카드 공유하기</PartTripButton>
          </S.CarouselSection>
        ) : null}

        {mode === "detail" && !isLoading ? (
          <S.DetailLayout>
            {detail ? (
              <>
                <S.PlaceOverview>
                  <S.DetailHeading><h2>방문 장소</h2></S.DetailHeading>
                  <S.PlaceOverviewImage>{firstPhoto?.imageUrl ? <img src={resolveApiAssetUrl(firstPhoto.imageUrl) || firstPhoto.imageUrl} alt={firstPlace?.placeName ? `${firstPlace.placeName} 여행 사진` : "여행 사진"} /> : <span>{firstPlace?.placeName || "장소 이미지 없음"}</span>}</S.PlaceOverviewImage>
                  <S.PlaceCopy><strong>{firstPlace?.placeName || "장소 정보 없음"}</strong><span>{firstPlace?.address || "상세 주소 정보 없음"}</span><small>{[firstPlace?.date || detail.startDate, firstPlace?.rating == null ? "" : `★ ${firstPlace.rating}`].filter(Boolean).join(" | ") || "여행 정보 없음"}</small></S.PlaceCopy>
                </S.PlaceOverview>
                  <S.CapturedInfo>
                  <S.CapturedPanel><h2>촬영된 이미지</h2><S.CapturedImage>{firstPhoto?.imageUrl ? <img src={resolveApiAssetUrl(firstPhoto.imageUrl) || firstPhoto.imageUrl} alt="여행 사진" /> : <span>촬영된 이미지</span>}</S.CapturedImage><small>{firstPhoto?.takenAt || firstPhoto?.date || detail.startDate || "촬영일 정보 없음"}</small></S.CapturedPanel>
                  <S.CapturedPanel><h2>사진에 포함된 위치 정보</h2><strong>{firstPlace?.placeName || "위치 정보 없음"}</strong><small>{[firstPlace?.address, firstPlace?.rating == null ? "" : `★ ${firstPlace.rating}`].filter(Boolean).join(" | ") || "위치 정보 없음"}</small></S.CapturedPanel>
                  <S.AddPhoto><PartTripButton type="button" onClick={() => navigate({ to: paths.tripCardCreate })}>사진 추가하기</PartTripButton><small>갤러리에서 기록하고 싶은 사진 업로드</small></S.AddPhoto>
                </S.CapturedInfo>
              </>
            ) : (
              <S.Empty>여행 카드를 찾을 수 없습니다.</S.Empty>
            )}
          </S.DetailLayout>
        ) : null}

        {mode === "create" && !isLoading ? <TripCardPhotoComposer cards={mine} /> : null}

        {mode === "delete" && !isLoading ? (
          <>
            <S.Toolbar>
              <strong>{selected.length}개 선택됨</strong>
              <div>
                <button type="button" onClick={selectAll}>전체 선택</button>
                <button type="button" onClick={clearSelection}>선택 해제</button>
              </div>
            </S.Toolbar>
            <S.DeleteLayout>
            <S.DeleteList>
              <h2>여행 카드 {cards.length}개</h2>
              {cards.map((card, index) => (
                <S.DeleteRow
                  key={card.tripId ?? index}
                  $selected={
                    card.tripId != null && selected.includes(card.tripId)
                  }
                >
                  <input
                    type="checkbox"
                    checked={
                      card.tripId != null && selected.includes(card.tripId)
                    }
                    disabled={card.tripId == null}
                    onChange={() =>
                      card.tripId != null &&
                      setSelected((current) =>
                        current.includes(card.tripId as number)
                          ? current.filter((id) => id !== card.tripId)
                          : [...current, card.tripId as number],
                      )
                    }
                  />
                  <span>IMG</span>
                  <div>
                    <strong>{card.title || "여행 카드"}</strong>
                    <small>
                      {card.startDate || "-"} – {card.endDate || "-"} · 사진{" "}
                      {card.photoCount ?? card.images?.length ?? 0}장
                    </small>
                  </div>
                </S.DeleteRow>
              ))}
              {cards.length === 0 ? (
                <S.Empty>삭제할 여행 카드가 없습니다.</S.Empty>
              ) : null}
            </S.DeleteList>
            <S.DeletePanel>
              <h2>삭제 확인</h2>
              <S.Warning>
                <strong>! 삭제하면 되돌릴 수 없어요</strong>
                <span>카드에 담긴 사진과 코멘트가 함께 삭제됩니다.</span>
              </S.Warning>
              <S.DeleteSummary><strong>선택한 카드 {selected.length}개</strong><span>
                {cards
                  .filter(
                    (card) =>
                      card.tripId != null && selected.includes(card.tripId),
                  )
                  .map((card) => card.title || "여행 카드")
                  .join(" · ") || "선택된 카드가 없습니다."}
              </span><span>사진과 코멘트가 함께 삭제됩니다.</span></S.DeleteSummary>
              <S.DeleteActions>
                <S.DeleteButton
                  type="button"
                  disabled={selected.length === 0}
                  onClick={handleDelete}
                >
                  {selected.length}개 삭제하기
                </S.DeleteButton>
                <PartTripButton
                  type="button"
                  $variant="secondary"
                  onClick={() => navigate({ to: paths.tripCards })}
                >
                  취소
                </PartTripButton>
              </S.DeleteActions>
            </S.DeletePanel>
            </S.DeleteLayout>
          </>
        ) : null}
      </S.Page>
    </AppShell>
  );
}
