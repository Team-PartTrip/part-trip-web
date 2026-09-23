import styled from 'styled-components'

export const Page = styled.main`
  width: min(100%, 1200px);
  margin: 24px auto 64px;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin: 0 24px 24px;
  h1 { margin: 0; font-size: 30px; line-height: 38px; }
  p { margin: 8px 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 15px; line-height: 22px; }
  @media (max-width: 860px) { align-items: flex-start; flex-direction: column; }
`

export const Steps = styled.ol`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  @media (max-width: 560px) { width: 100%; gap: 4px; }
`

export const Step = styled.li<{ $active: boolean }>`
  min-height: 36px;
  display: flex;
  align-items: center;
  border-radius: 18px;
  padding: 0 12px;
  background: ${({ $active }) => $active ? '#1565c0' : '#e3f2fd'};
  color: ${({ $active, theme }) => $active ? theme.colors.text.inverse : theme.colors.text.strong};
  font-size: 13px;
  white-space: nowrap;
  @media (max-width: 560px) { flex: 1; justify-content: center; min-width: 0; padding-inline: 5px; font-size: 11px; }
`

export const Grid = styled.div`
  display: grid;
  align-items: start;
  gap: 24px;
  grid-template-columns: minmax(0, 736px) minmax(280px, 360px);
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`

export const Card = styled.section`
  min-width: 0;
  border: 1px solid #e6edf4;
  border-radius: 16px;
  padding: 24px;
  background: #fff;
  box-shadow: 0 4px 14px rgb(15 33 51 / 5%);
  h2 { margin: 0; font-size: 18px; line-height: 26px; }
  > p { margin: 8px 0 20px; color: ${({ theme }) => theme.colors.text.muted}; font-size: 14px; line-height: 21px; }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const Field = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
  > label, > span { font-size: 14px; font-weight: 600; }
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; line-height: 19px; }
  input { max-width: 420px; }
`

export const CityGrid = styled.div`
  display: grid;
  max-height: 240px;
  overflow: auto;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  max-width: 420px;
`

export const City = styled.button<{ $active: boolean }>`
  display: flex;
  min-height: 64px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 2px;
  border: 1px solid ${({ $active }) => $active ? '#66a3bf' : '#e6eef5'};
  border-radius: 14px;
  padding: 10px 16px;
  background: ${({ $active }) => $active ? '#e3f2fd' : '#fff'};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  font: inherit;
  text-align: left;
  strong { font-size: 15px; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; }
`

export const DateGrid = styled.div`
  display: grid;
  max-width: 420px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 460px) { grid-template-columns: 1fr; }
`

export const Error = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 14px;
  line-height: 21px;
`

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
  button { min-height: 48px; }
`

export const BlockList = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`

export const Block = styled.section`
  min-width: 0;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 14px;
  padding: 14px;
  background: #fff;
  h3 { margin: 0 0 10px; font-size: 14px; line-height: 20px; }
`

export const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

export const Option = styled.button<{ $active: boolean }>`
  min-height: 48px;
  border: 1px solid ${({ $active }) => $active ? '#1766bf' : '#d1dee5'};
  border-radius: 14px;
  padding: 0 14px;
  background: ${({ $active }) => $active ? '#e0f2ff' : '#fff'};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  &:focus-visible { outline: 3px solid ${({ theme }) => theme.colors.brand.primary}; outline-offset: 2px; }
`

export const MoreBlocks = styled.details`
  margin-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding-top: 16px;
  > summary { min-height: 48px; color: ${({ theme }) => theme.colors.brand.strong}; cursor: pointer; font-weight: 600; }
  ${BlockList} { margin-top: 12px; }
`

export const Summary = styled.aside`
  border: 1px solid #90caf9;
  border-radius: 16px;
  padding: 24px;
  background: #f3f8ff;
  h2 { margin: 0 0 16px; font-size: 18px; line-height: 26px; }
  dl { display: grid; gap: 12px; margin: 0; }
  dt { color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; }
  dd { margin: 3px 0 0; font-size: 15px; font-weight: 600; line-height: 22px; overflow-wrap: anywhere; }
`

export const ScheduleDays = styled.div`
  display: grid;
  gap: 16px;
`

export const ScheduleDay = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  padding: 20px;
  h2 { margin: 0 0 12px; font-size: 17px; line-height: 24px; }
`

export const SchedulePlace = styled.div`
  display: flex;
  min-height: 64px;
  align-items: center;
  gap: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding: 10px 0;
  > b { display: grid; width: 36px; height: 36px; flex: 0 0 36px; place-items: center; border-radius: 50%; background: #e3f2fd; color: #1565c0; }
  span { min-width: 0; }
  strong { display: block; font-size: 15px; line-height: 21px; }
  small { display: block; margin-top: 2px; color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; }
`

export const EditorHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  p { margin: 4px 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 14px; line-height: 20px; }
  @media (max-width: 560px) { align-items: flex-start; flex-direction: column; }
`

export const SlotTools = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-left: auto;
  button { min-width: 48px; min-height: 48px; padding-inline: 12px; }
`

export const SwapButton = styled.button<{ $active?: boolean }>`
  min-height: 48px;
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.brand.primary : theme.colors.border.default};
  border-radius: 12px;
  padding: 0 12px;
  background: ${({ $active, theme }) => $active ? theme.colors.background.info : theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  font: inherit;
  font-size: 13px;
`

export const Picker = styled.section`
  display: grid;
  gap: 14px;
  margin-top: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 14px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.subtle};
  h3 { margin: 0; font-size: 16px; line-height: 24px; }
`

export const PickerForm = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 8px;
  input, button { min-height: 48px; }
  @media (max-width: 560px) { grid-template-columns: 1fr 1fr; input { grid-column: 1 / -1; } }
`

export const CandidateList = styled.div`
  display: grid;
  gap: 8px;
  max-height: 340px;
  overflow: auto;
`

export const CandidateButton = styled.button`
  display: grid;
  min-height: 56px;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 12px;
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;
  strong { display: block; font-size: 14px; }
  small { display: block; margin-top: 3px; color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; }
`

export const PickerActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  select, button { min-height: 48px; }
`

export const EditorFeedback = styled.p<{ $error?: boolean }>`
  margin: 12px 0 0;
  color: ${({ $error, theme }) => $error ? theme.colors.status.error : theme.colors.brand.strong};
  font-size: 14px;
  line-height: 21px;
`

export const LinkBox = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: minmax(0, 1fr) auto;
  margin-top: 20px;
  input { min-width: 0; }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`
