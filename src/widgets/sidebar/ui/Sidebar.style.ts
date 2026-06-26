import styled from 'styled-components'

export const SidebarWrapper = styled.div`
  display: flex;
  width: clamp(14rem, 17vw, 16.125rem);
  height: 100dvh;
  flex: 0 0 clamp(14rem, 17vw, 16.125rem);
  padding: clamp(2.75rem, 6vh, 3.875rem) clamp(1rem, 2vw, 1.4375rem);
  z-index: 10;

  @media (max-width: 48rem) {
    width: 100%;
    height: auto;
    flex: 0 0 auto;
    padding: 1rem;
  }
`

export const Aside = styled.aside`
  display: flex;
  width: 100%;
  min-height: 100%;
  flex-direction: column;
  overflow: hidden;
  border-radius: clamp(1.25rem, 2vw, 1.5rem);
  background: ${({ theme }) => theme.colors.background.default};

  @media (max-width: 48rem) {
    min-height: auto;
  }
`

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  padding: clamp(1rem, 2vh, 1.1875rem) clamp(1.125rem, 2vw, 1.375rem) 0;

  a {
    display: inline-flex;
    max-width: 100%;
    align-items: center;
    text-decoration: none;
  }

  img {
    display: block;
    width: min(100%, 11.5rem);
    height: auto;
  }
`

export const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: clamp(1.55rem, 3.4vh, 2.1875rem);
  padding: clamp(1.65rem, 3.5vh, 2.0625rem) clamp(1rem, 2vw, 1.75rem) 0;
`

export const Footer = styled.div`
  margin-top: auto;
  padding: 0 clamp(1rem, 2vw, 1rem) clamp(1rem, 2.3vh, 1.25rem);
`

export const LogoutButton = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.75rem;
  border: 0;
  padding: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.default};
  cursor: pointer;
  font: inherit;

  span {
    font-size: clamp(1.25rem, 1.75vw, 1.5rem);
    font-weight: 400;
    letter-spacing: 0;
    line-height: 1.2;
  }
`

export const LogoutIconBox = styled.span`
  display: flex;
  width: clamp(2.55rem, 3.2vw, 2.9375rem);
  height: clamp(2.55rem, 3.2vw, 2.9375rem);
  flex: 0 0 clamp(2.55rem, 3.2vw, 2.9375rem);
  align-items: center;
  justify-content: center;
  border-radius: 0.625rem;
  background: #ff4545;
  color: ${({ theme }) => theme.colors.text.inverse};

  svg {
    width: 60%;
    height: 60%;
    color: currentColor;
  }

  svg path,
  svg rect,
  svg line,
  svg polyline,
  svg polygon {
    fill: currentColor;
    stroke: currentColor;
  }
`
