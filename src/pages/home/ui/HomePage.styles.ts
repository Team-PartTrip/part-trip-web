import styled, { css } from 'styled-components'

const cardShadow = '2px 2px 4px rgb(0 0 0 / 25%)'

export const Logo = styled.div`
  display: inline-flex;
  align-items: flex-start;
  color: #050505;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1.15;
`

export const LogoMark = styled.span`
  display: inline-grid;
  width: 42px;
  height: 42px;
  place-items: center;
  color: #1a6ebf;
  font-size: 30px;
  line-height: 1;
`

export const GuestPage = styled.main`
  min-height: 100vh;
  overflow-x: hidden;
  background: #ffffff;
`

export const GuestHeader = styled.header`
  display: grid;
  height: 91px;
  align-items: center;
  padding: 0 43px 0 33px;
  grid-template-columns: 233px 1fr auto;
`

export const GuestNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 55px;
  padding-left: 42px;
`

export const GuestNavItem = styled.button`
  border: 0;
  padding: 0;
  background: transparent;
  color: #111111;
  cursor: pointer;
  font: inherit;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0;
`

export const AuthActions = styled.div`
  display: flex;
  gap: 17px;
`

const authButton = css`
  width: 106px;
  height: 44px;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  font: inherit;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0;
`

export const TextButton = styled.button`
  ${authButton}
  background: #ffffff;
  color: #111111;
`

export const PrimaryButton = styled.button`
  ${authButton}
  background: #2a64e1;
  color: #ffffff;
`

export const GuestMain = styled.section`
  max-width: 1438px;
  margin: 35px auto 64px;
  padding: 0 36px;
`

export const FeatureGrid = styled.div`
  display: grid;
  min-height: 514px;
  gap: 23px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
`

export const FeatureCard = styled.article<{ $variant: string }>`
  position: relative;
  overflow: hidden;
  min-height: 450px;
  border-radius: 24px;
  padding: 74px 24px 24px;
  background: ${({ $variant }) =>
    $variant === 'green'
      ? 'linear-gradient(145deg, #e8fff5 0%, #ffffff 44%, #d7f5e8 100%)'
      : $variant === 'orange'
        ? 'linear-gradient(145deg, #fff1df 0%, #ffffff 44%, #ffe1bd 100%)'
        : 'linear-gradient(145deg, #eaf1ff 0%, #ffffff 44%, #d7e4ff 100%)'};
  box-shadow: ${cardShadow};
`

export const FeatureIcon = styled.div`
  position: absolute;
  top: 73px;
  left: 78px;
  display: grid;
  width: 53px;
  height: 53px;
  place-items: center;
  border-radius: 999px;
  background: #ffffff;
  color: #2a64e1;
  font-size: 15px;
  font-weight: 800;
  box-shadow: 0 2px 10px rgb(42 100 225 / 18%);
`

export const FeatureTitle = styled.h1`
  position: relative;
  z-index: 1;
  max-width: 274px;
  margin: 26px 0 0;
  color: #111111;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.65;
`

export const FeatureDescription = styled.p`
  position: relative;
  z-index: 1;
  max-width: 270px;
  margin: 0 0 0 1px;
  color: #5f6673;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1.2;
`

export const FeatureAction = styled.button`
  position: relative;
  z-index: 1;
  width: 145px;
  height: 54px;
  border: 0;
  border-radius: 14px;
  margin-top: 14px;
  background: #2a64e1;
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0;
`

export const FeatureArt = styled.div`
  position: absolute;
  right: -35px;
  bottom: -20px;
  width: 260px;
  height: 260px;
  border-radius: 42% 58% 44% 56%;
  background:
    radial-gradient(circle at 35% 36%, #ffffff 0 12%, transparent 13%),
    linear-gradient(135deg, rgb(42 100 225 / 24%), rgb(42 100 225 / 8%));
`

export const SectionTitle = styled.h2`
  margin: 64px 0 24px;
  color: #111111;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 0;
`

export const RecordGrid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
`

export const RecordCard = styled.article`
  overflow: hidden;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: ${cardShadow};
`

export const RecordThumb = styled.div<{ $index: number }>`
  height: 232px;
  background: ${({ $index }) =>
    [
      'linear-gradient(135deg, #d9ecff, #86b7ff)',
      'linear-gradient(135deg, #ffe6b3, #ff9d76)',
      'linear-gradient(135deg, #e4ddff, #9b8cff)',
    ][$index]};
`

export const RecordBody = styled.div`
  display: flex;
  min-height: 84px;
  flex-direction: column;
  gap: 8px;
  padding: 18px;

  strong {
    font-size: 20px;
    letter-spacing: 0;
  }

  span {
    color: #797d82;
    font-size: 15px;
  }
`

export const DashboardPage = styled.main`
  display: flex;
  width: 100%;
  min-height: 100vh;
  overflow-x: auto;
  background: #f4f8fc;
  color: #111827;
`

export const Sidebar = styled.aside`
  position: sticky;
  top: 0;
  display: flex;
  width: 200px;
  min-height: 100vh;
  flex: 0 0 200px;
  flex-direction: column;
  overflow: hidden;
  border-radius: 0 18px 18px 0;
  background: #ffffff;
  padding: 12px;

  ${Logo} {
    width: 146px;
    height: 35px;
    margin-bottom: 8px;
  }

  ${Logo} img {
    width: 146px;
    height: auto;
  }
`

export const SidebarNav = styled.nav`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
`

export const SidebarItem = styled.button<{ $active?: boolean }>`
  display: flex;
  width: 100%;
  height: 48px;
  align-items: center;
  gap: 0;
  border: 0;
  border-radius: 18px;
  padding: 0;
  background: transparent;
  color: ${({ $active }) => ($active ? '#0b73ce' : '#0f0f10')};
  cursor: pointer;
  font: inherit;
  font-size: 20px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  letter-spacing: 0;
`

export const SidebarIcon = styled.span`
  display: grid;
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  place-items: center;
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 22px;
  line-height: 1;
`

export const SidebarFooter = styled.button`
  display: flex;
  width: 100%;
  height: 36px;
  align-items: center;
  gap: 8px;
  border: 0;
  margin-top: auto;
  padding: 0;
  background: transparent;
  color: #0f0f10;
  cursor: pointer;
  font: inherit;
  font-size: 20px;
  letter-spacing: 0;
`

export const LogoutIcon = styled.span`
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 10px;
  background: #ff3e3e;
  color: #ffffff;
  font-size: 20px;
`

export const DashboardContent = styled.section`
  display: flex;
  width: min(100%, 1304px);
  min-width: 980px;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 44px;
  padding: 45px 36px;
`

const dashboardCard = css`
  overflow: hidden;
  border: 1px solid #e7edf7;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 8px 12px rgb(13 31 64 / 8%);
`

export const TopArea = styled.section`
  display: grid;
  width: 100%;
  align-items: center;
  gap: 50px;
  grid-template-columns: minmax(620px, 895px) 260px;
`

export const HeroImage = styled.div<{ $imageUrl: string }>`
  position: relative;
  height: 382px;
  overflow: hidden;
  border-radius: 32px;
  background:
    linear-gradient(180deg, rgb(0 0 0 / 40%) 0%, rgb(0 0 0 / 0%) 42%, rgb(0 0 0 / 70%) 100%),
    url('${({ $imageUrl }) => $imageUrl}') center 38% / cover;
  box-shadow: 0 16px 16px rgb(13 31 64 / 16%);
`

export const InfoStack = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const CompactCard = styled.article`
  ${dashboardCard}
  display: flex;
  width: 260px;
  height: 92px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 22px;
  padding: 16px 22px;
  text-align: center;

  span {
    color: #64748b;
    font-size: 13px;
    font-weight: 500;
  }

  strong {
    color: #111827;
    font-size: 21px;
    font-weight: 800;
    white-space: nowrap;
  }
`

export const WordCard = styled.article`
  ${dashboardCard}
  display: flex;
  width: 260px;
  height: 104px;
  align-items: center;
  gap: 18px;
  border-radius: 22px;
  padding: 18px 22px;
`

export const WordSound = styled.span`
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 999px;
  background: rgb(26 110 191 / 23%);
  color: #0b73ce;
`

export const WordText = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 3px;

  small {
    width: fit-content;
    border-radius: 999px;
    padding: 7px 14px;
    background: #e5f2ff;
    color: #2f76e8;
    font-size: 13px;
    font-weight: 700;
  }

  strong {
    color: #111827;
    font-size: 22px;
    font-weight: 800;
  }

  span {
    color: #64748b;
    font-size: 14px;
  }
`

export const TranslateIcon = styled.span`
  color: #a1a7b0;
  font-size: 19px;
`

export const CardTitle = styled.h2`
  margin: 0;
  color: #000000;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -1.1px;
`

export const BottomArea = styled.section`
  display: grid;
  width: 100%;
  align-items: start;
  gap: 24px;
  grid-template-columns: minmax(590px, 658px) minmax(420px, 523px);
`

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
`

export const TravelInfoCard = styled.article`
  ${dashboardCard}
  display: grid;
  align-items: center;
  gap: 28px;
  padding: 24px 28px;
  grid-template-columns: 220px minmax(260px, 1fr);
`

export const PopulationBox = styled.div`
  display: flex;
  height: 188px;
  flex-direction: column;
  gap: 12px;
`

export const PopulationItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const PopulationMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #111827;
  font-size: 13px;
  font-weight: 700;
`

export const ProgressTrack = styled.div`
  height: 10px;
  width: 100%;
  overflow: hidden;
  border-radius: 999px;
  background: #f1ecee;
`

export const ProgressFill = styled.span<{ $color: string }>`
  display: block;
  height: 100%;
  border-radius: inherit;
  background: ${({ $color }) => $color};
`

export const CultureSummary = styled.div`
  display: flex;
  min-height: 126px;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  border: 1px solid #eef2f7;
  border-radius: 22px;
  padding: 22px;
  background: #f7f7f8;

  strong {
    color: #111827;
    font-size: 18px;
  }

  p {
    max-width: 310px;
    margin: 0;
    color: #475569;
    font-size: 14px;
    line-height: 1.35;
  }
`

export const CharacterRankingCard = styled.article`
  ${dashboardCard}
  display: grid;
  min-height: 206px;
  align-items: center;
  gap: 22px;
  padding: 22px 24px;
  grid-template-columns: 192px 1fr;
`

export const CharacterArt = styled.div`
  position: relative;
  display: grid;
  width: 192px;
  height: 162px;
  place-items: center;
  color: #111827;
  font-size: 76px;

  span {
    position: absolute;
    top: 13px;
    color: #111827;
    font-size: 64px;
    transform: scaleX(1.5);
  }

  strong {
    display: grid;
    width: 104px;
    height: 104px;
    place-items: center;
    border: 2px solid #211b16;
    border-radius: 48% 48% 42% 42%;
    background:
      radial-gradient(circle at 36% 42%, #f7c633 0 6px, #121212 7px 12px, transparent 13px),
      radial-gradient(circle at 63% 42%, #f7c633 0 6px, #121212 7px 12px, transparent 13px),
      #fff7e8;
    color: transparent;
    box-shadow: 0 16px 24px rgb(13 31 64 / 10%);
  }
`

export const RankingContent = styled.div`
  h2 {
    margin: 0;
    color: #111827;
    font-size: 20px;
    font-weight: 800;
  }

  p {
    margin: 8px 0 12px;
    color: #64748b;
    font-size: 14px;
  }
`

export const RankingRow = styled.div`
  display: grid;
  width: 184px;
  height: 28px;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  margin-top: 8px;
  padding: 0 12px;
  grid-template-columns: 1fr auto;
  background: #f7fafd;
  color: #334155;
  font-size: 13px;
  font-weight: 700;
`

export const FestivalCard = styled.article`
  ${dashboardCard}
  display: flex;
  min-height: 458px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
`

export const FestivalHeader = styled.div`
  display: flex;
  width: 428px;
  height: 37px;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    color: #111827;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -1px;
  }

  button {
    border: 0;
    padding: 0;
    background: transparent;
    color: #0b73ce;
    cursor: pointer;
    font: inherit;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -1px;
  }
`

export const CalendarWidget = styled.div`
  width: 392px;
  border: 1px solid #e4e2e2;
  border-radius: 24px;
  padding: 17px;
  background: #ffffff;
  box-shadow: 0 8px 15px rgb(0 93 166 / 8%);
`

export const CalendarTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 16px;
  color: #1b1c1c;
  font-size: 14px;

  span {
    color: #cbd5e1;
    font-size: 20px;
    letter-spacing: 4px;
  }
`

export const CalendarGrid = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(7, minmax(0, 1fr));
`

export const CalendarWeekday = styled.div`
  display: grid;
  height: 15px;
  place-items: center;
  color: #94a3b8;
  font-size: 10px;
`

export const CalendarDay = styled.div<{
  $muted?: boolean
  $event?: boolean
  $selected?: boolean
}>`
  position: relative;
  display: grid;
  height: 36px;
  place-items: center;
  border-radius: 8px;
  background: ${({ $selected }) =>
    $selected ? 'rgb(0 93 166 / 10%)' : 'transparent'};
  color: ${({ $event, $muted }) =>
    $event ? '#b52330' : $muted ? 'rgb(27 28 28 / 20%)' : '#1b1c1c'};
  font-size: 14px;

  ${({ $selected }) =>
    $selected &&
    css`
      &::after {
        position: absolute;
        bottom: 4px;
        left: 50%;
        width: 4px;
        height: 4px;
        border-radius: 999px;
        background: #005da6;
        content: '';
        transform: translateX(-50%);
      }
    `}
`

export const EventPreview = styled.article`
  display: grid;
  width: 392px;
  align-items: center;
  gap: 16px;
  border: 1px solid rgb(228 226 226 / 20%);
  border-radius: 24px;
  padding: 11px 17px;
  background: #ffffff;
  grid-template-columns: 96px 1fr;
  box-shadow: 0 1px 1px rgb(0 0 0 / 5%);
`

export const EventImage = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 16px;
  background:
    radial-gradient(circle, transparent 0 13px, #c8922d 14px 15px, transparent 16px),
    radial-gradient(circle, transparent 0 29px, #c8922d 30px 31px, transparent 32px),
    linear-gradient(135deg, #15110d, #332215);
`

export const EventInfo = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;

  small {
    width: fit-content;
    border-radius: 999px;
    padding: 2px 8px;
    background: rgb(181 35 48 / 10%);
    color: #b52330;
    font-size: 10px;
    font-weight: 700;
  }

  strong {
    color: #1b1c1c;
    font-size: 16px;
    font-weight: 700;
  }

  > span {
    color: #404752;
    font-size: 12px;
  }
`

export const EventMeta = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
  color: #404752;
  font-size: 12px;

  span {
    min-width: 0;
  }
`
