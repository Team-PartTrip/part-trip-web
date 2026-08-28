import styled from 'styled-components'

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Header = styled.header`
  margin-bottom: 24px;
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

export const CalendarLayout = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 720px) minmax(320px, 392px);
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const LoadingLayout = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 720px) minmax(320px, 392px);

  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const CalendarCard = styled.section`
  min-height: 650px;
  border-radius: 28px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const MonthBar = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
  h2 { margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 18px; }
  p { margin: 4px 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; }
  span { display: flex; gap: 4px; }
  button { width: 28px; height: 28px; border: 0; background: transparent; color: ${({ theme }) => theme.colors.brand.strong}; cursor: pointer; font-size: 18px; }
`

export const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 4px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 11px;
  text-align: center;
  span:first-child { color: ${({ theme }) => theme.colors.status.error}; }
`

export const CalendarGrid = styled.div`
  display: grid;
  gap: 4px;
  grid-template-columns: repeat(7, 1fr);
`

export const Cell = styled.div<{ $empty: boolean; $inTrip: boolean }>`
  position: relative;
  min-height: 64px;
  border-radius: 8px;
  padding: 8px;
  background: ${({ $empty, $inTrip, theme }) => $empty ? 'transparent' : $inTrip ? theme.colors.background.muted : theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 11px;
  strong { font-weight: 500; }
  &:nth-child(7n + 1) strong { color: ${({ theme }) => theme.colors.status.error}; }
  @media (max-width: 560px) { min-height: 50px; padding: 6px; }
`

export const EventLabel = styled.span`
  position: absolute;
  right: 6px;
  bottom: 6px;
  left: 6px;
  overflow: hidden;
  border-radius: 6px;
  padding: 4px 2px;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 9px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Note = styled.p`
  margin: 16px 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 13px;
  text-align: center;
`

export const FestivalList = styled.section`
  min-height: 650px;
  border-radius: 28px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0 0 16px; color: ${({ theme }) => theme.colors.text.strong}; font-size: 15px; }
  > button { margin-top: 24px; border: 0; background: transparent; color: ${({ theme }) => theme.colors.brand.primary}; cursor: pointer; font-size: 12px; font-weight: 600; }
`

export const FestivalRow = styled.article`
  display: flex;
  min-height: 144px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-left: 5px solid ${({ theme }) => theme.colors.brand.primary};
  border-radius: 12px;
  padding: 16px 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  div { display: flex; min-width: 0; flex-direction: column; gap: 4px; }
  strong { overflow: hidden; color: ${({ theme }) => theme.colors.text.strong}; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
  span { overflow: hidden; color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
  small { flex: 0 0 auto; border-radius: 999px; padding: 4px 8px; background: ${({ theme }) => theme.colors.background.muted}; color: ${({ theme }) => theme.colors.brand.primary}; font-size: 10px; }
`
