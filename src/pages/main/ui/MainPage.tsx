import { useEffect } from 'react'
import logoUrl from '@shared/assets/logo.svg'
import mainHeroUrl from '@shared/assets/main-hero-redesign.png'
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
        <MainHero imageSrc={mainHeroUrl} aria-label="싱가포르 야경" />

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
