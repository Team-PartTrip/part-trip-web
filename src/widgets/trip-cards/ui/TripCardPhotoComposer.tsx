import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { figmaCardJapan } from "@/shared/assets";
import { useCreateTravelCardEntryMutation } from "@/entities/trip-card";
import type { TripPlanResponseDto } from "@/entities/trip-plan";
import { resolveApiAssetUrl } from "@/shared/libs/api-client";
import {
  Button as PartTripButton,
  Textarea as PartTripTextarea,
} from "@/shared/ui/parttrip";

import * as S from "./TripCardsPage.styles";

type PhotoDraft = { file: File; url: string };

type Props = { cards: TripPlanResponseDto[] };

export function TripCardPhotoComposer({ cards }: Props) {
  const [photos, setPhotos] = useState<PhotoDraft[]>([]);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<PhotoDraft[]>([]);
  const createEntryMutation = useCreateTravelCardEntryMutation();
  const selectedCard = cards.find((card) => String(card.tripId) === selectedCardId);

  useEffect(
    () => () => photosRef.current.forEach(({ url }) => URL.revokeObjectURL(url)),
    [],
  );

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextPhotos = Array.from(event.target.files ?? [])
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({ file, url: URL.createObjectURL(file) }))
      .sort((a, b) => a.file.lastModified - b.file.lastModified);
    photos.forEach(({ url }) => URL.revokeObjectURL(url));
    setPhotos(nextPhotos);
    setSuccessMessage("");
    setErrorMessage(
      nextPhotos.length === 0 ? "이미지 파일을 하나 이상 선택해주세요." : "",
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cardId = Number(selectedCardId);
    if (!Number.isSafeInteger(cardId) || cardId <= 0) {
      setErrorMessage("사진을 추가할 여행 카드를 선택해주세요.");
      return;
    }
    if (photos.length === 0) {
      setErrorMessage("이미지 파일을 하나 이상 선택해주세요.");
      return;
    }
    try {
      setErrorMessage("");
      setSuccessMessage("");
      for (const photo of photos) {
        await createEntryMutation.mutateAsync({
          cardId,
          payload: { comment: comment.trim(), imageFile: photo.file },
        });
        URL.revokeObjectURL(photo.url);
        setPhotos((current) => current.filter((item) => item !== photo));
      }
      setSuccessMessage(`${photos.length}장의 사진을 여행 카드에 추가했습니다.`);
      setPhotos([]);
      setComment("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setErrorMessage("사진을 여행 카드에 추가하지 못했습니다.");
    }
  };

  return (
    <S.Composer>
      <S.CreateCardLayout>
        <S.CreateFormPanel>
          <S.FormHeading>기본 정보</S.FormHeading>
          <S.Form onSubmit={(event) => void handleSubmit(event)}>
            <label>
              여행 카드
              <select value={selectedCardId} onChange={(event) => setSelectedCardId(event.target.value)} disabled={createEntryMutation.isPending}>
                <option value="">사진을 추가할 여행 카드를 선택하세요</option>
                {cards.map((card) => <option key={card.tripId} value={card.tripId}>{card.title || `${card.cityName || card.countryName || "여행"} 기록`}</option>)}
              </select>
            </label>
            <label>
              사진 선택
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
              />
            </label>
            <S.PreviewGrid>
              {photos.map((photo) => (
                <S.PreviewImage
                  key={`${photo.file.name}-${photo.file.lastModified}`}
                >
                  <img src={photo.url} alt={photo.file.name} />
                </S.PreviewImage>
              ))}
            </S.PreviewGrid>
            <label>
              코멘트
              <PartTripTextarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="이 사진에 대해 짧게 남겨보세요."
                maxLength={500}
              />
            </label>
            <small>{comment.length} / 500</small>
            {errorMessage ? (
              <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage>
            ) : null}
            {successMessage ? <S.SuccessMessage role="status">{successMessage}</S.SuccessMessage> : null}
            <PartTripButton type="submit" disabled={createEntryMutation.isPending || !selectedCardId || photos.length === 0}>{createEntryMutation.isPending ? "업로드 중" : "여행 카드에 추가"}</PartTripButton>
          </S.Form>
        </S.CreateFormPanel>
        <S.CardPreviewPanel>
          <S.FormHeading>미리보기</S.FormHeading>
          <S.PreviewCard>
            <img src={resolveApiAssetUrl(selectedCard?.images?.[0]) || photos[0]?.url || figmaCardJapan} alt="" />
            <div>
              <h2>{selectedCard?.title || `${selectedCard?.cityName || selectedCard?.countryName || "여행"} 기록`}</h2>
              <span>
                {selectedCard ? `${selectedCard.startDate || "-"} – ${selectedCard.endDate || "-"} · 사진 ${selectedCard.photoCount ?? 0}장` : "여행 카드를 선택하세요"}
              </span>
            </div>
          </S.PreviewCard>
        </S.CardPreviewPanel>
      </S.CreateCardLayout>
      {cards.length === 0 ? <S.ErrorMessage role="status">추가할 여행 카드가 없습니다. 여행 계획을 확정하면 카드가 생성됩니다.</S.ErrorMessage> : null}
    </S.Composer>
  );
}
