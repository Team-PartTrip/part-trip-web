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

export const LoadingBody = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
`

export const LoadingPanel = styled(Skeleton)`
  height: 30.375rem;
  border-radius: 1rem;
`

export const Root = styled.section`
  width: 100%;
  min-width: 0;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Header = styled.header`
  margin-bottom: 1.5rem;
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
  font-size: 0.9375rem;
  line-height: 1.375rem;
`

export const Error = styled.p`
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 0.8125rem;
`

export const Body = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (max-width: 53.75rem) { grid-template-columns: 1fr; }
`

export const FormCard = styled.section`
  display: flex;
  min-height: 30.375rem;
  flex-direction: column;
  gap: 0.875rem;
  border-radius: 1.25rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const PreviewCard = styled.section`
  min-height: 30.375rem;
  border-radius: 1.25rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 0.9375rem;
  line-height: 1.25rem;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  label { color: ${({ theme }) => theme.colors.text.strong}; font-size: 0.75rem; font-weight: 600; }
`

export const DestinationGrid = styled.div`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
`

export const DestinationButton = styled.button<{ $active: boolean }>`
  display: flex;
  min-height: 3.625rem;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.125rem;
  border: 0.0625rem solid ${({ $active, theme }) => ($active ? theme.colors.brand.primary : theme.colors.border.default)};
  border-radius: 0.75rem;
  padding: 0 0.75rem;
  background: ${({ $active, theme }) => ($active ? theme.colors.background.muted : theme.colors.background.default)};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;
  strong { font-size: 0.8125rem; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.6875rem; }
  &:disabled { cursor: default; }
`

export const DateRange = styled.div`
  display: grid;
  align-items: center;
  gap: 0.5rem;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  span { color: ${({ theme }) => theme.colors.text.muted}; }
`

export const MonthBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.75rem 0;
  strong { font-size: 1rem; }
  span { display: flex; gap: 0.25rem; }
  button { width: 1.75rem; height: 1.75rem; border: 0; background: transparent; color: ${({ theme }) => theme.colors.brand.strong}; cursor: pointer; font-size: 1.125rem; }
`

export const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 0.25rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.6875rem;
  text-align: center;
  span:first-child { color: ${({ theme }) => theme.colors.status.error}; }
`

export const CalendarGrid = styled.div`
  display: grid;
  gap: 0.25rem;
  grid-template-columns: repeat(7, 1fr);
`

export const CalendarCell = styled.div<{ $selected: boolean; $edge: boolean }>`
  display: grid;
  min-height: 2.75rem;
  place-items: center;
  border-radius: 0.5rem;
  background: ${({ $selected, $edge, theme }) => $edge ? theme.colors.brand.primary : $selected ? theme.colors.background.muted : 'transparent'};
  color: ${({ $edge, theme }) => $edge ? theme.colors.text.inverse : theme.colors.text.strong};
  font-size: 0.6875rem;
`

export const DateSummary = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.25rem;
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 0.75rem;
  font-weight: 600;
`
