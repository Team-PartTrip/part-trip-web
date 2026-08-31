import { Link, useLocation } from '@tanstack/react-router'
import { partTripLogoUrl } from '@/shared/assets'
import { paths } from '@/shared/config'

import type { SidebarMenuType } from '../types/sidebar-item/sidebar-item'
import SidebarItem from './sidebar-item/SidebarItem'
import * as S from './Sidebar.style'

interface Props {
  menus: SidebarMenuType[]
}

function activeHref(pathname: string, menus: SidebarMenuType[]) {
  if (pathname.startsWith(paths.planner)) return paths.planner
  if (pathname.startsWith(paths.tripCards)) return paths.record
  if (pathname.startsWith(paths.record)) return paths.record
  if (
    pathname.startsWith(paths.profile) ||
    pathname.startsWith(paths.notifications) ||
    pathname.startsWith('/settings')
  ) return paths.profile
  return menus.find((item) => pathname === item.href)?.href ?? paths.main
}

export default function Sidebar({ menus }: Props) {
  const { pathname } = useLocation()

  const selectedHref = activeHref(pathname, menus)

  return (
    <S.SidebarWrapper>
      <S.Aside>
        <S.LogoSection>
          <Link to={paths.main} aria-label="PartTrip 홈"><img src={partTripLogoUrl} alt="" /></Link>
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

      </S.Aside>
    </S.SidebarWrapper>
  )
}
