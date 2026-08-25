import { useLocation } from '@tanstack/react-router'

import * as S from './SidebarItem.style'

interface Props {
  active?: boolean
  iconSrc?: string
  text: string
  href: string
  onClick?: () => void
}

const SidebarItem = ({
  active,
  iconSrc,
  text,
  href,
  onClick,
}: Props) => {
  const { pathname } = useLocation()
  const isParentActive = active ?? (pathname === href || (href !== '/' && pathname.startsWith(href)))

  return (
    <S.ItemLink
      to={href}
      onClick={onClick}
      $isParentActive={isParentActive}
    >
      {iconSrc && (
        <S.IconWrapper>
          <img src={iconSrc} alt="" />
        </S.IconWrapper>
      )}

      <S.Text $isParentActive={isParentActive}>{text}</S.Text>
    </S.ItemLink>
  )
}

export default SidebarItem
