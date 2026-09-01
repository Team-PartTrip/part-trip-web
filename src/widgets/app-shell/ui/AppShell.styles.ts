import { Link } from '@tanstack/react-router'
import styled from 'styled-components'

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
  border-bottom: 1px solid #e6eef5;
  padding: 0 32px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: 0 2px 8px rgb(16 42 66 / 4%);

  @media (max-width: 767px) {
    height: 64px;
    flex-basis: 64px;
    padding: 0 16px;
  }
`

export const TopbarSpacer = styled.div`
  min-width: 0;
  flex: 1;
`

export const MobileLogoLink = styled(Link)`
  display: none;

  img {
    display: block;
    width: 112px;
    height: auto;
  }

  @media (max-width: 767px) {
    display: inline-flex;
    align-items: center;
  }
`

export const NotificationLink = styled(Link)`
  display: inline-flex;
  width: 70px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  padding: 0;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
`

export const Main = styled.main`
  min-width: 0;
  flex: 1;
  padding: 40px;
  background: ${({ theme }) => theme.colors.background.subtle};

  @media (max-width: 1100px) {
    padding: 28px;
  }

  @media (max-width: 767px) {
    padding: 24px 16px;
  }
`
