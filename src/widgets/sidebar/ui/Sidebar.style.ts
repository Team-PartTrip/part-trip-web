import styled from 'styled-components'

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
  padding: 23px;

  @media (max-width: 767px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
  }
`

export const LogoSection = styled.div`
  height: 32px;
  margin-bottom: 24px;

  a {
    color: ${({ theme }) => theme.colors.brand.strong};
    font-size: 24px;
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
