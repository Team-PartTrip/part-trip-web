import styled from 'styled-components'

export const Page = styled.main`
  width: min(100%, 1200px);
  margin: 24px auto 64px;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Header = styled.header`
  margin: 0 24px 24px;
  h1 { margin: 0; font-size: 30px; line-height: 38px; }
  p { margin: 8px 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 15px; line-height: 22px; }
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  @media (max-width: 760px) { grid-template-columns: 1fr; }
`

export const Card = styled.section`
  min-width: 0;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0; font-size: 20px; line-height: 28px; }
  > p { margin: 8px 0 20px; color: ${({ theme }) => theme.colors.text.muted}; font-size: 14px; line-height: 21px; }
`

export const Code = styled.p`
  border-radius: 12px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-align: center;
`

export const Form = styled.form`
  display: flex;
  gap: 8px;
  input { flex: 1; min-width: 0; }
  button { min-width: 120px; }
  @media (max-width: 440px) { align-items: stretch; flex-direction: column; }
`

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const Person = styled.li`
  display: flex;
  min-height: 64px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  span { min-width: 0; overflow-wrap: anywhere; font-weight: 600; }
  button { min-height: 44px; }
`

export const PersonActions = styled.div`
  display: flex;
  flex: 0 0 auto;
  gap: 8px;
  button { min-height: 44px; }
  @media (max-width: 520px) { align-items: stretch; flex-direction: column; }
`

export const GuardianDetails = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  section { min-width: 0; border-radius: 12px; padding: 16px; background: ${({ theme }) => theme.colors.background.muted}; }
  h3 { margin: 0 0 12px; font-size: 16px; line-height: 22px; }
  @media (max-width: 760px) { grid-template-columns: 1fr; }
`

export const PlannerSelect = styled.select`
  width: 100%;
  min-height: 48px;
  margin-bottom: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 10px;
  padding: 0 12px;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.strong};
  font: inherit;
`

export const ScheduleList = styled.ul`
  display: flex;
  max-height: 280px;
  flex-direction: column;
  gap: 8px;
  overflow: auto;
  margin: 0;
  padding: 0;
  list-style: none;
  li { display: grid; gap: 4px; border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle}; padding: 8px 0; }
  strong { font-size: 13px; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; line-height: 18px; }
`

export const MapLink = styled.a`
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: 14px;
  font-weight: 600;
`

export const Message = styled.p<{ $error?: boolean }>`
  color: ${({ $error, theme }) => $error ? theme.colors.status.error : theme.colors.text.muted};
  font-size: 14px;
  line-height: 21px;
`
