import styled from 'styled-components'

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding-bottom: 3.75rem;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Header = styled.header`
  min-height: 4.125rem;
  margin: 1.5rem 0;
  padding-inline: 1.5rem;
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 1.875rem;
  line-height: 2.375rem;
`

export const Subtitle = styled.p`
  margin: 0.375rem 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.9375rem;
  line-height: 1.375rem;
`

export const Error = styled.p`
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 0.8125rem;
`

export const State = styled.p`
  padding: 4rem 0;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`

export const DeleteLayout = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 45rem minmax(0, 28.5rem);
  @media (max-width: 53.75rem) { grid-template-columns: 1fr; }
`

export const DeleteList = styled.section`
  width: 45rem;
  height: 23.375rem;
  box-sizing: border-box;
  border-radius: 1.25rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0 0 0.75rem; font-size: 0.9375rem; line-height: 1.375rem; }
  @media (max-width: 53.75rem) { width: 100%; height: auto; min-height: 23.375rem; }
`

export const Toolbar = styled.header`
  display: flex;
  width: 100%;
  height: 1.9375rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  strong { font-size: 0.9375rem; line-height: 1.125rem; }
  > div { display: flex; gap: 0.75rem; }
  button { width: 4.75rem; height: 1.9375rem; border: 0; border-radius: 0.625rem; padding: 0; background: ${({ theme }) => theme.colors.background.muted}; color: ${({ theme }) => theme.colors.brand.primary}; cursor: pointer; font-size: 0.75rem; font-weight: 600; }
  button + button { border: 0.0625rem solid ${({ theme }) => theme.colors.border.default}; background: ${({ theme }) => theme.colors.background.default}; }
`

export const PhotoGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(4, 9.9375rem);
  @media (max-width: 47.5rem) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`

export const PhotoButton = styled.button<{ $selected: boolean }>`
  position: relative;
  overflow: hidden;
  width: 9.9375rem;
  height: 8.75rem;
  border: 0.125rem solid ${({ $selected, theme }) => ($selected ? theme.colors.brand.primary : 'transparent')};
  border-radius: 0.625rem;
  padding: 0;
  background: ${({ theme }) => theme.colors.background.muted};
  cursor: pointer;
  img { display: block; width: 100%; height: 100%; object-fit: cover; }
  span { position: absolute; top: 0.5rem; right: 0.5rem; display: grid; width: 1.5rem; height: 1.5rem; place-items: center; border-radius: 0.4375rem; background: ${({ $selected, theme }) => ($selected ? theme.colors.brand.primary : theme.colors.background.default)}; color: ${({ $selected, theme }) => ($selected ? theme.colors.text.inverse : theme.colors.text.muted)}; font-size: 0.875rem; }
  @media (max-width: 47.5rem) { width: 100%; }
`

export const DeletePanel = styled.section`
  display: flex;
  width: 28.5rem;
  height: 23.375rem;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  border-radius: 1.25rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0; font-size: 0.9375rem; }
  @media (max-width: 53.75rem) { width: 100%; height: auto; min-height: 23.375rem; }
`

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
  strong { color: ${({ theme }) => theme.colors.status.error}; font-size: 0.75rem; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.625rem; }
`

export const DeleteSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  strong { font-size: 0.75rem; line-height: 1.0625rem; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.6875rem; line-height: 0.9375rem; }
`

export const DeleteActions = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;
  button { height: 2.6875rem; min-height: 2.6875rem; border: 0.0625rem solid ${({ theme }) => theme.colors.border.default}; border-radius: 0.75rem; background: ${({ theme }) => theme.colors.background.default}; color: ${({ theme }) => theme.colors.text.strong}; cursor: pointer; font-size: 0.75rem; font-weight: 600; }
`

export const DeleteButton = styled.button`
  width: 100%;
  min-height: 2.6875rem !important;
  border: 0 !important;
  background: ${({ theme }) => theme.colors.status.error} !important;
  color: ${({ theme }) => theme.colors.text.inverse} !important;
  &:disabled { cursor: not-allowed !important; opacity: .5; }
`
