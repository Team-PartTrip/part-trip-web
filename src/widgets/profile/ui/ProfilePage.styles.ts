import styled from 'styled-components'

export const Page = styled.main`
  display: flex;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  flex: 1;
  flex-direction: column;
  padding: 0;
  color: ${({ theme }) => theme.colors.text.strong};

`

export const Header = styled.header`
  min-height: 4.25rem;
  padding: 0 1.5rem;
  margin: 1.5rem 0;
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

export const State = styled.p`
  padding: 4rem 0;
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
  gap: 0.5rem;

  button { min-height: 2.875rem; }
`

export const LogoutButton = styled.button`
  min-height: 2.875rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.status.error};
  border-radius: 0.875rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.status.error};
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 600;
`

export const ErrorActions = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`

export const Avatar = styled.div`
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  overflow: hidden;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 0.6875rem;
  font-weight: 600;
  img { display: block; width: 100%; height: 100%; object-fit: cover; }
`

export const AccountPanel = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  border: 0.0625rem solid #e3ecf5;
  border-radius: 1rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: 0 0.25rem 0.875rem rgb(15 33 51 / 5%);
`

export const AccountHeader = styled.div`
  display: flex;
  min-height: 11rem;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;

  @media (max-width: 45rem) { align-items: flex-start; flex-wrap: wrap; }
`

export const AccountCopy = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.3125rem;
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 1.25rem; line-height: 1.75rem; }
  span, small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.875rem; line-height: 1.25rem; }
  small { overflow-wrap: anywhere; }
`

export const SettingsList = styled.nav`
  display: flex;
  flex: 1;
  flex-direction: column;
  border-top: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  padding: 0 1.5rem;
`

export const SettingsRow = styled.button`
  display: flex;
  flex: 1;
  width: 100%;
  min-height: 4.75rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 0;
  border-bottom: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  padding: 0.75rem 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;

  &:last-child { border-bottom: 0; }
  &:hover { background: ${({ theme }) => theme.colors.background.subtle}; }
  > span { display: flex; min-width: 0; flex-direction: column; gap: 0.25rem; }
  strong { font-size: 0.9375rem; line-height: 1.375rem; }
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.8125rem; line-height: 1.125rem; }
  b { flex: 0 0 auto; color: ${({ theme }) => theme.colors.brand.strong}; font-size: 0.875rem; font-weight: 600; }

  @media (max-width: 35rem) {
    align-items: flex-start;
    > b { align-self: center; max-width: 6.875rem; font-size: 0.75rem; text-align: right; }
  }
`
