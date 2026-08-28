import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { figmaCardJapan } from "@/shared/assets";
import {
  Button as PartTripButton,
  Input as PartTripInput,
  Textarea as PartTripTextarea,
} from "@/shared/ui/parttrip";

import * as S from "./TripCardsPage.styles";

type PhotoDraft = { file: File; url: string };

type GeneratedDraft = {
  content: string;
  endDate: string;
  photos: PhotoDraft[];
  startDate: string;
  title: string;
};

function dateValue(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

export function TripCardPhotoComposer() {
  const [photos, setPhotos] = useState<PhotoDraft[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [generatedDraft, setGeneratedDraft] = useState<GeneratedDraft | null>(
    null,
  );

  useEffect(
    () => () => photos.forEach(({ url }) => URL.revokeObjectURL(url)),
    [photos],
  );

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextPhotos = Array.from(event.target.files ?? [])
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({ file, url: URL.createObjectURL(file) }))
      .sort((a, b) => a.file.lastModified - b.file.lastModified);
    photos.forEach(({ url }) => URL.revokeObjectURL(url));
    setPhotos(nextPhotos);
    setGeneratedDraft(null);
    setErrorMessage(
      nextPhotos.length === 0 ? "이미지 파일을 하나 이상 선택해주세요." : "",
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || photos.length === 0) {
      setErrorMessage("제목과 이미지를 입력해주세요.");
      return;
    }
    const nextStartDate = startDate || dateValue(photos[0].file.lastModified);
    const nextEndDate =
      endDate ||
      dateValue(
        photos.at(-1)?.file.lastModified ?? photos[0].file.lastModified,
      );
    if (nextStartDate > nextEndDate) {
      setErrorMessage("종료일은 시작일보다 빠를 수 없습니다.");
      return;
    }
    setErrorMessage("");
    setStartDate(nextStartDate);
    setEndDate(nextEndDate);
    setGeneratedDraft({
      content:
        content.trim() ||
        "사진 파일의 촬영 시각을 기준으로 생성한 여행 기록 초안입니다.",
      endDate: nextEndDate,
      photos,
      startDate: nextStartDate,
      title: title.trim(),
    });
  };

  return (
    <S.Composer>
      <S.CreateCardLayout>
        <S.CreateFormPanel>
          <S.FormHeading>기본 정보</S.FormHeading>
          <S.Form onSubmit={handleSubmit}>
            <label>
              여행 이름
              <PartTripInput
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="오사카 여행"
                maxLength={60}
              />
            </label>
            <label>
              여행 기간
              <S.DateFields>
                <PartTripInput
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
                <PartTripInput
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </S.DateFields>
            </label>
            <label>
              사진 선택
              <input
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
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="이 사진에 대해 짧게 남겨보세요."
                maxLength={100}
              />
            </label>
            <small>{content.length} / 100</small>
            {errorMessage ? (
              <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage>
            ) : null}
            <PartTripButton type="submit">여행 카드 초안 만들기</PartTripButton>
          </S.Form>
        </S.CreateFormPanel>
        <S.CardPreviewPanel>
          <S.FormHeading>미리보기</S.FormHeading>
          <S.PreviewCard>
            <img src={photos[0]?.url || figmaCardJapan} alt="" />
            <div>
              <h2>{title || "오사카 여행"}</h2>
              <span>
                {startDate && endDate
                  ? `${startDate} – ${endDate}`
                  : "Japan · 5 days"}
              </span>
            </div>
          </S.PreviewCard>
        </S.CardPreviewPanel>
      </S.CreateCardLayout>
      {generatedDraft ? (
        <S.GeneratedCard>
          <S.Badge>프론트 초안</S.Badge>
          <h2>{generatedDraft.title}</h2>
          <p>
            {generatedDraft.startDate} – {generatedDraft.endDate}
          </p>
          <p>{generatedDraft.content}</p>
        </S.GeneratedCard>
      ) : null}
    </S.Composer>
  );
}
