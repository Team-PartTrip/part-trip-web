import styled from 'styled-components'

export const Root = styled.section`
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

export const Error = styled.p`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 13px;
`

export const Body = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const FormCard = styled.section`
  display: flex;
  min-height: 486px;
  flex-direction: column;
  gap: 14px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const PreviewCard = styled.section`
  min-height: 486px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 15px;
  line-height: 20px;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  label { color: ${({ theme }) => theme.colors.text.strong}; font-size: 12px; font-weight: 600; }
`

export const DestinationGrid = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
`

export const DestinationButton = styled.button<{ $active: boolean }>`
  display: flex;
  min-height: 58px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 2px;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.brand.primary : theme.colors.border.default)};
  border-radius: 12px;
  padding: 0 12px;
  background: ${({ $active, theme }) => ($active ? theme.colors.background.muted : theme.colors.background.default)};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;
  strong { font-size: 13px; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; }
`

export const DateRange = styled.div`
  display: grid;
  align-items: center;
  gap: 8px;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  span { color: ${({ theme }) => theme.colors.text.muted}; }
`

export const MonthBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 12px 0;
  strong { font-size: 16px; }
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

export const CalendarCell = styled.div<{ $selected: boolean; $edge: boolean }>`
  display: grid;
  min-height: 44px;
  place-items: center;
  border-radius: 8px;
  background: ${({ $selected, $edge, theme }) => $edge ? theme.colors.brand.primary : $selected ? theme.colors.background.muted : 'transparent'};
  color: ${({ $edge, theme }) => $edge ? theme.colors.text.inverse : theme.colors.text.strong};
  font-size: 11px;
`

export const DateSummary = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 12px;
  font-weight: 600;
`
