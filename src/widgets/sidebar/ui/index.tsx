import { DoorOpen } from '@b1nd/dodam-design-system/icons'
import { useOverlay } from '@b1nd/dodam-design-system/components'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { type ReactElement } from 'react'

import type { SidebarMenuType } from '../types/sidebar-item/sidebar-item'
import LogoutDialog from './logout-dialog'
import SidebarItem from './sidebar-item/SidebarItem'
import * as S from './Sidebar.style'

interface Props {
  logo: ReactElement
  menus: SidebarMenuType[]
}

const Sidebar = ({ logo, menus }: Props) => {
  const overlay = useOverlay()
  const navigate = useNavigate()

  const openLogoutDialog = () => {
    overlay.open(({ close, exit }) => {
      const onClose = () => {
        close()
        exit()
      }

      return (
        <LogoutDialog
          onClose={onClose}
          moveToLogin={() => navigate('/login')}
        />
      )
    })
  }

  return (
    <S.SidebarWrapper>
      <S.Aside>
        <S.LogoSection>
          <Link to="/">{logo}</Link>
        </S.LogoSection>

        <S.MenuList aria-label="메인 메뉴">
          {menus.map((item) => (
            <SidebarItem
              key={item.text}
              Icon={item.icon}
              text={item.text}
              herf={item.herf}
            />
          ))}
        </S.MenuList>

        <S.Footer>
          <S.LogoutButton type="button" onClick={openLogoutDialog}>
            <S.LogoutIconBox>
              <DoorOpen aria-hidden="true" />
            </S.LogoutIconBox>
            <span>Log out</span>
          </S.LogoutButton>
        </S.Footer>
      </S.Aside>
    </S.SidebarWrapper>
  )
}

export default Sidebar
