import styled from "styled-components";
import { Skeleton } from "@/shared/ui/parttrip";

export const LoadingHeader = styled(Skeleton)`
  width: 13.75rem;
  height: 2.375rem;
`

export const LoadingLayout = styled.div`
  display: flex;
  min-height: 38.9375rem;
  align-items: center;
  justify-content: center;
`

export const LoadingCard = styled(Skeleton)`
  width: 26.25rem;
  height: 32.6875rem;
  border-radius: 1.75rem;
`

export const Page = styled.main<{ $wide?: boolean }>`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: ${({ $wide }) => ($wide ? '0' : '2rem')};
  color: ${({ theme }) => theme.colors.text.strong};

  @media (max-width: 47.9375rem) {
    padding: 0;
  }
`;

export const Header = styled.header<{ $wide?: boolean; $create?: boolean; $detail?: boolean }>`
  min-height: ${({ $detail, $wide, $create }) => ($detail ? '3.6875rem' : $create ? '4.25rem' : $wide ? '4.125rem' : '2.375rem')};
  padding-inline: 1.5rem;
  margin-top: ${({ $wide }) => ($wide ? '1.5rem' : '0')};
  margin-bottom: 1.5rem;
  > div > p { margin-top: ${({ $detail }) => ($detail ? '0.25rem' : '0.375rem')}; font-size: ${({ $detail }) => ($detail ? '0.875rem' : '0.9375rem')}; line-height: ${({ $detail }) => ($detail ? '1.0625rem' : '1.375rem')}; }
`;

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 1.875rem;
  line-height: 2.375rem;
`;

export const Subtitle = styled.p`
  margin: 0.375rem 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.9375rem;
  line-height: 1.375rem;
`;

export const Notice = styled.p`
  margin: 0 0 1rem;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.8125rem;
  line-height: 1.125rem;
`;

export const State = styled.p`
  padding: 4rem 0;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`;

;

export const Card = styled.button`
  overflow: hidden;
  border: 0;
  border-radius: 1.25rem;
  padding: 0;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;
  img {
    display: block;
    width: 100%;
    height: 10.625rem;
    object-fit: cover;
  }
`;

;

;

export const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

export const Empty = styled.div`
  display: grid;
  min-height: 13.75rem;
  place-items: center;
  border-radius: 1.25rem;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`;

export const EmptyComposer = styled.div`
  display: flex;
  min-height: 13.75rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: center;
  p { max-width: 32ch; margin: 0; color: ${({ theme }) => theme.colors.text.muted}; line-height: 1.5; }
`;

export const DetailLayout = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(0, 34rem) minmax(0, 1fr);
  @media (max-width: 53.75rem) {
    grid-template-columns: 1fr;
  }
`;

export const CarouselSection = styled.section`
  display: flex;
  min-height: 38.9375rem;
  flex-direction: column;
  align-items: center;
  gap: 1.125rem;
  > button { width: 9.1875rem; height: 3.25rem; min-height: 3.25rem; border-radius: 0.875rem; font-size: 0.875rem; }
`

export const TravelCard = styled.button`
  display: block;
  width: min(100%, 26.25rem);
  overflow: hidden;
  border: 0;
  border-radius: 1.75rem;
  padding: 0;
  background: transparent;
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  cursor: pointer;
  text-align: left;
`

export const TravelCardImage = styled.div`
  display: grid;
  height: 13.75rem;
  place-items: center;
  box-sizing: border-box;
  border: 0.0625rem solid #dceaf7;
  border-radius: 1rem;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 0.75rem;
  img { display: block; width: 100%; height: 100%; object-fit: cover; }
`

export const TravelCardInfo = styled.div`
  min-height: 18.9375rem;
  padding: 1.75rem;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
`

export const TravelCardTitle = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  > span { display: flex; min-width: 0; flex-direction: column; gap: 0.25rem; }
  strong { font-size: 1.875rem; line-height: 2.375rem; }
  small { font-size: 0.6875rem; line-height: 0.9375rem; }
`

export const FavoriteBadge = styled.span`
  display: grid;
  width: 3.25rem;
  height: 3.25rem;
  flex: 0 0 3.25rem;
  place-items: center;
  border-radius: 1.375rem;
  background: ${({ theme }) => theme.colors.brand.accent};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 1.25rem;
`

export const MetricList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.9375rem;
  border-top: 0.0625rem solid rgb(255 255 255 / 22%);
  padding-top: 1rem;
  > span { display: flex; height: 1.75rem; align-items: center; justify-content: space-between; gap: 1rem; }
  small { font-size: 0.75rem; }
  strong { font-size: 0.8125rem; }
`

export const Pagination = styled.div`
  display: flex;
  gap: 0.5rem;
  height: 0.75rem;
  align-items: center;
  width: 2.5rem;
  span { width: 0.5rem; height: 0.5rem; border-radius: 50%; background: ${({ theme }) => theme.colors.border.default}; }
  span.active { background: ${({ theme }) => theme.colors.brand.primary}; }
`

export const PlaceOverview = styled.section`
  height: 27.125rem;
  min-height: 27.125rem;
  border-radius: 0.875rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const PlaceOverviewImage = styled.div`
  display: grid;
  height: 16.25rem;
  place-items: start;
  margin-top: 1rem;
  border-radius: 1rem;
  padding: 0;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: 0.8125rem;
  font-weight: 600;
  img { display: block; width: 100%; height: 100%; border-radius: inherit; object-fit: cover; }
`

export const PlaceCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  strong { font-size: 1.25rem; line-height: 1.5rem; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.875rem; line-height: 1.0625rem; }
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.75rem; line-height: 0.9375rem; }
`

export const CapturedInfo = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 1.25rem;
`

export const CapturedPanel = styled.section`
  display: flex;
  min-height: 8.8125rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  border-radius: 0.875rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 0.9375rem; line-height: 1.375rem; }
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 1.25rem; line-height: 1.5rem; }
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.75rem; line-height: 0.9375rem; }
`

export const CapturedImage = styled.div`
  display: grid;
  width: 100%;
  height: 10.625rem;
  place-items: start;
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: 0.6875rem;
  font-weight: 600;
  img { display: block; width: 100%; height: 100%; border-radius: inherit; object-fit: cover; }
`

export const AddPhoto = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.75rem; line-height: 0.9375rem; }
  > button { width: 7.4375rem; height: 3.25rem; min-height: 3.25rem; font-size: 0.875rem; }
`

;

;

export const DetailHeading = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  h2 {
    margin: 0;
    font-size: 0.9375rem;
    line-height: 1.375rem;
  }
  span {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 0.6875rem;
  }
`;

;

;

export const Badge = styled.span`
  border-radius: 62.4375rem;
  padding: 0.3125rem 0.5rem;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 0.6875rem;
`;

;

;

;

export const Composer = styled.section`
  display: block;
  width: 100%;
  height: 35rem;
  box-sizing: border-box;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  padding: 1.5rem;
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
  margin: 0 0 0.75rem;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 1.125rem;
  line-height: 1.5rem;
`;

export const Form = styled.form`
  display: flex;
  height: calc(100% - 2.25rem);
  flex-direction: column;
  align-items: flex-start;
  > button { width: 10rem; height: 2.875rem; min-height: 2.875rem; margin-top: 0.75rem; border-radius: 0.875rem; font-size: 0.875rem; white-space: nowrap; }
`;

export const FieldLabel = styled.label`
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 0.8125rem;
  line-height: 1rem;
  font-weight: 600;
`;

export const CardField = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
`;

export const CardSelector = styled.select`
  width: 100%;
  height: 2.75rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.default};
  border-radius: 0.75rem;
  padding: 0 0.75rem;
  background: ${({ theme }) => theme.colors.background.soft};
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 0.875rem;
`;

export const Gallery = styled.div`
  display: flex;
  gap: 0.625rem;
  width: 100%;
  height: 5.625rem;
  margin-top: 0.375rem;
`;

export const PhotoTile = styled.button`
  position: relative;
  display: grid;
  width: 7.5rem;
  height: 5.625rem;
  flex: 0 0 7.5rem;
  place-items: center;
  overflow: hidden;
  border: 0;
  border-radius: 0.75rem;
  padding: 0;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  font-size: 0.75rem;
  img { display: block; width: 100%; height: 100%; object-fit: cover; }
`;

export const PhotoCheck = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: grid;
  width: 1.375rem;
  height: 1.375rem;
  place-items: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 0.75rem;
`;

export const FileInput = styled.input`
  position: absolute;
  width: 0.0625rem;
  height: 0.0625rem;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
`;

export const TextareaField = styled.div`
  position: relative;
  width: 100%;
  height: 6rem;
  margin-top: 0.375rem;
  textarea { width: 100%; height: 6rem; min-height: 6rem; resize: none; border-radius: 0.75rem; padding: 0.875rem 1rem 2rem; font-size: 0.875rem; }
`;

export const Counter = styled.span`
  position: absolute;
  bottom: 0.875rem;
  left: 1rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.6875rem;
  line-height: 0.8125rem;
`;

export const ErrorMessage = styled.p`
  margin: 0.75rem 0 0;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 0.8125rem;
`;

export const SuccessMessage = styled.p`
  margin: 0.75rem 0 0;
  color: ${({ theme }) => theme.colors.status.success};
  font-size: 0.8125rem;
`;

export const DeleteLayout = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 45rem minmax(0, 28.5rem);
  @media (max-width: 53.75rem) {
    grid-template-columns: 1fr;
  }
`;

export const DeleteList = styled.section`
  width: 45rem;
  height: 23.125rem;
  box-sizing: border-box;
  border-radius: 1.25rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 {
    margin: 0 0 0.75rem;
    font-size: 0.9375rem;
    line-height: 1.375rem;
  }
  @media (max-width: 53.75rem) { width: 100%; height: auto; min-height: 23.125rem; }
`;

export const Toolbar = styled.header`
  display: flex;
  width: 100%;
  height: 1.9375rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  strong {
    font-size: 0.9375rem;
    line-height: 1.125rem;
  }
  > div { display: flex; gap: 0.75rem; }
  button { width: 4.75rem; height: 1.9375rem; border: 0; border-radius: 0.625rem; padding: 0; background: ${({ theme }) => theme.colors.background.muted}; color: ${({ theme }) => theme.colors.brand.primary}; cursor: pointer; font-size: 0.75rem; font-weight: 600; }
  button + button { border: 0.0625rem solid ${({ theme }) => theme.colors.border.default}; background: ${({ theme }) => theme.colors.background.default}; }
`;

export const DeleteRow = styled.label<{ $selected: boolean }>`
  display: grid;
  width: 42rem;
  height: 5.5rem;
  box-sizing: border-box;
  grid-template-columns: 1.5rem 4rem minmax(0, 1fr);
  align-items: center;
  gap: 0.875rem;
  border: 0.0625rem solid
    ${({ $selected, theme }) => ($selected ? theme.colors.brand.primary : theme.colors.border.subtle)};
  border-radius: 0.75rem;
  margin-top: 0.75rem;
  padding: 0.75rem 0.875rem;
  background: ${({ $selected, theme }) => ($selected ? theme.colors.background.muted : theme.colors.background.default)};
  cursor: pointer;
  input {
    appearance: none;
    width: 1.5rem;
    height: 1.5rem;
    margin: 0;
    border: 0.0625rem solid ${({ theme }) => theme.colors.border.default};
    border-radius: 0.4375rem;
    background: ${({ theme }) => theme.colors.background.default};
    cursor: pointer;
    &:checked { border-color: ${({ theme }) => theme.colors.brand.primary}; background: ${({ theme }) => theme.colors.brand.primary}; }
    &:checked::after { display: grid; height: 100%; place-items: center; color: ${({ theme }) => theme.colors.text.inverse}; content: '✓'; font-size: 0.875rem; }
  }
  > span {
    display: grid;
    width: 4rem;
    height: 4rem;
    place-items: center;
    border-radius: 0.75rem;
    background: ${({ theme }) => theme.colors.background.muted};
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 0.625rem;
  }
  > div {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 0.25rem;
    align-self: center;
  }
  strong {
    font-size: 0.8125rem;
  }
  small {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 0.6875rem;
  }
  @media (max-width: 53.75rem) { width: 100%; }
`;

export const DeletePanel = styled.section`
  display: flex;
  width: 28.5rem;
  height: 23.125rem;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  border-radius: 1.25rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 {
    margin: 0;
    font-size: 0.9375rem;
  }
  @media (max-width: 53.75rem) { width: 100%; height: auto; min-height: 23.125rem; }
`;

export const Warning = styled.div`
  display: flex;
  width: 100%;
  height: 4.4375rem;
  box-sizing: border-box;
  flex-direction: column;
  gap: 0.25rem;
  border-radius: 0.75rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.background.error};
  color: ${({ theme }) => theme.colors.status.error};
  strong {
    font-size: 0.75rem;
  }
  span {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 0.625rem;
  }
`;

export const DeleteSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  strong { font-size: 0.75rem; line-height: 1.0625rem; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.6875rem; line-height: 0.9375rem; }
`;

export const DeleteActions = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;
  > button { height: 2.6875rem; min-height: 2.6875rem; border-radius: 0.75rem; }
`;

export const DeleteButton = styled.button`
  width: 100%;
  min-height: 2.6875rem;
  border: 0;
  border-radius: 0.625rem;
  background: ${({ theme }) => theme.colors.status.error};
  color: ${({ theme }) => theme.colors.text.inverse};
  cursor: pointer;
  font-weight: 600;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
