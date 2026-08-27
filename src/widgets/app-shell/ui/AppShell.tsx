import { useState, type ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
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
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const { data: notificationCount } = useUnreadNotificationCountQuery()
  const { data: profile } = useUserProfileQuery()

  return (
    <S.Root>
      <Sidebar accountName={profile?.name ? `${profile.name}님의 PartTrip` : undefined} menus={MENUS} />
      <S.Content>
        <S.Topbar>
          <S.SearchForm
            role="search"
            onSubmit={(event) => {
              event.preventDefault()
              if (query.trim()) navigate({ search: { q: query.trim() }, to: paths.tripCards })
            }}
          >
            <img src={S.searchIcon} alt="" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="여행지, 여행 기록 검색"
              aria-label="여행지, 여행 기록 검색"
            />
          </S.SearchForm>
          <S.TopbarSpacer />
          <S.NotificationLink to={paths.notifications}>알림{typeof notificationCount?.unreadCount === 'number' ? ` ${notificationCount.unreadCount}` : ''}</S.NotificationLink>
          <S.ProfileLink to={paths.profile} aria-label="마이페이지">MS</S.ProfileLink>
        </S.Topbar>
          <S.Main>{children}</S.Main>
      </S.Content>
    </S.Root>
  )
}
