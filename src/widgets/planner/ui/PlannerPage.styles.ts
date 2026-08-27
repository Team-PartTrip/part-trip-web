import styled from 'styled-components'

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
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
  font-size: 14px;
`

export const State = styled.p`
  margin: 80px 0;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`

export const PlannerTabs = styled.nav`
  display: flex;
  gap: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.soft};
  margin-bottom: 24px;

  button {
    min-width: 132px;
    height: 44px;
    border: 0;
    border-bottom: 2px solid transparent;
    padding: 0 12px;
    background: transparent;
    color: ${({ theme }) => theme.colors.text.muted};
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
  }

  button.active {
    border-bottom-color: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.brand.strong};
  }
`

export const PlannerListLayout = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr) 432px;

  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const PlanListPanel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;

  h2 { margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 18px; line-height: 24px; }
`

export const PlanRow = styled.button<{ $selected: boolean }>`
  display: flex;
  width: 100%;
  min-height: 76px;
  align-items: center;
  gap: 16px;
  border: 0;
  border-radius: 12px;
  padding: 16px 20px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;
  outline: ${({ $selected, theme }) => ($selected ? `2px solid ${theme.colors.brand.primary}` : 'none')};
`

export const PlanMarker = styled.span<{ $state: 'active' | 'planned' | 'completed' }>`
  width: 12px;
  height: 12px;
  flex: 0 0 12px;
  border-radius: 50%;
  background: ${({ $state, theme }) => $state === 'active' ? theme.colors.brand.primary : $state === 'completed' ? theme.colors.brand.successStrong : theme.colors.brand.strong};
`

export const PlanDetails = styled.span`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 4px;

  strong { font-size: 15px; line-height: 22px; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; }
`

export const PlanStatus = styled.span<{ $state: 'active' | 'planned' | 'completed' }>`
  color: ${({ $state, theme }) => $state === 'completed' ? theme.colors.brand.successStrong : $state === 'active' ? theme.colors.brand.primary : theme.colors.text.muted};
  font-size: 12px;
  white-space: nowrap;
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

  > ${StepCard} > div:first-of-type { display: none; }
`

export const StepField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  > label { color: ${({ theme }) => theme.colors.text.strong}; font-size: 12px; font-weight: 600; }
  input[readonly] { color: ${({ theme }) => theme.colors.text.muted}; }
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
  min-height: 48px;
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
  min-height: 360px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  p { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; }
`

export const InviteCode = styled.div`
  width: 100%;
  border-radius: 12px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 13px;
  font-weight: 600;
  overflow-wrap: anywhere;
`

export const InviteField = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 6px;
  margin-top: auto;
  label { color: ${({ theme }) => theme.colors.text.strong}; font-size: 12px; font-weight: 600; }
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
  gap: 8px;
  margin-bottom: 16px;
`

export const CategoryChip = styled.button<{ $active: boolean }>`
  height: 38px;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.brand.primary : theme.colors.border.default)};
  border-radius: 999px;
  padding: 0 16px;
  background: ${({ $active, theme }) => ($active ? theme.colors.brand.primary : theme.colors.background.default)};
  color: ${({ $active, theme }) => ($active ? theme.colors.text.inverse : theme.colors.text.muted)};
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
`

export const PlaceBody = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr) 456px;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const PlaceListPanel = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 486px;
  gap: 12px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0; font-size: 18px; line-height: 24px; }
`

export const PlaceRow = styled.div`
  display: flex;
  min-height: 92px;
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding: 10px 0;
  background: ${({ theme }) => theme.colors.background.default};
`

export const PlaceThumb = styled.span<{ $imageUrl?: string }>`
  width: 72px;
  height: 72px;
  flex: 0 0 72px;
  border-radius: 8px;
  background: ${({ $imageUrl }) => $imageUrl ? `url("${$imageUrl}") center / cover` : '#dee5f0'};
`

export const PlaceDetails = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 14px; }
  span { overflow: hidden; color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
`

export const PlaceAction = styled.button<{ $active: boolean }>`
  min-width: 48px;
  height: 34px;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.background.muted : theme.colors.border.default)};
  border-radius: 8px;
  background: ${({ $active, theme }) => ($active ? theme.colors.background.muted : theme.colors.background.default)};
  color: ${({ $active, theme }) => ($active ? theme.colors.brand.primary : theme.colors.text.muted)};
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
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
`

export const VoteBody = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr) 456px;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const CandidatePanel = styled.section`
  min-height: 486px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0 0 8px; font-size: 15px; }
`

export const CandidateRow = styled.div`
  display: flex;
  min-height: 92px;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  &:last-child { border-bottom: 0; }
`

export const VoteMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  span { border-radius: 8px; padding: 6px 8px; background: ${({ theme }) => theme.colors.background.muted}; color: ${({ theme }) => theme.colors.brand.strong}; font-size: 11px; }
  button { min-width: 48px; height: 32px; border: 1px solid ${({ theme }) => theme.colors.brand.strong}; border-radius: 8px; background: ${({ theme }) => theme.colors.background.default}; color: ${({ theme }) => theme.colors.brand.strong}; cursor: pointer; font-size: 11px; font-weight: 600; }
  button[aria-pressed="true"] { background: ${({ theme }) => theme.colors.brand.primary}; color: ${({ theme }) => theme.colors.text.inverse}; }
`

export const VoteSummary = styled.section`
  display: flex;
  min-height: 486px;
  flex-direction: column;
  gap: 12px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0; font-size: 15px; }
  > strong { font-size: 12px; }
  > small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; }
`

export const Deadline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-radius: 12px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 16px;
  font-weight: 600;
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; font-weight: 400; }
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

export const VoteGuidance = styled.p`
  display: grid;
  min-height: 93px;
  place-items: center;
  margin: 0;
  border-radius: 12px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 12px;
  text-align: center;
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
  border-radius: 20px;
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
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  p { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; line-height: 20px; }
`

export const FinalChecklist = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
  border-radius: 12px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 12px;
  line-height: 18px;
`

export const FinalActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
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
