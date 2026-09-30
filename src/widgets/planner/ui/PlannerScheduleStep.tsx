import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  useConfirmPlannerMutation,
  usePlannerDetailQuery,
  usePlannerScheduleQuery,
} from "@/entities/planner";
import { ACTIVE_PLANNER_ID_KEY, PLANNER_CONFIRMED_KEY, paths } from "@/shared/config";
import { readSessionId, readSessionValue, writeSessionValue } from "@/shared/libs/session-storage";
import { Button } from "@/shared/ui/parttrip";
import { normalizeStatus } from "@/shared/utils";
import { isPositiveSafeInteger } from "@/shared/utils/number";
import { clearPlannerCreationDraft, type PlannerCreationDraft } from "../model/planner-creation";
import { canManagePlanner } from "../model/planner-role";
import * as S from "./PlannerAiFlow.styles";
import { PlannerScheduleEditor } from "./PlannerScheduleEditor";

export function PlannerScheduleStep({
  currentDraft,
}: {
  currentDraft?: PlannerCreationDraft;
}) {
  const navigate = useNavigate();
  const plannerId = readSessionId(ACTIVE_PLANNER_ID_KEY);
  const scheduleQuery = usePlannerScheduleQuery(plannerId);
  const routePolls = useRef({ plannerId, attempts: 0 });
  const { dataUpdatedAt, errorUpdatedAt, isFetching, refetch } = scheduleQuery;

  const hasCalculatingRoute =
    scheduleQuery.data?.days?.some((day) =>
      day.slots?.some((slot) => slot.routeStatus === "CALCULATING"),
    ) ?? false;

  useEffect(() => {
    if (routePolls.current.plannerId !== plannerId)
      routePolls.current = { plannerId, attempts: 0 };
    if (!hasCalculatingRoute) {
      routePolls.current.attempts = 0;
      return;
    }
    if (isFetching || routePolls.current.attempts >= 20)
      return;

    const timeout = window.setTimeout(() => {
      routePolls.current.attempts += 1;
      void refetch();
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [
    dataUpdatedAt,
    errorUpdatedAt,
    hasCalculatingRoute,
    isFetching,
    plannerId,
    refetch,
  ]);

  const detailQuery = usePlannerDetailQuery(plannerId);
  const confirmMutation = useConfirmPlannerMutation();
  const [message, setMessage] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const serverConfirmed = ["CONFIRMED", "TRAVELING", "COMPLETED"].includes(
    normalizeStatus(detailQuery.data?.status),
  );
  const isConfirmed =
    confirmed ||
    serverConfirmed ||
    readSessionValue(`${PLANNER_CONFIRMED_KEY}:${plannerId}`) === "true";
  const canManageCurrentPlanner = canManagePlanner(detailQuery.data?.role);
  const isSolo = currentDraft?.isSolo || detailQuery.data?.memberCount === 1;

  const confirmSchedule = async () => {
    if (
      !canManageCurrentPlanner ||
      !isPositiveSafeInteger(plannerId) ||
      !scheduleQuery.data
    )
      return;
    if (isEditingSchedule || confirmMutation.isPending || isConfirmed) return;
    setMessage("");
    try {
      await confirmMutation.mutateAsync(plannerId);
      setConfirmed(true);
      writeSessionValue(`${PLANNER_CONFIRMED_KEY}:${plannerId}`, "true");
      if (isSolo) {
        clearPlannerCreationDraft();
        void navigate({ to: paths.planner });
      } else {
        void navigate({ to: paths.plannerInvite });
      }
    } catch {
      setMessage("일정을 확정하지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  let content: ReactNode;
  if (!isPositiveSafeInteger(plannerId)) {
    content = (
      <p role="alert">
        확인할 일정이 없어요. 플래너 목록에서 여행을 선택해주세요.
      </p>
    );
  } else if (scheduleQuery.isLoading || detailQuery.isLoading) {
    content = (
      <p role="status" aria-busy="true">
        AI 일정을 불러오는 중이에요.
      </p>
    );
  } else if (scheduleQuery.isError && !scheduleQuery.data) {
    content = (
      <>
        <S.Error role="alert">일정을 불러오지 못했어요.</S.Error>
        <S.ButtonRow>
          <Button
            type="button"
            $variant="secondary"
            onClick={() => void scheduleQuery.refetch()}
          >
            다시 시도
          </Button>
        </S.ButtonRow>
      </>
    );
  } else {
    let action: ReactNode = null;
    if (isConfirmed && canManageCurrentPlanner && !isSolo) {
      action = (
        <Button
          type="button"
          onClick={() => void navigate({ to: paths.plannerInvite })}
        >
          초대 단계로
        </Button>
      );
    } else if (!isConfirmed && canManageCurrentPlanner) {
      action = (
        <Button
          type="button"
          disabled={
            isEditingSchedule || confirmMutation.isPending || !scheduleQuery.data?.days?.length
          }
          onClick={() => void confirmSchedule()}
        >
          {confirmMutation.isPending ? "확정 중…" : "일정 확정"}
        </Button>
      );
    } else if (!isConfirmed && !canManageCurrentPlanner) {
      action = (
        <p role="status">리더가 일정을 확정하면 초대 단계가 열립니다.</p>
      );
    }

    content = (
      <>
        {detailQuery.isError ? (
          <S.Error role="alert">
            플래너 권한을 확인하지 못해 일정은 읽기 전용으로 표시됩니다.
          </S.Error>
        ) : null}
        {scheduleQuery.data ? (
          <PlannerScheduleEditor
            plannerId={plannerId}
            cityName={detailQuery.data?.cityName ?? scheduleQuery.data.cityName}
            schedule={scheduleQuery.data}
            canManage={canManageCurrentPlanner && !confirmMutation.isPending}
            isConfirmed={isConfirmed}
            onEditingChange={setIsEditingSchedule}
          />
        ) : (
          <p role="alert">일정 응답에 표시할 내용이 없습니다.</p>
        )}
        {message ? <S.Error role="alert">{message}</S.Error> : null}
        {isEditingSchedule ? <p role="status">일정 편집을 저장하거나 취소한 뒤 확정해주세요.</p> : null}
        {action ? <S.ButtonRow>{action}</S.ButtonRow> : null}
      </>
    );
  }

  return <S.Card>{content}</S.Card>;
}
