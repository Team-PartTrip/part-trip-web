import type { FC, SVGProps } from 'react'
import { useLocation } from 'react-router-dom'

import * as S from './SidebarItem.style'

interface Props {
  Icon?: FC<SVGProps<SVGSVGElement>>
  text: string
  href: string
  onClick?: () => void
}

const SidebarItem = ({
  Icon,
  text,
  href,
  onClick,
}: Props) => {
  const { pathname } = useLocation()

  const isParentActive =
    pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <S.ItemLink
      to={href}
      onClick={onClick}
      $isParentActive={isParentActive}
    >
      {Icon && (
        <S.IconWrapper>
          <Icon aria-hidden="true" focusable="false" />
        </S.IconWrapper>
      )}

      <S.Text $isParentActive={isParentActive}>{text}</S.Text>
    </S.ItemLink>
  )
}

export default SidebarItem
