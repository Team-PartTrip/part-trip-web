import {
  DashboardArrowIcon,
  DashboardExchangeIcon,
  DashboardSpeakerIcon,
  DashboardTranslateIcon,
  DashboardWeatherIcon,
} from '@shared/assets'
import { todayTravelInfo } from '@shared/api'

import * as S from './TodayInfo.styles'

export function PhraseOfDay() {
  return (
    <S.PhraseCard>
      <S.SoundIcon aria-hidden="true"><DashboardSpeakerIcon /></S.SoundIcon>
      <S.PhraseText>
        <small>Day {todayTravelInfo.phrase.day}</small>
        <strong>{todayTravelInfo.phrase.local}</strong>
        <span>{todayTravelInfo.phrase.translated}</span>
      </S.PhraseText>
      <S.TranslateIcon aria-hidden="true"><DashboardTranslateIcon /></S.TranslateIcon>
    </S.PhraseCard>
  )
}

export function TodayStats() {
  return (
    <S.Stats>
      <S.ExchangeCard>
        <h2><DashboardExchangeIcon aria-hidden="true" />오늘의 환율</h2>
        <p><span>🇸🇬 {todayTravelInfo.exchange.base}</span><DashboardArrowIcon aria-hidden="true" /><strong>{todayTravelInfo.exchange.converted}</strong><span>🇰🇷</span></p>
      </S.ExchangeCard>

      <S.WeatherCard>
        <S.WeatherHeader>
          <h2><DashboardWeatherIcon aria-hidden="true" />현지 날씨</h2>
          <small>{todayTravelInfo.weather.city}</small>
        </S.WeatherHeader>
        <S.WeatherBody>
          <strong>{todayTravelInfo.weather.temperature}°C</strong>
          <span>{todayTravelInfo.weather.condition}<small>Feels like {todayTravelInfo.weather.feelsLike}°C</small></span>
        </S.WeatherBody>
        <time dateTime="2026-06-09">2026년 6월 9일</time>
      </S.WeatherCard>
    </S.Stats>
  )
}
