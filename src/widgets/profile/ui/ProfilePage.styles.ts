import { Link } from '@tanstack/react-router'
import styled from 'styled-components'

export const Page = styled.main`
  display: flex;
  width: min(100%, 68rem);
  min-width: 0;
  align-self: center;
  flex-direction: column;
  gap: 1.5rem;
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 2rem;
  font-weight: 700;
  line-height: 2.5rem;
`

export const Subtitle = styled.p`
  max-width: 48rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 1rem;
  line-height: 1.5rem;
`

export const State = styled.p`
  margin: 0;
  padding: 2rem 0;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`

export const ModalBackdrop = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: transparent;
`

export const ProfileActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;

  button { min-height: 2.875rem; }
`

export const LogoutButton = styled.button`
  min-height: 2.875rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.status.error};
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.status.error};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;

  &:focus-visible {
    outline: 0.1875rem solid ${({ theme }) => theme.colors.border.interactive};
    outline-offset: 0.125rem;
  }
`

export const ErrorActions = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`

export const DeletionError = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.status.error};
`

export const Avatar = styled.div`
  display: grid;
  width: 4rem;
  height: 4rem;
  flex: 0 0 4rem;
  place-items: center;
  overflow: hidden;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background.info};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 1.125rem;
  font-weight: 700;

  img { display: block; width: 100%; height: 100%; object-fit: cover; }
`

export const AccountPanel = styled.section`
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
`

export const AccountHeader = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;

  @media (max-width: 56rem) {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: start;

    ${ProfileActions} {
      grid-column: 1 / -1;
      justify-content: flex-start;
    }
  }
`

export const AccountCopy = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.25rem;

  strong {
    color: ${({ theme }) => theme.colors.text.strong};
    font-size: 1.375rem;
    line-height: 1.875rem;
    overflow-wrap: anywhere;
  }

  span, small {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 0.9375rem;
    line-height: 1.375rem;
  }

  small { overflow-wrap: anywhere; }
`

export const SettingsNav = styled.nav`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: start;
  gap: 1rem;

  @media (max-width: 56rem) {
    grid-template-columns: 1fr;
  }
`

export const SettingsGroup = styled.section`
  min-width: 0;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  padding: 1.125rem 1.25rem 0;
  background: ${({ theme }) => theme.colors.background.default};

  > h2 {
    margin: 0 0 0.75rem;
    color: ${({ theme }) => theme.colors.text.strong};
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.625rem;
  }
`

export const SettingsList = styled.div`
  display: flex;
  flex-direction: column;
`

export const SettingsRow = styled(Link)`
  display: flex;
  width: 100%;
  min-width: 0;
  min-height: 4.75rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 0;
  border-top: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  padding: 0.875rem 0.125rem;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
  text-decoration: none;

  &:hover { background: ${({ theme }) => theme.colors.background.subtle}; }

  &:focus-visible {
    outline: 0.1875rem solid ${({ theme }) => theme.colors.border.interactive};
    outline-offset: -0.1875rem;
  }

  > span {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 0.25rem;
  }

  strong {
    color: ${({ theme }) => theme.colors.text.strong};
    font-size: 1rem;
    line-height: 1.5rem;
  }

  small {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 0.875rem;
    line-height: 1.375rem;
  }

  b {
    flex: 0 1 auto;
    color: ${({ theme }) => theme.colors.brand.strong};
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.25rem;
    text-align: right;
  }
`
