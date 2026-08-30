import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useCreateTravelCardEntryMutation } from "@/entities/trip-card";
import type { TripPlanResponseDto } from "@/entities/trip-plan";
import {
  Button as PartTripButton,
  Textarea as PartTripTextarea,
} from "@/shared/ui/parttrip";

import * as S from "./TripCardsPage.styles";

type PhotoDraft = { file: File; url: string };

type Props = { cards: TripPlanResponseDto[] };

export function TripCardPhotoComposer({ cards }: Props) {
  const [photos, setPhotos] = useState<PhotoDraft[]>([]);
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<PhotoDraft[]>([]);
  const createEntryMutation = useCreateTravelCardEntryMutation();
  const selectedCard = cards[0];

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
    const cardId = Number(selectedCard?.tripId);
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
      const photoCount = photos.length;
      for (const photo of photos) {
        await createEntryMutation.mutateAsync({
          cardId,
          payload: { comment: comment.trim(), imageFile: photo.file },
        });
        URL.revokeObjectURL(photo.url);
        setPhotos((current) => current.filter((item) => item !== photo));
      }
      setSuccessMessage(`${photoCount}장의 사진을 여행 카드에 추가했습니다.`);
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
          <S.FormHeading>{selectedCard ? `${selectedCard.title || `${selectedCard.cityName || selectedCard.countryName || "여행"} 여행`} · ${(selectedCard.startDate || "").replaceAll("-", ".")} 시작` : "사진 · 코멘트"}</S.FormHeading>
          <S.Form onSubmit={(event) => void handleSubmit(event)}>
            <S.FieldLabel htmlFor="trip-card-photos">사진 선택</S.FieldLabel>
            <S.Gallery>
              {photos.slice(0, 4).map((photo) => (
                <S.PhotoTile key={`${photo.file.name}-${photo.file.lastModified}`} type="button" onClick={() => fileInputRef.current?.click()} aria-label={`${photo.file.name} 선택됨`}>
                  <img src={photo.url} alt={photo.file.name} />
                  <S.PhotoCheck aria-hidden="true">✓</S.PhotoCheck>
                </S.PhotoTile>
              ))}
              {Array.from({ length: Math.max(0, 4 - photos.length) }, (_, index) => (
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
            <PartTripButton type="submit" disabled={createEntryMutation.isPending || !selectedCard?.tripId || photos.length === 0}>{createEntryMutation.isPending ? "업로드 중" : "여행 카드에 담기"}</PartTripButton>
          </S.Form>
        </S.CreateFormPanel>
      </S.CreateCardLayout>
      {cards.length === 0 ? <S.ErrorMessage role="status">추가할 여행 카드가 없습니다. 여행 계획을 확정하면 카드가 생성됩니다.</S.ErrorMessage> : null}
    </S.Composer>
  );
}
