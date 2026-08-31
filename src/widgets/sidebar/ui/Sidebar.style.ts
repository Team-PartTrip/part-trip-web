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
    text-decoration: none;

    img {
      display: block;
      width: 136px;
      height: auto;
    }
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
