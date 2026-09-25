import styled from 'styled-components'
import { Skeleton } from '@/shared/ui/parttrip'

export const Page = styled.main<{ $wide?: boolean }>`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: ${({ $wide }) => ($wide ? '0' : '2rem')};
  color: ${({ theme }) => theme.colors.text.strong};

  @media (max-width: 47.9375rem) {
    padding: 0;
  }
`

export const LoadingHeader = styled(Skeleton)`
  width: 13.75rem;
  height: 2.375rem;
`

export const LoadingLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const LoadingBody = styled(Skeleton)`
  width: 100%;
  height: 29.5rem;
  border-radius: 1rem;
`

export const Header = styled.header<{ $hasSubtitle?: boolean; $wide?: boolean }>`
  display: flex;
  min-height: ${({ $hasSubtitle, $wide }) => ($hasSubtitle ? ($wide ? '4.25rem' : '4.375rem') : '0')};
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.25rem;
  padding-inline: 1.5rem;
  margin-top: ${({ $wide }) => ($wide ? '1.5rem' : '0')};
  margin-bottom: 1.5rem;

  > button {
    min-width: 10.25rem;
    min-height: 3rem;
    padding: 0.875rem;
    border-radius: 0.875rem;
    font-size: 0.875rem;
  }
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 1.875rem;
  line-height: 2.375rem;
`

export const Subtitle = styled.p`
  margin: 0.5rem 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.875rem;
  line-height: 1.0625rem;
`

export const Error = styled.p`
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 0.875rem;
`

export const State = styled.p`
  margin: 5rem 0;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`

export const PlannerTabs = styled.nav`
  display: flex;
  min-height: 3rem;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;

  button {
    min-width: 7rem;
    min-height: 3rem;
    border: 0.0625rem solid ${({ theme }) => theme.colors.brand.primary};
    border-radius: 62.4375rem;
    padding: 0 1.125rem;
    background: ${({ theme }) => theme.colors.background.default};
    color: ${({ theme }) => theme.colors.brand.strong};
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;

    &:focus-visible { outline: 0.1875rem solid ${({ theme }) => theme.colors.brand.primary}; outline-offset: 0.125rem; }
  }

  button.active {
    background: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
    border-color: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: 0 0.1875rem 0.25rem rgb(26 110 191 / 16%);
  }
`

export const PlannerListLayout = styled.div`
  display: block;
`

export const PlanListPanel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;

`

export const PlanRow = styled.button<{ $state: 'active' | 'planned' | 'completed' }>`
  position: relative;
  display: flex;
  width: 100%;
  min-height: 8.5rem;
  align-items: center;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  padding: 0.8125rem 1.4375rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;
  text-align: left;

  &::before {
    position: absolute;
    top: -0.0625rem;
    left: 1.4375rem;
    width: 5.5rem;
    height: 0.1875rem;
    border-radius: 62.4375rem;
    background: ${({ $state, theme }) => $state === 'active' ? theme.colors.brand.accent : $state === 'completed' ? theme.colors.brand.success : theme.colors.brand.primary};
    content: '';
  }
`

export const PlanItem = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.5rem;

  ${PlanRow} {
    flex: 1;
  }
`

export const PlanContent = styled.span`
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`

export const PlanDetails = styled.span`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.5rem;

  strong { font-size: 1.1875rem; line-height: 1.375rem; }
  > span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.8125rem; line-height: 1rem; }
`

export const PlanStatus = styled.span<{ $state: 'active' | 'planned' | 'completed' }>`
  display: inline-flex;
  width: 7.5rem;
  height: 2rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  border: 0.0625rem solid ${({ $state, theme }) => $state === 'completed' ? theme.colors.brand.successStrong : $state === 'active' ? theme.colors.brand.accent : theme.colors.brand.primary};
  border-radius: 62.4375rem;
  padding: 0.5rem;
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ $state, theme }) => $state === 'completed' ? theme.colors.brand.successStrong : $state === 'active' ? theme.colors.brand.accent : theme.colors.brand.primary};
  font-size: 0.6875rem;
  font-weight: 600;
  white-space: nowrap;
`

export const PlanStatusRow = styled.span`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const PlanParticipation = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.75rem;
  line-height: 1rem;
  white-space: nowrap;
`

export const PlanAside = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-end;
  min-width: 18.75rem;

  @media (max-width: 43.75rem) { min-width: auto; }
`

export const RowArrow = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.5rem;
`

export const GroupForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const GroupTypeRow = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (max-width: 38.75rem) { grid-template-columns: 1fr; }
`

export const GroupTypeButton = styled.button<{ $active: boolean }>`
  min-height: 6rem;
  box-sizing: border-box;
  border: ${({ $active, theme }) => ($active ? `0.125rem solid ${theme.colors.brand.primary}` : `0.0625rem solid ${theme.colors.border.subtle}`)};
  border-radius: 0.875rem;
  padding: 1.25rem;
  background: ${({ $active, theme }) => ($active ? '#e2f2ff' : theme.colors.background.default)};
  color: ${({ $active, theme }) => ($active ? theme.colors.brand.primary : theme.colors.text.strong)};
  cursor: pointer;
  font-size: 1.0625rem;
  font-weight: 600;
  text-align: left;
`

export const CountRow = styled.div`
  display: flex;
  min-height: 5.75rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 0.875rem;
  padding: 1.25rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  label { color: ${({ theme }) => theme.colors.text.strong}; font-size: 0.9375rem; font-weight: 600; }
  > div { min-height: 2.75rem; gap: 0.875rem; border: 0; padding: 0; background: transparent; }
  > div button { width: 2.75rem; height: 3rem; border: 0.0625rem solid ${({ theme }) => theme.colors.brand.primary}; border-radius: 0.75rem; background: ${({ theme }) => theme.colors.background.default}; font-size: 0.875rem; }
`

export const MemberPanel = styled.section`
  display: flex;
  min-height: 16.875rem;
  box-sizing: border-box;
  flex-direction: column;
  gap: 0.875rem;
  border-radius: 1rem;
  padding: 1.25rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  > h2 { font-size: 1.125rem; line-height: 1.375rem; }
`

export const GroupActions = styled.div`
  display: flex;
  min-height: 3.25rem;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 0;

  > button { height: 3rem; }
  > button:first-child { width: 11.875rem; }
  > button:last-child { width: 8.75rem; }
`

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 0.9375rem;
  line-height: 1.25rem;
`

export const StepField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  > label { color: ${({ theme }) => theme.colors.text.strong}; font-size: 0.75rem; font-weight: 600; }
  input[readonly] { color: ${({ theme }) => theme.colors.text.muted}; }
`

export const Stepper = styled.div`
  display: flex;
  min-height: 2.875rem;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.default};
  border-radius: 0.75rem;
  padding: 0 0.75rem;
  background: ${({ theme }) => theme.colors.background.soft};

  > span { min-width: 1.5rem; color: ${({ theme }) => theme.colors.text.strong}; text-align: center; }
  button { width: 2.125rem; height: 2.125rem; border: 0; border-radius: 0.5rem; background: ${({ theme }) => theme.colors.background.default}; color: ${({ theme }) => theme.colors.brand.strong}; cursor: pointer; font-size: 1.125rem; }
  button:disabled { cursor: not-allowed; opacity: .45; }
`

export const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`

export const MemberRow = styled.div`
  display: flex;
  min-height: 3.375rem;
  align-items: center;
  gap: 0.625rem;
  padding: 0.375rem 0;
`

export const Avatar = styled.span`
  display: inline-flex;
  width: 2.125rem;
  height: 2.125rem;
  flex: 0 0 2.125rem;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 0.6875rem;
  font-weight: 600;
`

export const PlanMemberAvatars = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  ${Avatar} { width: 2.125rem; height: 2.125rem; flex-basis: 2.125rem; font-size: 0.6875rem; }
`

export const PlanMemberOverflow = styled.span`
  display: inline-flex;
  width: 2.125rem;
  height: 2.125rem;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.6875rem;
  font-weight: 600;
`

export const MemberDetails = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.125rem;
  strong { font-size: 0.9375rem; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.75rem; }
`

export const MemberState = styled.span`
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: 0.75rem;
  white-space: nowrap;
`

export const InvitePanel = styled.section`
  display: flex;
  min-height: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  border-radius: 1.75rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  p { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.8125rem; }
`

export const InvitationPanel = styled(InvitePanel)`
  width: 100%;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.background.muted};
  box-shadow: none;
`

export const InvitationRow = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.625rem;
  border-bottom: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  padding: 0.5rem 0;

  &:last-child { border-bottom: 0; }
  strong { flex: 1; color: ${({ theme }) => theme.colors.text.strong}; font-size: 0.8125rem; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.6875rem; }
`

export const SmallActionButton = styled.button`
  min-height: 1.875rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.default};
  border-radius: 0.5rem;
  padding: 0 0.5625rem;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.brand.strong};
  cursor: pointer;
  font-size: 0.6875rem;
  font-weight: 600;

  &:disabled { cursor: not-allowed; opacity: .5; }
`

export const InviteCodeRow = styled.div`
  display: grid;
  width: 100%;
  align-items: end;
  gap: 0.5rem;
  grid-template-columns: minmax(0, 1fr) auto;

  @media (max-width: 38.75rem) { grid-template-columns: 1fr; }
`

export const Notice = styled.p`
  margin: 0;
  border-radius: 0.75rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.75rem;
  line-height: 1.125rem;
`

export const Empty = styled.div`
  display: grid;
  min-height: 7.5rem;
  place-items: center;
  padding: 1.5rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.8125rem;
  text-align: center;
`
