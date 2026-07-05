import styled from 'styled-components'

export const Dimmer = styled.div`
  position: fixed;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(15 23 42 / 48%);
  inset: 0;
`

export const Dialog = styled.section`
  width: min(22rem, calc(100vw - 2rem));
  border-radius: 1rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: 0 1.25rem 3rem rgb(15 23 42 / 20%);
`

export const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 1.25rem;
  line-height: 1.4;
`

export const Description = styled.p`
  margin: 0.5rem 0 1.5rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.9375rem;
  line-height: 1.5;
`

export const ErrorMessage = styled.p`
  margin: -0.75rem 0 1rem;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 0.8125rem;
  line-height: 1.4;
`

export const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.625rem;
`

const Button = styled.button`
  min-height: 2.75rem;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.button};
  cursor: pointer;
  font: inherit;
  font-weight: 700;

  &:disabled {
    cursor: wait;
    opacity: 0.55;
  }

  &:focus-visible {
    outline: 0.1875rem solid ${({ theme }) => theme.colors.shadow.focus};
    outline-offset: 0.125rem;
  }
`

export const CloseButton = styled(Button)`
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.strong};
`

export const LogoutButton = styled(Button)`
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};

  &:hover {
    background: ${({ theme }) => theme.colors.brand.primaryHover};
  }
`
