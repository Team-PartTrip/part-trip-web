import styled from 'styled-components'
import { figmaHomeHero } from '@/shared/assets'
import { Skeleton } from '@/shared/ui/parttrip'

export const LoadingLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const LoadingHero = styled(Skeleton)`
  width: 100%;
  height: 16.25rem;
  border-radius: 1.375rem;
`

export const LoadingCalendar = styled(Skeleton)`
  width: 100%;
  height: 5.75rem;
  border-radius: 1rem;
`

export const LoadingRecommendations = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  > div { display: grid; gap: 1rem; grid-template-columns: repeat(3, minmax(0, 1fr)); }
`

export const LoadingHeading = styled(Skeleton)`
  width: 6.375rem;
  height: 1.5rem;
`

export const LoadingRecommendation = styled(Skeleton)`
  height: 13.75rem;
  border-radius: 1rem;
`

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  padding: 2rem;
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.text.strong};

  @media (max-width: 47.9375rem) {
    padding: 0;
  }
`

export const Error = styled.p`
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 0.875rem;
`

export const State = styled.p`
  margin: 0 0 1.5rem;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`

export const Hero = styled.section`
  position: relative;
  display: flex;
  min-height: 16.25rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;
  box-sizing: border-box;
  overflow: hidden;
  border: 0.0625rem solid rgb(13 74 132 / 12%);
  border-radius: 1.25rem;
  padding: 2.25rem;
  background-color: ${({ theme }) => theme.colors.brand.strong};
  background-image: linear-gradient(90deg, rgb(8 35 56 / 78%), rgb(8 35 56 / 58%) 48%, rgb(8 35 56 / 14%)), url(${figmaHomeHero});
  background-position: center;
  background-size: cover;
  color: ${({ theme }) => theme.colors.text.inverse};

  @media (max-width: 47.9375rem) {
    min-height: 18.75rem;
    border-radius: 1rem;
    padding: 1.5rem 1.25rem;
    background-position: 58% center;
  }
`

export const HeroLabel = styled.span`
  font-size: 0.8125rem;
  line-height: 1.125rem;
`

export const Dday = styled.strong`
  font-size: 2.75rem;
  line-height: 3.3125rem;
`

export const HeroTitle = styled.h1`
  max-width: 42.5rem;
  margin: 0;
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 700;
  line-height: 1.2;
  text-wrap: balance;
`

export const HeroCopy = styled.p`
  max-width: 32.5rem;
  margin: 0;
  color: rgb(255 255 255 / 94%);
  font-size: 1rem;
  line-height: 1.5rem;
`

export const TodayRoute = styled.div`
  display: flex;
  max-width: 47.5rem;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.125rem;

  span {
    display: inline-flex;
    min-height: 2.5rem;
    align-items: center;
    gap: 0.5rem;
    border: 0.0625rem solid rgb(255 255 255 / 50%);
    border-radius: 62.4375rem;
    padding: 0 0.875rem;
    background: rgb(13 40 58 / 38%);
    color: #fff;
    font-size: 0.9375rem;
    font-weight: 600;
  }

  i { font-style: normal; opacity: .8; }
`

export const HeroAction = styled.button`
  min-width: 11rem;
  min-height: 3rem;
  margin-top: auto;
  border: 0.0625rem solid #fff;
  border-radius: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: #fff;
  color: ${({ theme }) => theme.colors.brand.strong};
  cursor: pointer;
  font: inherit;
  font-size: 0.9375rem;
  font-weight: 700;

  &:hover { background: #f2f7fc; }
  &:focus-visible { outline: 0.1875rem solid #fff; outline-offset: 0.1875rem; }

  @media (max-width: 47.9375rem) { width: 100%; }
`

export const Destination = styled.strong`
  font-size: 1.5rem;
  line-height: 1.8125rem;
`

export const HeroMeta = styled.span`
  font-size: 0.8125rem;
  line-height: 1.125rem;
`

export const CalendarCard = styled.button`
  display: grid;
  width: 100%;
  min-height: 5.75rem;
  align-items: center;
  gap: 1rem;
  grid-template-columns: 3rem minmax(0, 1fr) auto;
  margin-top: 1.5rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  padding: 1.25rem 1.125rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;
  &:hover { background: ${({ theme }) => theme.colors.background.soft}; }
`

export const CalendarIcon = styled.span`
  display: grid;
  width: 3rem;
  height: 3rem;
  place-items: center;
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.colors.background.info};
  img { width: 1.5rem; height: 1.5rem; }
`

export const CalendarCopy = styled.span`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.25rem;
  strong { font-size: 1rem; line-height: 1.1875rem; }
  span { color: ${({ theme }) => theme.colors.brand.accent}; font-size: 0.8125rem; line-height: 1.125rem; }
`

export const CalendarArrow = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 1.25rem;
  line-height: 1.5rem;
`

export const Recommendations = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
`

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 1.25rem;
  line-height: 1.5rem;
`

export const RecommendationGrid = styled.div`
  display: grid;
  min-height: 15rem;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  @media (max-width: 43.75rem) { grid-template-columns: 1fr; }
`

export const Recommendation = styled.article`
  display: flex;
  height: 13.75rem;
  box-sizing: border-box;
  flex-direction: column;
  gap: 0.875rem;
  overflow: hidden;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  padding: 1.25rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  span { display: block; color: ${({ theme }) => theme.colors.text.strong}; font-size: 0.9375rem; font-weight: 600; line-height: 1.125rem; }
`

export const RecommendationImage = styled.div<{ $imageUrl?: string }>`
  display: grid;
  height: 9.375rem;
  flex: 0 0 9.375rem;
  place-items: center;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.colors.background.muted};
  background-image: ${({ $imageUrl }) => ($imageUrl ? `url(${JSON.stringify($imageUrl)})` : 'none')};
  background-position: center;
  background-size: cover;
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 0.8125rem;
`
