import styled from 'styled-components'

export const Root = styled.section`
  width: calc(100% - 15.0625rem);
  min-width: 0;
  height: 100%;
  overflow: hidden;
  background: #f4f8fc;

  @media (max-width: 74.9375rem) {
    flex: 1;
    width: auto;
  }

  @media (max-width: 47.9375rem) {
    width: 100%;
    height: calc(100vh - 3.5rem);
    flex: 0 0 calc(100vh - 3.5rem);
  }
`

export const TopBar = styled.header`
  display: flex;
  width: 100%;
  height: 4.375rem;
  align-items: center;
  gap: 3.875rem;
  border-bottom: 0.0625rem solid #d7dce5;
  padding-inline: 2rem 7.75rem;
  background: #f4f8fc;

  @media (max-width: 74.9375rem) {
    gap: 1.5rem;
    padding-inline: 1.5rem;
  }

  @media (max-width: 47.9375rem) {
    height: 4rem;
    gap: 0.75rem;
    padding-inline: 0.75rem;
  }
`

export const BackButton = styled.button`
  display: inline-flex;
  min-width: 8.0625rem;
  align-items: center;
  gap: 1rem;
  border: 0;
  padding: 0;
  background: transparent;
  color: #191c1e;
  cursor: pointer;
  font: inherit;

  > svg {
    width: 0.7359375rem;
    height: 1.25rem;
    flex: 0 0 auto;
  }

  span {
    font-size: 1.375rem;
    font-weight: 700;
    letter-spacing: -0.06875rem;
    white-space: nowrap;
  }

  @media (max-width: 47.9375rem) {
    min-width: auto;
    gap: 0.25rem;

    span {
      font-size: 0.9375rem;
    }
  }
`

export const SearchLabel = styled.label`
  display: flex;
  width: min(57.6875rem, 100%);
  height: 3rem;
  align-items: center;
  gap: 0.875rem;
  border-radius: 999rem;
  padding: 0 1rem;
  background: #ffffff;
  color: #657080;

  > svg {
    width: 1.125rem;
    height: 1.125rem;
    flex: 0 0 auto;
  }

  input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: #303640;
    font: inherit;
    font-size: 0.875rem;

    &::placeholder {
      color: #727780;
    }
  }

  @media (max-width: 47.9375rem) {
    height: 2.5rem;

    input {
      font-size: 0.75rem;
    }
  }
`

export const Body = styled.div`
  width: min(60rem, calc(100% - 4rem));
  margin: 1.25rem auto 0;

  @media (max-width: 47.9375rem) {
    width: calc(100% - 1.5rem);
    margin-top: 0.75rem;
  }
`

export const RecentSection = styled.section`
  height: 8.9375rem;

  @media (max-width: 47.9375rem) {
    height: 5.75rem;
  }
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    color: #191c1e;
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.75rem;
  }

  button {
    border: 0;
    padding: 0;
    background: transparent;
    color: #1478c8;
    cursor: pointer;
    font: inherit;
    font-size: 0.875rem;

    &:disabled {
      cursor: default;
      opacity: 0.45;
    }
  }

  @media (max-width: 47.9375rem) {
    h2 { font-size: 1rem; }
    button { font-size: 0.75rem; }
  }
`

export const EmptyRecent = styled.p`
  margin: 1.5rem 0 0;
  color: #727780;
  font-size: 0.8125rem;
`

export const RecentChip = styled.div`
  display: flex;
  width: 10.28125rem;
  height: 3.375rem;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  border: 0.0625rem solid #c5ccd8;
  border-radius: 0.625rem;
  padding: 0.5rem 1rem;
  background: #ffffff;
  box-shadow: 0 0.0625rem 0.125rem rgb(0 0 0 / 5%);

  > span:first-child {
    display: grid;
    width: 2rem;
    height: 1.5rem;
    place-items: center;
    border-radius: 0.25rem;
    background: #f5f6f7;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  > span:nth-child(2) {
    display: flex;
    flex: 1;
    flex-direction: column;
    color: #303640;

    strong { font-size: 0.75rem; font-weight: 500; }
    small { font-size: 0.625rem; }
  }

  button {
    display: grid;
    border: 0;
    padding: 0;
    place-items: center;
    background: transparent;
    color: #5f6875;
    cursor: pointer;
  }

  @media (max-width: 47.9375rem) {
    height: 2.75rem;
    margin-top: 0.75rem;
  }
`

export const PopularSection = styled.section`
  margin-top: 1.5625rem;

  > h2 {
    margin: 0 0 1.25rem;
    color: #191c1e;
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.75rem;
  }

  @media (max-width: 47.9375rem) {
    margin-top: 0.5rem;

    > h2 {
      margin-bottom: 0.75rem;
      font-size: 1rem;
    }
  }
`

export const DestinationGrid = styled.div`
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 63.9375rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

export const ResultState = styled.p`
  margin: 2rem 0;
  color: #727780;
  text-align: center;
`

export const DestinationCard = styled.button<{ $imageUrl: string }>`
  position: relative;
  height: 14.5rem;
  overflow: hidden;
  border: 0;
  border-radius: 2rem;
  padding: 0;
  background:
    linear-gradient(0deg, rgb(0 0 0 / 80%), transparent 50%),
    url('${({ $imageUrl }) => $imageUrl}') center / 104.35% 100% no-repeat;
  box-shadow: 0 0.0625rem 0.125rem rgb(0 0 0 / 5%);
  color: #ffffff;
  cursor: pointer;

  &:hover:not(:disabled) {
    transform: translateY(-0.1875rem);
    box-shadow: 0 0.75rem 1.5rem rgb(13 31 64 / 15%);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.7;
  }

  > span {
    position: absolute;
    bottom: 1.5rem;
    left: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    strong {
      font-size: 1.25rem;
      font-weight: 500;
      line-height: 1.75rem;
    }

    small {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
  }

  @media (max-width: 74.9375rem) {
    height: clamp(9rem, 22vh, 14.5rem);
  }

  @media (max-width: 47.9375rem) {
    height: clamp(7.5rem, 18vh, 9rem);
    border-radius: 1.25rem;

    > span {
      bottom: 0.75rem;
      left: 0.75rem;

      strong { font-size: 0.9375rem; line-height: 1.25rem; }
      small { font-size: 0.6875rem; line-height: 1rem; }
    }
  }
`
