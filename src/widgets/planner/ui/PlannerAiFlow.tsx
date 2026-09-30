import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { paths } from "@/shared/config";
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
    "국내 도시 & 기간",
    "여행 도시와 날짜를 정해주세요. 최대 14일까지 계획할 수 있어요.",
  ],
  criteria: [
    "여행 기준을 선택해 주세요",
    "선택한 조건은 AI 일정 생성에 사용됩니다. 도시와 날짜는 앞 단계에서 정한 값이에요.",
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

export function PlannerAiFlow({ step }: { step: Step }) {
  const navigate = useNavigate();
  const [currentDraft] = useState(readPlannerCreationDraft);
  const [title, subtitle] = stepCopy[step];
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
      stepContent = <PlannerScheduleStep currentDraft={currentDraft} />;
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
          <S.Steps aria-label="여행 플래너 진행 단계">
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
          </S.Steps>
        </S.Header>
        {stepContent}
      </S.Page>
    </AppShell>
  );
}
