import styled from 'styled-components'
import { Skeleton } from '@/shared/ui/parttrip'

export const LoadingLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const LoadingHeader = styled(Skeleton)`
  width: 13.75rem;
  height: 2.375rem;
`

export const LoadingTabs = styled(Skeleton)`
  width: 11.5rem;
  height: 2.25rem;
  border-radius: 62.4375rem;
`

export const LoadingBody = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(0, 1fr) 22.5rem;
`

export const LoadingMap = styled(Skeleton)`
  height: 29.375rem;
  border-radius: 1rem;
`

export const LoadingLocations = styled(Skeleton)`
  height: 20rem;
  border-radius: 1rem;
`

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Header = styled.header`
  margin-bottom: 1.25rem;
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 2rem;
  line-height: 2.5rem;
`

export const Subtitle = styled.p`
  margin: 0.375rem 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.8125rem;
  line-height: 1.125rem;
`

export const TripSelect = styled.select`
  min-height: 2.5rem;
  max-width: 17.5rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.default};
  border-radius: 0.75rem;
  padding: 0 0.75rem;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.strong};
  font: inherit;
  font-size: 0.75rem;
`

export const RecordTabs = styled.nav`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  button {
    min-width: 5.5rem;
    height: 2.25rem;
    border: 0;
    border-radius: 62.4375rem;
    padding: 0 1.25rem;
    background: ${({ theme }) => theme.colors.background.muted};
    color: ${({ theme }) => theme.colors.brand.primary};
    cursor: pointer;
    font-size: 0.6875rem;
    font-weight: 600;
  }
  button.active {
    background: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
  }
`

export const State = styled.p`
  padding: 4rem 0;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`

export const Body = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(0, 47.5rem) minmax(17.5rem, 1fr);
  @media (max-width: 56.25rem) { grid-template-columns: 1fr; }
`

export const MapPanel = styled.section`
  min-width: 0;
`

export const MapTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: 0.8125rem;
  line-height: 1.125rem;
`

export const MapSubtitle = styled.p`
  margin: 0.5rem 0 1rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.6875rem;
  line-height: 1rem;
`

export const MapCanvas = styled.div`
  position: relative;
  width: 100%;
  height: 29.375rem;
  overflow: hidden;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  background: ${({ theme }) => theme.colors.background.muted};
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  @media (max-width: 40rem) { height: 22.5rem; }
`

export const MapState = styled.p`
  display: grid;
  height: 100%;
  place-items: center;
  margin: 0;
  padding: 1.5rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.8125rem;
  text-align: center;
`

export const RouteSegment = styled.span<{ $left: number; $top: number; $length: number; $angle: number }>`
  position: absolute;
  top: ${({ $top }) => `${$top}%`};
  left: ${({ $left }) => `${$left}%`};
  width: ${({ $length }) => `${$length}%`};
  height: 0;
  border-top: 0.1875rem dashed ${({ theme }) => theme.colors.brand.primary};
  filter: drop-shadow(0 0 0.125rem rgb(255 255 255 / 90%));
  transform: rotate(${({ $angle }) => `${$angle}deg`});
  transform-origin: left center;
  z-index: 1;
`

export const MarkerGroup = styled.span<{ $left: number; $top: number }>`
  position: absolute;
  top: ${({ $top }) => `${$top}%`};
  left: ${({ $left }) => `${$left}%`};
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transform: translate(-50%, -100%);
`

export const MapMarker = styled.span`
  position: relative;
  display: grid;
  width: 1.75rem;
  height: 2.125rem;
  place-items: center;
  border: 0.125rem solid ${({ theme }) => theme.colors.background.default};
  border-radius: 50% 50% 50% 0;
  background: ${({ theme }) => theme.colors.brand.primary};
  box-shadow: 0 0.125rem 0.3125rem rgb(15 33 51 / 22%);
  color: ${({ theme }) => theme.colors.text.inverse};
  transform: rotate(-45deg);
  &::after {
    color: inherit;
    content: attr(data-number);
    font-size: 0.6875rem;
    font-weight: 700;
    transform: rotate(45deg);
  }
`

export const MapLabel = styled.span`
  border-radius: 0.375rem;
  padding: 0.25rem 0.375rem;
  background: rgb(255 255 255 / 88%);
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 0.625rem;
  font-weight: 600;
  white-space: nowrap;
`

export const LocationPanel = styled.aside`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 1rem;
`

export const LocationTitle = styled.h2`
  margin: 0 0 0.25rem;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 0.9375rem;
  line-height: 1.375rem;
`

export const LocationCard = styled.button`
  display: flex;
  min-height: 5.75rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border: 0;
  border-radius: 0.875rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.soft};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;
  span { display: flex; min-width: 0; flex-direction: column; gap: 0.25rem; }
  strong { font-size: 0.8125rem; line-height: 1.1875rem; }
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.6875rem; line-height: 0.9375rem; }
  b { color: ${({ theme }) => theme.colors.text.muted}; font-size: 1.375rem; font-weight: 400; }
  &:hover { background: ${({ theme }) => theme.colors.background.muted}; }
`
