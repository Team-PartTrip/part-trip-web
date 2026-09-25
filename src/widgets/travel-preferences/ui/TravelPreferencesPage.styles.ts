import styled from 'styled-components'

export const Page = styled.main`
  width: min(100%, 75rem);
  margin: 1.5rem auto 4rem;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Header = styled.header`
  margin: 0 1.5rem 1.5rem;
  h1 { margin: 0; font-size: 1.875rem; line-height: 2.375rem; }
  p { margin: 0.5rem 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.9375rem; line-height: 1.375rem; }
`

export const Panel = styled.form`
  border: 0.0625rem solid #e5edf2;
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  background: ${({ theme }) => theme.colors.background.default};

  @media (max-width: 45rem) { padding: 1rem; }
`

export const Row = styled.fieldset`
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  border: 0;
  border-bottom: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  margin: 0;
  padding: 1.25rem 0;

  @media (max-width: 45rem) { align-items: flex-start; flex-direction: column; gap: 0.75rem; }
`

export const Copy = styled.div`
  min-width: 13.75rem;
  legend { padding: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 1.0625rem; font-weight: 700; }
  p { margin: 0.375rem 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.875rem; line-height: 1.3125rem; }
`

export const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

export const Option = styled.button<{ $active: boolean }>`
  min-width: 4.5rem;
  min-height: 3rem;
  border: 0.0625rem solid ${({ $active }) => $active ? '#1766bf' : '#d1dee5'};
  border-radius: 62.4375rem;
  padding: 0 1rem;
  background: ${({ $active }) => $active ? '#e0f2ff' : '#fff'};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  font: inherit;
  font-size: 0.9375rem;

  &:focus-visible { outline: 0.1875rem solid ${({ theme }) => theme.colors.brand.primary}; outline-offset: 0.125rem; }
`

export const Feedback = styled.p<{ $error?: boolean }>`
  min-height: 1.375rem;
  margin: 1rem 0 0;
  color: ${({ $error, theme }) => $error ? theme.colors.status.error : theme.colors.brand.strong};
  font-size: 0.875rem;
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;

  button { min-width: 8.75rem; min-height: 3rem; }
`
