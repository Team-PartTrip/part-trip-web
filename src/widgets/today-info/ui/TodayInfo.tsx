import * as S from './TodayInfo.styles'

export function PhraseOfDay() {
  return (
    <S.PhraseCard>
      <S.SoundIcon aria-hidden="true">⌕</S.SoundIcon>
      <S.PhraseText>
        <small>Day 1</small>
        <strong>Hello</strong>
        <span>안녕하세요</span>
      </S.PhraseText>
      <S.TranslateIcon aria-hidden="true">文<sup>A</sup></S.TranslateIcon>
    </S.PhraseCard>
  )
}

export function TodayStats() {
  return (
    <S.Stats>
      <S.ExchangeCard>
        <h2>♻ 오늘의 환율</h2>
        <p><span>🇸🇬 1 SGD</span><b>→</b><strong>1200 KRW</strong><span>🇰🇷</span></p>
      </S.ExchangeCard>

      <S.WeatherCard>
        <S.WeatherHeader>
          <h2>☼ 현지 날씨</h2>
          <small>Singapore</small>
        </S.WeatherHeader>
        <S.WeatherBody>
          <strong>29°C</strong>
          <span>Partly<br />Cloudy<small>Feels like 32°C</small></span>
        </S.WeatherBody>
        <time dateTime="2026-06-09">2026년 6월 9일</time>
      </S.WeatherCard>
    </S.Stats>
  )
}
