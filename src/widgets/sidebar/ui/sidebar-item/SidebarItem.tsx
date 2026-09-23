import { useLocation } from '@tanstack/react-router'

import * as S from './SidebarItem.style'

interface Props {
  active?: boolean
  iconSrc?: string
  text: string
  href: string
  badgeCount?: number
  onClick?: () => void
}

const SidebarItem = ({
  active,
  iconSrc,
  text,
  href,
  badgeCount,
  onClick,
}: Props) => {
  const { pathname } = useLocation()
  const isParentActive = active ?? (pathname === href || (href !== '/' && pathname.startsWith(href)))

  return (
    <S.ItemLink
      to={href}
      onClick={onClick}
      $isParentActive={isParentActive}
      aria-current={isParentActive ? 'page' : undefined}
      aria-label={badgeCount && badgeCount > 0 ? `${text}, 읽지 않은 알림 ${badgeCount}개` : undefined}
    >
      {iconSrc && (
        <S.IconWrapper>
          <img src={iconSrc} alt="" />
          {badgeCount && badgeCount > 0 ? <S.Badge aria-hidden="true">{badgeCount > 99 ? '99+' : badgeCount}</S.Badge> : null}
        </S.IconWrapper>
      )}

      <S.Text $isParentActive={isParentActive}>{text}</S.Text>
    </S.ItemLink>
  )
}

export default SidebarItem
