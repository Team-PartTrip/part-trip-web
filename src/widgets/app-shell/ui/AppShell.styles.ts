import { Link } from '@/shared/libs/router'
import styled from 'styled-components'
import searchIcon from '@/shared/assets/figma/search.svg'

export { searchIcon }

export const Root = styled.div`
  display: flex;
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.background.subtle};
`

export const Content = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  min-height: 100dvh;

  @media (max-width: 767px) {
    padding-bottom: 64px;
  }
`

export const Topbar = styled.header`
  display: flex;
  width: 100%;
  height: 80px;
  flex: 0 0 80px;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.soft};
  padding: 0 32px;
  background: ${({ theme }) => theme.colors.background.default};

  @media (max-width: 767px) {
    height: 64px;
    flex-basis: 64px;
    padding: 0 16px;
  }
`

export const SearchForm = styled.form`
  display: flex;
  width: min(360px, 50vw);
  height: 44px;
  align-items: center;
  gap: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border.soft};
  border-radius: 999px;
  padding: 0 16px;
  background: ${({ theme }) => theme.colors.background.subtle};

  img {
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
  }

  input {
    width: 100%;
    min-width: 0;
    border: 0;
    padding: 0;
    background: transparent;
    color: ${({ theme }) => theme.colors.text.strong};
    font-size: 14px;
    outline: 0;

    &::placeholder {
      color: ${({ theme }) => theme.colors.text.muted};
    }
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`

export const TopbarSpacer = styled.div`
  min-width: 0;
  flex: 1;
`

export const NotificationLink = styled(Link)`
  display: inline-flex;
  height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0 16px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
`

export const ProfileLink = styled(Link)`
  display: inline-flex;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
`

export const Main = styled.main`
  min-width: 0;
  flex: 1;
  padding: 40px;

  @media (max-width: 1100px) {
    padding: 28px;
  }

  @media (max-width: 767px) {
    padding: 24px 16px;
  }
`
