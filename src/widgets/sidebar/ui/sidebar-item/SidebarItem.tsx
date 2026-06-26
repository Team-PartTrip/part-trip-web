import type { FC, SVGProps } from 'react'
import { useLocation } from 'react-router-dom'

import * as S from './SidebarItem.style'

interface Props {
  Icon?: FC<SVGProps<SVGSVGElement>>
  text: string
  herf: string
  onClick?: () => void
}

const SidebarItem = ({
  Icon,
  text,
  herf,
  onClick,
}: Props) => {
  const { pathname } = useLocation()

  const isParentActive =
    pathname === herf || (herf !== '/' && pathname.startsWith(herf))

  return (
    <S.ItemLink
      to={herf}
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
