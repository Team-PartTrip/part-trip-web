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
