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
  grid-template-columns: minmax(0, 1fr) 384px;
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

export const LoadingSettings = styled(Skeleton)`
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
  grid-template-columns: minmax(0, 1fr) 384px;
  margin-top: 24px;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const WorldMapSummary = styled.section`
  position: relative;
  display: block;
  min-height: 260px;
  box-sizing: border-box;
  border: 1px solid #dceaf7;
  border-radius: 16px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.background.muted};

  img {
    display: block;
    position: absolute;
    top: 57px;
    right: 16px;
    width: 360px;
    height: 180px;
    object-fit: contain;
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    img { height: 160px; }
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

export const SettingsCard = styled.section`
  min-height: 260px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  padding: 20px 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};

  > ${SectionTitle} {
    margin-bottom: 0;
    font-size: 15px;
    line-height: 20px;
  }
`

export const SettingsButton = styled.button<{ $danger?: boolean }>`
  display: flex;
  width: 100%;
  min-height: 49px;
  align-items: center;
  justify-content: space-between;
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding: 0;
  background: transparent;
  color: ${({ $danger, theme }) => ($danger ? theme.colors.status.error : theme.colors.text.strong)};
  cursor: pointer;
  font-size: 12px;
  text-align: left;
  &:last-child { border-bottom: 0; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 18px; }
`
