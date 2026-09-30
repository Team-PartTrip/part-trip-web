import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { usePlannerDetailQuery } from "@/entities/planner";
import { ACTIVE_PLANNER_ID_KEY, PLANNER_CONFIRMED_KEY, paths } from "@/shared/config";
import { readSessionId, readSessionValue } from "@/shared/libs/session-storage";
import { Button, Input } from "@/shared/ui/parttrip";
import { formatDateRange, normalizeStatus } from "@/shared/utils";
import { clearPlannerCreationDraft, type PlannerCreationDraft } from "../model/planner-creation";
import * as S from "./PlannerAiFlow.styles";

export function PlannerInviteStep({
  currentDraft,
}: {
  currentDraft?: PlannerCreationDraft;
}) {
  const navigate = useNavigate();
  const plannerId = readSessionId(ACTIVE_PLANNER_ID_KEY);
  const detailQuery = usePlannerDetailQuery(plannerId);
  const [inviteFeedback, setInviteFeedback] = useState("");
  const isConfirmed =
    ["CONFIRMED", "TRAVELING", "COMPLETED"].includes(
      normalizeStatus(detailQuery.data?.status),
    ) || readSessionValue(`${PLANNER_CONFIRMED_KEY}:${plannerId}`) === "true";

  const copyInviteLink = async () => {
    const link = detailQuery.data?.inviteLink;
    if (!link) {
      setInviteFeedback("서버에서 초대 링크를 불러오지 못했어요.");
      return;
    }
    try {
      await navigator.clipboard.writeText(link);
      setInviteFeedback("초대 링크를 복사했어요.");
    } catch {
      setInviteFeedback("링크를 선택해 복사해주세요.");
    }
  };

  return (
    <S.Grid>
      <S.Card>
        <h2>초대 링크로 함께 일정 보기</h2>
        <p>
          링크를 카카오톡이나 문자로 보내 가족을 초대할 수 있어요. 혼자 여행이면
          초대를 건너뛰어도 됩니다.
        </p>
        {detailQuery.isLoading ? (
          <p role="status">초대 링크를 불러오는 중이에요.</p>
        ) : (
          <S.LinkBox>
            <Input
              aria-label="여행 초대 링크"
              readOnly
              value={detailQuery.data?.inviteLink ?? ""}
              placeholder="초대 링크가 아직 없어요"
            />
            <Button
              type="button"
              disabled={!detailQuery.data?.inviteLink}
              onClick={() => void copyInviteLink()}
            >
              링크 복사
            </Button>
          </S.LinkBox>
        )}
        {inviteFeedback ? <p role="status">{inviteFeedback}</p> : null}
        <S.ButtonRow>
          <Button
            type="button"
            $variant="secondary"
            onClick={() => {
              clearPlannerCreationDraft();
              void navigate({ to: paths.planner });
            }}
          >
            완료
          </Button>
        </S.ButtonRow>
      </S.Card>
      <S.Summary>
        <h2>확정한 일정</h2>
        <dl>
          <div>
            <dt>여행지</dt>
            <dd>
              {detailQuery.data?.cityName ?? currentDraft?.cityName ?? "여행지"}
            </dd>
          </div>
          <div>
            <dt>기간</dt>
            <dd>
              {formatDateRange(
                detailQuery.data?.startDate ?? currentDraft?.startDate,
                detailQuery.data?.endDate ?? currentDraft?.endDate,
              )}
            </dd>
          </div>
          <div>
            <dt>상태</dt>
            <dd>{isConfirmed ? "확정됨" : "일정 확정 전"}</dd>
          </div>
        </dl>
      </S.Summary>
    </S.Grid>
  );
}
