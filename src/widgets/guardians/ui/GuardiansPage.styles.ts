import styled from 'styled-components'

export const Page = styled.main`
  width: min(100%, 75rem);
  margin: 1.5rem auto 4rem;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Header = styled.header`
  margin: 0 1.5rem 1.5rem;
  h1 { margin: 0; font-size: 1.875rem; line-height: 2.375rem; }
  p { margin: 0.5rem 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.9375rem; line-height: 1.375rem; }
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
  @media (max-width: 47.5rem) { grid-template-columns: 1fr; }
`

export const Card = styled.section`
  min-width: 0;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0; font-size: 1.25rem; line-height: 1.75rem; }
  > p { margin: 0.5rem 0 1.25rem; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.875rem; line-height: 1.3125rem; }
`

export const Code = styled.p`
  border-radius: 0.75rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-align: center;
`

export const Form = styled.form`
  display: flex;
  gap: 0.5rem;
  input { flex: 1; min-width: 0; }
  button { min-width: 7.5rem; }
  @media (max-width: 27.5rem) {
    align-items: stretch;
    flex-direction: column;
    input { flex: 0 0 3rem; height: 3rem; min-height: 3rem; }
  }
`

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const Person = styled.li`
  display: flex;
  min-height: 4rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  span { min-width: 0; overflow-wrap: anywhere; font-weight: 600; }
  button { min-height: 3rem; }
`

export const PersonActions = styled.div`
  display: flex;
  flex: 0 0 auto;
  gap: 0.5rem;
  button { min-height: 3rem; }
  @media (max-width: 32.5rem) { align-items: stretch; flex-direction: column; }
`

export const GuardianDetails = styled.div`
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  section { min-width: 0; border-radius: 0.75rem; padding: 1rem; background: ${({ theme }) => theme.colors.background.muted}; }
  h3 { margin: 0 0 0.75rem; font-size: 1rem; line-height: 1.375rem; }
  @media (max-width: 47.5rem) { grid-template-columns: 1fr; }
`

export const PlannerSelect = styled.select`
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

export const ScheduleList = styled.ul`
  display: flex;
  max-height: 17.5rem;
  flex-direction: column;
  gap: 0.5rem;
  overflow: auto;
  margin: 0;
  padding: 0;
  list-style: none;
  li { display: grid; gap: 0.25rem; border-bottom: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle}; padding: 0.5rem 0; }
  strong { font-size: 0.8125rem; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.75rem; line-height: 1.125rem; }
`

export const MapLink = styled.a`
  display: inline-flex;
  min-height: 3rem;
  align-items: center;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: 0.875rem;
  font-weight: 600;
`

export const Message = styled.p<{ $error?: boolean }>`
  color: ${({ $error, theme }) => $error ? theme.colors.status.error : theme.colors.text.muted};
  font-size: 0.875rem;
  line-height: 1.3125rem;
`
