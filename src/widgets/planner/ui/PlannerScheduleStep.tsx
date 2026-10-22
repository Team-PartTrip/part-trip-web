import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useBlocker, useNavigate } from "@tanstack/react-router";
import {
  useConfirmPlannerMutation,
  usePlannerDetailQuery,
  usePlannerScheduleQuery,
  usePlannerSurveyQuery,
  usePlannerWarningsQuery,
  useRegeneratePlannerMutation,
} from "@/entities/planner";
import { ACTIVE_PLANNER_ID_KEY, PLANNER_CONFIRMED_KEY, paths } from "@/shared/config";
import { readSessionId, readSessionValue, writeSessionValue } from "@/shared/libs/session-storage";
import { Button } from "@/shared/ui/parttrip";
import { getErrorMessage, normalizeStatus } from "@/shared/utils";
import { isPositiveSafeInteger } from "@/shared/utils/number";
import { clearPlannerCreationDraft, type PlannerCreationDraft } from "../model/planner-creation";
import { withRouteTimeout } from "../model/route-timeout";
import { canManagePlanner } from "../model/planner-role";
import * as S from "./PlannerAiFlow.styles";
import { PlannerScheduleEditor } from "./PlannerScheduleEditor";

import { usePlannerLiveMembers, isPlannerFinished } from '../model/usePlannerLiveMembers';
import { PlannerMemberManagement } from './PlannerMemberManagement';
import { plannerMatchesTab } from '../model/status';

export function PlannerScheduleStep({
  currentDraft,
  plannerId: requestedPlannerId,
}: {
  currentDraft?: PlannerCreationDraft;
  plannerId?: number;
}) {
  const navigate = useNavigate();
  const plannerId = requestedPlannerId ?? readSessionId(ACTIVE_PLANNER_ID_KEY);
  const scheduleQuery = usePlannerScheduleQuery(plannerId);
  const warningsQuery = usePlannerWarningsQuery(plannerId);
  const regenerateMutation = useRegeneratePlannerMutation();
  const regenerating = useRef(false);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const surveyQuery = usePlannerSurveyQuery(plannerId, surveyOpen);
  const [coolingDown, setCoolingDown] = useState(false);
  const [hasSavedEdits, setHasSavedEdits] = useState(false);
  useBlocker({ shouldBlockFn: () => regenerating.current, enableBeforeUnload: () => regenerating.current });
  useEffect(() => {
    if (!coolingDown) return;
    const timer = window.setTimeout(() => setCoolingDown(false), 30000);
    return () => window.clearTimeout(timer);
  }, [coolingDown]);
  const [timedOutPlannerId, setTimedOutPlannerId] = useState<number>();
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
      if (routePolls.current.attempts >= 20) setTimedOutPlannerId(plannerId);
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

  const visibleSchedule = useMemo(() => scheduleQuery.data
    ? withRouteTimeout(scheduleQuery.data, timedOutPlannerId === plannerId && timedOutPlannerId !== undefined)
    : undefined, [scheduleQuery.data, timedOutPlannerId, plannerId]);

  const detailQuery = usePlannerDetailQuery(plannerId);
  const membersQuery = usePlannerLiveMembers(plannerId, detailQuery.data);
  const finished = isPlannerFinished(detailQuery.data?.status);
  const confirmMutation = useConfirmPlannerMutation();
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const serverConfirmed = ["CONFIRMED", "TRAVELING", "COMPLETED", "DONE"].includes(
    normalizeStatus(detailQuery.data?.status),
  );
  const isConfirmed =
    confirmed ||
    serverConfirmed ||
    readSessionValue(`${PLANNER_CONFIRMED_KEY}:${plannerId}`) === "true";
  const canManageCurrentPlanner = canManagePlanner(detailQuery.data?.role);
  const isSolo = detailQuery.data?.memberCount != null ? detailQuery.data.memberCount === 1 : currentDraft?.isSolo;
  const canInvite = plannerMatchesTab(detailQuery.data?.status, detailQuery.data?.startDate, detailQuery.data?.endDate, 'planned');
  const warnings = warningsQuery.data ?? scheduleQuery.data?.warnings ?? [];

  const regenerate = async () => {
    if (!canManageCurrentPlanner || isConfirmed || isEditingSchedule || hasSavedEdits || coolingDown || confirmMutation.isPending || regenerating.current) return;
    if (!window.confirm('저장된 여행 기준과 현재 멤버들의 편의 설정으로 AI 일정을 다시 만들까요? 현재 추천 일정은 새 일정으로 바뀌어요.')) return;
    regenerating.current = true;
    setMessage('');
    setMessageIsError(false);
    try {
      await regenerateMutation.mutateAsync(plannerId);
      setCoolingDown(true);
      setTimedOutPlannerId(undefined);
      routePolls.current = { plannerId, attempts: 0 };
      setMessage('현재 멤버들의 편의 설정을 반영해 일정을 다시 만들었어요.');
    } catch (error) {
      setMessageIsError(true);
      setMessage(getErrorMessage(error, '일정을 다시 만들지 못했어요. 잠시 후 다시 시도해주세요.'));
    } finally {
      regenerating.current = false;
    }
  };

  const confirmSchedule = async () => {
    if (
      !canManageCurrentPlanner ||
      !isPositiveSafeInteger(plannerId) ||
      !scheduleQuery.data
    )
      return;
    if (isEditingSchedule || confirmMutation.isPending || isConfirmed || regenerating.current) return;
    setMessage("");
    setMessageIsError(false);
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
    } catch (error) {
      setMessageIsError(true);
      setMessage(getErrorMessage(error, "일정을 확정하지 못했어요. 잠시 후 다시 시도해주세요."));
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
            disabled={scheduleQuery.isFetching || detailQuery.isFetching}
            onClick={() => { void scheduleQuery.refetch(); void detailQuery.refetch(); }}
          >
            다시 시도
          </Button>
        </S.ButtonRow>
      </>
    );
  } else {
    let action: ReactNode = null;
    if (isConfirmed && canManageCurrentPlanner && !isSolo && !finished && canInvite) {
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
            isEditingSchedule || regenerateMutation.isPending || confirmMutation.isPending || !scheduleQuery.data?.days?.length
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
            플래너 권한을 확인하지 못해 일정은 읽기 전용으로 표시돼요.
            <Button type="button" disabled={detailQuery.isFetching} onClick={() => void detailQuery.refetch()}>다시 시도</Button>
          </S.Error>
        ) : null}
        {visibleSchedule ? (
          <PlannerScheduleEditor
            plannerId={plannerId}
            cityName={detailQuery.data?.cityName ?? visibleSchedule.cityName}
            schedule={visibleSchedule}
            canManage={canManageCurrentPlanner && !confirmMutation.isPending && !regenerateMutation.isPending}
            isConfirmed={isConfirmed}
            onEditingChange={setIsEditingSchedule}
            onSaved={() => setHasSavedEdits(true)}
          />
        ) : (
          <p role="alert">일정 응답에 표시할 내용이 없습니다.</p>
        )}
        {warnings.length ? <S.RouteNotice as="section" role="status">
          <strong>여행 전에 확인해주세요</strong>
          <ul>{warnings.map((warning, index) => <li key={`${warning.tourPlaceId}-${index}`}>{warning.message}</li>)}</ul>
        </S.RouteNotice> : null}
        <details onToggle={event => setSurveyOpen(event.currentTarget.open)}>
          <summary>일정을 만들 때 선택한 여행 기준</summary>
          {surveyOpen ? surveyQuery.isLoading ? <p role="status">여행 기준을 불러오는 중이에요.</p>
            : surveyQuery.isError ? <p role="alert">저장된 여행 기준을 불러오지 못했어요. <Button type="button" disabled={surveyQuery.isFetching} onClick={() => void surveyQuery.refetch()}>다시 시도</Button></p>
              : surveyQuery.data?.blocks.length ? <ul>{surveyQuery.data.blocks.map((block, index) => <li key={`${block.type}-${index}`}>{block.placeName || block.value}</li>)}</ul>
                : <p>저장된 여행 기준이 없어요.</p> : null}
        </details>
        {!isConfirmed && canManageCurrentPlanner ? <>
          <p>저장된 여행 기준과 현재 멤버들의 편의 설정으로 다시 만들 수 있어요. 직접 수정해 저장한 일정은 다시 만들 수 없어요.</p>
          <S.ButtonRow><Button type="button" $variant="secondary" disabled={isEditingSchedule || hasSavedEdits || coolingDown || confirmMutation.isPending || regenerateMutation.isPending || !scheduleQuery.data} onClick={() => void regenerate()}>
            {regenerateMutation.isPending ? 'AI가 다시 만드는 중…' : coolingDown ? '30초 후 다시 생성 가능' : 'AI 일정 다시 만들기'}
          </Button></S.ButtonRow>
          {regenerateMutation.isPending ? <p role="status">일정을 다시 만들고 있어요. 완료될 때까지 기다려주세요.</p> : null}
        </> : null}
        {timedOutPlannerId === plannerId && hasCalculatingRoute ? <Button type="button" $variant="secondary" disabled={isFetching} onClick={() => {
          routePolls.current = { plannerId, attempts: 0 };
          setTimedOutPlannerId(undefined);
          void refetch();
        }}>경로 다시 불러오기</Button> : null}
        <PlannerMemberManagement plannerId={plannerId} detail={detailQuery.data} members={membersQuery.data ?? []} />
        {message ? messageIsError ? <S.Error role="alert">{message}</S.Error> : <p role="status">{message}</p> : null}
        {isEditingSchedule ? <p role="status">일정 편집을 저장하거나 취소한 뒤 확정해주세요.</p> : null}
        {action ? <S.ButtonRow>{action}</S.ButtonRow> : null}
      </>
    );
  }

  return <S.Card>{content}</S.Card>;
}
