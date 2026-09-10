import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useSearch } from "@tanstack/react-router";
import { useCreateTravelCardEntryMutation } from "@/entities/trip-card";
import type { TripPlanResponseDto } from "@/entities/trip-plan";
import { getErrorMessage } from "@/shared/utils";

export const MAX_PHOTOS = 4;

type PhotoDraft = { file: File; url: string };
type Props = { cards: TripPlanResponseDto[] };

export function useTripCardPhotoComposer({ cards }: Props) {
  const search = useSearch({ strict: false }) as { cardId?: string };
  const [selectedCardId, setSelectedCardId] = useState(search.cardId ?? "");
  const [photos, setPhotos] = useState<PhotoDraft[]>([]);
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<PhotoDraft[]>([]);
  const createEntryMutation = useCreateTravelCardEntryMutation();
  const selectedCard = cards.find((card) => String(card.tripId) === selectedCardId) ?? cards[0];

  useEffect(
    () => () => photosRef.current.forEach(({ url }) => URL.revokeObjectURL(url)),
    [],
  );

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const remaining = Math.max(0, MAX_PHOTOS - photos.length);
    const incomingPhotos = Array.from(event.target.files ?? [])
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({ file, url: URL.createObjectURL(file) }))
      .sort((a, b) => a.file.lastModified - b.file.lastModified);
    const nextPhotos = incomingPhotos.slice(0, remaining);
    incomingPhotos.slice(remaining).forEach(({ url }) => URL.revokeObjectURL(url));
    setPhotos((current) => [...current, ...nextPhotos]);
    setSuccessMessage("");
    setErrorMessage(
      nextPhotos.length === 0
        ? remaining === 0
          ? `사진은 최대 ${MAX_PHOTOS}장까지 선택할 수 있습니다.`
          : "이미지 파일을 하나 이상 선택해주세요."
        : "",
    );
    event.target.value = "";
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
          payload: {
            ...(comment.trim() ? { comment: comment.trim() } : {}),
            imageFile: photo.file,
          },
        });
        URL.revokeObjectURL(photo.url);
        setPhotos((current) => current.filter((item) => item !== photo));
      }
      setSuccessMessage(`${photoCount}장의 사진을 여행 카드에 추가했습니다.`);
      setPhotos([]);
      setComment("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  return {
    comment,
    errorMessage,
    fileInputRef,
    handlePhotoChange,
    handleSubmit,
    isPending: createEntryMutation.isPending,
    photos,
    selectedCard,
    setComment,
    setSelectedCardId,
    successMessage,
  };
}
