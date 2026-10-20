import type { TravelRecordDto } from "@/entities/trip-card";
import { useNavigate } from "@tanstack/react-router";
import { formatDate } from "@/shared/utils";
import { paths } from "@/shared/config";
import {
  Button as PartTripButton,
  Textarea as PartTripTextarea,
} from "@/shared/ui/parttrip";

import { MAX_PHOTOS, useTripCardPhotoComposer } from "../model/useTripCardPhotoComposer";
import { PHOTO_ACCEPT, TRIP_ENDED_NOTICE } from "../model/photo-composer-state";
import * as S from "./TripCardsPage.styles";

type Props = { cards: TravelRecordDto[] };

export function TripCardPhotoComposer({ cards }: Props) {
  const navigate = useNavigate();
  const {
    comment,
    errorMessage,
    fileInputRef,
    handlePhotoChange,
    handleSubmit,
    isPending,
    photos,
    selectedCard,
    setComment,
    setSelectedCardId,
    successMessage,
    tripEnded,
  } = useTripCardPhotoComposer({ cards });

  if (cards.length === 0) {
    return <S.EmptyComposer>
      <p role="status">여행카드가 아직 없어요. 여행 계획을 확정하면 사진을 기록할 수 있어요.</p>
      <PartTripButton type="button" onClick={() => navigate({ to: paths.planner })}>여행 계획 만들기</PartTripButton>
    </S.EmptyComposer>;
  }

  return (
    <S.Composer>
      <S.CreateCardLayout>
        <S.CreateFormPanel>
          <S.FormHeading>{selectedCard ? `${selectedCard.title || `${selectedCard.cityName || selectedCard.regionName || selectedCard.countryName || "여행"} 여행`} · ${formatDate(selectedCard.startDate || "")} 시작` : "사진 · 코멘트"}</S.FormHeading>
          <S.Form onSubmit={(event) => void handleSubmit(event)}>
            {cards.length > 0 ? <S.CardField><S.FieldLabel htmlFor="trip-card-select">여행카드</S.FieldLabel><S.CardSelector id="trip-card-select" value={selectedCard?.tripId == null ? "" : String(selectedCard.tripId)} onChange={(event) => setSelectedCardId(event.target.value)} disabled={isPending}><option value="" disabled>여행카드를 선택해주세요</option>{cards.filter((card) => card.tripId != null).map((card) => <option key={card.tripId} value={card.tripId}>{card.title || `${card.cityName || card.regionName || card.countryName || "여행"} 기록`}</option>)}</S.CardSelector></S.CardField> : null}
            {!selectedCard && cards.length > 0 ? <p role="alert">선택한 여행카드를 찾을 수 없어요. 사진을 올릴 여행카드를 다시 선택해주세요.</p> : null}
            <S.FieldLabel htmlFor="trip-card-photos">사진 선택</S.FieldLabel>
            {tripEnded ? <p role="status">{TRIP_ENDED_NOTICE}</p> : null}
            <S.Gallery>
              {photos.slice(0, MAX_PHOTOS).map((photo) => (
                <S.PhotoTile key={photo.url} type="button" disabled={tripEnded} onClick={() => fileInputRef.current?.click()} aria-label={`${photo.file.name} 선택됨`}>
                  <img src={photo.url} alt={photo.file.name} />
                  <S.PhotoCheck aria-hidden="true">✓</S.PhotoCheck>
                </S.PhotoTile>
              ))}
              {Array.from({ length: Math.max(0, MAX_PHOTOS - photos.length) }, (_, index) => (
                <S.PhotoTile key={`empty-${index}`} type="button" disabled={tripEnded} onClick={() => fileInputRef.current?.click()} aria-label="사진 추가">
                </S.PhotoTile>
              ))}
            </S.Gallery>
            <S.FileInput
              ref={fileInputRef}
              id="trip-card-photos"
              type="file"
              accept={PHOTO_ACCEPT}
              disabled={tripEnded}
              multiple
              onChange={handlePhotoChange}
            />
            {photos.length > 1 ? <p>사진마다 따로 남겨요. 올린 뒤 사진을 열어 코멘트를 적어주세요.</p> : <>
            <S.FieldLabel htmlFor="trip-card-comment">코멘트</S.FieldLabel>
            <S.TextareaField>
              <PartTripTextarea
                id="trip-card-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="이 사진에 대해 짧게 남겨보세요."
                maxLength={100}
              />
              <S.Counter>{comment.length} / 100</S.Counter>
            </S.TextareaField>
            </>}
            {errorMessage ? (
              <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage>
            ) : null}
            {successMessage ? <S.SuccessMessage role="status">{successMessage}</S.SuccessMessage> : null}
            <PartTripButton type="submit" disabled={tripEnded || isPending || !selectedCard?.tripId || photos.length === 0}>{isPending ? "업로드 중" : "여행카드에 담기"}</PartTripButton>
          </S.Form>
        </S.CreateFormPanel>
      </S.CreateCardLayout>
    </S.Composer>
  );
}
