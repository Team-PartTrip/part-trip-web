import { type ReactNode } from 'react'
import { useUnreadNotificationCountQuery } from '@/entities/notification'
import { useUserProfileQuery } from '@/entities/user'
import { paths } from '@/shared/config'
import { MENUS } from '@/widgets/sidebar'
import { Sidebar } from '@/widgets/sidebar'

import * as S from './AppShell.styles'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { data: notificationCount } = useUnreadNotificationCountQuery()
  const { data: profile, isLoading: isProfileLoading } = useUserProfileQuery()

  return (
    <S.Root>
      <Sidebar accountName={profile?.name ? `${profile.name}님의 PartTrip` : undefined} isLoading={isProfileLoading} menus={MENUS} />
      <S.Content>
        <S.Topbar>
          <S.TopbarSpacer />
          <S.NotificationLink to={paths.notifications}>알림{typeof notificationCount?.unreadCount === 'number' ? ` ${notificationCount.unreadCount}` : ''}</S.NotificationLink>
          <S.ProfileLink to={paths.profile} aria-label="마이페이지">{isProfileLoading ? <S.ProfileSkeleton /> : profile?.name?.slice(0, 1) || '찬'}</S.ProfileLink>
        </S.Topbar>
        <S.Main>{children}</S.Main>
      </S.Content>
    </S.Root>
  )
}
