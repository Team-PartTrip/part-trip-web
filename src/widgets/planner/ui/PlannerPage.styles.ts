import styled from 'styled-components'
import { Skeleton } from '@/shared/ui/parttrip'

export const Page = styled.main<{ $wide?: boolean }>`
  width: 100%;
  min-width: 0;
  width: ${({ $wide }) => ($wide ? 'calc(100% + 32px)' : '100%')};
  margin-left: ${({ $wide }) => ($wide ? '-32px' : '0')};
  color: ${({ theme }) => theme.colors.text.strong};
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

export const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding-inline: 24px;
  margin-bottom: 24px;

  > button {
    width: 112px;
    height: 48px;
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
  margin: 6px 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 15px;
  line-height: 22px;
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
  gap: 16px;
  margin-bottom: 24px;

  button {
    width: 96px;
    height: 34px;
    border: 1px solid ${({ theme }) => theme.colors.border.subtle};
    border-radius: 17px;
    padding: 0 10px;
    background: ${({ theme }) => theme.colors.background.default};
    color: ${({ theme }) => theme.colors.brand.primary};
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
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
  gap: 12px;

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
  border-radius: 999px;
  padding: 8px;
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ $state, theme }) => $state === 'completed' ? theme.colors.brand.successStrong : $state === 'active' ? theme.colors.brand.primary : theme.colors.text.muted};
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
  min-width: 160px;
`

export const RowArrow = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
`

export const SelectedPlanPanel = styled.section`
  height: 640px;
  overflow: hidden;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};

  > img { display: block; width: 100%; height: 180px; object-fit: cover; }
  > div { display: flex; min-height: 286px; flex-direction: column; align-items: flex-start; gap: 10px; padding: 20px 24px; }
  h2 { margin: 0; font-size: 18px; }
  p { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; }
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; }
`

export const StepCard = styled.section`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 16px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};

  h2 { margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 24px; line-height: 32px; }
  p { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; line-height: 20px; }
`

export const FlowStepper = styled.nav`
  display: flex;
  max-width: 100%;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  overflow-x: auto;
  padding-top: 4px;
`

export const FlowStep = styled.span<{ $active: boolean; $complete: boolean }>`
  flex: 0 0 auto;
  border-radius: 999px;
  padding: 7px 12px;
  background: ${({ $active, $complete, theme }) => ($active ? theme.colors.brand.primary : $complete ? theme.colors.background.muted : theme.colors.background.soft)};
  color: ${({ $active, $complete, theme }) => ($active ? theme.colors.text.inverse : $complete ? theme.colors.brand.primary : theme.colors.text.muted)};
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
`

export const GroupForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  font-size: 13px;
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
  border-radius: 12px;
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
  gap: 8px;
  border-radius: 16px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const GroupActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;

  > button:first-child { width: 190px; }
  > button:last-child { width: 140px; }
`

export const StepNumber = styled.span`
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
`

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 15px;
  line-height: 20px;
`

export const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
`

export const TwoColumn = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr) 456px;

  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const SettingsLayout = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 860px) { grid-template-columns: 1fr; }

  > ${StepCard} > div:first-of-type,
  > ${StepCard} > div:nth-of-type(4),
  > ${StepCard} > div:nth-of-type(5),
  > ${StepCard} > div:nth-of-type(6) { display: none; }
`

export const StepField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  > label { color: ${({ theme }) => theme.colors.text.strong}; font-size: 12px; font-weight: 600; }
  input[readonly] { color: ${({ theme }) => theme.colors.text.muted}; }
`

export const FieldHint = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 11px;
  font-weight: 400;
  line-height: 16px;
`

export const SearchEmpty = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 12px;
  line-height: 18px;
`

export const SegmentRow = styled.div`
  display: flex;
  gap: 8px;
`

export const SegmentButton = styled.button<{ $active: boolean }>`
  min-width: 120px;
  height: 44px;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.brand.primary : theme.colors.border.default)};
  border-radius: 12px;
  background: ${({ $active, theme }) => ($active ? theme.colors.brand.primary : theme.colors.background.default)};
  color: ${({ $active, theme }) => ($active ? theme.colors.text.inverse : theme.colors.text.muted)};
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
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
  gap: 8px;
`

export const MemberRow = styled.div`
  display: flex;
  min-height: 54px;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding: 6px 0;
`

export const Avatar = styled.span`
  display: inline-flex;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 11px;
  font-weight: 600;
`

export const MemberDetails = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  strong { font-size: 14px; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; }
`

export const MemberState = styled.span`
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: 11px;
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

export const InviteMemberRow = styled.div`
  display: grid;
  width: 100%;
  align-items: end;
  gap: 8px;
  grid-template-columns: minmax(0, 1fr) auto;

  @media (max-width: 620px) { grid-template-columns: 1fr; }
`

export const InviteLinkRow = styled.div`
  display: grid;
  width: 100%;
  align-items: center;
  gap: 8px;
  grid-template-columns: minmax(0, 1fr) auto;
`

export const InviteCodeRow = styled.div`
  display: grid;
  width: 100%;
  align-items: end;
  gap: 8px;
  grid-template-columns: minmax(0, 1fr) auto;

  @media (max-width: 620px) { grid-template-columns: 1fr; }
`

export const PopularGrid = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
`

export const PopularButton = styled.button<{ $active: boolean }>`
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

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

export const StyleChip = styled.button<{ $active: boolean }>`
  height: 32px;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.brand.primary : theme.colors.border.default)};
  border-radius: 999px;
  padding: 0 12px;
  background: ${({ $active, theme }) => ($active ? theme.colors.brand.primary : theme.colors.background.default)};
  color: ${({ $active, theme }) => ($active ? theme.colors.text.inverse : theme.colors.text.muted)};
  cursor: pointer;
  font-size: 12px;
`

export const PreviewPanel = styled.section`
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const CalendarPanel = styled.section`
  min-height: 402px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const CalendarHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 13px;
  span { display: flex; gap: 4px; color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; }
  button { width: 24px; height: 24px; border: 0; border-radius: 8px; background: ${({ theme }) => theme.colors.background.muted}; color: ${({ theme }) => theme.colors.text.strong}; cursor: pointer; }
`

export const Weekdays = styled.div`
  display: grid;
  gap: 4px;
  grid-template-columns: repeat(7, 1fr);
  margin-top: 14px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 10px;
  text-align: center;
`

export const CalendarGrid = styled.div`
  display: grid;
  gap: 4px;
  grid-template-columns: repeat(7, 1fr);
  margin-top: 8px;
`

export const CalendarDay = styled.button<{ $selected: boolean; $range: boolean }>`
  min-height: 30px;
  border: 0;
  border-radius: 4px;
  padding: 0;
  background: ${({ $selected, $range, theme }) => ($selected ? theme.colors.brand.primary : $range ? theme.colors.background.info : 'transparent')};
  color: ${({ $selected, theme }) => ($selected ? theme.colors.text.inverse : theme.colors.text.strong)};
  cursor: pointer;
  font-size: 10px;
`

export const CalendarSummary = styled.p`
  margin: 14px 0 0;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: 11px;
  font-weight: 600;
`

export const PreviewCard = styled.article`
  width: 100%;
  max-width: 360px;
  overflow: hidden;
  margin: 12px auto 0;
  border-radius: 28px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  img { display: block; width: 100%; height: 170px; object-fit: cover; }
  > div { display: flex; min-height: 148px; flex-direction: column; gap: 8px; padding: 20px 24px; }
  h2, p { margin: 0; }
  h2 { font-size: 18px; }
  p { color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; }
  small { color: ${({ theme }) => theme.colors.brand.strong}; font-size: 12px; font-weight: 600; }
  small b { float: right; }
`

export const CategoryChips = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 16px;
`

export const CategoryChip = styled.button<{ $active: boolean }>`
  width: 92px;
  height: 34px;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.brand.primary : theme.colors.border.default)};
  border-radius: 999px;
  padding: 0 10px;
  background: ${({ $active, theme }) => ($active ? theme.colors.brand.primary : theme.colors.background.default)};
  color: ${({ $active, theme }) => ($active ? theme.colors.text.inverse : theme.colors.text.muted)};
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
`

export const VoteCategoryChips = styled(CategoryChips)`
  gap: 14px;

  ${CategoryChip} {
    height: 36px;
    border: 0;
    border-radius: 12px;
    background: ${({ theme }) => theme.colors.background.muted};

    &:first-child { background: ${({ theme }) => theme.colors.background.muted}; }
  }

  ${CategoryChip}.active {
    background: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
  }
`

export const VoteStatusRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`

export const VoteStatus = styled.span<{ $active?: boolean }>`
  display: inline-flex;
  width: ${({ $active }) => ($active ? '96px' : '112px')};
  height: 36px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  padding: 10px;
  background: ${({ $active, theme }) => ($active ? theme.colors.brand.primary : theme.colors.background.muted)};
  color: ${({ $active, theme }) => ($active ? theme.colors.text.inverse : theme.colors.brand.primary)};
  font-size: 12px;
  font-weight: 600;
`

export const PlaceBody = styled.div`
  display: block;
`

export const PlaceListPanel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const PlaceListHeader = styled.header`
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  span, button { color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; }
  button { border: 0; padding: 0; background: transparent; color: ${({ theme }) => theme.colors.brand.primary}; cursor: pointer; font-weight: 600; }
`

export const DirectCandidate = styled.div`
  display: flex;
  max-width: 520px;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;

  label { color: ${({ theme }) => theme.colors.text.strong}; font-size: 12px; font-weight: 600; }
`

export const PlaceRow = styled.div<{ $active?: boolean }>`
  display: flex;
  min-height: 102px;
  align-items: center;
  gap: 14px;
  box-sizing: border-box;
  border: ${({ $active, theme }) => ($active ? `1.5px solid ${theme.colors.brand.primary}` : `1px solid ${theme.colors.border.subtle}`)};
  border-radius: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const PlaceThumb = styled.span<{ $imageUrl?: string }>`
  display: grid;
  width: 88px;
  height: 70px;
  flex: 0 0 88px;
  place-items: center;
  overflow: hidden;
  border: 1px solid #dceaf7;
  border-radius: 14px;
  background-color: #ebf4fc;
  background-image: ${({ $imageUrl }) => $imageUrl ? `url(${JSON.stringify($imageUrl)})` : 'none'};
  background-position: center;
  background-size: cover;
  color: #29527a;
  font-size: 12px;
  font-weight: 600;
`

export const PlaceDetails = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 16px; }
  span { overflow: hidden; color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
`

export const PlaceAction = styled.button<{ $active: boolean }>`
  display: flex;
  width: 130px;
  height: 48px;
  flex: 0 0 130px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  font-weight: 600;

  span {
    display: inline-flex;
    width: ${({ $active }) => ($active ? '86px' : '72px')};
    height: 30px;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: 8px;
    background: ${({ $active, theme }) => ($active ? theme.colors.background.muted : theme.colors.background.subtle)};
    color: ${({ $active, theme }) => ($active ? theme.colors.brand.primary : theme.colors.text.muted)};
    font-size: 11px;
  }

  b {
    display: inline-flex;
    width: 36px;
    height: 36px;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.brand.primary : theme.colors.border.default)};
    border-radius: 50%;
    background: ${({ $active, theme }) => ($active ? theme.colors.brand.primary : theme.colors.background.default)};
    color: ${({ $active, theme }) => ($active ? theme.colors.text.inverse : theme.colors.text.muted)};
    font-size: 13px;
  }
`

export const SelectedPanel = styled.section`
  display: flex;
  min-height: 486px;
  flex-direction: column;
  gap: 12px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0; font-size: 15px; }
`

export const SelectionGuidance = styled.div`
  display: flex;
  min-height: 196px;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  border-radius: 12px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.muted};

  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 13px; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; }
`

export const SelectedRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding: 10px 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 13px;
  button { border: 0; background: transparent; color: ${({ theme }) => theme.colors.text.muted}; cursor: pointer; font-size: 16px; }
`

export const PanelActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;

  > button { width: 100%; height: 48px; }
`

export const VoteBody = styled.div`
  display: block;
`

export const CandidatePanel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  ${PlaceThumb} { display: none; }
  ${PlaceDetails} { strong { font-size: 16px; } span { font-size: 13px; } }
  > ${PanelActions} { align-items: flex-start; }
  > ${PanelActions} > button { width: 180px; }
`

export const CandidateRow = styled.div<{ $selected?: boolean }>`
  display: flex;
  min-height: 108px;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  box-sizing: border-box;
  border: ${({ $selected, theme }) => ($selected ? `1.5px solid ${theme.colors.brand.primary}` : `1px solid ${theme.colors.border.subtle}`)};
  border-radius: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const DeleteOptionButton = styled.button`
  border: 0;
  padding: 4px;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  font-size: 11px;

  &:disabled { cursor: not-allowed; opacity: .5; }
`

export const VoteMeta = styled.div<{ $selected?: boolean }>`
  display: flex;
  min-width: 120px;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  span { color: ${({ theme }) => theme.colors.brand.primary}; font-size: 13px; font-weight: 600; }
  button { width: 120px; height: 48px; border: 1px solid ${({ $selected, theme }) => ($selected ? theme.colors.border.subtle : theme.colors.brand.primary)}; border-radius: 14px; padding: 14px; background: ${({ $selected, theme }) => ($selected ? theme.colors.background.default : theme.colors.brand.primary)}; color: ${({ $selected, theme }) => ($selected ? theme.colors.brand.primary : theme.colors.text.inverse)}; cursor: pointer; font-size: 14px; font-weight: 600; }
  button:disabled { cursor: not-allowed; opacity: .6; }
`

export const MemberAvatars = styled.div`
  display: flex;
  gap: 4px;
  ${Avatar} { width: 24px; height: 24px; flex-basis: 24px; font-size: 9px; }
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

export const ActionFeedback = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.brand.successStrong};
  font-size: 12px;
  line-height: 18px;
`

export const SelectedPlaces = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const SelectedPlaceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  small { color: ${({ theme }) => theme.colors.brand.primary}; font-size: 11px; }
`

export const PlaceMarker = styled.span`
  width: 8px;
  height: 8px;
  flex: 0 0 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brand.primary};
`

export const NextPanel = styled.section`
  display: flex;
  min-height: 360px;
  flex-direction: column;
  gap: 12px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  p { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; line-height: 20px; }
  > label { color: ${({ theme }) => theme.colors.text.strong}; font-size: 12px; font-weight: 600; }
`

export const ProgressStats = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-bottom: 16px;
`

export const ProgressStat = styled.div`
  display: flex;
  min-height: 62px;
  flex-direction: column;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 12px;
  padding: 12px 16px;
  strong { color: ${({ theme }) => theme.colors.brand.primary}; font-size: 24px; line-height: 28px; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; }
`

export const ProgressBody = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr) 456px;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const CategoryStatusPanel = styled.section`
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const StatusLine = styled.div`
  display: grid;
  align-items: center;
  gap: 8px;
  grid-template-columns: 72px minmax(0, 1fr) auto;
  min-height: 44px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  font-size: 12px;
  &:last-child { border-bottom: 0; }
  > span { border-radius: 8px; padding: 6px; background: ${({ theme }) => theme.colors.background.muted}; color: ${({ theme }) => theme.colors.brand.strong}; text-align: center; }
  strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  small { color: ${({ theme }) => theme.colors.text.muted}; }
`

export const ConfirmOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 4px 0 10px;
`

export const ConfirmOptionButton = styled.button<{ $confirmed?: boolean }>`
  min-height: 30px;
  border: 1px solid ${({ $confirmed, theme }) => ($confirmed ? theme.colors.brand.primary : theme.colors.border.default)};
  border-radius: 8px;
  padding: 0 9px;
  background: ${({ $confirmed, theme }) => ($confirmed ? theme.colors.background.muted : theme.colors.background.default)};
  color: ${({ $confirmed, theme }) => ($confirmed ? theme.colors.brand.primary : theme.colors.text.muted)};
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;

  &:disabled { cursor: not-allowed; opacity: .55; }
`

export const MemberResponses = styled.section`
  display: flex;
  min-height: 300px;
  flex-direction: column;
  gap: 4px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const ResponseRow = styled.div`
  display: flex;
  min-height: 44px;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  font-size: 12px;
  strong { flex: 1; }
  span { color: ${({ theme }) => theme.colors.brand.successStrong}; font-size: 11px; }
`

export const FinalBody = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr) 456px;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const FinalPlan = styled.section`
  display: flex;
  min-height: 560px;
  flex-direction: column;
  gap: 12px;
  border-radius: 28px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const FinalTripCard = styled.article`
  width: 360px;
  max-width: 100%;
  overflow: hidden;
  border-radius: 28px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  img { display: block; width: 100%; height: 170px; object-fit: cover; }
  > div { display: flex; min-height: 100px; flex-direction: column; gap: 6px; padding: 16px; }
  h2, p { margin: 0; }
  h2 { font-size: 16px; }
  p { color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; }
  small { color: ${({ theme }) => theme.colors.brand.strong}; font-size: 11px; font-weight: 600; }
  small b { float: right; }
`

export const FinalPlaceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const FinalPlaceRow = styled.div`
  display: grid;
  align-items: center;
  gap: 8px;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  min-height: 36px;
  font-size: 12px;
  small { color: ${({ theme }) => theme.colors.text.muted}; }
  span { border-radius: 8px; padding: 6px 8px; background: ${({ theme }) => theme.colors.background.muted}; color: ${({ theme }) => theme.colors.brand.strong}; font-size: 11px; }
`

export const FinalConfirmPanel = styled.section`
  display: flex;
  min-height: 708px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  border-radius: 28px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  p { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; line-height: 20px; }
`

export const FinalActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Badge = styled.span`
  border-radius: 999px;
  padding: 5px 8px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 11px;
`

export const PlaceDetailLayout = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr) 456px;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const PlaceImage = styled.img`
  display: block;
  width: 100%;
  height: 480px;
  border-radius: 20px;
  object-fit: cover;
`

export const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  overflow: hidden;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.border.subtle};
`

export const ProgressBar = styled.span<{ $progress: number }>`
  display: block;
  width: ${({ $progress }) => `${Math.max(0, Math.min(100, $progress))}%`};
  height: 100%;
  border-radius: inherit;
  background: ${({ theme }) => theme.colors.brand.primary};
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
