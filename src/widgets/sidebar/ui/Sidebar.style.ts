import styled from 'styled-components'

export const SidebarWrapper = styled.aside`
  position: sticky;
  top: 0;
  z-index: 10;
  width: 14.5rem;
  height: 100dvh;
  flex: 0 0 14.5rem;
  border-right: 0.0625rem solid ${({ theme }) => theme.colors.border.soft};
  background: ${({ theme }) => theme.colors.background.default};

  @media (max-width: 47.9375rem) {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4rem;
    flex: 0 0 4rem;
    border-top: 0.0625rem solid ${({ theme }) => theme.colors.border.soft};
    border-right: 0;
  }
`

export const Aside = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  padding: 1.25rem 1.5rem 1.5rem;

  @media (max-width: 47.9375rem) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
  }
`

export const LogoSection = styled.div`
  height: 2.125rem;
  margin-bottom: 1.625rem;

  a {
    text-decoration: none;

    img {
      display: block;
      width: 8.5rem;
      height: auto;
    }
  }

  @media (max-width: 47.9375rem) {
    display: none;
  }
`

export const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 47.9375rem) {
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    gap: 0;
  }
`
