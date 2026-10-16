import { useEffect, useMemo, useRef, useState } from "react";
import { useBlocker, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  plannerQueryKeys,
  useGeneratePlannerMutation,
  usePlannerBlocksQuery,
  type PlannerBlockDto,
  type PlannerBlockResponseDto,
} from "@/entities/planner";
import type { PlaceSearchResponseDto } from "@/entities/travel";
import { useTravelPreferencesQuery, useUpdateTravelPreferencesMutation } from "@/entities/user";
import { paths } from "@/shared/config";
import { Button, Input } from "@/shared/ui/parttrip";
import { formatDateRange, getErrorMessage } from "@/shared/utils";
import { isPositiveSafeInteger } from "@/shared/utils/number";
import { activatePlannerSession } from "../model/planner-session";
import { writePlannerCreationDraft, type PlannerCreationDraft } from "../model/planner-creation";
import { getPlannerTravelParty } from "../model/member-count";
import { getPreferenceAnswers, mobilityOf, togglePreference, type Mobility, type AvoidFood } from "../model/preference-answers";
import * as S from "./PlannerAiFlow.styles";
import { PlaceSearchDialog } from "@/widgets/place-search";

type SelectionMap = Record<string, string[]>;

const mobilityOptions: Array<{ value: Mobility | null; label: string }> = [
  { value: "WHEELCHAIR", label: "휠체어를 써요" },
  { value: "WALKING", label: "오래 걷기 어려워요" },
  { value: "STAIRS", label: "계단이 어려워요" },
  { value: null, label: "괜찮아요" },
];
const foodOptions: Array<{ value: AvoidFood | null; label: string }> = [
  { value: "SEAFOOD", label: "해산물" },
  { value: "SPICY", label: "매운 음식" },
  { value: "HARD", label: "딱딱하거나 질긴 음식" },
  { value: "MEAT", label: "고기" },
  { value: "DAIRY", label: "유제품" },
  { value: null, label: "없어요" },
];

const suggestedBlockTypes = [
  "COMPANION",
  "DEPARTURE_PLACE",
  "TRAVEL_TYPE",
  "WALKING",
  "DAILY_DENSITY",
  "FOOD_TYPE",
  "TASTE",
  "LODGING_TYPE",
  "MUST_INCLUDE",
  "EXCLUDE",
];
function toSelectionMap(blocks: PlannerBlockDto[] = []): SelectionMap {
  return blocks.reduce<SelectionMap>((result, block) => {
    result[block.type] = [...(result[block.type] ?? []), block.value];
    return result;
  }, {});
}

function getBlockValues(selections: SelectionMap): PlannerBlockDto[] {
  return Object.entries(selections).flatMap(([type, values]) =>
    values.map(value => value.trim()).filter(Boolean).map((value) => ({ type, value })),
  );
}

export function PlannerCriteriaStep({ draft }: { draft: PlannerCreationDraft }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const blocksQuery = usePlannerBlocksQuery();
  const generateMutation = useGeneratePlannerMutation();
  const preferencesQuery = useTravelPreferencesQuery();
  const updatePreferences = useUpdateTravelPreferencesMutation();
  const [mobilityAnswer, setMobility] = useState<Mobility[] | null>(null);
  const [foodsAnswer, setFoods] = useState<AvoidFood[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  useBlocker({ shouldBlockFn: () => submittingRef.current, enableBeforeUnload: () => submittingRef.current });
  const mobility = mobilityAnswer ?? mobilityOf(preferencesQuery.data);
  const foods = foodsAnswer ?? preferencesQuery.data?.avoidFoods ?? null;
  const askMobility = preferencesQuery.data != null;
  const askFoods = preferencesQuery.data != null;
  const [selections, setSelections] = useState<SelectionMap>(() =>
    toSelectionMap(draft.blocks),
  );
  const [departurePoint, setDeparturePoint] =
    useState<PlaceSearchResponseDto | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [departureMessage, setDepartureMessage] = useState("");
  const searchReturnFocusRef = useRef<HTMLButtonElement | null>(null);
  const departureActionVersion = useRef(0);
  const [message, setMessage] = useState("");
  const blocks = useMemo(() => {
    const values = getBlockValues(selections);
    if (!selections.DEPARTURE_PLACE?.length && preferencesQuery.data?.home) {
      return [...values, { type: "DEPARTURE_PLACE", value: "집 근처" }];
    }
    return values;
  }, [preferencesQuery.data?.home, selections]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const availableBlocks = (blocksQuery.data ?? []).some(block => block.type === 'DEPARTURE_PLACE') ? blocksQuery.data ?? [] : [...(blocksQuery.data ?? []), { type: 'DEPARTURE_PLACE', label: '어디에서 출발하세요?' }];
  const priorityBlocks = suggestedBlockTypes.flatMap(type => availableBlocks.filter(block => block.type === type));
  const otherBlocks = availableBlocks.filter(
    (block) => !suggestedBlockTypes.includes(block.type ?? ""),
  );

  const questions = [...priorityBlocks.map(block => block.type!), ...(askMobility ? ["mobility"] : []), ...(askFoods ? ["foods"] : []), "review"];
  const currentIndex = Math.min(questionIndex, questions.length - 1);
  const currentQuestion = questions[currentIndex];
  const activeBlock = priorityBlocks.find(block => block.type === currentQuestion);
  const isReview = currentQuestion === "review";
  const hasAnswer = currentQuestion === 'mobility' ? mobility !== null : currentQuestion === 'foods' ? foods !== null : (selections[currentQuestion]?.length ?? 0) > 0 || (currentQuestion === 'DEPARTURE_PLACE' && Boolean(preferencesQuery.data?.home));
  const questionTitle = currentQuestion === "TRAVEL_TYPE" ? "어떤 여행을 하고 싶으세요?"
    : currentQuestion === "COMPANION" ? "누구와 함께 떠나세요?"
    : currentQuestion === "mobility" ? "다니실 때 불편한 점이 있으세요?"
    : currentQuestion === "foods" ? "피하는 음식이 있으세요?"
    : isReview ? "선택한 여행 기준을 확인해 주세요" : activeBlock?.label || "여행 기준 선택";
  const nextQuestion = () => setQuestionIndex(Math.min(currentIndex + 1, questions.length - 1));
  useEffect(() => { questionRef.current?.focus(); }, [currentQuestion]);

  const setDepartureOption = (value: string) => {
    departureActionVersion.current += 1;
    setSelections((current) => ({ ...current, DEPARTURE_PLACE: [value] }));
    setDeparturePoint(null);
    setDepartureMessage("");
  };

  const selectPlace = (place: PlaceSearchResponseDto) => {
    departureActionVersion.current += 1;
    setDeparturePoint(place);
    setSelections((current) => ({
      ...current,
      DEPARTURE_PLACE: ["직접 지정"],
    }));
    setDepartureMessage("");
    setSearchOpen(false);
  };

  const selectCurrentLocation = () => {
    const actionVersion = ++departureActionVersion.current;
    setDepartureMessage("");
    if (!navigator.geolocation) {
      setDepartureMessage("이 브라우저에서는 현재 위치를 사용할 수 없어요.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (departureActionVersion.current !== actionVersion) return;
        setDeparturePoint({
          name: `선택한 출발지 (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`,
          address: "",
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setSelections((current) => ({
          ...current,
          DEPARTURE_PLACE: ["직접 지정"],
        }));
        setDepartureMessage("");
      },
      () => {
        if (departureActionVersion.current === actionVersion)
          setDepartureMessage(
            "현재 위치를 확인하지 못했어요. 위치 권한과 설정을 확인해주세요.",
          );
      },
    );
  };

  const openPlaceSearch = (trigger: HTMLButtonElement) => {
    departureActionVersion.current += 1;
    searchReturnFocusRef.current = trigger;
    setSearchOpen(true);
  };

  const selectBlockOption = (
    block: PlannerBlockResponseDto,
    value: string,
    trigger: HTMLButtonElement,
  ) => {
    const type = block.type;
    if (!type) return;
    setMessage("");
    if (type === "DEPARTURE_PLACE") {
      if (value === "직접 지정") {
        openPlaceSearch(trigger);
        return;
      }
      departureActionVersion.current += 1;
      const next = selections[type]?.includes(value) ? [] : [value];
      setSelections((current) => ({ ...current, [type]: next }));
      setDeparturePoint(null);
      setDepartureMessage("");
      return;
    }
    setSelections((current) => {
      const selected = current[type] ?? [];
      const next = block.multiple
        ? selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value]
        : suggestedBlockTypes.includes(type) ? [value]
        : selected.includes(value)
          ? []
          : [value];
      return { ...current, [type]: next };
    });
  };

  const renderBlock = (block: PlannerBlockResponseDto) => {
    const type = block.type;
    if (!type) return null;
    const isDeparture = type === "DEPARTURE_PLACE";
    const home = preferencesQuery.data?.home;
    const selectedDeparture = selections[type]?.[0];
    const departureLabel =
      departurePoint?.name ??
      (selectedDeparture === "집 근처" && home
        ? home.name
        : selectedDeparture) ??
      (home ? home.name : "선택되지 않음");
    if (type === 'MUST_INCLUDE' || type === 'EXCLUDE') return (
      <S.Block key={type}>
        <label htmlFor={`place-names-${type}`}>{block.label || (type === 'MUST_INCLUDE' ? '반드시 포함할 곳' : '제외할 곳')}</label>
        <Input id={`place-names-${type}`} value={(selections[type] ?? []).join(',')} placeholder="장소 이름을 쉼표로 구분해 적어주세요" onChange={event => {
          setSelections(current => ({ ...current, [type]: event.target.value ? event.target.value.split(',') : [] }));
        }} />
        <p>예: 경주월드, 불국사 · 안 골라도 괜찮아요.</p>
      </S.Block>
    );
    return (
      <S.Block key={type} $departure={isDeparture}>
        {type !== currentQuestion ? <h3>{block.label ?? type}</h3> : null}
        <S.Options role="group" aria-label={block.label ?? type}>
          {(isDeparture ? [] : block.options ?? []).map((value) => (
            <S.Option
              key={value}
              type="button"
              $active={Boolean(
                selections[type]?.includes(value) ||
                (isDeparture &&
                  !selectedDeparture &&
                  home &&
                  value === "집 근처"),
              )}
              aria-pressed={Boolean(
                selections[type]?.includes(value) ||
                (isDeparture &&
                  !selectedDeparture &&
                  home &&
                  value === "집 근처"),
              )}
              onClick={(event) => {
                selectBlockOption(block, value, event.currentTarget);
                if (!block.multiple && suggestedBlockTypes.includes(type) && !isDeparture) nextQuestion();
              }}
            >
              {value}
            </S.Option>
          ))}
        </S.Options>
        {isDeparture ? (
          <S.DepartureTools>
            <p aria-live="polite">출발지: <strong>{departureLabel}</strong></p>
            <div>
              <Button
                type="button"
                $variant="secondary"
                onClick={(event) => openPlaceSearch(event.currentTarget)}
              >
                다른 곳 찾기
              </Button>
              <Button
                type="button"
                $variant="secondary"
                onClick={selectCurrentLocation}
              >
                지금 있는 곳
              </Button>
              {home ? (
                <Button
                  type="button"
                  $variant="secondary"
                  onClick={() => setDepartureOption("집 근처")}
                >
                  우리 집으로
                </Button>
              ) : null}
            </div>
            {departureMessage ? (
              <S.Error role="alert">{departureMessage}</S.Error>
            ) : null}
          </S.DepartureTools>
        ) : null}
      </S.Block>
    );
  };

  const generate = async () => {
    if (submittingRef.current) return;
    setMessage("");
    const party = getPlannerTravelParty(blocks);
    if (!party) {
      const companionIndex = questions.indexOf("COMPANION");
      if (companionIndex >= 0) setQuestionIndex(companionIndex);
      setMessage("혼자 여행인지, 동행이 있는지 선택해주세요.");
      return;
    }
    const home = preferencesQuery.data?.home;
    const useHomeAsDeparture =
      selections.DEPARTURE_PLACE?.[0] === "집 근처" ||
      (!selections.DEPARTURE_PLACE?.length && home != null);
    const resolvedDeparture = departurePoint ?? (useHomeAsDeparture ? home : undefined);
    const payload = {
      ...party,
      title: `${draft.cityName} 여행`,
      regionCode: draft.regionCode,
      cityName: draft.cityName,
      startDate: draft.startDate,
      endDate: draft.endDate,
      blocks,
      ...(resolvedDeparture
        ? {
            departurePoint: {
              placeName: resolvedDeparture.name,
              latitude: resolvedDeparture.latitude,
              longitude: resolvedDeparture.longitude,
            },
          }
        : {}),
    };
    writePlannerCreationDraft({ ...draft, blocks, ...party });
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const answers = getPreferenceAnswers(preferencesQuery.data, mobilityAnswer, foodsAnswer);
      if (answers) {
        // 편의 저장 실패가 일정 생성을 막지 않도록 한다.
        await updatePreferences.mutateAsync(answers).catch(() => {});
      }
      const schedule = await generateMutation.mutateAsync(payload);
      if (!isPositiveSafeInteger(schedule.plannerId))
        throw new Error("plannerId is missing");
      activatePlannerSession(schedule.plannerId);
      queryClient.setQueryData(
        plannerQueryKeys.schedule(schedule.plannerId),
        schedule,
      );
      submittingRef.current = false;
      void navigate({ to: '/planner/$plannerId', params: { plannerId: String(schedule.plannerId) } });
    } catch (error) {
      setMessage(getErrorMessage(error, "AI 일정을 만들지 못했어요. 도시와 날짜를 확인하고 다시 시도해주세요."));
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <S.FlowLayout>
      <S.TripSummary>
        <h2>선택한 여행</h2>
        <dl>
          <div>
            <dt>여행지</dt>
            <dd>{draft.cityName}</dd>
          </div>
          <div>
            <dt>기간</dt>
            <dd>{formatDateRange(draft.startDate, draft.endDate)}</dd>
          </div>
          <div>
            <dt>선택한 기준</dt>
            <dd>
              {blocks.length
                ? blocks.map((block) => block.value).join(" · ")
                : "기본 조건으로 만들어요"}
            </dd>
          </div>
        </dl>
      </S.TripSummary>
      <S.QuestionCard data-question={currentQuestion}>
        {blocksQuery.isLoading || preferencesQuery.isLoading ? (
          <p role="status">여행 기준을 불러오는 중이에요.</p>
        ) : blocksQuery.isError ? (
          <S.Error role="alert">
            여행 기준을 불러오지 못했어요. 새로고침 후 다시 시도해주세요.
          </S.Error>
        ) : (
          <>
            <S.QuestionProgress aria-label={`여행 기준 ${currentIndex + 1} / ${questions.length}단계`}>
              <span>{currentIndex + 1} / {questions.length}</span>
              <progress aria-label="여행 기준 진행률" max={questions.length} value={currentIndex + 1} />
            </S.QuestionProgress>
            <h2 ref={questionRef} tabIndex={-1}>{questionTitle}</h2>
            <S.QuestionHint>{currentQuestion !== 'COMPANION' && !isReview ? '안 골라도 괜찮아요. ' : ''}{isReview ? "필요한 추가 조건을 정하고 AI 일정을 만들어 보세요." : activeBlock && !activeBlock.multiple ? "하나를 선택하면 다음 질문으로 이동해요." : "여러 개 선택할 수 있어요. 선택을 마치면 다음을 눌러주세요."}</S.QuestionHint>
            <S.QuestionFields disabled={submitting}>
            <S.BlockList>
              {currentQuestion === "mobility" ? <S.PreferenceQuestion>
                <p>AI가 장소를 고를 때 참고해요. {mobilityOf(preferencesQuery.data) === null ? "다음 계획부터는 고른 대로 미리 채워둘게요." : "지난번에 고른 대로 채워뒀어요. 바꾸면 다음 계획에도 적용돼요."}</p>
                <S.Options role="group" aria-label="다니실 때 불편한 점이 있으세요?">
                  {mobilityOptions.map(({ value, label }) => {
                    const active = value === null ? mobility?.length === 0 : mobility?.includes(value) === true;
                    return <S.Option key={label} type="button" $active={active} aria-pressed={active}
                      disabled={submitting} onClick={() => setMobility(current => togglePreference(current ?? mobilityOf(preferencesQuery.data), value))}>{label}</S.Option>;
                  })}
                </S.Options>
              </S.PreferenceQuestion> : null}
              {currentQuestion === "foods" ? <S.PreferenceQuestion>
                <p>AI가 맛집을 고를 때 빼요. 식당 종류만 참고해요. 알레르기가 있으면 식당에 꼭 확인하세요. {preferencesQuery.data?.avoidFoods == null ? "다음 계획부터는 고른 대로 미리 채워둘게요." : "지난번에 고른 대로 채워뒀어요. 바꾸면 다음 계획에도 적용돼요."}</p>
                <S.Options role="group" aria-label="피하는 음식이 있으세요?">
                  {foodOptions.map(({ value, label }) => {
                    const active = value === null ? foods?.length === 0 : foods?.includes(value) === true;
                    return <S.Option key={label} type="button" $active={active} aria-pressed={active}
                      disabled={submitting} onClick={() => setFoods(current => togglePreference(current ?? preferencesQuery.data?.avoidFoods ?? null, value))}>{label}</S.Option>;
                  })}
                </S.Options>
              </S.PreferenceQuestion> : null}
              {priorityBlocks.filter(block => block.type === currentQuestion).map(renderBlock)}
            </S.BlockList>
            {isReview && otherBlocks.length ? (
              <S.MoreBlocks>
                <summary>
                  <span>더 자세히 정하기 ({otherBlocks.length}가지)</span>
                  <span>간단히 보기</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                </summary>
                <S.BlockList>{otherBlocks.map(renderBlock)}</S.BlockList>
              </S.MoreBlocks>
            ) : null}
            </S.QuestionFields>
            {isReview ? <S.ReviewCopy>선택한 기준은 위의 여행 요약에서 확인할 수 있어요. 이전으로 돌아가 수정할 수 있어요.</S.ReviewCopy> : null}
            {message ? <S.Error role="alert">{message}</S.Error> : null}
            <S.ButtonRow>
              <Button
                type="button"
                $variant="secondary"
                disabled={submitting}
                onClick={() => currentIndex > 0 ? setQuestionIndex(currentIndex - 1) : void navigate({ to: paths.plannerDestination })}
              >
                이전
              </Button>
              <Button
                type="button"
                disabled={
                  submitting ||
                  blocksQuery.isLoading ||
                  preferencesQuery.isLoading
                }
                onClick={() => isReview ? void generate() : nextQuestion()}
              >
                {submitting
                  ? "AI가 일정을 만드는 중…"
                  : isReview ? "AI로 일정 만들기" : !hasAnswer && currentQuestion !== "COMPANION" ? "건너뛰기" : "다음"}
              </Button>
              {!isReview ? <Button type="button" $variant="secondary" disabled={submitting || blocksQuery.isLoading || preferencesQuery.isLoading} onClick={() => setQuestionIndex(questions.indexOf('review'))}>나머지는 기본으로 만들기</Button> : null}
            </S.ButtonRow>
            {submitting ? (
              <p role="status" aria-live="polite">
                선택한 여행지와 조건으로 일정을 만들고 있어요. 잠시
                기다려주세요.
              </p>
            ) : null}
          </>
        )}
      </S.QuestionCard>

      <PlaceSearchDialog
        isOpen={searchOpen}
        returnFocusRef={searchReturnFocusRef}
        title="출발지 찾기"
        onClose={() => setSearchOpen(false)}
        onSelect={selectPlace}
      />
    </S.FlowLayout>
  );
}
