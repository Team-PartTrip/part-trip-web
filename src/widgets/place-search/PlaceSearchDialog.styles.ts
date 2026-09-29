import styled from 'styled-components'

export const Dialog = styled.dialog`
  display: grid;
  width: min(34rem, 100%);
  max-height: min(42rem, calc(100dvh - 2rem));
  gap: 1rem;
  overflow: auto;
  overscroll-behavior: contain;
  &:not([open]) { display: none; }
  border: 0;
  border-radius: 1rem;
  padding: 1.5rem;
  background: #fff;
  color: ${({ theme }) => theme.colors.text.strong};
  box-shadow: 0 1.25rem 3rem rgb(15 23 42 / 20%);
  &::backdrop { background: rgb(15 23 42 / 48%); }
  h2 { margin: 0; font-size: 1.25rem; }
  input { width: 100%; }
`

export const Results = styled.div`
  display: flex;
  max-height: 15rem;
  flex-direction: column;
  overflow: auto;
  width: 100%;
  border: 0.0625rem solid #e6edf4;
  border-radius: 0.75rem;
  background: #fff;
  > p, > small { margin: 0; padding: 0.75rem 0.875rem; }
`

export const Error = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 0.875rem;
  line-height: 1.3125rem;
`

export const Place = styled.button`
  display: flex;
  min-height: 3.25rem;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.25rem;
  border: 0;
  border-top: 0.0625rem solid #eef2f5;
  padding: 0.5rem 0.875rem;
  background: #fff;
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  font: inherit;
  text-align: left;
  strong { font-size: 0.9375rem; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.75rem; }
  &:hover { background: #f3f8ff; }
  &:focus-visible { position: relative; outline: 0.125rem solid ${({ theme }) => theme.colors.brand.primary}; outline-offset: -0.125rem; }
`
