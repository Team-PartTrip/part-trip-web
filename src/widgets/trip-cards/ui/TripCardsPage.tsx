import {
  figmaCardActive,
  figmaCardCompleted,
  figmaCardJapan,
} from "@/shared/assets";
import { Button as PartTripButton } from "@/shared/ui/parttrip";
import { AppShell } from "@/widgets/app-shell";

import {
  useTripCardsFlow,
  type TripCardsMode,
} from "../model/useTripCardsFlow";
import { TripCardPhotoComposer } from "./TripCardPhotoComposer";
import * as S from "./TripCardsPage.styles";

const fallbackImages = [figmaCardJapan, figmaCardActive, figmaCardCompleted];

type CardState = "planned" | "active" | "completed";

function cardState(startDate?: string, endDate?: string): CardState {
  const start = startDate ? Date.parse(startDate) : Number.NaN;
  const end = endDate ? Date.parse(endDate) : Number.NaN;
  if (Number.isFinite(end) && end < Date.now()) return "completed";
  if (Number.isFinite(start) && start <= Date.now()) return "active";
  return "planned";
}

function cardStatus(state: CardState) {
  return state === "completed"
    ? "완료"
    : state === "active"
      ? "진행 중"
      : "예정 여행";
}

function cardDday(state: CardState, startDate?: string) {
  if (state === "completed") return "Done";
  if (state === "active") return "LIVE";
  const start = startDate ? Date.parse(startDate) : Number.NaN;
  if (!Number.isFinite(start)) return "-";
  return `D-${Math.max(0, Math.ceil((start - Date.now()) / 86_400_000))}`;
}

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
    createTab,
    detail,
    handleDelete,
    handleImport,
    handleShare,
    hasQueryError,
    importMutation,
    isLoading,
    message,
    mine,
    navigate,
    paths,
    selected,
    setCreateTab,
    setSelected,
    shareMutation,
  } = useTripCardsFlow(mode);
  const allCardIds = cards.flatMap((card) =>
    card.tripId == null ? [] : [card.tripId],
  );
  const allSelected =
    allCardIds.length > 0 && selected.length === allCardIds.length;

  const toggleAll = () => {
    setSelected(allSelected ? [] : allCardIds);
  };

  return (
    <AppShell>
      <S.Page>
        <S.Header>
          <div>
            <S.Title>
              {mode === "detail"
                ? detail?.title || "일본 오사카 여행팟"
                : mode === "create"
                  ? "여행 카드 만들기"
                  : mode === "delete"
                    ? "여행 카드 삭제"
                    : "내 여행 카드"}
            </S.Title>
            <S.Subtitle>
              {mode === "delete"
                ? "삭제할 여행 카드를 선택하세요. 여러 개를 한 번에 지울 수 있어요."
                : mode === "create"
                  ? "여행 사진과 기본 정보를 입력해 새로운 카드를 만드세요."
                  : mode === "detail"
                    ? "방문한 장소와 사진을 시간 순서로 확인하세요."
                    : "예정된 여행과 지난 여행을 한눈에 관리하세요."}
            </S.Subtitle>
          </div>
        </S.Header>
        {message || hasQueryError ? (
          <S.Notice role={hasQueryError ? "alert" : "status"}>
            {message || "여행 카드를 불러오지 못했습니다."}
          </S.Notice>
        ) : null}
        {isLoading ? (
          <S.State aria-busy="true">여행 카드를 불러오는 중입니다.</S.State>
        ) : null}

        {mode === "list" && !isLoading ? (
          <>
            <S.CardGrid>
              {cards.map((card, index) => {
                const state = cardState(card.startDate, card.endDate);
                return (
                  <S.Card
                    type="button"
                    key={card.tripId ?? index}
                    onClick={() =>
                      card.tripId &&
                      navigate({
                        params: { tripId: String(card.tripId) },
                        to: "/trip-cards/$tripId",
                      })
                    }
                  >
                    <img
                      src={
                        card.images?.[0] ||
                        fallbackImages[index % fallbackImages.length]
                      }
                      alt=""
                    />
                    <S.CardBody>
                      <strong>
                        {card.title ||
                          `${card.cityName || card.countryName || "여행"} 여행`}
                      </strong>
                      <span>
                        {card.startDate || "-"} – {card.endDate || "-"}
                      </span>
                      <S.CardStatus $state={state}>
                        <span>{cardStatus(state)}</span>
                        <b>{cardDday(state, card.startDate)}</b>
                      </S.CardStatus>
                    </S.CardBody>
                  </S.Card>
                );
              })}
              {cards.length === 0 ? (
                <S.Empty>공유된 여행 카드가 없습니다.</S.Empty>
              ) : null}
            </S.CardGrid>
            <S.ActionRow>
              <PartTripButton
                type="button"
                onClick={() => navigate({ to: paths.tripCardCreate })}
              >
                여행카드 공유하기
              </PartTripButton>
              <PartTripButton
                type="button"
                $variant="secondary"
                onClick={() => navigate({ to: paths.tripCardDelete })}
              >
                카드 선택 · 삭제
              </PartTripButton>
            </S.ActionRow>
          </>
        ) : null}

        {mode === "detail" && !isLoading ? (
          <S.DetailLayout>
            {detail ? (
              <>
                <S.DetailTrip>
                  <S.Card>
                    <img src={detail.images?.[0] || figmaCardJapan} alt="" />
                    <S.CardBody>
                      <strong>{detail.title || "오사카 여행"}</strong>
                      <span>
                        {detail.startDate || "-"} – {detail.endDate || "-"}
                      </span>
                      <S.CardStatus
                        $state={cardState(detail.startDate, detail.endDate)}
                      >
                        <span>
                          {cardStatus(
                            cardState(detail.startDate, detail.endDate),
                          )}
                        </span>
                        <b>
                          {cardDday(
                            cardState(detail.startDate, detail.endDate),
                            detail.startDate,
                          )}
                        </b>
                      </S.CardStatus>
                    </S.CardBody>
                  </S.Card>
                  <PartTripButton type="button" $variant="secondary">
                    여행 정보 수정
                  </PartTripButton>
                </S.DetailTrip>
                <S.DetailTimeline>
                  <S.DetailHeading>
                    <h2>여행 타임라인</h2>
                    <span>
                      장소 {detail.places?.length ?? 0} · 사진{" "}
                      {detail.images?.length ?? 0}
                    </span>
                  </S.DetailHeading>
                  {(detail.places ?? []).map((place, index) => (
                    <S.PlaceTimeline key={place.tripPlaceId ?? index}>
                      <strong>{place.placeName || "장소"}</strong>
                      <span>
                        DAY {place.dayNumber ?? index + 1} ·{" "}
                        {place.placeSub || "상세 주소 · 별점 등 정보"}
                      </span>
                      <S.PhotoSlots>
                        <span>
                          {detail.images?.[index] ? (
                            <img src={detail.images[index]} alt="" />
                          ) : null}
                        </span>
                        <span>+ 사진 추가</span>
                      </S.PhotoSlots>
                    </S.PlaceTimeline>
                  ))}
                  {!detail.places?.length ? (
                    <S.Empty>등록된 일정이 없습니다.</S.Empty>
                  ) : null}
                  <PartTripButton
                    type="button"
                    disabled={importMutation.isPending}
                    onClick={() => void handleImport()}
                  >
                    {importMutation.isPending
                      ? "가져오는 중"
                      : "내 여행으로 가져오기"}
                  </PartTripButton>
                </S.DetailTimeline>
              </>
            ) : (
              <S.Empty>여행 카드를 찾을 수 없습니다.</S.Empty>
            )}
          </S.DetailLayout>
        ) : null}

        {mode === "create" && !isLoading ? (
          <>
            <S.CreateTabs aria-label="여행 카드 작성 방식">
              <button
                type="button"
                aria-pressed={createTab === "share"}
                onClick={() => setCreateTab("share")}
              >
                기존 여행 공유
              </button>
              <button
                type="button"
                aria-pressed={createTab === "photo"}
                onClick={() => setCreateTab("photo")}
              >
                사진으로 작성
              </button>
            </S.CreateTabs>
            {createTab === "share" ? (
              <S.SelectList>
                {mine.map((trip, index) => (
                  <S.SelectRow key={trip.tripId ?? index}>
                    <div>
                      <strong>{trip.title || "여행 기록"}</strong>
                      <span>
                        {trip.cityName || trip.countryName || "여행지"}
                      </span>
                    </div>
                    <PartTripButton
                      type="button"
                      disabled={shareMutation.isPending}
                      onClick={() => void handleShare(trip.tripId)}
                    >
                      공유하기
                    </PartTripButton>
                  </S.SelectRow>
                ))}
                {mine.length === 0 ? (
                  <S.Empty>공유할 내 여행이 없습니다.</S.Empty>
                ) : null}
              </S.SelectList>
            ) : (
              <TripCardPhotoComposer />
            )}
          </>
        ) : null}

        {mode === "delete" && !isLoading ? (
          <S.DeleteLayout>
            <S.DeleteList>
              <S.Toolbar>
                <strong>{selected.length}개 선택됨</strong>
                <div>
                  <button type="button" onClick={toggleAll}>
                    {allSelected ? "선택 해제" : "전체 선택"}
                  </button>
                </div>
              </S.Toolbar>
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
                      {card.images?.length ?? 0}장
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
              <strong>선택한 카드 {selected.length}개</strong>
              <span>
                {cards
                  .filter(
                    (card) =>
                      card.tripId != null && selected.includes(card.tripId),
                  )
                  .map((card) => card.title || "여행 카드")
                  .join(" · ") || "선택된 카드가 없습니다."}
              </span>
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
        ) : null}
      </S.Page>
    </AppShell>
  );
}
