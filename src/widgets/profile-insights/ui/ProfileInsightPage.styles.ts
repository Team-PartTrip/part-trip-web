import styled from 'styled-components'
import { Skeleton } from '@/shared/ui/parttrip'

export const Page = styled.main<{ $wide?: boolean }>`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: ${({ $wide }) => ($wide ? '0' : '2rem')};
  color: ${({ theme }) => theme.colors.text.strong};

  @media (max-width: 47.9375rem) {
    width: 100%;
    padding: 0;
  }
`

export const Header = styled.header<{ $wide?: boolean; $hasSubtitle?: boolean }>`
  min-height: ${({ $hasSubtitle, $wide }) => ($hasSubtitle ? ($wide ? '4.25rem' : '3.5625rem') : '3rem')};
  padding-inline: 1.5rem;
  margin-bottom: 1.5rem;
  margin-top: ${({ $wide }) => ($wide ? '1.5rem' : '0')};
  h1 { line-height: ${({ $hasSubtitle }) => ($hasSubtitle ? '2.25rem' : '2.375rem')}; }
  p { margin-top: 0.25rem; font-size: 0.875rem; line-height: 1.0625rem; }
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 1.875rem;
  line-height: 2.375rem;
`

export const Subtitle = styled.p`
  margin: 0.375rem 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.9375rem;
  line-height: 1.375rem;
`

export const State = styled.p`
  padding: 4rem 0;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`

export const LoadingLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const LoadingHeader = styled(Skeleton)`
  width: 13.75rem;
  height: 2.375rem;
`

export const LoadingGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
`

export const LoadingPanel = styled(Skeleton)`
  height: 28.75rem;
  border-radius: 1rem;
`

export const LoadingSingle = styled(Skeleton)`
  width: 100%;
  height: 28.75rem;
  border-radius: 1rem;
`

export const MapBody = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(0, 47rem) 22.5rem;
  @media (max-width: 53.75rem) { grid-template-columns: 1fr; }
`

export const MapLegend = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.75rem;
  span { display: inline-flex; align-items: center; gap: 0.375rem; }
`

export const LegendDot = styled.i<{ $visited?: boolean }>`
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background: ${({ $visited, theme }) => $visited ? theme.colors.brand.primary : theme.colors.background.muted};
`

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 0.9375rem;
  line-height: 1.25rem;
`

export const MapCard = styled.section`
  position: relative;
  min-height: 37rem;
  box-sizing: border-box;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  > ${SectionTitle} { margin: 0 0 0.5rem; color: ${({ theme }) => theme.colors.brand.primary}; font-size: 0.875rem; line-height: 1.0625rem; }
  @media (max-width: 35rem) { min-height: 22.5rem; padding: 1rem; }
`

export const MapCanvas = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  height: 29.375rem;
  overflow: hidden;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  background: ${({ theme }) => theme.colors.background.soft};
  > div { width: 100%; height: 100%; }
  @media (max-width: 35rem) { height: 16.25rem; }
`

export const KoreaMap = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  svg { display: block; width: auto; max-width: 100%; height: 100%; }
  svg [data-region] { cursor: pointer; }
  svg [data-region] path {
    stroke: ${({ theme }) => theme.colors.text.muted};
    stroke-width: 0.03125rem;
  }
  svg [data-region]:hover path {
    fill: ${({ theme }) => theme.colors.background.info} !important;
    stroke: ${({ theme }) => theme.colors.brand.strong} !important;
  }
  svg [data-region]:focus-visible path { stroke: #003366; stroke-width: 1.5; }
`

export const RegionPicker = styled.details`
  display: none;
  @media (max-width: 47.9375rem) {
    display: block;
    margin-top: 0.75rem;
    summary {
      display: flex;
      min-height: 3rem;
      align-items: center;
      color: ${({ theme }) => theme.colors.brand.primary};
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
    }
  }
`

export const RegionPickerList = styled.div`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 0.5rem;
  button {
    display: flex;
    min-width: 0;
    min-height: 3rem;
    align-items: center;
    justify-content: space-between;
    gap: 0.25rem;
    border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
    border-radius: 0.75rem;
    padding: 0.5rem;
    background: ${({ theme }) => theme.colors.background.default};
    color: ${({ theme }) => theme.colors.text.strong};
    cursor: pointer;
    font-size: 0.8125rem;
    text-align: left;
  }
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.6875rem; white-space: nowrap; }
  button:focus-visible { outline: 0.125rem solid ${({ theme }) => theme.colors.brand.strong}; outline-offset: 0.125rem; }
`

export const CountryStats = styled.aside`
  display: flex;
  width: 100%;
  min-height: 37rem;
  box-sizing: border-box;
  align-self: start;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 1.125rem; line-height: 1.5rem; }
  > strong { color: ${({ theme }) => theme.colors.brand.strong}; font-size: 2rem; }
  p, > span { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.75rem; line-height: 1.125rem; }
  > button:last-of-type { margin-top: 0; }
  @media (max-width: 53.75rem) { min-height: 17.5rem; }
`

export const Badge = styled.span`
  border-radius: 62.4375rem;
  padding: 0.3125rem 0.5rem;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 0.6875rem;
`

export const CountryRecordsLayout = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 22.5rem minmax(0, 51rem);
  @media (max-width: 53.75rem) { grid-template-columns: 1fr; }
`

export const CountrySummaryCard = styled.section`
  position: relative;
  min-height: 28.75rem;
  box-sizing: border-box;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 1.125rem 0 0.375rem; color: ${({ theme }) => theme.colors.text.strong}; font-size: 1.75rem; line-height: 2.125rem; }
  > p { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.8125rem; line-height: 1.125rem; }
`

export const CountryCode = styled.strong`
  display: inline-flex;
  width: 3rem;
  height: 3rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 0.875rem;
  box-shadow: 0 0.25rem 0.625rem rgb(26 110 191 / 16%);
`

export const CountryMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 3.25rem;
  > div { display: flex; flex-direction: column; gap: 0.5rem; }
  strong { color: ${({ theme }) => theme.colors.brand.primary}; font-size: 1.5rem; line-height: 1.875rem; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.6875rem; }
`

export const CountryProgress = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 2.625rem;
  > div { height: 0.625rem; }
  > span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.75rem; font-weight: 600; }
`

export const CountryRecordsPanel = styled.section`
  min-height: 28.75rem;
  box-sizing: border-box;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  > ${SectionTitle} { margin-bottom: 0.75rem; font-size: 1.125rem; line-height: 1.5rem; }
  > ${SectionTitle}:not(:first-child) { margin-top: 1.75rem; }
`

export const CityTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  button { height: 2.25rem; border: 0; border-radius: 0.75rem; padding: 0 1rem; background: ${({ theme }) => theme.colors.background.muted}; color: ${({ theme }) => theme.colors.brand.primary}; cursor: pointer; font-size: 0.75rem; font-weight: 600; }
  button.active { background: ${({ theme }) => theme.colors.background.muted}; }
  span { display: inline-flex; min-height: 2.25rem; align-items: center; border-radius: 0.75rem; padding: 0 1rem; background: ${({ theme }) => theme.colors.background.muted}; color: ${({ theme }) => theme.colors.text.strong}; font-size: 0.75rem; font-weight: 600; }
`

export const CountryRecordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`

export const CountryRecordRow = styled.button`
  position: relative;
  display: flex;
  min-height: 4.5rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 0.0625rem solid #dceaf7;
  border-radius: 0.875rem;
  padding: 0.875rem 1rem;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;
  strong, span { display: block; }
  strong { font-size: 0.9375rem; }
  span { margin-top: 0.375rem; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.75rem; }
  b { color: ${({ theme }) => theme.colors.text.muted}; font-size: 1.125rem; font-weight: 600; }
  &:disabled { cursor: default; opacity: .7; }
`

export const Empty = styled.div`
  display: grid;
  min-height: 11.25rem;
  place-items: center;
  grid-column: 1 / -1;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.8125rem;
  text-align: center;
`

export const CountrySummaryList = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 27.75rem;
  overflow-y: auto;
  margin-top: 0.25rem;
`

export const CountrySummaryRow = styled.button`
  display: flex;
  min-height: 4.75rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  border-radius: 0.75rem;
  border: 0;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.soft};
  color: inherit;
  cursor: pointer;
  text-align: left;
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 1rem; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.75rem; }
  b { margin-left: 0.5rem; font-size: 1.125rem; font-weight: 400; }
`

export const MoreLink = styled.button`
  display: inline-flex;
  min-height: 3rem;
  align-self: flex-start;
  align-items: center;
  border: 0;
  padding: 0.5rem 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.primary};
  cursor: pointer;
  font-size: 0.875rem;
  margin-top: auto;
  &:hover { text-decoration: underline; }
`

export const UnknownRegionNotice = styled.p`
  margin: 0;
  border-radius: 0.625rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.75rem;
  line-height: 1.125rem;
  overflow-wrap: anywhere;
`

export const ClaimBody = styled.main`
  display: flex;
  min-height: 46.8125rem;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  text-align: center;
`

export const ClaimCountry = styled.strong`
  display: grid;
  width: 4.5rem;
  height: 4.5rem;
  place-items: center;
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 1.375rem;
`

export const ClaimNew = styled.span`
  display: inline-flex;
  width: 4.75rem;
  height: 2.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  padding: 0;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 0.75rem;
  font-weight: 700;
`

export const ClaimTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 1.875rem;
  line-height: 2.25rem;
`

export const ClaimSubtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.875rem;
  line-height: 1.0625rem;
`

export const ClaimInfo = styled.section`
  display: flex;
  width: min(100%, 38.75rem);
  box-sizing: border-box;
  flex-direction: column;
  height: 16rem;
  gap: 1rem;
  margin-top: 0;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  text-align: left;
`

export const InfoRow = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: 3rem minmax(0, 1fr);
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.8125rem; }
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 0.875rem; }
`

export const ClaimNotice = styled.p`
  width: 14.3125rem;
  height: 2.75rem;
  box-sizing: border-box;
  margin: 0;
  border: 0.0625rem solid rgb(255 122 53 / 18%);
  border-radius: 1rem;
  padding: 0.75rem;
  background: #fff7f1;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.75rem;
  white-space: nowrap;
`

export const ClaimProgress = styled.section`
  display: flex;
  width: min(100%, 38.75rem);
  box-sizing: border-box;
  flex-direction: column;
  height: 6rem;
  gap: 1rem;
  border: 0.0625rem solid #dee5f0;
  border-radius: 1.125rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  text-align: left;
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 0.875rem; }
  strong b { color: ${({ theme }) => theme.colors.brand.primary}; font-size: 0.9375rem; }
`

export const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  button { width: 9.1875rem; height: 3.25rem; min-height: 3.25rem; font-size: 0.875rem; }
`

export const ProgressTrack = styled.div`
  width: 100%;
  height: 0.5rem;
  overflow: hidden;
  border-radius: 62.4375rem;
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
  min-height: 13.75rem;
  box-sizing: border-box;
  align-items: center;
  gap: 2.5rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  padding: 1.75rem 2.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  @media (max-width: 35rem) { align-items: flex-start; flex-direction: column; }
`

export const AchievementCount = styled.div<{ $progress: number }>`
  position: relative;
  display: flex;
  width: 10.25rem;
  height: 10.25rem;
  flex: 0 0 10.25rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 1.375rem;
  background: ${({ theme }) => theme.colors.background.subtle};

  &::before {
    position: absolute;
    inset: 1.5rem;
    border-radius: 1.375rem;
    background: ${({ theme }) => theme.colors.background.default};
    content: '';
  }

  strong, span { position: relative; z-index: 1; }
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 2.25rem; line-height: 2.75rem; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.75rem; }
`

export const AchievementCopy = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.25rem;
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.875rem; }
  strong { color: ${({ theme }) => theme.colors.brand.primary}; font-size: 1.5rem; line-height: 1.875rem; }
  b { color: ${({ theme }) => theme.colors.brand.success}; font-size: 0.875rem; }
  em { display: block; width: min(100%, 20rem); min-height: 2.625rem; box-sizing: border-box; border-radius: 0.75rem; padding: 0.625rem; background: ${({ theme }) => theme.colors.background.muted}; color: ${({ theme }) => theme.colors.text.strong}; font-size: 0.8125rem; font-style: normal; text-align: center; }
`

export const ContinentSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;

  > ${SectionTitle} { margin-bottom: 0.75rem; font-size: 1.25rem; line-height: 1.5rem; }
`

export const ContinentRow = styled.div`
  display: flex;
  min-height: 3.625rem;
  box-sizing: border-box;
  flex-direction: column;
  gap: 0.375rem;
  justify-content: center;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.soft};
  border-radius: 0.875rem;
  padding: 0.875rem;
  background: ${({ theme }) => theme.colors.background.default};
  > div { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; }
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 0.875rem; }
  > div span { color: ${({ theme }) => theme.colors.brand.primary}; font-size: 0.75rem; }
  > ${ProgressTrack} { height: 0.375rem; }
`
