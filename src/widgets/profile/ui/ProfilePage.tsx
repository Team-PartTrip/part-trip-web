import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMyTrips } from "@/entities/trip-plan";
import { useWorldMapQuery } from "@/entities/world-map";
import { useProfileStatsQuery, useUserProfileQuery } from "@/entities/user";
import { ProfileForm } from "@/features/fix-profile";
import { paths } from "@/shared/config";
import { Button as PartTripButton } from "@/shared/ui/parttrip";
import { WorldMap } from "@/shared/ui";
import { AppShell } from "@/widgets/app-shell";
import { LogoutDialog } from "@/widgets/sidebar";

import * as S from "./ProfilePage.styles";

function initials(name?: string) {
  return name?.slice(0, 2).toUpperCase() || "MS";
}

type ProfilePageProps = {
  editMode?: boolean;
};

export function ProfilePage({ editMode = false }: ProfilePageProps = {}) {
  const navigate = useNavigate();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { hasError: hasTripsError, isLoading: isTripsLoading, trips } = useMyTrips();
  const {
    data: profile,
    isError: hasProfileError,
    isLoading: isProfileLoading,
  } = useUserProfileQuery();
  const { data: profileStats, isLoading: isProfileStatsLoading } = useProfileStatsQuery();
  const {
    data: worldMap,
    isError: hasWorldMapError,
    isLoading: isWorldMapLoading,
  } = useWorldMapQuery();
  const isLoading = isTripsLoading || isProfileLoading || isProfileStatsLoading || isWorldMapLoading;
  const hasPageError = hasProfileError || hasTripsError || hasWorldMapError;
  const tripCountryCount = new Set(
    trips.map((trip) => trip.countryName).filter(Boolean),
  ).size;
  const visitedCountries = worldMap?.visited ?? [];
  const countryCount = worldMap
    ? new Set(visitedCountries.map((country) => country.countryName).filter(Boolean)).size
    : tripCountryCount;
  const recordCount = trips.reduce((total, trip) => total + (trip.images?.length ?? 0), 0);
  const displayedRecordCount = profileStats?.recordCount ?? recordCount;
  const name = profile?.name || "닉네임 미설정";

  return (
    <AppShell>
      <S.Page>
        <S.Header>
          <S.Title>마이</S.Title>
          <S.Subtitle>
            내 여행과 기록을 한눈에 확인하세요.
          </S.Subtitle>
        </S.Header>
        {hasPageError ? (
          <>
            <S.State role="alert">정보를 불러오지 못했습니다.</S.State>
            <S.ErrorActions>
              <S.LogoutButton type="button" onClick={() => setIsLogoutDialogOpen(true)}>
                로그아웃
              </S.LogoutButton>
            </S.ErrorActions>
          </>
        ) : null}
        {!hasPageError && isLoading ? <S.LoadingLayout aria-busy="true" aria-label="프로필 정보 로딩 중"><S.LoadingRow><S.LoadingCard /><S.LoadingStats /></S.LoadingRow><S.LoadingLower><S.LoadingMap /></S.LoadingLower></S.LoadingLayout> : !hasPageError ? (
          <>
            <S.ProfileBody>
              <S.ProfileCard>
                <S.Avatar>
                  {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={`${name} 프로필 사진`} />
                  ) : (
                    initials(name)
                  )}
                </S.Avatar>
                <h2>{name}</h2>
                <p>여행 프로필</p>
                <p>{profile?.id ? `@${profile.id}` : '아이디 정보 없음'}</p>
                <S.ProfileActions>
                  <PartTripButton
                    type="button"
                    $variant="secondary"
                    onClick={() => navigate({ to: paths.profileEdit })}
                  >
                    프로필 수정
                  </PartTripButton>
                  <S.LogoutButton type="button" onClick={() => setIsLogoutDialogOpen(true)}>
                    로그아웃
                  </S.LogoutButton>
                </S.ProfileActions>
              </S.ProfileCard>
              <S.StatsCard>
                <S.SectionTitle>여행 통계</S.SectionTitle>
                <S.Stats>
                  <div>
                    <small>여행</small>
                    <strong>{profileStats?.tripCount ?? trips.length}</strong>
                  </div>
                  <div>
                    <small>국가</small>
                    <strong>{profileStats?.countryCount ?? countryCount}</strong>
                  </div>
                  <div>
                    <small>기록</small>
                    <strong>{displayedRecordCount}</strong>
                  </div>
                </S.Stats>
              </S.StatsCard>
            </S.ProfileBody>
            <S.LowerBody>
              <S.WorldMapSummary>
                <S.WorldMapCopy>
                  <S.SectionTitle>내 세계지도</S.SectionTitle>
                  <p>{countryCount}개국 여행 기록</p>
                  <S.WorldMapMore type="button" onClick={() => navigate({ to: paths.profileMap })}>
                    세계지도 보기
                  </S.WorldMapMore>
                </S.WorldMapCopy>
                <WorldMap
                  ariaLabel="방문 국가 세계 지도"
                  countryCodes={visitedCountries.map((country) => country.countryCode)}
                />
              </S.WorldMapSummary>
            </S.LowerBody>
          </>
        ) : null}
      </S.Page>
      {editMode && profile ? (
        <>
          <S.ModalBackdrop />
          <ProfileForm profile={profile} />
        </>
      ) : null}
      {isLogoutDialogOpen ? (
        <LogoutDialog
          onClose={() => setIsLogoutDialogOpen(false)}
          moveToLogin={() => navigate({ replace: true, to: paths.login })}
        />
      ) : null}
    </AppShell>
  );
}
