import styled from 'styled-components'

export const SidebarWrapper = styled.div`
  width: 15.0625rem;
  height: 100%;
  min-height: 38rem;
  flex: 0 0 15.0625rem;
  background: #ffffff;

  @media (max-width: 74.9375rem) {
    width: 10rem;
    flex-basis: 10rem;
  }

  @media (max-width: 63.9375rem) {
    width: 5rem;
    flex-basis: 5rem;
  }

  @media (max-width: 47.9375rem) {
    width: 100%;
    height: 3.5rem;
    min-height: 0;
    flex: 0 0 3.5rem;
  }
`

export const Aside = styled.aside`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  background: #ffffff;

  @media (max-width: 47.9375rem) {
    flex-direction: row;
    align-items: center;
  }
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

  @media (max-width: 74.9375rem) {
    padding-inline: 1.5rem;

    img {
      width: 7rem;
      height: auto;
    }
  }

  @media (max-width: 63.9375rem) {
    justify-content: center;
    padding-inline: 0.75rem;

    img {
      width: 3.5rem;
    }
  }

  @media (max-width: 47.9375rem) {
    width: 5.75rem;
    height: 100%;
    flex: 0 0 5.75rem;
    align-items: center;
    padding: 0 0 0 0.75rem;

    img {
      width: 5rem;
    }
  }
`

export const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2.1875rem;
  padding: 4.3125rem 2.5625rem 0;

  @media (max-width: 74.9375rem) {
    padding-inline: 1.5rem;
  }

  @media (max-width: 63.9375rem) {
    align-items: center;
    padding-inline: 1.75rem;
  }

  @media (max-width: 47.9375rem) {
    height: 100%;
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    gap: 0;
    padding: 0 0.5rem;
  }
`

export const Footer = styled.div`
  margin: auto 1.9375rem 1.5625rem;
  border-top: 0.0625rem solid #b8bdc5;
  padding-top: 1.25rem;

  @media (max-width: 63.9375rem) {
    margin-inline: 1.25rem;
  }

  @media (max-width: 47.9375rem) {
    display: none;
  }
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

  @media (max-width: 63.9375rem) {
    width: 100%;
    justify-content: center;

    > span:last-child {
      position: absolute;
      width: 0.0625rem;
      height: 0.0625rem;
      overflow: hidden;
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      white-space: nowrap;
    }
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
