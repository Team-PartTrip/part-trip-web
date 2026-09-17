import { figmaTripPlanning } from "@/shared/assets";
import { Button as PartTripButton } from "@/shared/ui/parttrip";

import * as S from "./PlannerPage.styles";

type PlannerPlace = {
  description?: string;
  imageUrl?: string;
  placeName?: string;
  tourPlaceId?: number;
};

type PlannerPlaceStepProps = {
  canVotePlaces: boolean;
  isSavingPlaceVote: boolean;
  isSelected: boolean;
  onToggle: () => void;
  place?: PlannerPlace;
};

export function PlannerPlaceStep({
  canVotePlaces,
  isSavingPlaceVote,
  isSelected,
  onToggle,
  place,
}: PlannerPlaceStepProps) {
  return (
    <S.PlaceDetailLayout>
      {place ? (
        <>
          <S.PlaceImage src={place.imageUrl || figmaTripPlanning} alt="" />
          <S.StepCard>
            <S.Badge>추천 장소</S.Badge>
            <h2>{place.placeName}</h2>
            <p>{place.description || "장소 설명이 없습니다."}</p>
            <PartTripButton
              type="button"
              disabled={!canVotePlaces || isSavingPlaceVote || place.tourPlaceId == null}
              aria-pressed={isSelected}
              onClick={onToggle}
            >
              {isSavingPlaceVote ? "투표 처리 중" : isSelected ? "투표 취소" : "투표"}
            </PartTripButton>
          </S.StepCard>
        </>
      ) : (
        <S.Empty>장소 정보를 찾을 수 없습니다.</S.Empty>
      )}
    </S.PlaceDetailLayout>
  );
}
