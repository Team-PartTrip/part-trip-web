import * as S from './MainPage.styles'
import logoUrl from '@shared/assets/logo.svg'
import mainHeroUrl from '@shared/assets/main-hero.png'

const sidebarItems = [
  { active: true, icon: '⌂', label: '홈' },
  { icon: '☷', label: '커뮤니티' },
  { icon: '⌁', label: '기록' },
  { icon: '◎', label: '미션' },
  { icon: '◉', label: '프로필' },
]

const populationItems = [
  { code: 'CN', group: '중국계', value: 75, color: '#0b73ce' },
  { code: 'MY', group: '말레이계', value: 14, color: '#e9d9dd' },
  { code: 'IN', group: '인도계', value: 9, color: '#11a987' },
]

const calendarDays = [
  '28',
  '29',
  '30',
  '30',
  '30',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
]

function Logo() {
  return (
    <S.Logo>
      <img src={logoUrl} alt="PartTrip" />
    </S.Logo>
  )
}

function Sidebar() {
  return (
    <S.Sidebar>
      <Logo />
      <S.SidebarNav aria-label="대시보드 메뉴">
        {sidebarItems.map((item) => (
          <S.SidebarItem key={item.label} $active={item.active}>
            <S.SidebarIcon>{item.icon}</S.SidebarIcon>
            <span>{item.label}</span>
          </S.SidebarItem>
        ))}
      </S.SidebarNav>
      <S.SidebarFooter type="button">
        <S.LogoutIcon>↪</S.LogoutIcon>
        <span>로그아웃</span>
      </S.SidebarFooter>
    </S.Sidebar>
  )
}

function LoggedInMainView() {
  return (
    <S.DashboardPage>
      <Sidebar />
      <S.DashboardContent>
        <S.TopArea>
          <S.HeroImage $imageUrl={mainHeroUrl} aria-label="싱가포르 야경" />
          <S.InfoStack>
            <S.CompactCard>
              <span>오늘의 환율</span>
              <strong>1 SGD = 1200 KRW</strong>
            </S.CompactCard>
            <S.CompactCard>
              <span>현지 시각</span>
              <strong>PM 10:24</strong>
            </S.CompactCard>
            <S.WordCard>
              <S.WordSound>⌕</S.WordSound>
              <S.WordText>
                <small>Day 1</small>
                <strong>Hello</strong>
                <span>안녕하세요</span>
              </S.WordText>
              <S.TranslateIcon>文</S.TranslateIcon>
            </S.WordCard>
          </S.InfoStack>
        </S.TopArea>

        <S.BottomArea>
          <S.LeftColumn>
            <S.TravelInfoCard>
              <S.PopulationBox>
                <S.CardTitle>여행지 정보</S.CardTitle>
                {populationItems.map((item) => (
                  <S.PopulationItem key={item.code}>
                    <S.PopulationMeta>
                      <span>
                        {item.code} {item.group}
                      </span>
                      <strong>{item.value}%</strong>
                    </S.PopulationMeta>
                    <S.ProgressTrack>
                      <S.ProgressFill
                        $color={item.color}
                        style={{ width: `${item.value}%` }}
                      />
                    </S.ProgressTrack>
                  </S.PopulationItem>
                ))}
              </S.PopulationBox>
              <S.CultureSummary>
                <strong>문화 요약</strong>
                <p>
                  중국계가 75%, 말레이계 14%, 인도계는 9%로 여러 문화가
                  공존하는 다문화 국가입니다.
                </p>
              </S.CultureSummary>
            </S.TravelInfoCard>

            <S.CharacterRankingCard>
              <S.CharacterArt aria-hidden="true">
                <span>^</span>
                <strong>●</strong>
              </S.CharacterArt>
              <S.RankingContent>
                <h2>내 캐릭터 랭킹</h2>
                <p>내 캐릭터의 포인트와 순위를 한눈에 확인할 수 있어요.</p>
                <S.RankingRow>
                  <span>포인트</span>
                  <strong>2,430P</strong>
                </S.RankingRow>
                <S.RankingRow>
                  <span>성장세</span>
                  <strong>+12%</strong>
                </S.RankingRow>
                <S.RankingRow>
                  <span>내 순위</span>
                  <strong>전체 8위</strong>
                </S.RankingRow>
              </S.RankingContent>
            </S.CharacterRankingCard>
          </S.LeftColumn>

          <S.FestivalCard>
            <S.FestivalHeader>
              <h2>이달의 축제 & 이벤트</h2>
              <button type="button">전체보기 →</button>
            </S.FestivalHeader>
            <S.CalendarWidget>
              <S.CalendarTop>
                <strong>2026년 6월</strong>
                <span>‹ ›</span>
              </S.CalendarTop>
              <S.CalendarGrid>
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                  <S.CalendarWeekday key={day}>{day}</S.CalendarWeekday>
                ))}
                {calendarDays.map((day, index) => (
                  <S.CalendarDay
                    key={`${day}-${index}`}
                    $muted={index < 5}
                    $event={day === '5'}
                    $selected={day === '8'}
                  >
                    {day}
                  </S.CalendarDay>
                ))}
              </S.CalendarGrid>
            </S.CalendarWidget>
            <S.EventPreview>
              <S.EventImage aria-hidden="true" />
              <S.EventInfo>
                <small>음식</small>
                <strong>싱가포르 푸드 페스티벌</strong>
                <span>전 세계 미식가들의 축제</span>
                <S.EventMeta>
                  <span>◷ 19:45, 20:45</span>
                  <span>⌖ 베이프론트 이벤트 스페이스</span>
                </S.EventMeta>
              </S.EventInfo>
            </S.EventPreview>
          </S.FestivalCard>
        </S.BottomArea>
      </S.DashboardContent>
    </S.DashboardPage>
  )
}

export function MainPage() {
  return <LoggedInMainView />
}

export default MainPage
