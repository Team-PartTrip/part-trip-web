import {
  DashboardArrowIcon,
  DashboardExchangeIcon,
  DashboardSpeakerIcon,
  DashboardTranslateIcon,
  DashboardWeatherIcon,
} from '@shared/assets'
import type { ExchangeRateResponseDto, TodayPhraseResponseDto, WeatherResponseDto } from '@shared/api'

import * as S from './TodayInfo.styles'

export function PhraseOfDay({ phrase }: { phrase?: TodayPhraseResponseDto }) {
  const day = phrase?.dayNumber ?? 1
  const local = phrase?.phrase ?? '-'
  const translated = phrase?.meaning ?? '오늘의 회화를 불러오지 못했습니다.'

  return (
    <S.PhraseCard>
      <S.SoundIcon aria-hidden="true"><DashboardSpeakerIcon /></S.SoundIcon>
      <S.PhraseText>
        <small>Day {day}</small>
        <strong>{local}</strong>
        <span>{translated}</span>
      </S.PhraseText>
      <S.TranslateIcon aria-hidden="true"><DashboardTranslateIcon /></S.TranslateIcon>
    </S.PhraseCard>
  )
}

export function TodayStats({
  city,
  exchangeRate,
  weather,
}: {
  city?: string
  exchangeRate?: ExchangeRateResponseDto
  weather?: WeatherResponseDto
}) {
  const date = exchangeRate?.date ?? new Date().toISOString().slice(0, 10)

  return (
    <S.Stats>
      <S.ExchangeCard>
        <h2><DashboardExchangeIcon aria-hidden="true" />오늘의 환율</h2>
        <p><span>{exchangeRate?.currencyCode ? `1 ${exchangeRate.currencyCode}` : '-'}</span><DashboardArrowIcon aria-hidden="true" /><strong>{exchangeRate?.krwRate != null ? `${exchangeRate.krwRate.toLocaleString()} KRW` : '-'}</strong><span>🇰🇷</span></p>
      </S.ExchangeCard>

      <S.WeatherCard>
        <S.WeatherHeader>
          <h2><DashboardWeatherIcon aria-hidden="true" />현지 날씨</h2>
          <small>{city ?? '-'}</small>
        </S.WeatherHeader>
        <S.WeatherBody>
          <strong>{weather?.temperature != null ? `${weather.temperature}°C` : '-'}</strong>
          <span>{weather?.description ?? '-'}<small>체감 {weather?.feelsLike != null ? `${weather.feelsLike}°C` : '-'}</small></span>
        </S.WeatherBody>
        <time dateTime={date}>{date}</time>
      </S.WeatherCard>
    </S.Stats>
  )
}
