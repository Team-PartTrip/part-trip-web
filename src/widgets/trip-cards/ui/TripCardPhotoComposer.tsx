import type { TravelRecordDto } from "@/entities/trip-card";
import { formatDate } from "@/shared/utils";
import {
  Button as PartTripButton,
  Textarea as PartTripTextarea,
} from "@/shared/ui/parttrip";

import { MAX_PHOTOS, useTripCardPhotoComposer } from "../model/useTripCardPhotoComposer";
import * as S from "./TripCardsPage.styles";

type Props = { cards: TravelRecordDto[] };

export function TripCardPhotoComposer({ cards }: Props) {
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
  } = useTripCardPhotoComposer({ cards });

  return (
    <S.Composer>
      <S.CreateCardLayout>
        <S.CreateFormPanel>
          <S.FormHeading>{selectedCard ? `${selectedCard.title || `${selectedCard.cityName || selectedCard.countryName || "여행"} 여행`} · ${formatDate(selectedCard.startDate || "")} 시작` : "사진 · 코멘트"}</S.FormHeading>
          <S.Form onSubmit={(event) => void handleSubmit(event)}>
            {cards.length > 1 ? <S.CardField><S.FieldLabel htmlFor="trip-card-select">여행 카드</S.FieldLabel><S.CardSelector id="trip-card-select" value={selectedCard?.tripId == null ? "" : String(selectedCard.tripId)} onChange={(event) => setSelectedCardId(event.target.value)} disabled={isPending}>{cards.filter((card) => card.tripId != null).map((card) => <option key={card.tripId} value={card.tripId}>{card.title || `${card.cityName || card.countryName || "여행"} 기록`}</option>)}</S.CardSelector></S.CardField> : null}
            <S.FieldLabel htmlFor="trip-card-photos">사진 선택</S.FieldLabel>
            <S.Gallery>
              {photos.slice(0, MAX_PHOTOS).map((photo) => (
                <S.PhotoTile key={`${photo.file.name}-${photo.file.lastModified}`} type="button" onClick={() => fileInputRef.current?.click()} aria-label={`${photo.file.name} 선택됨`}>
                  <img src={photo.url} alt={photo.file.name} />
                  <S.PhotoCheck aria-hidden="true">✓</S.PhotoCheck>
                </S.PhotoTile>
              ))}
              {Array.from({ length: Math.max(0, MAX_PHOTOS - photos.length) }, (_, index) => (
                <S.PhotoTile key={`empty-${index}`} type="button" onClick={() => fileInputRef.current?.click()} aria-label="사진 추가">
                </S.PhotoTile>
              ))}
            </S.Gallery>
            <S.FileInput
              ref={fileInputRef}
              id="trip-card-photos"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
            />
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
            {errorMessage ? (
              <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage>
            ) : null}
            {successMessage ? <S.SuccessMessage role="status">{successMessage}</S.SuccessMessage> : null}
            <PartTripButton type="submit" disabled={isPending || !selectedCard?.tripId || photos.length === 0}>{isPending ? "업로드 중" : "여행 카드에 담기"}</PartTripButton>
          </S.Form>
        </S.CreateFormPanel>
      </S.CreateCardLayout>
      {cards.length === 0 ? <S.ErrorMessage role="status">추가할 여행 카드가 없습니다. 여행 계획을 확정하면 카드가 생성됩니다.</S.ErrorMessage> : null}
    </S.Composer>
  );
}
