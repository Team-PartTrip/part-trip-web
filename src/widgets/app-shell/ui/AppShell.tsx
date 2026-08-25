import { useState, type ReactNode } from 'react'
import { useNavigate } from '@/shared/libs/router'
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

  return (
    <S.Root>
      <Sidebar menus={MENUS} />
      <S.Content>
        <S.Topbar>
          <S.SearchForm
            role="search"
            onSubmit={(event) => {
              event.preventDefault()
              if (query.trim()) navigate(`${paths.tripCards}?q=${encodeURIComponent(query.trim())}`)
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
          <S.NotificationLink to={paths.notifications}>알림</S.NotificationLink>
          <S.ProfileLink to={paths.profile} aria-label="마이페이지">MS</S.ProfileLink>
        </S.Topbar>
        <S.Main>{children}</S.Main>
      </S.Content>
    </S.Root>
  )
}
