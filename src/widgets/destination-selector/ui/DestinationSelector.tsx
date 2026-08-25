import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DestinationBackIcon, DestinationSearchIcon } from "@/shared/assets";
import {
  deleteRecentSearch,
  getCountries,
  getDday,
  getPopularPlaces,
  getRecentSearches,
  changeTravelCountry,
  saveRecentSearch,
  saveTravelPlan,
  type Destination,
} from "@/entities/travel/api";
import { getProfile } from "@/entities/user/api";
import {
  destinationBangkokUrl,
  destinationDaNangUrl,
  destinationSingaporeUrl,
  destinationTokyoUrl,
} from "@/shared/assets/images";

import * as S from "./DestinationSelector.styles";

interface Props {
  onBack: () => void;
}

const currencyByCountry: Record<string, string> = {
  베트남: "VND",
  싱가포르: "SGD",
  일본: "JPY",
  태국: "THB",
};

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate.toISOString().slice(0, 10);
}

function getDestinationImage(destination: Destination) {
  if (destination.imageUrl) return destination.imageUrl;
  const value = `${destination.country} ${destination.name}`;
  if (value.includes("다낭") || value.includes("베트남"))
    return destinationDaNangUrl;
  if (value.includes("도쿄") || value.includes("일본"))
    return destinationTokyoUrl;
  if (value.includes("방콕") || value.includes("태국"))
    return destinationBangkokUrl;
  return destinationSingaporeUrl;
}

function CloseIcon() {
  return <span aria-hidden="true">×</span>;
}

type DestinationQueryData = {
  destinations: readonly Destination[];
  recentDestinations: readonly Destination[];
  userId?: string;
  travelPlanId?: number;
}

async function loadDestinationData(): Promise<DestinationQueryData> {
  const [countries, popularPlaces, profile, currentPlan] = await Promise.all([
    getCountries(),
    getPopularPlaces(),
    getProfile(),
    getDday().catch(() => undefined),
  ])
  const nextDestinations = countries.map((country, index) => ({
    country: country.countryName ?? "여행지",
    countryInfoId: country.countryInfoId,
    currency: currencyByCountry[country.countryName ?? ""] ?? "",
    id: String(country.countryInfoId ?? index),
    imageUrl: country.imageUrl,
    name: country.cityName || country.countryName || "여행지",
  }))
  const popularIds = new Set(popularPlaces.map((place) => place.countryInfoId))
  const recentSearches = await getRecentSearches(profile.userId)

  return {
    destinations: [...nextDestinations].sort(
      (a, b) => Number(popularIds.has(b.countryInfoId)) - Number(popularIds.has(a.countryInfoId)),
    ),
    recentDestinations: recentSearches.map((item, index) => ({
      country: item.countryName ?? "여행지",
      currency: currencyByCountry[item.countryName ?? ""] ?? "",
      id: `recent-${item.recentSearchId ?? index}`,
      imageUrl: item.imageUrl,
      name: item.cityName || item.countryName || "여행지",
      recentSearchId: item.recentSearchId,
    })),
    travelPlanId: currentPlan?.travelPlanId,
    userId: profile.userId,
  }
}

const DestinationSelector = ({ onBack }: Props) => {
  const [query, setQuery] = useState("");
  const [recentOverride, setRecentOverride] = useState<readonly Destination[] | null>(null);
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const destinationQuery = useQuery({
    queryKey: ["travel", "destination-selector"],
    queryFn: loadDestinationData,
  });
  const destinations = destinationQuery.data?.destinations ?? [];
  const recentDestinations = recentOverride ?? destinationQuery.data?.recentDestinations ?? [];
  const userId = destinationQuery.data?.userId;
  const travelPlanId = destinationQuery.data?.travelPlanId;
  const isLoading = destinationQuery.isLoading;
  const keyword = query.trim().toLocaleLowerCase();
  const results = keyword
    ? destinations.filter((destination) =>
        `${destination.name} ${destination.country}`
          .toLocaleLowerCase()
          .includes(keyword),
      )
    : destinations;

  const handleSelect = async (destination: Destination) => {
    try {
      setSelectingId(destination.id);
      setErrorMessage("");
      const today = new Date();
      if (travelPlanId != null && destination.countryInfoId != null) {
        await changeTravelCountry({
          countryInfoId: destination.countryInfoId,
          travelPlanId,
        });
      } else {
        await saveTravelPlan({
          cityName: destination.name,
          countryName: destination.country,
          endDate: addDays(today, 34),
          startDate: addDays(today, 30),
        });
      }
      if (userId != null && destination.countryInfoId != null) {
        await saveRecentSearch({
          userId,
          countryInfoId: destination.countryInfoId,
        });
      }
      onBack();
    } catch {
      setErrorMessage("여행지를 저장하지 못했습니다. 다시 시도해주세요.");
      setSelectingId(null);
    }
  };

  const handleDeleteRecent = async (destination: Destination) => {
    if (destination.recentSearchId == null) return;
    await deleteRecentSearch(destination.recentSearchId);
    setRecentOverride((current) =>
      (current ?? destinationQuery.data?.recentDestinations ?? []).filter((item) => item.id !== destination.id),
    );
  };

  const handleDeleteAllRecent = async () => {
    await Promise.all(
      recentDestinations.flatMap((item) =>
        item.recentSearchId == null
          ? []
          : [deleteRecentSearch(item.recentSearchId)],
      ),
    );
    setRecentOverride([]);
  };

  return (
    <S.Root>
      <S.TopBar>
        <S.BackButton
          type="button"
          aria-label="메인으로 돌아가기"
          onClick={onBack}
        >
          <DestinationBackIcon aria-hidden="true" />
          <span>여행지 선택</span>
        </S.BackButton>

        <S.SearchLabel>
          <DestinationSearchIcon aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder="어디로 여행을 떠나시나요?"
            aria-label="여행지 검색"
          />
        </S.SearchLabel>
      </S.TopBar>

      <S.Body>
        <S.RecentSection>
          <S.SectionHeader>
            <h2>최근 검색</h2>
            <button
              type="button"
              onClick={() => void handleDeleteAllRecent()}
              disabled={recentDestinations.length === 0}
            >
              모두 지우기
            </button>
          </S.SectionHeader>
          {recentDestinations.length === 0 ? (
            <S.EmptyRecent>최근 검색한 여행지가 없습니다.</S.EmptyRecent>
          ) : (
            recentDestinations.map((destination) => (
              <S.RecentChip key={destination.id}>
                <span aria-hidden="true">
                  <img src={getDestinationImage(destination)} alt="" />
                </span>
                <span>
                  <strong>{destination.name}</strong>
                  <small>{destination.currency}</small>
                </span>
                <button
                  type="button"
                  aria-label={`${destination.name} 최근 검색 삭제`}
                  onClick={() => void handleDeleteRecent(destination)}
                >
                  <CloseIcon />
                </button>
              </S.RecentChip>
            ))
          )}
        </S.RecentSection>

        <S.PopularSection>
          <h2>인기 여행지</h2>
          {isLoading ? (
            <S.ResultState aria-live="polite">
              여행지를 찾는 중입니다.
            </S.ResultState>
          ) : null}
          {errorMessage || destinationQuery.isError ? (
            <S.ResultState role="alert">{errorMessage || "여행지 목록을 불러오지 못했습니다."}</S.ResultState>
          ) : null}
          {!isLoading && results.length === 0 ? (
            <S.ResultState>검색 결과가 없습니다.</S.ResultState>
          ) : null}
          <S.DestinationGrid>
            {!isLoading &&
              results.map((destination) => (
                <S.DestinationCard
                  key={destination.id}
                  type="button"
                  data-destination-card
                  $imageUrl={getDestinationImage(destination)}
                  onClick={() => void handleSelect(destination)}
                  disabled={selectingId !== null}
                >
                  <span>
                    <strong>
                      {selectingId === destination.id
                        ? "선택 중..."
                        : destination.name}
                    </strong>
                    <small>{destination.country}</small>
                  </span>
                </S.DestinationCard>
              ))}
          </S.DestinationGrid>
        </S.PopularSection>
      </S.Body>
    </S.Root>
  );
};

export default DestinationSelector;
