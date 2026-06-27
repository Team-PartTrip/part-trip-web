import styled from 'styled-components'

export const SidebarWrapper = styled.div`
  width: 15.0625rem;
  height: 100%;
  min-height: 38rem;
  flex: 0 0 15.0625rem;
  background: #ffffff;
`

export const Aside = styled.aside`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  background: #ffffff;
`

export const LogoSection = styled.div`
  display: flex;
  height: 4.625rem;
  align-items: flex-start;
  padding: 1.9375rem 1.875rem 0;

  a {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
  }

  img {
    display: block;
    width: 11.3125rem;
    height: 2.6875rem;
    object-fit: contain;
  }
`

export const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2.1875rem;
  padding: 4.3125rem 2.5625rem 0;
`

export const Footer = styled.div`
  margin: auto 1.9375rem 1.5625rem;
  border-top: 0.0625rem solid #b8bdc5;
  padding-top: 1.25rem;
`

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  border: 0;
  padding: 0;
  background: transparent;
  color: #727780;
  cursor: pointer;
  font: inherit;

  span {
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.3;
  }
`

export const LogoutIconBox = styled.span`
  display: flex;
  width: 1.0625rem;
  height: 1.0625rem;
  flex: 0 0 1.0625rem;
  align-items: center;
  justify-content: center;
  color: #727780;

  svg {
    width: 100%;
    height: 100%;
  }
`
