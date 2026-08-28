import styled from 'styled-components'
import { Skeleton } from '@/shared/ui/parttrip'

export const LoadingLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const LoadingHeader = styled(Skeleton)`
  width: 220px;
  height: 38px;
`

export const LoadingTabs = styled(Skeleton)`
  width: 184px;
  height: 36px;
  border-radius: 999px;
`

export const LoadingBody = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr) 360px;
`

export const LoadingMap = styled(Skeleton)`
  height: 470px;
  border-radius: 16px;
`

export const LoadingLocations = styled(Skeleton)`
  height: 320px;
  border-radius: 16px;
`

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Header = styled.header`
  margin-bottom: 20px;
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 32px;
  line-height: 40px;
`

export const Subtitle = styled.p`
  margin: 6px 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 13px;
  line-height: 18px;
`

export const RecordTabs = styled.nav`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  button {
    min-width: 88px;
    height: 36px;
    border: 0;
    border-radius: 999px;
    padding: 0 20px;
    background: ${({ theme }) => theme.colors.background.muted};
    color: ${({ theme }) => theme.colors.brand.primary};
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
  }
  button.active {
    background: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
  }
`

export const State = styled.p`
  padding: 64px 0;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`

export const Body = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 760px) minmax(280px, 1fr);
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`

export const MapPanel = styled.section`
  min-width: 0;
`

export const MapTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: 13px;
  line-height: 18px;
`

export const MapSubtitle = styled.p`
  margin: 8px 0 16px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 11px;
  line-height: 16px;
`

export const MapCanvas = styled.div`
  position: relative;
  width: 100%;
  height: 470px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.background.muted};
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  @media (max-width: 640px) { height: 360px; }
`

export const RouteSegment = styled.span<{ $left: number; $top: number; $length: number; $angle: number }>`
  position: absolute;
  top: ${({ $top }) => `${$top}%`};
  left: ${({ $left }) => `${$left}%`};
  width: ${({ $length }) => `${$length}%`};
  height: 0;
  border-top: 3px dashed ${({ theme }) => theme.colors.brand.primary};
  filter: drop-shadow(0 0 2px rgb(255 255 255 / 90%));
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
  gap: 8px;
  transform: translate(-50%, -100%);
`

export const MapMarker = styled.span`
  position: relative;
  display: grid;
  width: 28px;
  height: 34px;
  place-items: center;
  border: 2px solid ${({ theme }) => theme.colors.background.default};
  border-radius: 50% 50% 50% 0;
  background: ${({ theme }) => theme.colors.brand.primary};
  box-shadow: 0 2px 5px rgb(15 33 51 / 22%);
  color: ${({ theme }) => theme.colors.text.inverse};
  transform: rotate(-45deg);
  &::after {
    color: inherit;
    content: attr(data-number);
    font-size: 11px;
    font-weight: 700;
    transform: rotate(45deg);
  }
`

export const MapLabel = styled.span`
  border-radius: 6px;
  padding: 4px 6px;
  background: rgb(255 255 255 / 88%);
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
`

export const LocationPanel = styled.aside`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 16px;
`

export const LocationTitle = styled.h2`
  margin: 0 0 4px;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 15px;
  line-height: 22px;
`

export const LocationCard = styled.button`
  display: flex;
  min-height: 92px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 0;
  border-radius: 14px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.soft};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;
  span { display: flex; min-width: 0; flex-direction: column; gap: 4px; }
  strong { font-size: 13px; line-height: 19px; }
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; line-height: 15px; }
  b { color: ${({ theme }) => theme.colors.text.muted}; font-size: 22px; font-weight: 400; }
  &:hover { background: ${({ theme }) => theme.colors.background.muted}; }
`

export const MoreLocations = styled.button`
  align-self: flex-start;
  border: 0;
  padding: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.primary};
  cursor: pointer;
  font-size: 11px;
`
