import styled from 'styled-components'
import { Skeleton } from '@/shared/ui/parttrip'

export const Page = styled.main<{ $wide?: boolean }>`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: ${({ $wide }) => ($wide ? '0' : '32px')};
  color: ${({ theme }) => theme.colors.text.strong};

  @media (max-width: 767px) {
    padding: 0;
  }
`

export const LoadingHeader = styled(Skeleton)`
  width: 220px;
  height: 38px;
`

export const LoadingLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const LoadingBody = styled(Skeleton)`
  width: 100%;
  height: 472px;
  border-radius: 16px;
`

export const Header = styled.header<{ $hasSubtitle?: boolean; $wide?: boolean }>`
  display: flex;
  min-height: ${({ $hasSubtitle, $wide }) => ($hasSubtitle ? ($wide ? '68px' : '70px') : '0')};
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding-inline: 24px;
  margin-top: ${({ $wide }) => ($wide ? '24px' : '0')};
  margin-bottom: 24px;

  > button {
    min-width: 164px;
    min-height: 48px;
    padding: 14px;
    border-radius: 14px;
    font-size: 14px;
  }
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 30px;
  line-height: 38px;
`

export const Subtitle = styled.p`
  margin: 8px 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 14px;
  line-height: 17px;
`

export const Error = styled.p`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 14px;
`

export const State = styled.p`
  margin: 80px 0;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`

export const PlannerTabs = styled.nav`
  display: flex;
  min-height: 48px;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;

  button {
    min-width: 112px;
    min-height: 48px;
    border: 1px solid ${({ theme }) => theme.colors.brand.primary};
    border-radius: 999px;
    padding: 0 18px;
    background: ${({ theme }) => theme.colors.background.default};
    color: ${({ theme }) => theme.colors.brand.strong};
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;

    &:focus-visible { outline: 3px solid ${({ theme }) => theme.colors.brand.primary}; outline-offset: 2px; }
  }

  button.active {
    background: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
    border-color: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: 0 3px 4px rgb(26 110 191 / 16%);
  }
`

export const PlannerListLayout = styled.div`
  display: block;
`

export const PlanListPanel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;

`

export const PlanRow = styled.button<{ $state: 'active' | 'planned' | 'completed' }>`
  position: relative;
  display: flex;
  width: 100%;
  min-height: 136px;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  padding: 13px 23px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;
  text-align: left;

  &::before {
    position: absolute;
    top: -1px;
    left: 23px;
    width: 88px;
    height: 3px;
    border-radius: 999px;
    background: ${({ $state, theme }) => $state === 'active' ? theme.colors.brand.accent : $state === 'completed' ? theme.colors.brand.success : theme.colors.brand.primary};
    content: '';
  }
`

export const PlanItem = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;

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
  gap: 16px;
`

export const PlanDetails = styled.span`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 8px;

  strong { font-size: 19px; line-height: 22px; }
  > span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; line-height: 16px; }
`

export const PlanStatus = styled.span<{ $state: 'active' | 'planned' | 'completed' }>`
  display: inline-flex;
  width: 120px;
  height: 32px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ $state, theme }) => $state === 'completed' ? theme.colors.brand.successStrong : $state === 'active' ? theme.colors.brand.accent : theme.colors.brand.primary};
  border-radius: 999px;
  padding: 8px;
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ $state, theme }) => $state === 'completed' ? theme.colors.brand.successStrong : $state === 'active' ? theme.colors.brand.accent : theme.colors.brand.primary};
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
`

export const PlanStatusRow = styled.span`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const PlanParticipation = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
`

export const PlanAside = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
  min-width: 300px;

  @media (max-width: 700px) { min-width: auto; }
`

export const RowArrow = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
`

export const GroupForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const GroupTypeRow = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (max-width: 620px) { grid-template-columns: 1fr; }
`

export const GroupTypeButton = styled.button<{ $active: boolean }>`
  min-height: 96px;
  box-sizing: border-box;
  border: ${({ $active, theme }) => ($active ? `2px solid ${theme.colors.brand.primary}` : `1px solid ${theme.colors.border.subtle}`)};
  border-radius: 14px;
  padding: 20px;
  background: ${({ $active, theme }) => ($active ? '#e2f2ff' : theme.colors.background.default)};
  color: ${({ $active, theme }) => ($active ? theme.colors.brand.primary : theme.colors.text.strong)};
  cursor: pointer;
  font-size: 17px;
  font-weight: 600;
  text-align: left;
`

export const CountRow = styled.div`
  display: flex;
  min-height: 92px;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 14px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  label { color: ${({ theme }) => theme.colors.text.strong}; font-size: 15px; font-weight: 600; }
  > div { min-height: 44px; gap: 14px; border: 0; padding: 0; background: transparent; }
  > div button { width: 44px; height: 48px; border: 1px solid ${({ theme }) => theme.colors.brand.primary}; border-radius: 12px; background: ${({ theme }) => theme.colors.background.default}; font-size: 14px; }
`

export const MemberPanel = styled.section`
  display: flex;
  min-height: 270px;
  box-sizing: border-box;
  flex-direction: column;
  gap: 14px;
  border-radius: 16px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  > h2 { font-size: 18px; line-height: 22px; }
`

export const GroupActions = styled.div`
  display: flex;
  min-height: 52px;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 12px;
  margin-top: 0;

  > button { height: 48px; }
  > button:first-child { width: 190px; }
  > button:last-child { width: 140px; }
`

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 15px;
  line-height: 20px;
`

export const StepField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  > label { color: ${({ theme }) => theme.colors.text.strong}; font-size: 12px; font-weight: 600; }
  input[readonly] { color: ${({ theme }) => theme.colors.text.muted}; }
`

export const Stepper = styled.div`
  display: flex;
  min-height: 46px;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 12px;
  padding: 0 12px;
  background: ${({ theme }) => theme.colors.background.soft};

  > span { min-width: 24px; color: ${({ theme }) => theme.colors.text.strong}; text-align: center; }
  button { width: 34px; height: 34px; border: 0; border-radius: 8px; background: ${({ theme }) => theme.colors.background.default}; color: ${({ theme }) => theme.colors.brand.strong}; cursor: pointer; font-size: 18px; }
  button:disabled { cursor: not-allowed; opacity: .45; }
`

export const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const MemberRow = styled.div`
  display: flex;
  min-height: 54px;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
`

export const Avatar = styled.span`
  display: inline-flex;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 11px;
  font-weight: 600;
`

export const PlanMemberAvatars = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  ${Avatar} { width: 34px; height: 34px; flex-basis: 34px; font-size: 11px; }
`

export const PlanMemberOverflow = styled.span`
  display: inline-flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 11px;
  font-weight: 600;
`

export const MemberDetails = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  strong { font-size: 15px; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; }
`

export const MemberState = styled.span`
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: 12px;
  white-space: nowrap;
`

export const InvitePanel = styled.section`
  display: flex;
  min-height: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  border-radius: 28px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  p { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; }
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
  gap: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding: 8px 0;

  &:last-child { border-bottom: 0; }
  strong { flex: 1; color: ${({ theme }) => theme.colors.text.strong}; font-size: 13px; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; }
`

export const SmallActionButton = styled.button`
  min-height: 30px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 8px;
  padding: 0 9px;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.brand.strong};
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;

  &:disabled { cursor: not-allowed; opacity: .5; }
`

export const InviteCodeRow = styled.div`
  display: grid;
  width: 100%;
  align-items: end;
  gap: 8px;
  grid-template-columns: minmax(0, 1fr) auto;

  @media (max-width: 620px) { grid-template-columns: 1fr; }
`

export const Notice = styled.p`
  margin: 0;
  border-radius: 12px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 12px;
  line-height: 18px;
`

export const Empty = styled.div`
  display: grid;
  min-height: 120px;
  place-items: center;
  padding: 24px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 13px;
  text-align: center;
`
