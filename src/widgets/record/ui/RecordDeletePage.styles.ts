import styled from 'styled-components'

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding-bottom: 60px;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Header = styled.header`
  min-height: 66px;
  margin: 24px 0;
  padding-inline: 24px;
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
  font-size: 13px;
`

export const State = styled.p`
  padding: 64px 0;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`

export const DeleteLayout = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: 720px minmax(0, 456px);
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const DeleteList = styled.section`
  width: 720px;
  height: 374px;
  box-sizing: border-box;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0 0 12px; font-size: 15px; line-height: 22px; }
  @media (max-width: 860px) { width: 100%; height: auto; min-height: 374px; }
`

export const Toolbar = styled.header`
  display: flex;
  width: 100%;
  height: 31px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  strong { font-size: 15px; line-height: 18px; }
  > div { display: flex; gap: 12px; }
  button { width: 76px; height: 31px; border: 0; border-radius: 10px; padding: 0; background: ${({ theme }) => theme.colors.background.muted}; color: ${({ theme }) => theme.colors.brand.primary}; cursor: pointer; font-size: 12px; font-weight: 600; }
  button + button { border: 1px solid ${({ theme }) => theme.colors.border.default}; background: ${({ theme }) => theme.colors.background.default}; }
`

export const PhotoGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, 159px);
  @media (max-width: 760px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`

export const PhotoButton = styled.button<{ $selected: boolean }>`
  position: relative;
  overflow: hidden;
  width: 159px;
  height: 140px;
  border: 2px solid ${({ $selected, theme }) => ($selected ? theme.colors.brand.primary : 'transparent')};
  border-radius: 10px;
  padding: 0;
  background: ${({ theme }) => theme.colors.background.muted};
  cursor: pointer;
  img { display: block; width: 100%; height: 100%; object-fit: cover; }
  span { position: absolute; top: 8px; right: 8px; display: grid; width: 24px; height: 24px; place-items: center; border-radius: 7px; background: ${({ $selected, theme }) => ($selected ? theme.colors.brand.primary : theme.colors.background.default)}; color: ${({ $selected, theme }) => ($selected ? theme.colors.text.inverse : theme.colors.text.muted)}; font-size: 14px; }
  @media (max-width: 760px) { width: 100%; }
`

export const DeletePanel = styled.section`
  display: flex;
  width: 456px;
  height: 374px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0; font-size: 15px; }
  @media (max-width: 860px) { width: 100%; height: auto; min-height: 374px; }
`

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
  strong { color: ${({ theme }) => theme.colors.status.error}; font-size: 12px; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 10px; }
`

export const DeleteSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  strong { font-size: 12px; line-height: 17px; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; line-height: 15px; }
`

export const DeleteActions = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
  button { height: 43px; min-height: 43px; border: 1px solid ${({ theme }) => theme.colors.border.default}; border-radius: 12px; background: ${({ theme }) => theme.colors.background.default}; color: ${({ theme }) => theme.colors.text.strong}; cursor: pointer; font-size: 12px; font-weight: 600; }
`

export const DeleteButton = styled.button`
  width: 100%;
  min-height: 43px !important;
  border: 0 !important;
  background: ${({ theme }) => theme.colors.status.error} !important;
  color: ${({ theme }) => theme.colors.text.inverse} !important;
  &:disabled { cursor: not-allowed !important; opacity: .5; }
`
