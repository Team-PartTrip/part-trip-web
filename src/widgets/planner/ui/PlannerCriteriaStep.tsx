import { useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
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
import { Button } from "@/shared/ui/parttrip";
import { formatDateRange } from "@/shared/utils";
import { isPositiveSafeInteger } from "@/shared/utils/number";
import { activatePlannerSession } from "../model/planner-session";
import { writePlannerCreationDraft, type PlannerCreationDraft } from "../model/planner-creation";
import { getPlannerTravelParty } from "../model/member-count";
import { getPreferenceAnswers, togglePreference, type Mobility, type AvoidFood } from "../model/preference-answers";
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
  "DEPARTURE_PLACE",
  "TRAVEL_TYPE",
  "COMPANION",
  "WALK_PREFERENCE",
  "DAILY_DENSITY",
  "FOOD_TYPE",
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
    values.map((value) => ({ type, value })),
  );
}

export function PlannerCriteriaStep({ draft }: { draft: PlannerCreationDraft }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const blocksQuery = usePlannerBlocksQuery();
  const generateMutation = useGeneratePlannerMutation();
  const preferencesQuery = useTravelPreferencesQuery();
  const updatePreferences = useUpdateTravelPreferencesMutation();
  const [mobility, setMobility] = useState<Mobility[] | null>(null);
  const [foods, setFoods] = useState<AvoidFood[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const askMobility = preferencesQuery.data != null &&
    preferencesQuery.data.usesWheelchair == null && preferencesQuery.data.limitedWalking == null;
  const askFoods = preferencesQuery.data != null && preferencesQuery.data.avoidFoods == null;
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
  const availableBlocks = blocksQuery.data ?? [];
  const priorityBlocks = availableBlocks.filter((block) =>
    suggestedBlockTypes.includes(block.type ?? ""),
  );
  const otherBlocks = availableBlocks.filter(
    (block) => !suggestedBlockTypes.includes(block.type ?? ""),
  );

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
          name: "지금 있는 곳",
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
    return (
      <S.Block key={type}>
        <h3>{block.label ?? type}</h3>
        <S.Options role="group" aria-label={block.label ?? type}>
          {(block.options ?? []).map((value) => (
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
              onClick={(event) =>
                selectBlockOption(block, value, event.currentTarget)
              }
            >
              {value}
            </S.Option>
          ))}
        </S.Options>
        {isDeparture ? (
          <S.DepartureTools>
            <p aria-live="polite">출발지: {departureLabel}</p>
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
      const answers = getPreferenceAnswers(preferencesQuery.data, mobility, foods);
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
      void navigate({ to: paths.plannerProgress });
    } catch {
      setMessage(
        "AI 일정을 만들지 못했어요. 도시와 날짜를 확인하고 다시 시도해주세요.",
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <S.Grid>
      <S.Card>
        {blocksQuery.isLoading ? (
          <p role="status">여행 기준을 불러오는 중이에요.</p>
        ) : blocksQuery.isError ? (
          <S.Error role="alert">
            여행 기준을 불러오지 못했어요. 새로고침 후 다시 시도해주세요.
          </S.Error>
        ) : (
          <>
            <S.BlockList>
              {priorityBlocks.filter(block => block.type === "DEPARTURE_PLACE").map(renderBlock)}
              {askMobility ? <S.PreferenceQuestion>
                <h3>다니실 때 불편한 점이 있으세요?</h3>
                <p>AI가 장소를 고를 때 참고해요. 여행 편의 설정에서 언제든 바꿀 수 있어요.</p>
                <S.Options role="group" aria-label="다니실 때 불편한 점이 있으세요?">
                  {mobilityOptions.map(({ value, label }) => {
                    const active = value === null ? mobility?.length === 0 : mobility?.includes(value) === true;
                    return <S.Option key={label} type="button" $active={active} aria-pressed={active}
                      disabled={submitting} onClick={() => setMobility(current => togglePreference(current, value))}>{label}</S.Option>;
                  })}
                </S.Options>
              </S.PreferenceQuestion> : null}
              {askFoods ? <S.PreferenceQuestion>
                <h3>피하는 음식이 있으세요?</h3>
                <p>AI가 맛집을 고를 때 빼요. 식당 종류만 참고해요. 알레르기가 있으면 식당에 꼭 확인하세요. 여행 편의 설정에서 언제든 바꿀 수 있어요.</p>
                <S.Options role="group" aria-label="피하는 음식이 있으세요?">
                  {foodOptions.map(({ value, label }) => {
                    const active = value === null ? foods?.length === 0 : foods?.includes(value) === true;
                    return <S.Option key={label} type="button" $active={active} aria-pressed={active}
                      disabled={submitting} onClick={() => setFoods(current => togglePreference(current, value))}>{label}</S.Option>;
                  })}
                </S.Options>
              </S.PreferenceQuestion> : null}
              {priorityBlocks.filter(block => block.type !== "DEPARTURE_PLACE").map(renderBlock)}
            </S.BlockList>
            {otherBlocks.length ? (
              <S.MoreBlocks>
                <summary>다른 여행 기준 더 보기 ({otherBlocks.length})</summary>
                <S.BlockList>{otherBlocks.map(renderBlock)}</S.BlockList>
              </S.MoreBlocks>
            ) : null}
            {message ? <S.Error role="alert">{message}</S.Error> : null}
            <S.ButtonRow>
              <Button
                type="button"
                $variant="secondary"
                disabled={submitting}
                onClick={() => void navigate({ to: paths.plannerDestination })}
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
                onClick={() => void generate()}
              >
                {submitting
                  ? "AI가 일정을 만드는 중…"
                  : "AI로 일정 만들기"}
              </Button>
            </S.ButtonRow>
            {submitting ? (
              <p role="status" aria-live="polite">
                선택한 여행지와 조건으로 일정을 만들고 있어요. 잠시
                기다려주세요.
              </p>
            ) : null}
          </>
        )}
      </S.Card>
      <S.Summary>
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
      </S.Summary>
      <PlaceSearchDialog
        isOpen={searchOpen}
        returnFocusRef={searchReturnFocusRef}
        title="출발지 찾기"
        onClose={() => setSearchOpen(false)}
        onSelect={selectPlace}
      />
    </S.Grid>
  );
}
