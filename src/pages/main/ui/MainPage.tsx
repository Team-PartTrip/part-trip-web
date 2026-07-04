import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSelectedDestinationMock, type Destination } from '@shared/api'
import logoUrl from '@shared/assets/logo.svg'
import mainHeroUrl from '@shared/assets/main-hero-redesign.png'
import { paths } from '@shared/config'
import { Festival } from '@widgets/festival'
import { MainHero } from '@widgets/main-hero'
import { MENUS, Sidebar } from '@widgets/sidebar'
import { PhraseOfDay, TodayStats } from '@widgets/today-info'
import { TravelInfo } from '@widgets/travel-info'

import * as S from './MainPage.styles'

function Logo() {
  return (
    <S.Logo>
      <img src={logoUrl} alt="PartTrip" />
    </S.Logo>
  )
}

export function MainPage() {
  const navigate = useNavigate()
  const [destination, setDestination] = useState<Destination | null>(null)

  useEffect(() => {
    let isMounted = true
    void getSelectedDestinationMock().then((selected) => {
      if (isMounted) setDestination(selected)
    })
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow
    const previousRootOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousRootOverflow
    }
  }, [])

  return (
    <S.Page>
      <Sidebar logo={<Logo />} menus={MENUS} />

      <S.Content>
        <MainHero
          imageSrc={mainHeroUrl}
          aria-label={`${destination?.name ?? '여행지'} 야경`}
          destination={destination?.name ?? '여행지를 불러오는 중'}
          onChangeDestination={() => navigate(paths.travelSelect)}
        />

        <S.BottomArea>
          <TravelInfo />
          <S.RightArea>
            <PhraseOfDay />
            <S.LowerRow>
              <Festival />
              <TodayStats />
            </S.LowerRow>
          </S.RightArea>
        </S.BottomArea>
      </S.Content>
    </S.Page>
  )
}

export default MainPage
