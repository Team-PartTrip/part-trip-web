import styled from 'styled-components'

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Header = styled.header`
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
  grid-template-columns: minmax(0, 1fr) 360px;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const DeleteList = styled.section`
  min-height: 374px;
  border-radius: 20px;
  padding: 24px 16px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 24px 0 8px; font-size: 15px; }
`

export const Toolbar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  strong { font-size: 12px; }
  button { border: 0; background: transparent; color: ${({ theme }) => theme.colors.brand.primary}; cursor: pointer; font-size: 11px; }
`

export const PhotoGrid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  @media (max-width: 560px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`

export const PhotoButton = styled.button<{ $selected: boolean }>`
  position: relative;
  overflow: hidden;
  height: 94px;
  border: 2px solid ${({ $selected, theme }) => ($selected ? theme.colors.brand.primary : 'transparent')};
  border-radius: 10px;
  padding: 0;
  background: ${({ theme }) => theme.colors.background.muted};
  cursor: pointer;
  img { display: block; width: 100%; height: 100%; object-fit: cover; }
  span { position: absolute; top: 6px; right: 6px; display: grid; width: 18px; height: 18px; place-items: center; border-radius: 5px; background: ${({ $selected, theme }) => ($selected ? theme.colors.brand.primary : theme.colors.background.default)}; color: ${({ theme }) => theme.colors.text.inverse}; font-size: 11px; }
`

export const DeletePanel = styled.section`
  display: flex;
  min-height: 374px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0; font-size: 15px; }
  > strong { font-size: 12px; }
  > span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; line-height: 16px; }
`

export const Warning = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 4px;
  border-radius: 12px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.background.error};
  strong { color: ${({ theme }) => theme.colors.status.error}; font-size: 12px; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 10px; }
`

export const DeleteActions = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
  button { min-height: 36px; border: 1px solid ${({ theme }) => theme.colors.border.default}; border-radius: 10px; background: ${({ theme }) => theme.colors.background.default}; color: ${({ theme }) => theme.colors.text.strong}; cursor: pointer; font-size: 12px; font-weight: 600; }
`

export const DeleteButton = styled.button`
  width: 100%;
  min-height: 46px !important;
  border: 0 !important;
  background: ${({ theme }) => theme.colors.status.error} !important;
  color: ${({ theme }) => theme.colors.text.inverse} !important;
  &:disabled { cursor: not-allowed !important; opacity: .5; }
`
