import styled from "styled-components";
import { Skeleton } from "@/shared/ui/parttrip";

export const LoadingHeader = styled(Skeleton)`
  width: 220px;
  height: 38px;
`

export const LoadingLayout = styled.div`
  display: flex;
  min-height: 623px;
  align-items: center;
  justify-content: center;
`

export const LoadingCard = styled(Skeleton)`
  width: 420px;
  height: 523px;
  border-radius: 28px;
`

export const Page = styled.main<{ $wide?: boolean }>`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: ${({ $wide }) => ($wide ? '0' : '32px')};
  color: ${({ theme }) => theme.colors.text.strong};

  @media (max-width: 767px) {
    padding: 0;
  }
`;

export const Header = styled.header<{ $wide?: boolean; $create?: boolean; $detail?: boolean }>`
  min-height: ${({ $detail, $wide, $create }) => ($detail ? '59px' : $create ? '68px' : $wide ? '66px' : '38px')};
  padding-inline: 24px;
  margin-top: ${({ $wide }) => ($wide ? '24px' : '0')};
  margin-bottom: 24px;
  > div > p { margin-top: ${({ $detail }) => ($detail ? '4px' : '6px')}; font-size: ${({ $detail }) => ($detail ? '14px' : '15px')}; line-height: ${({ $detail }) => ($detail ? '17px' : '22px')}; }
`;

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 30px;
  line-height: 38px;
`;

export const Subtitle = styled.p`
  margin: 6px 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 15px;
  line-height: 22px;
`;

export const Notice = styled.p`
  margin: 0 0 16px;
  border-radius: 12px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 13px;
  line-height: 18px;
`;

export const State = styled.p`
  padding: 64px 0;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`;

export const CardGrid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.button`
  overflow: hidden;
  border: 0;
  border-radius: 20px;
  padding: 0;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;
  img {
    display: block;
    width: 100%;
    height: 170px;
    object-fit: cover;
  }
`;

export const CardBody = styled.div`
  display: flex;
  min-height: 148px;
  flex-direction: column;
  gap: 8px;
  padding: 20px 24px;
  strong {
    font-size: 18px;
    line-height: 24px;
  }
  > span {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 13px;
  }
`;

export const CardStatus = styled.div<{
  $state: "planned" | "active" | "completed";
}>`
  display: flex;
  justify-content: space-between;
  color: ${({ $state, theme }) => ($state === "completed" ? theme.colors.brand.successStrong : $state === "active" ? theme.colors.brand.primary : theme.colors.brand.strong)};
  font-size: 12px;
  font-weight: 600;
`;

export const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
`;

export const Empty = styled.div`
  display: grid;
  min-height: 220px;
  place-items: center;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`;

export const DetailLayout = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 544px) minmax(0, 1fr);
  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const CarouselSection = styled.section`
  display: flex;
  min-height: 623px;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  > button { width: 147px; height: 52px; min-height: 52px; border-radius: 14px; font-size: 14px; }
`

export const TravelCard = styled.button`
  display: block;
  width: min(100%, 420px);
  overflow: hidden;
  border: 0;
  border-radius: 28px;
  padding: 0;
  background: transparent;
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  cursor: pointer;
  text-align: left;
`

export const TravelCardImage = styled.div`
  display: grid;
  height: 220px;
  place-items: center;
  box-sizing: border-box;
  border: 1px solid #dceaf7;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 12px;
  img { display: block; width: 100%; height: 100%; object-fit: cover; }
`

export const TravelCardInfo = styled.div`
  min-height: 303px;
  padding: 28px;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
`

export const TravelCardTitle = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  > span { display: flex; min-width: 0; flex-direction: column; gap: 4px; }
  strong { font-size: 30px; line-height: 38px; }
  small { font-size: 11px; line-height: 15px; }
`

export const FavoriteBadge = styled.span`
  display: grid;
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  place-items: center;
  border-radius: 22px;
  background: ${({ theme }) => theme.colors.brand.accent};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 20px;
`

export const MetricList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 15px;
  border-top: 1px solid rgb(255 255 255 / 22%);
  padding-top: 16px;
  > span { display: flex; height: 28px; align-items: center; justify-content: space-between; gap: 16px; }
  small { font-size: 12px; }
  strong { font-size: 13px; }
`

export const Pagination = styled.div`
  display: flex;
  gap: 8px;
  height: 12px;
  align-items: center;
  width: 40px;
  span { width: 8px; height: 8px; border-radius: 50%; background: ${({ theme }) => theme.colors.border.default}; }
  span.active { background: ${({ theme }) => theme.colors.brand.primary}; }
`

export const PlaceOverview = styled.section`
  height: 434px;
  min-height: 434px;
  border-radius: 14px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const PlaceOverviewImage = styled.div`
  display: grid;
  height: 260px;
  place-items: start;
  margin-top: 16px;
  border-radius: 16px;
  padding: 0;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: 13px;
  font-weight: 600;
  img { display: block; width: 100%; height: 100%; border-radius: inherit; object-fit: cover; }
`

export const PlaceCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  strong { font-size: 20px; line-height: 24px; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 14px; line-height: 17px; }
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; line-height: 15px; }
`

export const CapturedInfo = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 20px;
`

export const CapturedPanel = styled.section`
  display: flex;
  min-height: 141px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  border-radius: 14px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 15px; line-height: 22px; }
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 20px; line-height: 24px; }
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; line-height: 15px; }
`

export const CapturedImage = styled.div`
  display: grid;
  width: 100%;
  height: 170px;
  place-items: start;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: 11px;
  font-weight: 600;
  img { display: block; width: 100%; height: 100%; border-radius: inherit; object-fit: cover; }
`

export const AddPhoto = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; line-height: 15px; }
  > button { width: 119px; height: 52px; min-height: 52px; font-size: 14px; }
`

export const DetailTrip = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
`;

export const DetailTimeline = styled.section`
  min-height: 560px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  > button {
    margin-top: 16px;
  }
`;

export const DetailHeading = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  h2 {
    margin: 0;
    font-size: 15px;
    line-height: 22px;
  }
  span {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 11px;
  }
`;

export const PlaceTimeline = styled.article`
  display: grid;
  gap: 4px;
  margin-top: 16px;
  border-left: 2px solid ${({ theme }) => theme.colors.brand.primary};
  padding-left: 12px;
  strong {
    font-size: 13px;
  }
  > span {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 11px;
  }
`;

export const PhotoSlots = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  span {
    display: grid;
    width: 80px;
    height: 58px;
    place-items: center;
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.background.muted};
    color: ${({ theme }) => theme.colors.brand.strong};
    font-size: 10px;
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    object-fit: cover;
  }
`;

export const Badge = styled.span`
  border-radius: 999px;
  padding: 5px 8px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 11px;
`;

export const CreateTabs = styled.nav`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  button {
    height: 36px;
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: 999px;
    padding: 0 14px;
    background: ${({ theme }) => theme.colors.background.default};
    color: ${({ theme }) => theme.colors.text.muted};
    cursor: pointer;
    font-size: 12px;
  }
  button[aria-pressed="true"] {
    border-color: ${({ theme }) => theme.colors.brand.primary};
    background: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
  }
`;

export const SelectList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`;

export const SelectRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding: 12px 0;
  &:last-child {
    border-bottom: 0;
  }
  div,
  label {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  label {
    color: ${({ theme }) => theme.colors.text.strong};
  }
  span {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 13px;
  }
  strong {
    color: ${({ theme }) => theme.colors.text.strong};
  }
  input {
    width: 18px;
    height: 18px;
  }
`;

export const Composer = styled.section`
  display: block;
  width: 100%;
  height: 560px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`;

export const CreateCardLayout = styled.div`
  display: block;
  height: 100%;
`;

export const CreateFormPanel = styled.section`
  height: 100%;
`;

export const FormHeading = styled.h2`
  margin: 0 0 12px;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 18px;
  line-height: 24px;
`;

export const Form = styled.form`
  display: flex;
  height: calc(100% - 36px);
  flex-direction: column;
  align-items: flex-start;
  > button { width: 160px; height: 46px; min-height: 46px; margin-top: 12px; border-radius: 14px; font-size: 14px; white-space: nowrap; }
`;

export const FieldLabel = styled.label`
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 13px;
  line-height: 16px;
  font-weight: 600;
`;

export const CardField = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
`;

export const CardSelector = styled.select`
  width: 100%;
  height: 44px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 12px;
  padding: 0 12px;
  background: ${({ theme }) => theme.colors.background.soft};
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 14px;
`;

export const Gallery = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  height: 90px;
  margin-top: 6px;
`;

export const PhotoTile = styled.button`
  position: relative;
  display: grid;
  width: 120px;
  height: 90px;
  flex: 0 0 120px;
  place-items: center;
  overflow: hidden;
  border: 0;
  border-radius: 12px;
  padding: 0;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  font-size: 12px;
  img { display: block; width: 100%; height: 100%; object-fit: cover; }
`;

export const PhotoCheck = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 12px;
`;

export const FileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
`;

export const TextareaField = styled.div`
  position: relative;
  width: 100%;
  height: 96px;
  margin-top: 6px;
  textarea { width: 100%; height: 96px; min-height: 96px; resize: none; border-radius: 12px; padding: 14px 16px 32px; font-size: 14px; }
`;

export const Counter = styled.span`
  position: absolute;
  bottom: 14px;
  left: 16px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 11px;
  line-height: 13px;
`;

export const ErrorMessage = styled.p`
  margin: 12px 0 0;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 13px;
`;

export const SuccessMessage = styled.p`
  margin: 12px 0 0;
  color: ${({ theme }) => theme.colors.status.success};
  font-size: 13px;
`;

export const DeleteLayout = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: 720px minmax(0, 456px);
  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const DeleteList = styled.section`
  width: 720px;
  height: 370px;
  box-sizing: border-box;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 {
    margin: 0 0 12px;
    font-size: 15px;
    line-height: 22px;
  }
  @media (max-width: 860px) { width: 100%; height: auto; min-height: 370px; }
`;

export const Toolbar = styled.header`
  display: flex;
  width: 100%;
  height: 31px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
  strong {
    font-size: 15px;
    line-height: 18px;
  }
  > div { display: flex; gap: 12px; }
  button { width: 76px; height: 31px; border: 0; border-radius: 10px; padding: 0; background: ${({ theme }) => theme.colors.background.muted}; color: ${({ theme }) => theme.colors.brand.primary}; cursor: pointer; font-size: 12px; font-weight: 600; }
  button + button { border: 1px solid ${({ theme }) => theme.colors.border.default}; background: ${({ theme }) => theme.colors.background.default}; }
`;

export const DeleteRow = styled.label<{ $selected: boolean }>`
  display: grid;
  width: 672px;
  height: 88px;
  box-sizing: border-box;
  grid-template-columns: 24px 64px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  border: 1px solid
    ${({ $selected, theme }) => ($selected ? theme.colors.brand.primary : theme.colors.border.subtle)};
  border-radius: 12px;
  margin-top: 12px;
  padding: 12px 14px;
  background: ${({ $selected, theme }) => ($selected ? theme.colors.background.muted : theme.colors.background.default)};
  cursor: pointer;
  input {
    appearance: none;
    width: 24px;
    height: 24px;
    margin: 0;
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: 7px;
    background: ${({ theme }) => theme.colors.background.default};
    cursor: pointer;
    &:checked { border-color: ${({ theme }) => theme.colors.brand.primary}; background: ${({ theme }) => theme.colors.brand.primary}; }
    &:checked::after { display: grid; height: 100%; place-items: center; color: ${({ theme }) => theme.colors.text.inverse}; content: '✓'; font-size: 14px; }
  }
  > span {
    display: grid;
    width: 64px;
    height: 64px;
    place-items: center;
    border-radius: 12px;
    background: ${({ theme }) => theme.colors.background.muted};
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 10px;
  }
  > div {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 4px;
    align-self: center;
  }
  strong {
    font-size: 13px;
  }
  small {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 11px;
  }
  @media (max-width: 860px) { width: 100%; }
`;

export const DeletePanel = styled.section`
  display: flex;
  width: 456px;
  height: 370px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 {
    margin: 0;
    font-size: 15px;
  }
  @media (max-width: 860px) { width: 100%; height: auto; min-height: 370px; }
`;

export const Warning = styled.div`
  display: flex;
  width: 100%;
  height: 71px;
  box-sizing: border-box;
  flex-direction: column;
  gap: 4px;
  border-radius: 12px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.background.error};
  color: ${({ theme }) => theme.colors.status.error};
  strong {
    font-size: 12px;
  }
  span {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 10px;
  }
`;

export const DeleteSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  strong { font-size: 12px; line-height: 17px; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; line-height: 15px; }
`;

export const DeleteActions = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
  > button { height: 43px; min-height: 43px; border-radius: 12px; }
`;

export const DeleteButton = styled.button`
  width: 100%;
  min-height: 43px;
  border: 0;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.status.error};
  color: ${({ theme }) => theme.colors.text.inverse};
  cursor: pointer;
  font-weight: 600;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
