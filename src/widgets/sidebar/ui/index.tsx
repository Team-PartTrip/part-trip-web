import { useState, type ReactElement } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { paths } from '@shared/config'

import type { SidebarMenuType } from '../types/sidebar-item/sidebar-item'
import LogoutDialog from './logout-dialog'
import SidebarItem from './sidebar-item/SidebarItem'
import * as S from './Sidebar.style'

interface Props {
  logo: ReactElement
  menus: SidebarMenuType[]
}

function DoorOpenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 8V5.5A1.5 1.5 0 0 0 12.5 4h-6A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20h6a1.5 1.5 0 0 0 1.5-1.5V16M10 12h9m0 0-3-3m3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const Sidebar = ({ logo, menus }: Props) => {
  const navigate = useNavigate()
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  const closeLogoutDialog = () => setIsLogoutDialogOpen(false)

  return (
    <S.SidebarWrapper>
      <S.Aside>
        <S.LogoSection>
          <Link to={paths.main}>{logo}</Link>
        </S.LogoSection>

        <S.MenuList aria-label="메인 메뉴">
          {menus.map((item) => (
            <SidebarItem
              key={item.text}
              Icon={item.icon}
              text={item.text}
              href={item.href}
            />
          ))}
        </S.MenuList>

        <S.Footer>
          <S.LogoutButton
            type="button"
            onClick={() => setIsLogoutDialogOpen(true)}
          >
            <S.LogoutIconBox>
              <DoorOpenIcon />
            </S.LogoutIconBox>
            <span>Log out</span>
          </S.LogoutButton>
        </S.Footer>
      </S.Aside>

      {isLogoutDialogOpen ? (
        <LogoutDialog
          onClose={closeLogoutDialog}
          moveToLogin={() => navigate(paths.login, { replace: true })}
        />
      ) : null}
    </S.SidebarWrapper>
  )
}

export default Sidebar
