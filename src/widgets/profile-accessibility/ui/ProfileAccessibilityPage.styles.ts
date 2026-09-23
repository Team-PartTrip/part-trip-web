import styled from 'styled-components'

export const Page = styled.main`
  width: min(100%, 1200px);
  margin: 24px auto 64px;
  color: ${({ theme }) => theme.colors.text.strong};
  > header { margin: 0 24px 24px; }
  h1 { margin: 0; font-size: 30px; line-height: 38px; }
  header p { margin: 8px 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 15px; line-height: 22px; }
`

export const Card = styled.section`
  display: grid;
  gap: 0;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  padding: 8px 24px;
  background: ${({ theme }) => theme.colors.background.default};
  section { padding: 20px 0; border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle}; }
  h2 { margin: 0; font-size: 18px; line-height: 26px; }
  p { margin: 6px 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 14px; line-height: 22px; }
  > p { padding: 8px 0 16px; }
`

export const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
  button {
    min-height: 48px;
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: 12px;
    padding: 0 16px;
    background: ${({ theme }) => theme.colors.background.default};
    color: ${({ theme }) => theme.colors.text.strong};
    cursor: pointer;
  }
  button[aria-pressed='true'] {
    border-color: ${({ theme }) => theme.colors.brand.primary};
    background: ${({ theme }) => theme.colors.background.info};
    color: ${({ theme }) => theme.colors.brand.strong};
    font-weight: 700;
  }
`

export const Toggle = styled.button`
  min-height: 48px;
  margin-top: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 12px;
  padding: 0 16px;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  &[aria-pressed='true'] {
    border-color: ${({ theme }) => theme.colors.brand.primary};
    background: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
    font-weight: 700;
  }
`
