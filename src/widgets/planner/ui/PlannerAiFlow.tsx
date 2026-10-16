import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { usePlannerDetailQuery } from '@/entities/planner';
import { isPositiveSafeInteger, normalizeStatus } from '@/shared/utils';
import { readSessionId } from '@/shared/libs/session-storage';
import { activatePlannerSession } from '../model/planner-session';
import { ACTIVE_PLANNER_ID_KEY, paths } from "@/shared/config";
import { AppShell } from "@/widgets/app-shell";
import { readPlannerCreationDraft } from "../model/planner-creation";
import * as S from "./PlannerAiFlow.styles";
import { PlannerCriteriaStep } from "./PlannerCriteriaStep";
import { PlannerDestinationStep } from "./PlannerDestinationStep";
import { PlannerInviteStep } from "./PlannerInviteStep";
import { PlannerScheduleStep } from "./PlannerScheduleStep";

type Step = "destination" | "criteria" | "schedule" | "invite";

const stepIndex: Record<Step, number> = {
  destination: 1,
  criteria: 2,
  schedule: 3,
  invite: 4,
};
const stepLabels = ["여행지·기간", "여행 기준", "AI 일정", "초대"];
const stepCopy: Record<Step, [string, string]> = {
  destination: [
    "국내 도시 · 기간",
    "여행 도시와 날짜를 정해주세요. 최대 14일까지 계획할 수 있어요.",
  ],
  criteria: [
    "여행 기준을 선택해 주세요",
    "나에게 맞는 여행 기준을 하나씩 선택해 주세요.",
  ],
  schedule: [
    "AI 일정 초안",
    "날짜별 추천 장소를 확인하고 여행 일정을 확정해주세요.",
  ],
  invite: [
    "함께할 사람 초대",
    "초대 링크를 가족에게 보내면 같은 일정을 볼 수 있어요.",
  ],
};

export function PlannerAiFlow({ step, plannerId }: { step: Step; plannerId?: number }) {
  const navigate = useNavigate();
  const [currentDraft] = useState(readPlannerCreationDraft);
  const activeId = plannerId ?? readSessionId(ACTIVE_PLANNER_ID_KEY);
  const { data: detail } = usePlannerDetailQuery(activeId ?? 0, step === 'schedule' && isPositiveSafeInteger(activeId));
  const isConfirmed = ['CONFIRMED', 'TRAVELING', 'COMPLETED', 'DONE'].includes(normalizeStatus(detail?.status));
  const [title, subtitle] = step === 'schedule' && isConfirmed
    ? [detail?.title || `${detail?.cityName || '여행'} 일정`, '확정된 일정']
    : stepCopy[step];
  useEffect(() => {
    if (step !== 'schedule' || !isPositiveSafeInteger(activeId)) return;
    activatePlannerSession(activeId);
    if (plannerId == null) void navigate({ to: '/planner/$plannerId', params: { plannerId: String(activeId) }, replace: true });
  }, [activeId, navigate, plannerId, step]);
  let stepContent: ReactNode;

  useEffect(() => {
    if (step === "criteria" && !currentDraft)
      void navigate({ to: paths.plannerDestination, replace: true });
  }, [currentDraft, navigate, step]);

  switch (step) {
    case "destination":
      stepContent = <PlannerDestinationStep initialDraft={currentDraft} />;
      break;
    case "criteria":
      stepContent = currentDraft ? (
        <PlannerCriteriaStep draft={currentDraft} />
      ) : (
        <S.Card role="status">
          <p>여행 정보를 확인하는 중이에요.</p>
        </S.Card>
      );
      break;
    case "schedule":
      stepContent = <PlannerScheduleStep key={activeId ?? "missing"} currentDraft={currentDraft} plannerId={plannerId} />;
      break;
    case "invite":
      stepContent = <PlannerInviteStep currentDraft={currentDraft} />;
      break;
  }

  return (
    <AppShell>
      <S.Page>
        <S.Header>
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          {!(step === 'schedule' && isConfirmed) ? <S.Steps aria-label="여행 플래너 진행 단계">
            {stepLabels.map((label, index) => (
              <S.Step
                key={label}
                $active={stepIndex[step] === index + 1}
                aria-current={
                  stepIndex[step] === index + 1 ? "step" : undefined
                }
              >
                {index + 1} {label}
              </S.Step>
            ))}
          </S.Steps> : null}
        </S.Header>
        {stepContent}
      </S.Page>
    </AppShell>
  );
}
