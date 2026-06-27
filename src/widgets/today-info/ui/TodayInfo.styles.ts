import styled from 'styled-components'

const card = `
  border: 0.0625rem solid #e7edf7;
  border-radius: 0.875rem;
  background: #ffffff;
  box-shadow: 0 0.5rem 1.5rem rgb(13 31 64 / 8%);
`

export const PhraseCard = styled.article`
  ${card}
  display: grid;
  width: 100%;
  height: 5.875rem;
  align-items: center;
  grid-template-columns: 2.5rem 1fr auto;
  gap: 1.25rem;
  border-color: #4d91f3;
  padding: 1.1875rem;

  @media (max-width: 74.9375rem) {
    height: clamp(4.5rem, 10vh, 5.875rem);
    gap: 0.875rem;
    padding: 0.875rem;
  }

  @media (max-width: 47.9375rem) {
    grid-template-columns: 2.25rem 1fr auto;
    height: 4.5rem;
    padding: 0.75rem;
  }
`

export const SoundIcon = styled.span`
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  place-items: center;
  border-radius: 50%;
  background: #dceafb;
  color: #1478c8;
  font-weight: 700;
`

export const PhraseText = styled.div`
  display: grid;
  align-content: center;
  line-height: 1;

  small {
    width: fit-content;
    border-radius: 0.125rem;
    padding: 0.125rem 0.25rem;
    background: #b9d8fa;
    color: #174b7f;
    font-size: 0.6875rem;
  }

  strong {
    margin-top: 0.125rem;
    color: #1f252b;
    font-size: 1.125rem;
  }

  span {
    color: #727780;
    font-size: 0.875rem;
  }
`

export const TranslateIcon = styled.span`
  color: #b8bdc5;
  font-size: 1.25rem;
`

export const Stats = styled.aside`
  display: flex;
  width: 17.1875rem;
  flex-direction: column;
  gap: 0.875rem;

  @media (max-width: 74.9375rem) {
    width: 100%;
    min-width: 0;
    min-height: 0;
  }
`

export const ExchangeCard = styled.article`
  ${card}
  height: 7.5625rem;
  padding: 1.5625rem;

  @media (max-width: 74.9375rem) {
    height: auto;
    flex: 0 0 38%;
    padding: clamp(0.75rem, 1.5vw, 1rem);
  }

  h2 {
    margin: 0;
    color: #555b64;
    font-size: 0.9375rem;
    font-weight: 600;
  }

  p {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 1.25rem 0 0;
    color: #20242a;
    font-size: 0.875rem;
    white-space: nowrap;

    b { color: #727780; font-size: 1.125rem; }
    strong { color: #0969c5; font-size: 0.9375rem; }
  }

  @media (max-width: 74.9375rem) {
    p {
      gap: clamp(0.25rem, 0.7vw, 0.5rem);
      margin-top: 1rem;
      font-size: clamp(0.6875rem, 1.2vw, 0.8125rem);

      b { font-size: 1rem; }
      strong { font-size: clamp(0.75rem, 1.3vw, 0.875rem); }
    }
  }
`

export const WeatherCard = styled.article`
  ${card}
  height: 11.9375rem;
  padding: 1.4375rem 1.5625rem;

  @media (max-width: 74.9375rem) {
    height: auto;
    min-height: 0;
    flex: 1;
    padding: clamp(0.875rem, 1.8vw, 1.25rem);
  }

  > time {
    display: block;
    margin-top: 1.625rem;
    color: #555b64;
    font-size: 0.9375rem;
  }
`

export const WeatherHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    color: #555b64;
    font-size: 0.9375rem;
    font-weight: 600;
  }

  small { color: #8d939d; font-size: 0.5625rem; }
`

export const WeatherBody = styled.div`
  display: flex;
  align-items: center;
  gap: 1.75rem;
  margin-top: 1.4375rem;

  > strong {
    color: #181b20;
    font-size: 2.625rem;
    line-height: 1;
  }

  > span {
    color: #505762;
    font-size: 0.9375rem;
    line-height: 1.3;

    small {
      display: block;
      color: #8d939d;
      font-size: 0.5625rem;
    }
  }

  @media (max-width: 74.9375rem) {
    gap: clamp(0.5rem, 1vw, 1rem);

    > strong {
      font-size: clamp(2rem, 3.5vw, 2.5rem);
    }

    > span {
      min-width: 0;
      font-size: clamp(0.75rem, 1.3vw, 0.875rem);
    }
  }
`
