import type { ComponentType, SVGProps } from 'react'

import * as S from './HomePage.styles'

type MenuItem = {
  active?: boolean
  icon: ComponentType<SVGProps<SVGSVGElement>>
  iconSize: number
  label: string
}

function DashboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true" {...props}>
      <rect x="7" y="7" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="3" />
      <rect x="25" y="7" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="3" />
      <rect x="7" y="25" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="3" />
      <rect x="25" y="25" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="3" />
    </svg>
  )
}

function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true" {...props}>
      <rect x="8" y="10" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="3" />
      <path d="M15 6V14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M29 6V14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M9 19H35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M15 26H17M22 26H24M29 26H31M15 32H17M22 32H24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function MissionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true" {...props}>
      <circle cx="15" cy="15" r="5" stroke="currentColor" strokeWidth="3" />
      <circle cx="29" cy="15" r="5" stroke="currentColor" strokeWidth="3" />
      <circle cx="22" cy="26" r="5" stroke="currentColor" strokeWidth="3" />
      <path d="M5 34C6.8 28.8 10.4 26 15 26" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M39 34C37.2 28.8 33.6 26 29 26" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 39C15.7 34.6 18.3 32 22 32C25.7 32 28.3 34.6 30 39" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function TravelRecordIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true" {...props}>
      <path d="M9 8H27C31.4 8 35 11.6 35 16V36H17C12.6 36 9 32.4 9 28V8Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M17 8V26C17 31.5 21.5 36 27 36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M23 17H30M23 24H29" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function CommunityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true" {...props}>
      <path d="M7 12L17 8L27 12L37 8V32L27 36L17 32L7 36V12Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M17 8V32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M27 12V36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="22" cy="20" r="3" fill="currentColor" />
      <path d="M16.5 28C17.6 24.8 19.5 23.2 22 23.2C24.5 23.2 26.4 24.8 27.5 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function AnnouncementIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true" {...props}>
      <path d="M9 19H14L31 11V33L14 25H9C7.3 25 6 23.7 6 22C6 20.3 7.3 19 9 19Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M14 25L18 36H24L20 28" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M35 17C36.8 18.2 38 20 38 22C38 24 36.8 25.8 35 27" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function SettingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true" {...props}>
      <circle cx="22" cy="22" r="5" stroke="currentColor" strokeWidth="3" />
      <path d="M22 7V12M22 32V37M7 22H12M32 22H37" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M11.4 11.4L15 15M29 29L32.6 32.6M32.6 11.4L29 15M15 29L11.4 32.6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

const primaryMenuItems: MenuItem[] = [
  {
    active: true,
    icon: DashboardIcon,
    iconSize: 44,
    label: '대시보드',
  },
  {
    icon: CalendarIcon,
    iconSize: 44,
    label: '여행 계획',
  },
  {
    icon: MissionIcon,
    iconSize: 44,
    label: '미션',
  },
  {
    icon: TravelRecordIcon,
    iconSize: 43,
    label: '여행기록',
  },
  {
    icon: CommunityIcon,
    iconSize: 40,
    label: '커뮤니티',
  },
]

const secondaryMenuItems: MenuItem[] = [
  {
    icon: AnnouncementIcon,
    iconSize: 43,
    label: '공지사항',
  },
  {
    icon: SettingIcon,
    iconSize: 43,
    label: '설정',
  },
]

export function HomePage() {
  return (
    <S.PageShell>
      <S.Sidebar aria-label="홈 사이드바">
        <S.PrimaryNav aria-label="주요 메뉴">
          <S.PrimaryNavList>
            {primaryMenuItems.map((item) => (
              <S.NavItemButton
                key={item.label}
                $active={item.active}
                $gap={24}
                type="button"
                aria-current={item.active ? 'page' : undefined}
              >
                <S.NavIcon $size={item.iconSize}>
                  <item.icon />
                </S.NavIcon>
                <S.NavLabel>{item.label}</S.NavLabel>
              </S.NavItemButton>
            ))}
          </S.PrimaryNavList>
        </S.PrimaryNav>

        <S.SecondaryNav aria-label="보조 메뉴">
          <S.SecondaryNavList>
            {secondaryMenuItems.map((item) => (
              <S.NavItemButton key={item.label} $gap={16} type="button">
                <S.NavIcon $size={item.iconSize}>
                  <item.icon />
                </S.NavIcon>
                <S.NavLabel>{item.label}</S.NavLabel>
              </S.NavItemButton>
            ))}
          </S.SecondaryNavList>
        </S.SecondaryNav>
      </S.Sidebar>

      <S.MainArea aria-label="홈 콘텐츠" />
    </S.PageShell>
  )
}
