import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getAccessToken,
  getCountryInfo,
  getDday,
  getExchangeRate,
  getFestivals,
  getFoodInfo,
  getPopulationInfo,
  getTourPlace,
  getTodayPhrase,
  getWeather,
  type CountryInfoResponseDto,
  type DdayResponseDto,
  type ExchangeRateResponseDto,
  type FestivalResponseDto,
  type FoodInfoResponseDto,
  type PopulationInfoResponseDto,
  type TourPlaceResponseDto,
  type TodayPhraseResponseDto,
  type WeatherResponseDto,
} from '@shared/api'
import logoUrl from '@shared/assets/logo.png'
import mainHeroUrl from '@shared/assets/main-hero-redesign.jpg'
import { paths } from '@shared/config'
import { useLockBodyScroll } from '@shared/lib'
import { Festival } from '@widgets/festival'
import { MainHero } from '@widgets/main-hero'
import { MENUS, Sidebar } from '@widgets/sidebar'
import { PhraseOfDay, TodayStats } from '@widgets/today-info'
import { TravelInfo } from '@widgets/travel-info'

import * as S from './MainPage.styles'

type MainApiData = {
  country?: CountryInfoResponseDto
  exchangeRate?: ExchangeRateResponseDto
  festivals: FestivalResponseDto[]
  foodInfo: FoodInfoResponseDto[]
  plan?: DdayResponseDto
  phrase?: TodayPhraseResponseDto
  populationInfo: PopulationInfoResponseDto[]
  tourPlaces: TourPlaceResponseDto[]
  weather?: WeatherResponseDto
}

const initialData: MainApiData = {
  festivals: [],
  foodInfo: [],
  populationInfo: [],
  tourPlaces: [],
}

const DEFAULT_COUNTRY_NAME = '한국'

function parseDday(value?: string) {
  const matched = value?.match(/\d+/)
  return matched ? Number(matched[0]) : undefined
}

function Logo() {
  return (
    <S.Logo>
      <img src={logoUrl} alt="PartTrip" />
    </S.Logo>
  )
}

export function MainPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<MainApiData>(initialData)
  const [errorMessage, setErrorMessage] = useState('')

  const isLoggedIn = !!getAccessToken()

  useLockBodyScroll()

  useEffect(() => {
    // 비로그인 상태에서는 API 호출하지 않음
    if (!isLoggedIn) {
      return
    }

    let isMounted = true

    void (async () => {
      setErrorMessage('')

      try {
        let plan: DdayResponseDto | undefined

        // D-day는 실패해도 메인 정보는 불러오도록 처리
        try {
          plan = await getDday()
        } catch (error) {
          console.error('D-day 정보를 불러오지 못했습니다.', error)
          plan = undefined
        }

        const countryName = plan?.countryName || DEFAULT_COUNTRY_NAME

        const [country, populationInfo, tourPlaces, foodInfo, festivals, phrase, weather, exchangeRate] = await Promise.all([
          getCountryInfo(countryName),
          getPopulationInfo(countryName),
          getTourPlace(countryName),
          getFoodInfo(countryName),
          getFestivals(countryName),
          getTodayPhrase(countryName, 1).catch(() => undefined),
          getWeather(countryName).catch(() => undefined),
          getExchangeRate(countryName).catch(() => undefined),
        ])

        if (isMounted) {
          setData({
            country,
            exchangeRate,
            festivals,
            foodInfo,
            plan,
            phrase,
            populationInfo,
            tourPlaces,
            weather,
          })
        }
      } catch (error) {
        console.error('메인 여행 정보 조회 실패:', error)

        if (isMounted) {
          setErrorMessage('여행 정보를 불러오지 못했습니다.')
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [isLoggedIn])

  const pageData = isLoggedIn ? data : initialData

  const handleChangeDestination = () => {
    if (!isLoggedIn) {
      navigate(paths.login)
      return
    }

    navigate(paths.travelSelect)
  }

  const destination =
    pageData.plan?.cityName ||
    pageData.country?.cityName ||
    pageData.country?.countryName

  return (
    <S.Page>
      <Sidebar logo={<Logo />} menus={MENUS} />

      <S.Content>
        {isLoggedIn && errorMessage ? <S.ApiStatus role="alert">{errorMessage}</S.ApiStatus> : null}

        <MainHero
          imageSrc={pageData.country?.imageUrl || mainHeroUrl}
          aria-label={`${destination || '여행지'} 야경`}
          dDay={parseDday(pageData.plan?.dday)}
          destination={destination}
          isLoggedIn={isLoggedIn}
          onChangeDestination={handleChangeDestination}
        />

        <S.BottomArea>
          <TravelInfo
            countrySummary={pageData.country?.summary}
            foodInfo={pageData.foodInfo}
            populationInfo={pageData.populationInfo}
            tourPlaces={pageData.tourPlaces}
          />

          <S.RightArea>
            <PhraseOfDay phrase={pageData.phrase} />

            <S.LowerRow>
              <Festival festivals={pageData.festivals} />
              <TodayStats city={destination} exchangeRate={pageData.exchangeRate} weather={pageData.weather} />
            </S.LowerRow>
          </S.RightArea>
        </S.BottomArea>
      </S.Content>
    </S.Page>
  )
}

export default MainPage
