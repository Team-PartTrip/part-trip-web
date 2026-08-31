import styled from 'styled-components'
import { Skeleton } from '@/shared/ui/parttrip'

export const LoadingLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const LoadingHero = styled(Skeleton)`
  width: 100%;
  height: 260px;
  border-radius: 22px;
`

export const LoadingCalendar = styled(Skeleton)`
  width: 100%;
  height: 92px;
  border-radius: 16px;
`

export const LoadingRecommendations = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;

  > div { display: grid; gap: 16px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
`

export const LoadingHeading = styled(Skeleton)`
  width: 102px;
  height: 24px;
`

export const LoadingRecommendation = styled(Skeleton)`
  height: 220px;
  border-radius: 16px;
`

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  padding: 32px;
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.text.strong};

  @media (max-width: 767px) {
    padding: 0;
  }
`

export const Error = styled.p`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 14px;
`

export const State = styled.p`
  margin: 0 0 24px;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`

export const Hero = styled.section`
  display: flex;
  min-height: 260px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  box-sizing: border-box;
  border: 1px solid rgb(13 74 132 / 12%);
  border-radius: 22px;
  padding: 32px;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
`

export const HeroLabel = styled.span`
  font-size: 13px;
  line-height: 18px;
`

export const Dday = styled.strong`
  font-size: 44px;
  line-height: 53px;
`

export const Destination = styled.strong`
  font-size: 24px;
  line-height: 29px;
`

export const HeroMeta = styled.span`
  font-size: 13px;
  line-height: 18px;
`

export const CalendarCard = styled.button`
  display: grid;
  width: 100%;
  min-height: 92px;
  align-items: center;
  gap: 16px;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  margin-top: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  padding: 20px 18px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;
  &:hover { background: ${({ theme }) => theme.colors.background.soft}; }
`

export const CalendarIcon = styled.span`
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.background.info};
  img { width: 24px; height: 24px; }
`

export const CalendarCopy = styled.span`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
  strong { font-size: 16px; line-height: 19px; }
  span { color: ${({ theme }) => theme.colors.brand.accent}; font-size: 13px; line-height: 18px; }
`

export const CalendarArrow = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 20px;
  line-height: 24px;
`

export const Recommendations = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
`

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 20px;
  line-height: 24px;
`

export const RecommendationGrid = styled.div`
  display: grid;
  min-height: 240px;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  @media (max-width: 700px) { grid-template-columns: 1fr; }
`

export const Recommendation = styled.article`
  display: flex;
  height: 220px;
  box-sizing: border-box;
  flex-direction: column;
  gap: 14px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  span { display: block; color: ${({ theme }) => theme.colors.text.strong}; font-size: 15px; font-weight: 600; line-height: 18px; }
`

export const RecommendationImage = styled.div<{ $imageUrl?: string }>`
  display: grid;
  height: 150px;
  flex: 0 0 150px;
  place-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  background-color: #ebf4fc;
  background-image: ${({ $imageUrl }) => ($imageUrl ? `url(${JSON.stringify($imageUrl)})` : 'none')};
  background-position: center;
  background-size: cover;
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 13px;
`
