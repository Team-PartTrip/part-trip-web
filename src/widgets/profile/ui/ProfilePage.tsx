import { useNavigate } from "@tanstack/react-router";
import { getTripDurationDays, useMyTrips } from "@/entities/trip-plan";
import { useUserProfileQuery } from "@/entities/user";
import { paths } from "@/shared/config";
import { Button as PartTripButton } from "@/shared/ui/parttrip";
import { AppShell } from "@/widgets/app-shell";

import * as S from "./ProfilePage.styles";

function initials(name?: string) {
  return name?.slice(0, 2).toUpperCase() || "MS";
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { hasError: hasTripsError, trips } = useMyTrips();
  const {
    data: profile,
    isError: hasProfileError,
    isLoading: isProfileLoading,
  } = useUserProfileQuery();
  const countries = new Set(
    trips.map((trip) => trip.countryName).filter(Boolean),
  ).size;
  const name = profile?.name || "민수";

  return (
    <AppShell>
      <S.Page>
        <S.Header>
          <S.Title>마이페이지</S.Title>
          <S.Subtitle>
            나의 여행 히스토리와 방문 국가를 한눈에 확인하세요.
          </S.Subtitle>
        </S.Header>
        {hasProfileError || hasTripsError ? (
          <S.State role="alert">정보를 불러오지 못했습니다.</S.State>
        ) : null}
        {!profile && !hasProfileError && isProfileLoading ? (
          <S.State aria-busy="true">프로필을 불러오는 중입니다.</S.State>
        ) : null}
        {!hasProfileError && !hasTripsError ? (
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
                <p>여행을 계획하고 기록하는 사람</p>
                <PartTripButton
                  type="button"
                  $variant="secondary"
                  onClick={() => navigate({ to: paths.profileEdit })}
                >
                  프로필 편집
                </PartTripButton>
              </S.ProfileCard>
              <S.StatsCard>
                <S.SectionTitle>여행 통계</S.SectionTitle>
                <S.Stats>
                  <div>
                    <small>방문 국가</small>
                    <strong>{countries}</strong>
                    <span>개</span>
                  </div>
                  <div>
                    <small>여행 기록</small>
                    <strong>{trips.length}</strong>
                    <span>개</span>
                  </div>
                  <div>
                    <small>여행 일수</small>
                    <strong>{getTripDurationDays(trips)}</strong>
                    <span>일</span>
                  </div>
                </S.Stats>
              </S.StatsCard>
            </S.ProfileBody>
            <S.LowerBody>
              <S.WorldMapSummary>
                <S.SectionTitle>내 세계지도</S.SectionTitle>
                <p>{countries}개국 획득 · 방문 국가별 기록을 확인하세요.</p>
                <S.WorldMapMore
                  type="button"
                  onClick={() => navigate({ to: paths.profileMap })}
                >
                  더보기
                </S.WorldMapMore>
              </S.WorldMapSummary>
              <S.SettingsCard>
                <S.SectionTitle>설정</S.SectionTitle>
                <S.SettingsButton
                  type="button"
                  onClick={() => navigate({ to: paths.profileEdit })}
                >
                  여행 타입 수정 <span>›</span>
                </S.SettingsButton>
                <S.SettingsButton
                  type="button"
                  onClick={() => navigate({ to: paths.notificationSettings })}
                >
                  알림 설정 <span>›</span>
                </S.SettingsButton>
                <S.SettingsButton type="button">
                  계정 · 보안 <span>›</span>
                </S.SettingsButton>
                <S.SettingsButton type="button" $danger>
                  로그아웃
                </S.SettingsButton>
              </S.SettingsCard>
            </S.LowerBody>
          </>
        ) : null}
      </S.Page>
    </AppShell>
  );
}
