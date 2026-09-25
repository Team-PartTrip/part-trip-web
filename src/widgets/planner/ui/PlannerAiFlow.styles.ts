import styled from 'styled-components'

export const Page = styled.main`
  width: min(100%, 75rem);
  margin: 1.5rem auto 4rem;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem;
  margin: 0 1.5rem 1.5rem;
  h1 { margin: 0; font-size: 1.875rem; line-height: 2.375rem; }
  p { margin: 0.5rem 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.9375rem; line-height: 1.375rem; }
  @media (max-width: 53.75rem) { align-items: flex-start; flex-direction: column; }
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
  font-size: 0.8125rem;
  white-space: nowrap;
  @media (max-width: 35rem) { flex: 1; justify-content: center; min-width: 0; padding-inline: 0.3125rem; font-size: 0.6875rem; }
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
  > p { margin: 0.5rem 0 1.25rem; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.875rem; line-height: 1.3125rem; }
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
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.8125rem; line-height: 1.1875rem; }
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
  > strong { padding: 0.625rem 0.875rem 0.5rem; font-size: 0.8125rem; }
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
  strong { font-size: 0.9375rem; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.75rem; }
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
  line-height: 1.3125rem;
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
  gap: 0.75rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (max-width: 37.5rem) { grid-template-columns: 1fr; }
`

export const Block = styled.section`
  min-width: 0;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 0.875rem;
  padding: 0.875rem;
  background: #fff;
  h3 { margin: 0 0 0.625rem; font-size: 0.875rem; line-height: 1.25rem; }
`

export const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

export const Option = styled.button<{ $active: boolean }>`
  min-height: 3rem;
  border: 0.0625rem solid ${({ $active }) => $active ? '#1766bf' : '#d1dee5'};
  border-radius: 0.875rem;
  padding: 0 0.875rem;
  background: ${({ $active }) => $active ? '#e0f2ff' : '#fff'};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  font: inherit;
  font-size: 0.875rem;
  &:focus-visible { outline: 0.1875rem solid ${({ theme }) => theme.colors.brand.primary}; outline-offset: 0.125rem; }
`

export const MoreBlocks = styled.details`
  margin-top: 1rem;
  border-top: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  padding-top: 1rem;
  > summary { min-height: 3rem; color: ${({ theme }) => theme.colors.brand.strong}; cursor: pointer; font-weight: 600; }
  ${BlockList} { margin-top: 0.75rem; }
`

export const Summary = styled.aside`
  border: 0.0625rem solid #90caf9;
  border-radius: 1rem;
  padding: 1.5rem;
  background: #f3f8ff;
  h2 { margin: 0 0 1rem; font-size: 1.125rem; line-height: 1.625rem; }
  dl { display: grid; gap: 0.75rem; margin: 0; }
  dt { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.75rem; }
  dd { margin: 0.1875rem 0 0; font-size: 0.9375rem; font-weight: 600; line-height: 1.375rem; overflow-wrap: anywhere; }
`

export const ScheduleDays = styled.div`
  display: grid;
  gap: 1rem;
`

export const ScheduleDay = styled.section`
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  padding: 1.25rem;
  h2 { margin: 0 0 0.75rem; font-size: 1.0625rem; line-height: 1.5rem; }
`

export const SchedulePlace = styled.div`
  display: flex;
  min-height: 4rem;
  align-items: center;
  gap: 0.75rem;
  border-top: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  padding: 0.625rem 0;
  > b { display: grid; width: 2.25rem; height: 2.25rem; flex: 0 0 2.25rem; place-items: center; border-radius: 50%; background: #e3f2fd; color: #1565c0; }
  span { min-width: 0; }
  strong { display: block; font-size: 0.9375rem; line-height: 1.3125rem; }
  small { display: block; margin-top: 0.125rem; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.8125rem; }
`

export const EditorHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  p { margin: 0.25rem 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.875rem; line-height: 1.25rem; }
  @media (max-width: 35rem) { align-items: flex-start; flex-direction: column; }
`

export const SlotTools = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-left: auto;
  button { min-width: 3rem; min-height: 3rem; padding-inline: 0.75rem; }
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
  font-size: 0.8125rem;
`

export const Picker = styled.section`
  display: grid;
  gap: 0.875rem;
  margin-top: 1.25rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.default};
  border-radius: 0.875rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.subtle};
  h3 { margin: 0; font-size: 1rem; line-height: 1.5rem; }
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
  small { display: block; margin-top: 0.1875rem; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.75rem; }
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
  line-height: 1.3125rem;
`

export const LinkBox = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: minmax(0, 1fr) auto;
  margin-top: 1.25rem;
  input { min-width: 0; }
  @media (max-width: 35rem) { grid-template-columns: 1fr; }
`
