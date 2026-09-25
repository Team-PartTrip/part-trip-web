import styled from 'styled-components'

export const Page = styled.main`
  width: min(100%, 75rem);
  margin: 1.5rem auto 4rem;
  color: ${({ theme }) => theme.colors.text.strong};
  > header { margin: 0 1.5rem 1.5rem; }
  h1 { margin: 0; font-size: 1.875rem; line-height: 2.375rem; }
  header p { margin: 0.5rem 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.9375rem; line-height: 1.375rem; }
`

export const Card = styled.section`
  display: grid;
  gap: 0;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  padding: 0.5rem 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  section { padding: 1.25rem 0; border-bottom: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle}; }
  h2 { margin: 0; font-size: 1.125rem; line-height: 1.625rem; }
  p { margin: 0.375rem 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.875rem; line-height: 1.375rem; }
  > p { padding: 0.5rem 0 1rem; }
`

export const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.875rem;
  button {
    min-height: 3rem;
    border: 0.0625rem solid ${({ theme }) => theme.colors.border.default};
    border-radius: 0.75rem;
    padding: 0 1rem;
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
  min-height: 3rem;
  margin-top: 0.875rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.default};
  border-radius: 0.75rem;
  padding: 0 1rem;
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
