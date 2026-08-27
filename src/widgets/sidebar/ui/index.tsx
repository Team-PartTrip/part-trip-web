import { useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { getAccessToken } from '@/entities/session/api'
import { paths } from '@/shared/config'

import type { SidebarMenuType } from '../types/sidebar-item/sidebar-item'
import LogoutDialog from './logout-dialog'
import SidebarItem from './sidebar-item/SidebarItem'
import * as S from './Sidebar.style'

interface Props {
  accountName?: string
  logo?: ReactNode
  menus: SidebarMenuType[]
}

function activeHref(pathname: string, menus: SidebarMenuType[]) {
  if (pathname.startsWith(paths.planner) || pathname.startsWith(paths.tripCards)) return paths.planner
  if (pathname.startsWith(paths.record)) return paths.record
  if (
    pathname.startsWith(paths.profile) ||
    pathname.startsWith(paths.notifications) ||
    pathname.startsWith('/settings')
  ) return paths.profile
  return menus.find((item) => pathname === item.href)?.href ?? paths.main
}

export default function Sidebar({ accountName = '내 PartTrip', menus }: Props) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const isLoggedIn = Boolean(getAccessToken())

  const selectedHref = activeHref(pathname, menus)

  return (
    <S.SidebarWrapper>
      <S.Aside>
        <S.LogoSection>
          <Link to={paths.main} aria-label="PartTrip 홈">PartTrip</Link>
        </S.LogoSection>

        <S.MenuList aria-label="메인 메뉴">
          {menus.map((item) => (
            <SidebarItem
              key={item.href}
              active={selectedHref === item.href}
              iconSrc={item.iconSrc}
              text={item.text}
              href={item.href}
            />
          ))}
        </S.MenuList>

        <S.AccountButton
          type="button"
          onClick={() => {
            if (isLoggedIn) setIsLogoutDialogOpen(true)
            else navigate({ to: paths.login })
          }}
          aria-label={isLoggedIn ? '로그아웃 메뉴' : '로그인'}
        >
          <S.Avatar aria-hidden="true">MS</S.Avatar>
          <span>{isLoggedIn ? accountName : '로그인'}</span>
        </S.AccountButton>
      </S.Aside>

      {isLogoutDialogOpen ? (
        <LogoutDialog
          onClose={() => setIsLogoutDialogOpen(false)}
          moveToLogin={() => navigate({ to: paths.login, replace: true })}
        />
      ) : null}
    </S.SidebarWrapper>
  )
}
