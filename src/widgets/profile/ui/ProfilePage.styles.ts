import styled from 'styled-components'
import { Skeleton } from '@/shared/ui/parttrip'

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 0 0 60px;
  color: ${({ theme }) => theme.colors.text.strong};

  @media (max-width: 767px) {
    padding-bottom: 48px;
  }
`

export const Header = styled.header`
  min-height: 68px;
  padding: 0 24px;
  margin: 24px 0;
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 30px;
  line-height: 38px;
`

export const Subtitle = styled.p`
  margin: 6px 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 15px;
  line-height: 22px;
`

export const State = styled.p`
  padding: 64px 0;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`

export const LoadingLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const LoadingRow = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: 420px minmax(0, 1fr);
`

export const LoadingLower = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;
`

export const LoadingCard = styled(Skeleton)`
  height: 260px;
  border-radius: 16px;
`

export const LoadingStats = styled(Skeleton)`
  height: 260px;
  border-radius: 16px;
`

export const LoadingMap = styled(Skeleton)`
  height: 260px;
  border-radius: 16px;
`

export const ModalBackdrop = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: transparent;
`

export const ProfileBody = styled.section`
  display: grid;
  gap: 24px;
  grid-template-columns: 420px minmax(0, 1fr);
  min-height: 260px;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const ProfileCard = styled.article`
  display: flex;
  min-height: 260px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 24px; line-height: 32px; }
  p { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 14px; line-height: 20px; }
`

export const ProfileActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  button { min-height: 46px; }
`

export const LogoutButton = styled.button`
  min-height: 46px;
  border: 1px solid ${({ theme }) => theme.colors.status.error};
  border-radius: 14px;
  padding: 12px 24px;
  background: transparent;
  color: ${({ theme }) => theme.colors.status.error};
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
`

export const ErrorActions = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`

export const Avatar = styled.div`
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  overflow: hidden;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 11px;
  font-weight: 600;
  img { display: block; width: 100%; height: 100%; object-fit: cover; }
`

export const StatsCard = styled.section`
  min-height: 260px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const SectionTitle = styled.h2`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 18px;
  line-height: 24px;
`

export const Stats = styled.div`
  display: flex;
  gap: 16px;
  height: 106px;
  align-items: center;
  > div {
    display: flex;
    min-width: 0;
    flex: 1;
    height: 100%;
    box-sizing: border-box;
    flex-direction: column;
    gap: 12px;
    border: 1px solid ${({ theme }) => theme.colors.border.subtle};
    border-radius: 16px;
    padding: 24px;
  }
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; line-height: 16px; }
  strong { color: ${({ theme }) => theme.colors.brand.strong}; font-size: 24px; line-height: 30px; }
`

export const LowerBody = styled.section`
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;
  margin-top: 24px;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const WorldMapSummary = styled.section`
  position: relative;
  display: grid;
  align-items: center;
  gap: 24px;
  grid-template-columns: minmax(220px, 1fr) minmax(0, 2fr);
  min-height: 320px;
  box-sizing: border-box;
  border: 1px solid #dceaf7;
  border-radius: 16px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.muted};

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`

export const WorldMapCopy = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;

  ${SectionTitle} { margin: 0; font-size: 18px; line-height: 24px; }
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 14px;
    line-height: 20px;
  }
`

export const WorldMapMore = styled.button`
  width: 132px;
  height: 44px;
  border: 0;
  border-radius: 12px;
  padding: 0;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
`

export const AccountPanel = styled.section`
  overflow: hidden;
  border: 1px solid #e3ecf5;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: 0 4px 14px rgb(15 33 51 / 5%);
`

export const AccountHeader = styled.div`
  display: flex;
  min-height: 176px;
  align-items: center;
  gap: 16px;
  padding: 24px;

  @media (max-width: 720px) { align-items: flex-start; flex-wrap: wrap; }
`

export const AccountCopy = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 5px;
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 20px; line-height: 28px; }
  span, small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 14px; line-height: 20px; }
  small { overflow-wrap: anywhere; }
`

export const SettingsList = styled.nav`
  border-top: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding: 0 24px;
`

export const SettingsRow = styled.button`
  display: flex;
  width: 100%;
  min-height: 76px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding: 12px 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;

  &:last-child { border-bottom: 0; }
  &:hover { background: ${({ theme }) => theme.colors.background.subtle}; }
  > span { display: flex; min-width: 0; flex-direction: column; gap: 4px; }
  strong { font-size: 15px; line-height: 22px; }
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; line-height: 18px; }
  b { flex: 0 0 auto; color: ${({ theme }) => theme.colors.brand.strong}; font-size: 14px; font-weight: 600; }

  @media (max-width: 560px) {
    align-items: flex-start;
    > b { align-self: center; max-width: 110px; font-size: 12px; text-align: right; }
  }
`
