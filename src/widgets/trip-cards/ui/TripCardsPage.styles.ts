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

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  color: ${({ theme }) => theme.colors.text.strong};
`;

export const Header = styled.header`
  padding-inline: 24px;
  margin-bottom: 24px;
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
  gap: 16px;
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
  gap: 14px;
  margin-top: 18px;
  border-top: 1px solid rgb(255 255 255 / 22%);
  padding-top: 12px;
  > span { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  small { font-size: 11px; }
  strong { font-size: 13px; }
`

export const Pagination = styled.div`
  display: flex;
  gap: 8px;
  height: 12px;
  align-items: center;
  span { width: 8px; height: 8px; border-radius: 50%; background: ${({ theme }) => theme.colors.border.default}; }
  span.active { background: ${({ theme }) => theme.colors.brand.primary}; }
`

export const PlaceOverview = styled.section`
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
  border-radius: 12px;
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
  gap: 6px;
  margin-top: 16px;
  strong { font-size: 16px; line-height: 24px; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; }
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 10px; }
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
  gap: 10px;
  border-radius: 14px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 15px; line-height: 22px; }
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 16px; }
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 10px; }
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
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 10px; }
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
  display: grid;
  gap: 16px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  form {
    display: grid;
    gap: 14px;
  }
  label {
    display: grid;
    gap: 6px;
    color: ${({ theme }) => theme.colors.text.strong};
    font-size: 13px;
    font-weight: 600;
  }
  input[type="file"] {
    font-weight: 400;
  }
`;

export const CreateCardLayout = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const CreateFormPanel = styled.section`
  min-height: 560px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`;

export const CardPreviewPanel = styled.section`
  min-height: 560px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`;

export const FormHeading = styled.h2`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 15px;
`;

export const PreviewCard = styled.article`
  width: 360px;
  max-width: 100%;
  overflow: hidden;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  img {
    display: block;
    width: 100%;
    height: 170px;
    object-fit: cover;
  }
  > div {
    display: flex;
    min-height: 100px;
    flex-direction: column;
    gap: 6px;
    padding: 16px;
  }
  h2 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.strong};
    font-size: 16px;
  }
  span {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 12px;
  }
`;

export const Form = styled.form``;
export const PreviewGrid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  @media (max-width: 560px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const PreviewImage = styled.div`
  overflow: hidden;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.background.muted};
  img {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
  }
  small {
    display: block;
    padding: 6px;
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 10px;
  }
`;

export const ErrorMessage = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 13px;
`;

export const SuccessMessage = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.status.success};
  font-size: 13px;
`;

export const DeleteLayout = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr) 360px;
  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const DeleteList = styled.section`
  min-height: 370px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 {
    margin: 24px 0 8px;
    font-size: 15px;
  }
`;

export const Toolbar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  strong {
    font-size: 12px;
  }
  button {
    border: 0;
    background: transparent;
    color: ${({ theme }) => theme.colors.brand.primary};
    cursor: pointer;
    font-size: 11px;
  }
`;

export const DeleteRow = styled.label<{ $selected: boolean }>`
  display: flex;
  min-height: 64px;
  align-items: center;
  gap: 12px;
  border: 1px solid
    ${({ $selected, theme }) => ($selected ? theme.colors.brand.primary : theme.colors.border.subtle)};
  border-radius: 12px;
  margin-top: 8px;
  padding: 8px;
  background: ${({ $selected, theme }) => ($selected ? theme.colors.background.muted : theme.colors.background.default)};
  cursor: pointer;
  input {
    width: 18px;
    height: 18px;
  }
  > span {
    display: grid;
    width: 44px;
    height: 44px;
    place-items: center;
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.background.muted};
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 10px;
  }
  > div {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 4px;
  }
  strong {
    font-size: 13px;
  }
  small {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 11px;
  }
`;

export const DeletePanel = styled.section`
  display: flex;
  min-height: 370px;
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
  > strong {
    font-size: 12px;
  }
  > span {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 11px;
    line-height: 16px;
  }
`;

export const Warning = styled.div`
  display: flex;
  width: 100%;
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

export const DeleteActions = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
`;

export const DeleteButton = styled.button`
  width: 100%;
  min-height: 46px;
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
