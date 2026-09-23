import styled from 'styled-components'
import { figmaHomeHero } from '@/shared/assets'
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
  position: relative;
  display: flex;
  min-height: 260px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid rgb(13 74 132 / 12%);
  border-radius: 20px;
  padding: 36px;
  background-color: ${({ theme }) => theme.colors.brand.strong};
  background-image: linear-gradient(90deg, rgb(8 35 56 / 78%), rgb(8 35 56 / 58%) 48%, rgb(8 35 56 / 14%)), url(${figmaHomeHero});
  background-position: center;
  background-size: cover;
  color: ${({ theme }) => theme.colors.text.inverse};

  @media (max-width: 767px) {
    min-height: 300px;
    border-radius: 16px;
    padding: 24px 20px;
    background-position: 58% center;
  }
`

export const HeroLabel = styled.span`
  font-size: 13px;
  line-height: 18px;
`

export const Dday = styled.strong`
  font-size: 44px;
  line-height: 53px;
`

export const HeroTitle = styled.h1`
  max-width: 680px;
  margin: 0;
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 700;
  line-height: 1.2;
  text-wrap: balance;
`

export const HeroCopy = styled.p`
  max-width: 520px;
  margin: 0;
  color: rgb(255 255 255 / 94%);
  font-size: 16px;
  line-height: 24px;
`

export const TodayRoute = styled.div`
  display: flex;
  max-width: 760px;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 2px;

  span {
    display: inline-flex;
    min-height: 40px;
    align-items: center;
    gap: 8px;
    border: 1px solid rgb(255 255 255 / 50%);
    border-radius: 999px;
    padding: 0 14px;
    background: rgb(13 40 58 / 38%);
    color: #fff;
    font-size: 15px;
    font-weight: 600;
  }

  i { font-style: normal; opacity: .8; }
`

export const HeroAction = styled.button`
  min-width: 176px;
  min-height: 48px;
  margin-top: auto;
  border: 1px solid #fff;
  border-radius: 12px;
  padding: 12px 20px;
  background: #fff;
  color: ${({ theme }) => theme.colors.brand.strong};
  cursor: pointer;
  font: inherit;
  font-size: 15px;
  font-weight: 700;

  &:hover { background: #f2f7fc; }
  &:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }

  @media (max-width: 767px) { width: 100%; }
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
