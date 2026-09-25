import { AppShell } from "@/widgets/app-shell";

import {
  useTripCardsFlow,
  type TripCardsMode,
} from "../model/useTripCardsFlow";
import { TripCardPhotoComposer } from "./TripCardPhotoComposer";
import {
  TripCardDeleteView,
  TripCardDetailView,
  TripCardListView,
} from "./TripCardModeViews";
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
    navigate,
    selected,
    setSelected,
  } = useTripCardsFlow(mode);
  const featuredCard = cards[0];
  const detailTimeline = detail?.timeline ?? [];
  const firstPlace = detailTimeline.find((item) => item.type === "PLACE" && item.placeName) ?? detailTimeline.find((item) => item.placeName);
  const firstPhoto = detailTimeline.find((item) => item.type === "PHOTO" && item.imageUrl) ?? detailTimeline.find((item) => item.imageUrl);
  const featuredImage = featuredCard?.images?.[0];
  const copy = ({
    list: { title: "여행카드" },
    detail: { title: detail?.title || "여행 카드", subtitle: "방문 장소와 촬영 기록을 앱과 동일한 순서로 확인하세요." },
    create: { title: "사진 · 코멘트 추가", subtitle: "여행 계획을 확정하면 여행 카드가 만들어져요." },
    delete: { title: "여행 카드 삭제", subtitle: "삭제할 여행 카드를 선택하세요. 여러 개를 한 번에 지울 수 있어요." },
  } satisfies Record<TripCardsMode, { title: string; subtitle?: string }>)[mode];
  const isWide = mode === "create" || mode === "delete";

  return (
    <AppShell>
      <S.Page $wide={isWide}>
        <S.Header $wide={isWide} $create={mode === "create"} $detail={mode === "detail"}>
          {isLoading ? <S.LoadingHeader /> : <div>
            <S.Title>{copy.title}</S.Title>
            {copy.subtitle ? <S.Subtitle>{copy.subtitle}</S.Subtitle> : null}
          </div>}
        </S.Header>
        {message || hasQueryError ? (
          <S.Notice role={hasQueryError ? "alert" : "status"}>
            {message || "여행 카드를 불러오지 못했습니다."}
          </S.Notice>
        ) : null}
        {isLoading ? <S.LoadingLayout aria-busy="true" aria-label="여행 카드 로딩 중"><S.LoadingCard /></S.LoadingLayout> : null}

        {mode === "list" && !isLoading ? (
          <TripCardListView card={featuredCard} imageUrl={featuredImage} navigate={navigate} />
        ) : null}

        {mode === "detail" && !isLoading ? (
          <TripCardDetailView detail={detail} firstPhoto={firstPhoto} firstPlace={firstPlace} navigate={navigate} />
        ) : null}

        {mode === "create" && !isLoading ? <TripCardPhotoComposer cards={cards} /> : null}

        {mode === "delete" && !isLoading ? (
          <TripCardDeleteView
            cards={cards}
            handleDelete={handleDelete}
            navigate={navigate}
            selected={selected}
            setSelected={setSelected}
          />
        ) : null}
      </S.Page>
    </AppShell>
  );
}
