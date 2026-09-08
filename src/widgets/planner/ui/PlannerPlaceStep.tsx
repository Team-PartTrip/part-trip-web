import { figmaTripPlanning } from "@/shared/assets";
import { Button as PartTripButton } from "@/shared/ui/parttrip";

import * as S from "./PlannerPage.styles";

type PlannerPlace = {
  description?: string;
  imageUrl?: string;
  placeName?: string;
};

type PlannerPlaceStepProps = {
  canManageCandidates: boolean;
  isSaving: boolean;
  onAdd: () => void;
  place?: PlannerPlace;
};

export function PlannerPlaceStep({
  canManageCandidates,
  isSaving,
  onAdd,
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
              disabled={!canManageCandidates || isSaving}
              onClick={onAdd}
            >
              {isSaving ? "후보 저장 중" : "투표 후보에 추가"}
            </PartTripButton>
          </S.StepCard>
        </>
      ) : (
        <S.Empty>장소 정보를 찾을 수 없습니다.</S.Empty>
      )}
    </S.PlaceDetailLayout>
  );
}
