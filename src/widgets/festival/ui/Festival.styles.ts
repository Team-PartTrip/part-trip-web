import styled, { css } from 'styled-components'

export const Card = styled.article`
  width: 27.5rem;
  height: 20.375rem;
  border: 0.0625rem solid #e7edf7;
  border-radius: 1.5rem;
  padding: 1.375rem 0.375rem 0.5rem;
  background: #ffffff;
  box-shadow: 0 0.5rem 1.5rem rgb(13 31 64 / 8%);
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  padding-inline: 1.6875rem;

  span { color: #1478c8; font-size: 1.25rem; }
  h2 { margin: 0; color: #111111; font-size: 1.375rem; font-weight: 700; }
`

export const Calendar = styled.div`
  width: 26.75rem;
  height: 14.25rem;
  margin-top: 0.875rem;
  border-radius: 1.5rem;
  padding: 1rem;
  background: #ffffff;
  box-shadow: 0 0.5rem 1.5rem rgb(13 31 64 / 8%);
`

export const CalendarTop = styled.div`
  display: flex;
  height: 1.125rem;
  align-items: center;
  justify-content: space-between;
  padding-inline: 0.5rem;
  color: #20242a;
  font-size: 0.8125rem;

  button {
    border: 0;
    padding: 0 0.1875rem;
    background: transparent;
    color: #b9c0ca;
    cursor: pointer;
    font: inherit;
    font-size: 1.25rem;
  }
`

export const Grid = styled.div`
  display: grid;
  margin-top: 1rem;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 0.5rem;
`

export const Weekday = styled.div`
  display: grid;
  height: 0.75rem;
  place-items: center;
  color: #8d939d;
  font-size: 0.5rem;
`

export const Day = styled.div<{ $muted?: boolean; $event?: boolean; $selected?: boolean }>`
  position: relative;
  display: grid;
  height: 2.25rem;
  place-items: center;
  border-radius: 0.5rem;
  background: ${({ $selected }) => ($selected ? '#e6f0fb' : 'transparent')};
  color: ${({ $event, $muted }) => ($event ? '#e51f35' : $muted ? '#c9cbd0' : '#20242a')};
  font-size: 0.8125rem;

  ${({ $selected }) => $selected && css`
    &::after {
      position: absolute;
      bottom: 0.25rem;
      left: 50%;
      width: 0.1875rem;
      height: 0.1875rem;
      border-radius: 50%;
      background: #1478c8;
      content: '';
      transform: translateX(-50%);
    }
  `}
`
