import styled from 'styled-components'

export const Page = styled.main`
  width: min(100%, 75rem);
  margin: 1.5rem auto 4rem;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.25rem;
  margin: 0 0 1.5rem;
  h1 { margin: 0; font-size: 1.875rem; line-height: 2.375rem; }
  p { margin: 0.5rem 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 1rem; line-height: 1.375rem; }
  ol { width: 100%; }
  li { flex: 1; justify-content: center; }
`

export const Steps = styled.ol`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
  @media (max-width: 35rem) { width: 100%; gap: 0.25rem; }
`

export const Step = styled.li<{ $active: boolean }>`
  min-height: 2.25rem;
  display: flex;
  align-items: center;
  border-radius: 1.125rem;
  padding: 0 0.75rem;
  background: ${({ $active }) => $active ? '#1565c0' : '#e3f2fd'};
  color: ${({ $active, theme }) => $active ? theme.colors.text.inverse : theme.colors.text.strong};
  font-size: 0.875rem;
  white-space: nowrap;
  @media (max-width: 35rem) { flex: 1; justify-content: center; min-width: 0; padding-inline: 0.3125rem; font-size: 0.875rem; }
`

export const Grid = styled.div`
  display: grid;
  align-items: start;
  gap: 1.5rem;
  grid-template-columns: minmax(0, 46rem) minmax(17.5rem, 22.5rem);
  @media (max-width: 56.25rem) { grid-template-columns: 1fr; }
`

export const Card = styled.section`
  min-width: 0;
  border: 0.0625rem solid #e6edf4;
  border-radius: 1rem;
  padding: 1.5rem;
  background: #fff;
  box-shadow: 0 0.25rem 0.875rem rgb(15 33 51 / 5%);
  h2 { margin: 0; font-size: 1.125rem; line-height: 1.625rem; }
  > p { margin: 0.5rem 0 1.25rem; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.875rem; line-height: 1.375rem; }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

export const Field = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.5rem;
  > label, > span { font-size: 0.875rem; font-weight: 600; }
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.875rem; line-height: 1.375rem; }
  input { max-width: 26.25rem; }
  #planner-city-name { width: 100%; max-width: none; }
`

export const CityList = styled.div`
  display: flex;
  max-height: 15rem;
  flex-direction: column;
  overflow: auto;
  width: 100%;
  border: 0.0625rem solid #e6edf4;
  border-radius: 0.75rem;
  background: #fff;
  > strong { padding: 0.625rem 0.875rem 0.5rem; font-size: 0.875rem; }
  > p, > small { margin: 0; padding: 0.75rem 0.875rem; }
`

export const City = styled.button<{ $active: boolean }>`
  display: flex;
  min-height: 3.25rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border: 0;
  border-top: 0.0625rem solid #eef2f5;
  padding: 0.5rem 0.875rem;
  background: ${({ $active }) => $active ? '#e3f2fd' : '#fff'};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  font: inherit;
  text-align: left;
  strong { font-size: 1rem; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.875rem; }
  &:hover { background: #f3f8ff; }
  &:focus-visible { position: relative; outline: 0.125rem solid ${({ theme }) => theme.colors.brand.primary}; outline-offset: -0.125rem; }
`

export const DateGrid = styled.div`
  display: grid;
  max-width: 26.25rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  @media (max-width: 28.75rem) { grid-template-columns: 1fr; }
`

export const Error = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 0.875rem;
  line-height: 1.375rem;
`

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
  button { min-height: 3rem; }
`

export const BlockList = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
`

export const Block = styled.section<{ $departure?: boolean }>`
  min-width: 0;
  padding: 1.5rem 0;
  & + & { border-top: 1px solid ${({ theme }) => theme.colors.border.subtle}; }
  &:first-child { padding-top: 0; }
  &:last-child { padding-bottom: 0; }
  h3 { margin: 0 0 0.875rem; font-size: 1.0625rem; font-weight: 700; line-height: 1.5; }
  ${({ $departure }) => $departure && `
    > [role='group'] { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
    @media (max-width: 42rem) { > [role='group'] { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  `}
`

export const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
`

export const PreferenceQuestion = styled(Block)`
  > p { max-width: 65ch; margin: -0.375rem 0 1rem; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.875rem; line-height: 1.65; }
`

export const Option = styled.button<{ $active: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 0;
  min-height: 3rem;
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.brand.primary : theme.colors.border.default};
  border-radius: 0.75rem;
  padding: 0.75rem 0.875rem;
  background: ${({ $active, theme }) => $active ? theme.colors.background.info : theme.colors.background.default};
  color: ${({ $active, theme }) => $active ? theme.colors.brand.strong : theme.colors.text.strong};
  cursor: pointer;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
  text-align: left;
  transition: border-color 120ms ease, background-color 120ms ease;
  &::before { content: ''; box-sizing: border-box; width: 1.125rem; height: 1.125rem; flex: 0 0 1.125rem; border: 1px solid ${({ $active, theme }) => $active ? theme.colors.brand.primary : theme.colors.border.default}; border-radius: 50%; background: ${({ $active, theme }) => $active ? theme.colors.brand.primary : theme.colors.background.soft}; }
  &::after { content: ''; display: ${({ $active }) => $active ? 'block' : 'none'}; position: absolute; left: 1.25rem; top: calc(50% - 0.3125rem); width: 0.25rem; height: 0.4375rem; border: solid ${({ theme }) => theme.colors.text.inverse}; border-width: 0 1.5px 1.5px 0; transform: rotate(45deg); }
  &:hover:not(:disabled) { border-color: ${({ theme }) => theme.colors.brand.primary}; background: ${({ $active, theme }) => $active ? theme.colors.background.info : theme.colors.background.subtle}; }
  &:disabled { cursor: not-allowed; opacity: 0.55; }
  &:focus-visible { outline: 0.1875rem solid ${({ theme }) => theme.colors.brand.primary}; outline-offset: 0.125rem; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`

export const MoreBlocks = styled.details`
  margin-top: 1rem;
  border-top: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  padding-top: 1rem;
  > summary { display: flex; min-height: 3rem; align-items: center; justify-content: space-between; gap: 0.75rem; border-radius: 0.75rem; padding: 0.5rem 0.875rem; background: ${({ theme }) => theme.colors.background.soft}; color: ${({ theme }) => theme.colors.brand.strong}; cursor: pointer; font-size: 0.875rem; font-weight: 600; list-style: none; }
  > summary::-webkit-details-marker { display: none; }
  > summary:hover { background: ${({ theme }) => theme.colors.background.muted}; }
  > summary:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand.primary}; outline-offset: 2px; }
  > summary span:nth-child(2), &[open] > summary span:first-child { display: none; }
  &[open] > summary span:nth-child(2) { display: inline; }
  &[open] > summary svg { transform: rotate(180deg); }
  ${BlockList} { margin-top: 0.75rem; }
`

export const DepartureTools = styled.div`
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
  > p { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.875rem; line-height: 1.5; overflow-wrap: anywhere; }
  > p strong { color: ${({ theme }) => theme.colors.text.strong}; font-weight: 600; }
  > div { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  button { min-height: 2.75rem; border: 0; border-radius: 0.5rem; padding: 0.5rem 0.75rem; background: ${({ theme }) => theme.colors.background.soft}; font-size: 0.8125rem; }
  button:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand.primary}; outline-offset: 2px; }
`

export const Summary = styled.aside`
  position: sticky;
  top: 1.5rem;
  max-height: calc(100dvh - 3rem);
  overflow-y: auto;
  border: 0.0625rem solid #90caf9;
  border-radius: 1rem;
  padding: 1.5rem;
  background: #f3f8ff;
  h2 { margin: 0 0 1rem; font-size: 1.125rem; line-height: 1.625rem; }
  dl { display: grid; gap: 0.75rem; margin: 0; }
  dt { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.875rem; }
  dd { margin: 0.1875rem 0 0; font-size: 1rem; font-weight: 600; line-height: 1.375rem; overflow-wrap: anywhere; }
  @media (max-width: 56.25rem) { position: static; max-height: none; overflow-y: visible; }
`

export const ScheduleDays = styled.div`
  display: grid;
  gap: 1rem;
`

export const ScheduleAttribution = styled.div`
  display: grid;
  justify-items: center;
  gap: 0.375rem;
  margin-top: 1.5rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.875rem;
  line-height: 1.375rem;
`

export const ODsayMark = styled.span`
  display: grid;
  min-height: 1.375rem;
  place-items: center;
  border-radius: 0.25rem;
  padding: 0 0.375rem;
  background: #fff;
  img { display: block; width: auto; height: 14px; }
`

export const ScheduleDay = styled.section`
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  padding: 1.25rem;
  h2 { margin: 0 0 0.75rem; font-size: 1.0625rem; line-height: 1.5rem; }
`

export const SlotTools = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  button { min-width: 3rem; min-height: 3rem; padding-inline: 0.875rem; }
`

export const SchedulePlace = styled.div`
  display: grid;
  min-width: 0;
  grid-template-columns: 2.25rem minmax(0, 1fr);
  align-items: start;
  column-gap: 0.875rem;
  border-top: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  padding: 0.875rem 0;

  > b {
    display: grid;
    width: 2.25rem;
    height: 2.25rem;
    grid-column: 1;
    grid-row: 1;
    place-items: center;
    border-radius: 50%;
    background: #e3f2fd;
    color: #1565c0;
    font-size: 1rem;
    font-variant-numeric: tabular-nums;
  }

  > div {
    min-width: 0;
    grid-column: 2;
    grid-row: 1;
    align-self: center;
  }

  strong { display: block; font-size: 1rem; line-height: 1.5rem; text-wrap: pretty; }
  small { display: block; margin-top: 0.25rem; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.875rem; line-height: 1.375rem; overflow-wrap: anywhere; }

  > ${SlotTools} {
    grid-column: 2;
    grid-row: 2;
    margin: 0.75rem 0 0;
    justify-content: flex-start;
  }
`

export const RouteLine = styled.div`
  display: grid;
  min-width: 0;
  grid-template-columns: 2.25rem minmax(0, 1fr);
  align-items: start;
  column-gap: 0.875rem;
  border-top: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  padding: 0.75rem 0;

  > div { min-width: 0; }
  details { margin-top: 0.375rem; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.875rem; }
  summary { width: fit-content; min-height: 2rem; cursor: pointer; }
  summary:hover { color: ${({ theme }) => theme.colors.brand.strong}; text-decoration: underline; text-underline-offset: 0.15em; }
  summary:focus-visible, a:focus-visible { outline: 0.125rem solid ${({ theme }) => theme.colors.brand.primary}; outline-offset: 0.125rem; }
  ol { display: grid; gap: 0.25rem; margin: 0.25rem 0 0; padding-left: 1.125rem; }
  li { line-height: 1.375rem; overflow-wrap: anywhere; }
  a { display: inline-flex; min-height: 2.75rem; align-items: center; color: ${({ theme }) => theme.colors.brand.strong}; font-weight: 600; text-underline-offset: 0.15em; }
  a:hover { color: ${({ theme }) => theme.colors.brand.primary}; }
`

export const RouteModeIcon = styled.span`
  display: grid;
  width: 2.25rem;
  height: 2.25rem;
  place-items: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background.info};
  color: ${({ theme }) => theme.colors.brand.strong};
`

export const RouteSummary = styled.div`
  display: flex;
  min-height: 2.25rem;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem 0.75rem;
  strong { font-size: 0.875rem; line-height: 1.375rem; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.875rem; line-height: 1.375rem; }
`

export const RouteNotice = styled.p`
  margin: 0 0 1rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.875rem;
  line-height: 1.375rem;
`

export const EditorHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  p { margin: 0.25rem 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.875rem; line-height: 1.375rem; }
  @media (max-width: 35rem) { align-items: flex-start; flex-direction: column; }
`

export const SwapButton = styled.button<{ $active?: boolean }>`
  min-height: 3rem;
  border: 0.0625rem solid ${({ $active, theme }) => $active ? theme.colors.brand.primary : theme.colors.border.default};
  border-radius: 0.75rem;
  padding: 0 0.75rem;
  background: ${({ $active, theme }) => $active ? theme.colors.background.info : theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  font: inherit;
  font-size: 0.875rem;
`

export const Picker = styled.section`
  display: grid;
  gap: 0.875rem;
  margin-top: 1.25rem;
  scroll-margin-block: 1rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.default};
  border-radius: 0.875rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.subtle};
  h3 { margin: 0; font-size: 1rem; line-height: 1.5rem; text-wrap: balance; }
`

export const PickerDescription = styled.p`
  margin: 0.25rem 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.875rem;
  line-height: 1.375rem;
`

export const PickerForm = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 0.5rem;
  input, button { min-height: 3rem; }
  @media (max-width: 35rem) { grid-template-columns: 1fr 1fr; input { grid-column: 1 / -1; } }
`

export const CandidateList = styled.div`
  display: grid;
  gap: 0.5rem;
  max-height: 21.25rem;
  overflow: auto;
`

export const CandidateButton = styled.button`
  display: grid;
  min-height: 3.5rem;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.625rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 0.75rem;
  padding: 0.625rem 0.875rem;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;
  strong { display: block; font-size: 0.875rem; }
  small { display: block; margin-top: 0.1875rem; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.875rem; }
`

export const PickerActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  select, button { min-height: 3rem; }
`

export const EditorFeedback = styled.p<{ $error?: boolean }>`
  margin: 0.75rem 0 0;
  color: ${({ $error, theme }) => $error ? theme.colors.status.error : theme.colors.brand.strong};
  font-size: 0.875rem;
  line-height: 1.375rem;
`

export const LinkBox = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: minmax(0, 1fr) auto;
  margin-top: 1.25rem;
  input { min-width: 0; }
  @media (max-width: 35rem) { grid-template-columns: 1fr; }
`

export const AccessibilityLink = styled.button`
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  border: 0;
  padding: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.primary};
  cursor: pointer;
  font-size: 0.875rem;
  text-decoration: underline;
  text-underline-offset: 0.1875rem;
`;

export const FlowLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

export const TripSummary = styled(Summary)`
  position: static;
  max-height: none;
  overflow: visible;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 1.5rem;
  padding: 1.125rem 1.5rem;
  h2 { margin: 0; font-size: 1rem; }
  dl { grid-template-columns: minmax(5rem, 0.6fr) minmax(10rem, 1fr) minmax(0, 1.5fr); gap: 1.25rem; }
  dl > div { min-width: 0; border-left: 1px solid ${({ theme }) => theme.colors.border.subtle}; padding-left: 1.25rem; }
  dd { font-size: 0.9375rem; line-height: 1.5; }
  @media (max-width: 45rem) {
    grid-template-columns: 1fr;
    gap: 0.875rem;
    padding: 1.125rem;
    dl { grid-template-columns: 1fr 1fr; gap: 1rem; }
    dl > div { border: 0; padding: 0; }
    dl > div:last-child { grid-column: 1 / -1; }
  }
`

export const QuestionCard = styled(Card)`
  padding: 1.75rem;
  h2 { margin: 1.25rem 0 0.5rem; font-size: 1.5rem; line-height: 1.5; }
  h2:focus { outline: none; }
  ${Options} { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }
  ${Option} { min-height: 3.875rem; font-size: 1rem; }
  ${ButtonRow} { justify-content: flex-end; border-top: 1px solid ${({ theme }) => theme.colors.border.subtle}; padding-top: 1.25rem; }
  @media (max-width: 62rem) { ${Options} { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
  @media (max-width: 42rem) {
    padding: 1.125rem;
    h2 { font-size: 1.25rem; }
    ${Options} { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    ${Option} { min-height: 3.5rem; font-size: 0.875rem; }
  }
`

export const QuestionProgress = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.875rem;
  font-weight: 600;
  progress { width: min(60%, 25rem); height: 0.5rem; border: 0; border-radius: 1rem; overflow: hidden; appearance: none; background: ${({ theme }) => theme.colors.background.muted}; }
  progress::-webkit-progress-bar { background: ${({ theme }) => theme.colors.background.muted}; }
  progress::-webkit-progress-value { background: ${({ theme }) => theme.colors.brand.primary}; border-radius: 1rem; }
  progress::-moz-progress-bar { background: ${({ theme }) => theme.colors.brand.primary}; }
`

export const QuestionHint = styled.p`
  margin: 0 0 1.25rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.9375rem;
  line-height: 1.6;
`

export const QuestionFields = styled.fieldset`
  min-width: 0;
  margin: 0;
  border: 0;
  padding: 0;
`

export const ReviewCopy = styled.p`
  margin: 1.25rem 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.875rem;
  line-height: 1.6;
`

export const PlaceDetails = styled.details`
  min-width: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border.subtle};
  summary {
    display: grid;
    grid-template-columns: 2.25rem minmax(0, 1fr);
    gap: 0.875rem;
    padding: 0.875rem 0;
    cursor: pointer;
    list-style: none;
    &::-webkit-details-marker { display: none; }
    &:focus-visible { outline: 2px solid #1565c0; outline-offset: 2px; }
    > b { display: grid; width: 2.25rem; height: 2.25rem; place-items: center; border-radius: 50%; background: #e3f2fd; color: #1565c0; }
    > span { display: grid; min-width: 0; gap: 0.25rem; }
    strong { color: #173650; }
    small { color: #546e7a; }
    .place-preview { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
    > span::after { content: '장소 정보 보기'; color: #1565c0; font-size: 0.875rem; }
  }
  &[open] summary > span::after { content: '장소 정보 접기'; }
  .place-details-body {
    display: grid; gap: 0.75rem; min-width: 0; padding: 0 0 1rem 3.125rem;
    overflow-wrap: anywhere;
    img { max-width: 100%; width: 24rem; max-height: 15rem; object-fit: cover; border-radius: 0.75rem; }
    dl { margin: 0; display: grid; gap: 0.5rem; }
    dt { font-weight: 700; }
    dd { margin: 0.25rem 0 0; }
    a { color: #1565c0; }
  }
`
