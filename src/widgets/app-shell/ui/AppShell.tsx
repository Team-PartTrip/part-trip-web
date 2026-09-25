import { type ReactNode } from 'react'
import { useUnreadNotificationCountQuery } from '@/entities/notification'
import { partTripLogoUrl } from '@/shared/assets'
import { paths } from '@/shared/config'
import { MENUS } from '@/widgets/sidebar'
import { Sidebar } from '@/widgets/sidebar'

import * as S from './AppShell.styles'

type AppShellProps = {
  children: ReactNode
  fillHeight?: boolean
}

export function AppShell({ children, fillHeight = false }: AppShellProps) {
  const { data: notificationCount } = useUnreadNotificationCountQuery()

  return (
    <S.Root>
      <S.SkipLink href="#main-content">본문 바로가기</S.SkipLink>
      <Sidebar menus={MENUS} notificationCount={notificationCount?.unreadCount} />
      <S.Content>
        <S.Topbar>
          <S.MobileLogoLink to={paths.main} aria-label="PartTrip 홈"><img width={362} height={86} src={partTripLogoUrl} alt="" /></S.MobileLogoLink>
          <S.TopbarSpacer />
          <S.NotificationLink to={paths.notifications}>알림{typeof notificationCount?.unreadCount === 'number' ? ` ${notificationCount.unreadCount}` : ''}</S.NotificationLink>
        </S.Topbar>
        <S.Main $fillHeight={fillHeight} id="main-content" tabIndex={-1}>{children}</S.Main>
      </S.Content>
    </S.Root>
  )
}
