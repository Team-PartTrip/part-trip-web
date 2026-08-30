import styled from 'styled-components'
import { Skeleton } from '@/shared/ui/parttrip'

export const Page = styled.main<{ $wide?: boolean }>`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: ${({ $wide }) => ($wide ? '0' : '32px')};
  color: ${({ theme }) => theme.colors.text.strong};

  @media (max-width: 767px) {
    width: 100%;
    padding: 0;
  }
`

export const Header = styled.header<{ $wide?: boolean; $hasSubtitle?: boolean }>`
  min-height: ${({ $hasSubtitle, $wide }) => ($hasSubtitle ? ($wide ? '68px' : '57px') : '48px')};
  padding-inline: 24px;
  margin-bottom: 24px;
  margin-top: ${({ $wide }) => ($wide ? '24px' : '0')};
  h1 { line-height: ${({ $hasSubtitle }) => ($hasSubtitle ? '36px' : '38px')}; }
  p { margin-top: 4px; font-size: 14px; line-height: 17px; }
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

export const LoadingHeader = styled(Skeleton)`
  width: 220px;
  height: 38px;
`

export const LoadingGrid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
`

export const LoadingPanel = styled(Skeleton)`
  height: 460px;
  border-radius: 16px;
`

export const LoadingSingle = styled(Skeleton)`
  width: 100%;
  height: 460px;
  border-radius: 16px;
`

export const MapBody = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 752px) 360px;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 15px;
  line-height: 20px;
`

export const MapCard = styled.section`
  position: relative;
  height: 543px;
  min-height: 543px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  > ${SectionTitle} { margin: 0 0 8px; color: ${({ theme }) => theme.colors.brand.primary}; font-size: 14px; line-height: 17px; }
  @media (max-width: 560px) { min-height: 360px; padding: 16px; }
`

export const MapCanvas = styled.div`
  position: relative;
  width: 100%;
  height: 470px;
  overflow: hidden;
  border: 1px solid rgba(216, 221, 221, .55);
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.background.default};
  img { display: block; width: 100%; height: 100%; object-fit: contain; }
  @media (max-width: 560px) { height: 260px; }
`

export const CountryStats = styled.aside`
  display: flex;
  width: 360px;
  height: 378px;
  box-sizing: border-box;
  align-self: start;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 18px; line-height: 24px; }
  > strong { color: ${({ theme }) => theme.colors.brand.strong}; font-size: 32px; }
  p, > span { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; line-height: 18px; }
  button { margin-top: auto; }
  @media (max-width: 860px) { min-height: 280px; }
`

export const Badge = styled.span`
  border-radius: 999px;
  padding: 5px 8px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 11px;
`

export const CountryRecordsLayout = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: 360px minmax(0, 816px);
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const CountrySummaryCard = styled.section`
  position: relative;
  min-height: 460px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 18px 0 6px; color: ${({ theme }) => theme.colors.text.strong}; font-size: 28px; line-height: 34px; }
  > p { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; line-height: 18px; }
`

export const CountryCode = styled.strong`
  display: inline-flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 14px;
  box-shadow: 0 4px 10px rgb(26 110 191 / 16%);
`

export const CountryMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 52px;
  > div { display: flex; flex-direction: column; gap: 8px; }
  strong { color: ${({ theme }) => theme.colors.brand.primary}; font-size: 24px; line-height: 30px; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; }
`

export const CountryProgress = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 42px;
  > div { height: 10px; }
  > span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; font-weight: 600; }
`

export const CountryRecordsPanel = styled.section`
  min-height: 460px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  > ${SectionTitle} { margin-bottom: 12px; font-size: 18px; line-height: 24px; }
  > ${SectionTitle}:not(:first-child) { margin-top: 28px; }
`

export const CityTabs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  button { height: 36px; border: 0; border-radius: 12px; padding: 0 16px; background: ${({ theme }) => theme.colors.background.muted}; color: ${({ theme }) => theme.colors.brand.primary}; cursor: pointer; font-size: 12px; font-weight: 600; }
  button.active { background: ${({ theme }) => theme.colors.background.muted}; }
`

export const CountryRecordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const CountryRecordRow = styled.button`
  position: relative;
  display: flex;
  min-height: 72px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid #dceaf7;
  border-radius: 14px;
  padding: 14px 16px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;
  strong, span { display: block; }
  strong { font-size: 15px; }
  span { margin-top: 6px; color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; }
  b { color: ${({ theme }) => theme.colors.text.muted}; font-size: 18px; font-weight: 600; }
`

export const CountryList = styled.section`
  min-height: 460px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const CountryRow = styled.button<{ $active: boolean }>`
  display: block;
  width: 100%;
  min-height: 44px;
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 8px;
  padding: 0 12px;
  background: ${({ $active, theme }) => ($active ? theme.colors.background.muted : 'transparent')};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  text-align: left;
`

export const CountryPhotos = styled.section`
  display: grid;
  align-content: start;
  gap: 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`

export const CountryPhoto = styled.button`
  overflow: hidden;
  min-height: 230px;
  border: 0;
  border-radius: 20px;
  padding: 0 0 16px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;
  img { display: block; width: 100%; height: 128px; object-fit: cover; }
  strong, span { display: block; padding-inline: 16px; }
  strong { padding-top: 14px; font-size: 15px; }
  span { padding-top: 4px; color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; }
`

export const AchievementStats = styled.section`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 16px;
  @media (max-width: 760px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`

export const AchievementStat = styled.article`
  display: flex;
  min-height: 120px;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  border-radius: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  small, span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; }
  strong { color: ${({ theme }) => theme.colors.brand.strong}; font-size: 22px; }
`

export const AchievementMap = styled.section`
  min-height: 470px;
  border-radius: 28px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.muted};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  img { display: block; width: 100%; height: 390px; margin-top: 24px; object-fit: contain; }
`

export const Empty = styled.div`
  display: grid;
  min-height: 180px;
  place-items: center;
  grid-column: 1 / -1;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 13px;
  text-align: center;
`

export const CountrySummaryList = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
`

export const CountrySummaryRow = styled.button`
  display: flex;
  min-height: 76px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  border-radius: 12px;
  border: 0;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.soft};
  color: inherit;
  cursor: pointer;
  text-align: left;
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 16px; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; }
  b { margin-left: 8px; font-size: 18px; font-weight: 400; }
`

export const MoreLink = styled.button`
  align-self: flex-start;
  border: 0;
  padding: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.primary};
  cursor: pointer;
  font-size: 11px;
`

export const ClaimBody = styled.main`
  display: flex;
  min-height: 749px;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
`

export const ClaimCountry = styled.strong`
  display: grid;
  width: 72px;
  height: 72px;
  place-items: center;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 22px;
`

export const ClaimNew = styled.span`
  display: inline-flex;
  width: 76px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 0;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 12px;
  font-weight: 700;
`

export const ClaimTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 30px;
  line-height: 36px;
`

export const ClaimSubtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 14px;
  line-height: 17px;
`

export const ClaimInfo = styled.section`
  display: flex;
  width: min(100%, 620px);
  box-sizing: border-box;
  flex-direction: column;
  height: 256px;
  gap: 16px;
  margin-top: 0;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  text-align: left;
`

export const InfoRow = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 48px minmax(0, 1fr);
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; }
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 14px; }
`

export const ClaimNotice = styled.p`
  width: 229px;
  height: 44px;
  box-sizing: border-box;
  margin: 0;
  border: 1px solid rgb(255 122 53 / 18%);
  border-radius: 16px;
  padding: 12px;
  background: #fff7f1;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 12px;
  white-space: nowrap;
`

export const ClaimProgress = styled.section`
  display: flex;
  width: min(100%, 620px);
  box-sizing: border-box;
  flex-direction: column;
  height: 96px;
  gap: 16px;
  border: 1px solid #dee5f0;
  border-radius: 18px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  text-align: left;
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 14px; }
  strong b { color: ${({ theme }) => theme.colors.brand.primary}; font-size: 15px; }
`

export const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  button { width: 147px; height: 52px; min-height: 52px; font-size: 14px; }
`

export const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.background.muted};
`

export const ProgressBar = styled.span<{ $progress: number; $tone?: 'primary' | 'accent' }>`
  display: block;
  width: ${({ $progress }) => `${Math.max(0, Math.min(100, $progress))}%`};
  height: 100%;
  border-radius: inherit;
  background: ${({ $tone, theme }) => ($tone === 'accent' ? theme.colors.brand.accent : theme.colors.brand.primary)};
`

export const AchievementSummary = styled.section`
  display: flex;
  min-height: 220px;
  box-sizing: border-box;
  align-items: center;
  gap: 40px;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  padding: 28px 40px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  @media (max-width: 560px) { align-items: flex-start; flex-direction: column; }
`

export const AchievementCount = styled.div<{ $progress: number }>`
  position: relative;
  display: flex;
  width: 164px;
  height: 164px;
  flex: 0 0 164px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 22px;
  background: ${({ theme }) => theme.colors.background.subtle};

  &::before {
    position: absolute;
    inset: 24px;
    border-radius: 22px;
    background: ${({ theme }) => theme.colors.background.default};
    content: '';
  }

  strong, span { position: relative; z-index: 1; }
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 36px; line-height: 44px; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; }
`

export const AchievementCopy = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 14px; }
  strong { color: ${({ theme }) => theme.colors.brand.primary}; font-size: 24px; line-height: 30px; }
  b { color: ${({ theme }) => theme.colors.brand.success}; font-size: 14px; }
  em { display: block; width: 300px; height: 42px; box-sizing: border-box; border-radius: 12px; padding: 10px; background: ${({ theme }) => theme.colors.background.muted}; color: ${({ theme }) => theme.colors.text.strong}; font-size: 13px; font-style: normal; text-align: center; }
`

export const ContinentSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;

  > ${SectionTitle} { margin-bottom: 12px; font-size: 20px; line-height: 24px; }
`

export const ContinentRow = styled.div`
  display: flex;
  min-height: 58px;
  box-sizing: border-box;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.border.soft};
  border-radius: 14px;
  padding: 14px;
  background: ${({ theme }) => theme.colors.background.default};
  > div { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 14px; }
  > div span { color: ${({ theme }) => theme.colors.brand.primary}; font-size: 12px; }
  > ${ProgressTrack} { height: 6px; }
`
