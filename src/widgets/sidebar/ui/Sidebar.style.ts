import styled from 'styled-components'
import { Skeleton } from '@/shared/ui/parttrip'

export const SidebarWrapper = styled.aside`
  position: sticky;
  top: 0;
  z-index: 10;
  width: 232px;
  height: 100dvh;
  flex: 0 0 232px;
  border-right: 1px solid ${({ theme }) => theme.colors.border.soft};
  background: ${({ theme }) => theme.colors.background.default};

  @media (max-width: 767px) {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 64px;
    flex: 0 0 64px;
    border-top: 1px solid ${({ theme }) => theme.colors.border.soft};
    border-right: 0;
  }
`

export const Aside = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  padding: 20px 24px 24px;

  @media (max-width: 767px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
  }
`

export const LogoSection = styled.div`
  height: 34px;
  margin-bottom: 26px;

  a {
    color: ${({ theme }) => theme.colors.brand.strong};
    font-size: 28px;
    font-weight: 700;
    line-height: 32px;
    text-decoration: none;
  }

  @media (max-width: 767px) {
    display: none;
  }
`

export const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 767px) {
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    gap: 4px;
  }
`

export const AccountButton = styled.button`
  display: flex;
  height: 44px;
  flex: 0 0 44px;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-top: auto;
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--pt-text-strong);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  text-align: left;

  @media (max-width: 767px) {
    display: none;
  }
`

export const Avatar = styled.span`
  display: inline-flex;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 11px;
  font-weight: 600;
`

export const AccountIcon = styled.span`
  display: inline-flex;
  width: 25px;
  height: 25px;
  flex: 0 0 25px;
  align-items: center;
  justify-content: center;

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
`

export const AccountSkeleton = styled(Skeleton)`
  width: 25px;
  height: 25px;
  border-radius: 50%;
`

export const AccountNameSkeleton = styled(Skeleton)`
  width: 128px;
  height: 20px;
`
