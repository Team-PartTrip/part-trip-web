import styled from 'styled-components'

export const Page = styled.main`
  width: min(100%, 1200px);
  margin: 24px auto 64px;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Header = styled.header`
  margin: 0 24px 24px;
  h1 { margin: 0; font-size: 30px; line-height: 38px; }
  p { margin: 8px 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 15px; line-height: 22px; }
`

export const Panel = styled.form`
  border: 1px solid #e5edf2;
  border-radius: 16px;
  padding: 24px 32px;
  background: ${({ theme }) => theme.colors.background.default};

  @media (max-width: 720px) { padding: 16px; }
`

export const Row = styled.fieldset`
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  margin: 0;
  padding: 20px 0;

  @media (max-width: 720px) { align-items: flex-start; flex-direction: column; gap: 12px; }
`

export const Copy = styled.div`
  min-width: 220px;
  legend { padding: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 17px; font-weight: 700; }
  p { margin: 6px 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 14px; line-height: 21px; }
`

export const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

export const Option = styled.button<{ $active: boolean }>`
  min-width: 72px;
  min-height: 48px;
  border: 1px solid ${({ $active }) => $active ? '#1766bf' : '#d1dee5'};
  border-radius: 999px;
  padding: 0 16px;
  background: ${({ $active }) => $active ? '#e0f2ff' : '#fff'};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  font: inherit;
  font-size: 15px;

  &:focus-visible { outline: 3px solid ${({ theme }) => theme.colors.brand.primary}; outline-offset: 2px; }
`

export const Feedback = styled.p<{ $error?: boolean }>`
  min-height: 22px;
  margin: 16px 0 0;
  color: ${({ $error, theme }) => $error ? theme.colors.status.error : theme.colors.brand.strong};
  font-size: 14px;
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;

  button { min-width: 140px; min-height: 48px; }
`
