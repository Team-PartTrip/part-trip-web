import { Button as PartTripButton } from "@/shared/ui/parttrip";
import { formatDateRange, formatTripDuration } from "@/shared/utils";

import * as S from "./PlannerPage.styles";

type PlannerMember = {
  nickName?: string;
  userId?: string;
};

type FinalPlace = {
  category?: string;
  categoryLabel?: string;
  placeName?: string;
  voteCount?: number;
};

type PlannerFinalStepProps = {
  cityName?: string;
  endDate?: string;
  finalPlaces: FinalPlace[];
  isConfirmed: boolean;
  members: PlannerMember[];
  onShare: () => void;
  onStart: () => void;
  shareError: string;
  startDate?: string;
  userInitial: string;
  userName: string;
};

export function PlannerFinalStep({
  cityName,
  endDate,
  finalPlaces,
  isConfirmed,
  members,
  onShare,
  onStart,
  shareError,
  startDate,
  userInitial,
  userName,
}: PlannerFinalStepProps) {
  const visibleMembers = members.length
    ? members
    : [{ nickName: userName, userId: userInitial }];

  return (
    <S.FinalConfirmBody>
      <S.SuccessMark aria-hidden="true">✓</S.SuccessMark>
      <S.FinalTitle>여행 계획이 확정됐어요</S.FinalTitle>
      <S.FinalTripTitle>
        {cityName || "여행"} {formatTripDuration(startDate, endDate)}
      </S.FinalTripTitle>
      <S.FinalDate>{formatDateRange(startDate, endDate)}</S.FinalDate>
      <S.FinalMembers aria-label="참여 멤버">
        {visibleMembers.map((member, index) => (
          <S.Avatar key={member.userId ?? member.nickName ?? index}>
            {(member.nickName || member.userId || "멤버")
              .slice(0, 1)
              .toUpperCase()}
          </S.Avatar>
        ))}
      </S.FinalMembers>
      <S.FinalMemberSummary>
        {members.length || 1}명 모두 참여
      </S.FinalMemberSummary>
      <S.FinalSchedulePanel>
        <S.SectionTitle>확정된 일정</S.SectionTitle>
        <S.FinalPlaceList>
          {finalPlaces.map((item, index) => (
            <S.FinalPlaceRow key={`${item.placeName}-${index}`}>
              <small>{item.categoryLabel || item.category || "장소"}</small>
              <strong>{item.placeName || "장소"}</strong>
              <span>{item.voteCount ?? "-"}표</span>
            </S.FinalPlaceRow>
          ))}
          {finalPlaces.length === 0 ? (
            <S.Empty>확정된 장소가 없습니다.</S.Empty>
          ) : null}
        </S.FinalPlaceList>
      </S.FinalSchedulePanel>
      <S.FinalActions>
        <PartTripButton type="button" disabled={!isConfirmed} onClick={onStart}>
          여행 시작하기
        </PartTripButton>
        <PartTripButton type="button" $variant="secondary" onClick={onShare}>
          일정 공유하기
        </PartTripButton>
      </S.FinalActions>
      {shareError ? <S.Error role="alert">{shareError}</S.Error> : null}
      <S.FinalHint>
        일정이 마음에 들지 않나요? 이전 단계에서 수정할 수 있어요
      </S.FinalHint>
    </S.FinalConfirmBody>
  );
}
