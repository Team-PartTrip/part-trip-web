import styled, { css } from 'styled-components'

type NavItemButtonProps = {
  $active?: boolean
  $gap: number
}

export const PageShell = styled.main`
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background: #ffffff;

  @media (max-width: 720px) {
    min-height: 100dvh;
  }
`

export const Sidebar = styled.aside`
  display: flex;
  width: 247px;
  min-height: 100vh;
  flex: 0 0 247px;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid #d8dddd;
  background: #f6f9ff;

  @media (max-width: 720px) {
    min-height: 100dvh;
  }
`

export const PrimaryNav = styled.nav`
  padding: 119px 0 0 23px;
`

export const PrimaryNavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 29px;
`

const navItemStyles = css<NavItemButtonProps>`
  display: flex;
  width: ${({ $active }) => ($active ? '200px' : 'fit-content')};
  height: ${({ $active }) => ($active ? '56px' : '44px')};
  align-items: center;
  gap: ${({ $gap }) => $gap}px;
  border: 0;
  border-radius: ${({ $active }) => ($active ? '8px' : '0')};
  padding: 0;
  background: ${({ $active }) =>
    $active ? 'rgb(85 135 246 / 28%)' : 'transparent'};
  color: ${({ $active }) => ($active ? '#2a64e1' : '#555151')};
  font: inherit;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -1.2px;
  text-align: left;
  cursor: pointer;
  outline: none;

  &:hover {
    color: #2a64e1;
  }
`

export const NavItemButton = styled.button<NavItemButtonProps>`
  ${navItemStyles}
`

export const NavLabel = styled.span`
  color: inherit;
  white-space: nowrap;
`

export const NavIcon = styled.span<{ $size: number }>`
  display: inline-flex;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  color: inherit;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`

export const SecondaryNav = styled.nav`
  margin-top: auto;
  padding: 0 0 24px 21px;

  &::before {
    display: block;
    width: 205px;
    border-top: 1px solid #d8dddd;
    margin-bottom: 23px;
    content: '';
  }
`

export const SecondaryNavList = styled.div`
  display: flex;
  margin-left: 29px;
  flex-direction: column;
  gap: 20px;
`

export const MainArea = styled.section`
  flex: 1;
  min-width: 0;
  background: #ffffff;
`
