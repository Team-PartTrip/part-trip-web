import type { ComponentType, SVGProps } from 'react'
import styled, { css } from 'styled-components'

import logoUrl from '@shared/assets/logo.svg'

type MenuItem = {
  active?: boolean
  icon: ComponentType<SVGProps<SVGSVGElement>>
  iconHeight: number
  iconWidth: number
  label: string
}

function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 15 17" fill="none" aria-hidden="true" {...props}>
      <path
        d="M1.5 8.2L7.5 2.5L13.5 8.2V15.5H9.4V10.4H5.6V15.5H1.5V8.2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function CommunityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 17" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 3.5H15C15.8284 3.5 16.5 4.17157 16.5 5V9.4C16.5 10.2284 15.8284 10.9 15 10.9H9.2L6.2 13.5V10.9H3C2.17157 10.9 1.5 10.2284 1.5 9.4V5C1.5 4.17157 2.17157 3.5 3 3.5Z"
        fill="currentColor"
      />
      <circle cx="6" cy="7.2" r="0.8" fill="#fafafa" />
      <circle cx="9" cy="7.2" r="0.8" fill="#fafafa" />
      <circle cx="12" cy="7.2" r="0.8" fill="#fafafa" />
    </svg>
  )
}

function RecordIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 19 19" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 2.5H11.5L15 6V16.5H4C3.17157 16.5 2.5 15.8284 2.5 15V4C2.5 3.17157 3.17157 2.5 4 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 2.5V6H15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 9.5H12.5M5.5 12H10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MissionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 21 21" fill="none" aria-hidden="true" {...props}>
      <circle cx="6" cy="7" r="1.6" fill="currentColor" />
      <circle cx="10.5" cy="4.8" r="1.6" fill="currentColor" />
      <circle cx="15" cy="7" r="1.6" fill="currentColor" />
      <circle cx="8.2" cy="10.4" r="1.6" fill="currentColor" />
      <path
        d="M10.5 12.3C8.2 12.3 6.6 13.7 6.6 15.4C6.6 17.1 8.3 18.5 10.5 18.5C12.7 18.5 14.4 17.1 14.4 15.4C14.4 13.7 12.8 12.3 10.5 12.3Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ProfileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 21 21" fill="none" aria-hidden="true" {...props}>
      <circle cx="10.5" cy="6.4" r="3.2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4.6 17.2C5.8 14.2 8 12.8 10.5 12.8C13 12.8 15.2 14.2 16.4 17.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LogoutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 17 17" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 4.5H11.5C12.3284 4.5 13 5.17157 13 6V11C13 11.8284 12.3284 12.5 11.5 12.5H7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 8.5H2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M5.5 6.5L2.5 8.5L5.5 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const menuItems: MenuItem[] = [
  {
    active: true,
    icon: HomeIcon,
    iconHeight: 17,
    iconWidth: 15,
    label: '홈',
  },
  {
    icon: CommunityIcon,
    iconHeight: 17,
    iconWidth: 18,
    label: '커뮤니티',
  },
  {
    icon: RecordIcon,
    iconHeight: 19,
    iconWidth: 19,
    label: '기록',
  },
  {
    icon: MissionIcon,
    iconHeight: 21,
    iconWidth: 21,
    label: '미션',
  },
  {
    icon: ProfileIcon,
    iconHeight: 21,
    iconWidth: 21,
    label: '마이페이지',
  },
]

export function HomePage() {
  return (
    <PageShell>
      <Sidebar aria-label="홈 사이드바">
        <Brand>
          <BrandLogo src={logoUrl} alt="PartTrip" />
        </Brand>

        <SidebarBody>
          <Nav aria-label="주요 메뉴">
            <NavList>
              {menuItems.map((item) => (
                <NavItemButton
                  key={item.label}
                  $active={item.active}
                  type="button"
                >
                  <NavIcon $height={item.iconHeight} $width={item.iconWidth}>
                    <item.icon />
                  </NavIcon>
                  <NavLabel>{item.label}</NavLabel>
                </NavItemButton>
              ))}
            </NavList>
          </Nav>

          <LogoutButton type="button">
            <LogoutLabel>Log out</LogoutLabel>
            <LogoutIconWrap>
              <LogoutIcon />
            </LogoutIconWrap>
          </LogoutButton>
        </SidebarBody>
      </Sidebar>

      <MainArea aria-label="홈 콘텐츠" />
    </PageShell>
  )
}

const PageShell = styled.main`
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background: #ffffff;

  @media (max-width: 720px) {
    min-height: 100dvh;
  }
`

const Sidebar = styled.aside`
  display: flex;
  width: 241px;
  flex: 0 0 241px;
  flex-direction: column;
  background: #fafafa;
`

const Brand = styled.div`
  display: flex;
  padding: 31px 30px 0;
`

const BrandLogo = styled.img`
  width: 181px;
  height: 43px;
  object-fit: contain;
`

const SidebarBody = styled.div`
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
`

const Nav = styled.nav`
  padding: 69px 0 0 41px;
`

const NavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const navButtonStyles = css`
  display: flex;
  width: 183px;
  height: 56px;
  align-items: center;
  gap: 10px;
  border: 0;
  padding: 0;
  background: transparent;
  color: #111111;
  font: inherit;
  font-size: 18px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.9px;
  text-align: left;
  cursor: pointer;
  outline: none;

  &:hover {
    color: #1a6ebf;
  }
`

const NavItemButton = styled.button<{ $active?: boolean }>`
  ${navButtonStyles}
  color: ${({ $active }) => ($active ? '#1a6ebf' : '#111111')};
`

const NavLabel = styled.span`
  color: inherit;
`

const NavIcon = styled.span<{ $height: number; $width: number }>`
  display: inline-flex;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
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

const LogoutButton = styled.button`
  ${navButtonStyles}
  margin-top: auto;
  width: 100%;
  height: 57px;
  justify-content: space-between;
  padding: 0 14px 0 14px;
  border-radius: 0;
  box-shadow: 0 -4px 4px rgb(0 0 0 / 25%);
  color: #111111;

  &:hover {
    color: #1a6ebf;
  }
`

const LogoutLabel = styled.span`
  color: inherit;
`

const LogoutIconWrap = styled.span`
  display: inline-flex;
  width: 17px;
  height: 17px;
  align-items: center;
  justify-content: center;
  color: inherit;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`

const MainArea = styled.section`
  flex: 1;
  min-width: 0;
  background: #ffffff;
`
