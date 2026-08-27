import styled from 'styled-components'

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
  font-size: 15px;
  line-height: 22px;
`

export const RecordTabs = styled.nav`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.soft};
  button { min-width: 96px; height: 36px; border: 0; border-bottom: 2px solid transparent; background: transparent; color: ${({ theme }) => theme.colors.text.muted}; cursor: pointer; font-size: 12px; font-weight: 600; }
  button.active { border-bottom-color: ${({ theme }) => theme.colors.brand.primary}; color: ${({ theme }) => theme.colors.brand.strong}; }
`

export const State = styled.p`
  padding: 64px 0;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`

export const Body = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr) 360px;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const RouteMap = styled.section`
  position: relative;
  min-height: 560px;
  overflow: hidden;
  border-radius: 28px;
  background: ${({ theme }) => theme.colors.background.muted};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  background-image: linear-gradient(rgb(255 255 255 / 45%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 45%) 1px, transparent 1px);
  background-size: 56px 56px;
  @media (max-width: 560px) { min-height: 360px; }
`

export const RouteLine = styled.span`
  position: absolute;
  top: 48%;
  right: 12%;
  left: 12%;
  height: 3px;
  background: ${({ theme }) => theme.colors.brand.primary};
  transform: rotate(-10deg);
  transform-origin: center;
  &::after { position: absolute; top: 1px; right: -1px; width: 58%; height: 3px; background: ${({ theme }) => theme.colors.brand.primary}; content: ''; transform: rotate(23deg); transform-origin: right center; }
`

export const MapPin = styled.span<{ $index: number }>`
  position: absolute;
  top: ${({ $index }) => `${36 + $index * 16}%`};
  left: ${({ $index }) => `${18 + $index * 28}%`};
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 11px;
  font-weight: 600;
  &::before { width: 12px; height: 12px; border: 3px solid ${({ theme }) => theme.colors.background.default}; border-radius: 50%; background: ${({ theme }) => theme.colors.brand.strong}; box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.brand.strong}; content: ''; }
`

export const MapCaption = styled.p`
  position: absolute;
  top: 24px;
  left: 28px;
  margin: 0;
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 15px;
  font-weight: 600;
`

export const MapDetail = styled.aside`
  display: flex;
  min-height: 560px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  overflow: hidden;
  border-radius: 28px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  > img { display: block; width: 100%; height: 212px; object-fit: cover; }
  h2 { margin: 0; font-size: 18px; }
  p { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; }
  > span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; line-height: 18px; }
  @media (max-width: 860px) { min-height: 320px; > img { height: 180px; } }
`

export const Badge = styled.span`
  border-radius: 999px;
  padding: 5px 8px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 11px;
`

export const Empty = styled.div`
  display: grid;
  width: 100%;
  min-height: 240px;
  place-items: center;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`
