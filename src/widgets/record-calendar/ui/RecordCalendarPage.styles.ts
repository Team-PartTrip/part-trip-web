import styled from 'styled-components'

export const Page = styled.main`
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

export const CalendarLayout = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(0, 45rem) minmax(20rem, 24.5rem);
  @media (max-width: 53.75rem) { grid-template-columns: 1fr; }
`

export const LoadingLayout = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(0, 45rem) minmax(20rem, 24.5rem);

  @media (max-width: 53.75rem) { grid-template-columns: 1fr; }
`

export const State = styled.p`
  padding: 5rem 0;
  color: ${({ theme }) => theme.colors.status.error};
  text-align: center;
`

export const CalendarCard = styled.section`
  min-height: 40.625rem;
  border-radius: 1.75rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const MonthBar = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
  h2 { margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 1.125rem; }
  p { margin: 0.25rem 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.6875rem; }
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

export const Cell = styled.button<{ $empty: boolean; $inTrip: boolean; $selected: boolean }>`
  position: relative;
  width: 100%;
  min-height: 4rem;
  border: 0;
  border-radius: 0.5rem;
  padding: 0.5rem;
  background: ${({ $empty, $inTrip, theme }) => $empty ? 'transparent' : $inTrip ? theme.colors.background.muted : theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: ${({ $empty }) => ($empty ? 'default' : 'pointer')};
  font: inherit;
  font-size: 0.6875rem;
  text-align: left;
  box-shadow: ${({ $selected, theme }) => ($selected ? `inset 0 0 0 0.125rem ${theme.colors.brand.primary}` : 'none')};
  &:disabled { cursor: default; }
  strong { font-weight: 500; }
  &:nth-child(7n + 1) strong { color: ${({ theme }) => theme.colors.status.error}; }
  @media (max-width: 35rem) { min-height: 3.125rem; padding: 0.375rem; }
`

export const EventLabel = styled.span`
  position: absolute;
  right: 0.375rem;
  bottom: 0.375rem;
  left: 0.375rem;
  overflow: hidden;
  border-radius: 0.375rem;
  padding: 0.25rem 0.125rem;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 0.5625rem;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Note = styled.p`
  margin: 1rem 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.8125rem;
  text-align: center;
`

export const FestivalList = styled.section`
  min-height: 40.625rem;
  max-height: 40.625rem;
  box-sizing: border-box;
  overflow-y: auto;
  border-radius: 1.75rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0 0 1rem; color: ${({ theme }) => theme.colors.text.strong}; font-size: 0.9375rem; }
  > button { margin-top: 1.5rem; border: 0; background: transparent; color: ${({ theme }) => theme.colors.brand.primary}; cursor: pointer; font-size: 0.75rem; font-weight: 600; }
`

export const FilterButton = styled.button`
  margin: -0.5rem 0 1rem;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.primary};
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
`

export const CategoryFilter = styled.select`
  width: 100%;
  min-height: 3rem;
  margin-bottom: 0.75rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.default};
  border-radius: 0.625rem;
  padding: 0 0.75rem;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.strong};
  font: inherit;
`

export const FestivalRow = styled.article`
  display: flex;
  min-height: 9rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  content-visibility: auto;
  contain-intrinsic-block-size: 9rem;
  border-radius: 0.75rem;
  padding: 1rem 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  div { display: flex; min-width: 0; flex-direction: column; gap: 0.25rem; }
  strong { overflow: hidden; color: ${({ theme }) => theme.colors.text.strong}; font-size: 0.8125rem; text-overflow: ellipsis; white-space: nowrap; }
  span { overflow: hidden; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.6875rem; text-overflow: ellipsis; white-space: nowrap; }
  small { flex: 0 0 auto; border-radius: 62.4375rem; padding: 0.25rem 0.5rem; background: ${({ theme }) => theme.colors.background.muted}; color: ${({ theme }) => theme.colors.brand.primary}; font-size: 0.625rem; }
`
