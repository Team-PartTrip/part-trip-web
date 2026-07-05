import styled from 'styled-components'

export const Form = styled.form`
  width: min(52rem, 100%);
  border-radius: 2rem;
  padding: clamp(1.5rem, 5vw, 3rem);
  background: white;
  box-shadow: 0 1rem 3rem rgb(13 31 64 / 9%);
`

export const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;

  span { color: ${({ theme }) => theme.colors.brand.strong}; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.12em; }
  h1 { margin: 0.35rem 0 0; color: ${({ theme }) => theme.colors.text.strong}; }
  p { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.8rem; }

  @media (max-width: 40rem) { align-items: flex-start; flex-direction: column; }
`

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 40rem) { grid-template-columns: 1fr; }
`

export const Field = styled.label<{ $wide?: boolean }>`
  display: grid;
  grid-column: ${({ $wide }) => ($wide ? '1 / -1' : 'auto')};
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.8125rem;
  font-weight: 700;

  input, textarea {
    width: 100%;
    border: 0.0625rem solid ${({ theme }) => theme.colors.border.soft};
    border-radius: ${({ theme }) => theme.radii.input};
    padding: 0.875rem 1rem;
    background: white;
    color: ${({ theme }) => theme.colors.text.strong};
    font: inherit;
    resize: vertical;
  }

  input:focus, textarea:focus { border-color: ${({ theme }) => theme.colors.brand.primary}; outline: none; box-shadow: ${({ theme }) => theme.shadows.inputFocus}; }
`

export const ErrorMessage = styled.p`
  margin: 1rem 0 0;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 0.8125rem;
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
`

const Button = styled.button`
  min-width: 7rem;
  min-height: 3rem;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.button};
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  &:disabled { cursor: wait; opacity: 0.55; }
`

export const CancelButton = styled(Button)`background: ${({ theme }) => theme.colors.background.subtle}; color: ${({ theme }) => theme.colors.text.strong};`
export const SaveButton = styled(Button)`background: ${({ theme }) => theme.colors.brand.primary}; color: white;`
