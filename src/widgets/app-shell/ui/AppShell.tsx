import { type ReactNode } from 'react'
import { useUnreadNotificationCountQuery } from '@/entities/notification'
import { partTripLogoUrl } from '@/shared/assets'
import { paths } from '@/shared/config'
import { MENUS } from '@/widgets/sidebar'
import { Sidebar } from '@/widgets/sidebar'

import * as S from './AppShell.styles'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { data: notificationCount } = useUnreadNotificationCountQuery()

  return (
    <S.Root>
      <Sidebar menus={MENUS} />
      <S.Content>
        <S.Topbar>
          <S.MobileLogoLink to={paths.main} aria-label="PartTrip 홈"><img width={362} height={86} src={partTripLogoUrl} alt="" /></S.MobileLogoLink>
          <S.TopbarSpacer />
          <S.NotificationLink to={paths.notifications}>알림{typeof notificationCount?.unreadCount === 'number' ? ` ${notificationCount.unreadCount}` : ''}</S.NotificationLink>
        </S.Topbar>
        <S.Main>{children}</S.Main>
      </S.Content>
    </S.Root>
  )
}
