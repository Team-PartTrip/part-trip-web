import styled from 'styled-components'

export const Hero = styled.section<{ $imageUrl: string }>`
  position: relative;
  width: 100%;
  height: 24.625rem;
  overflow: hidden;
  border-radius: 2rem;
  background:
    linear-gradient(180deg, rgb(0 0 0 / 4%) 45%, rgb(0 0 0 / 70%) 100%),
    url('${({ $imageUrl }) => $imageUrl}') center / cover no-repeat;

  @media (max-width: 74.9375rem) {
    height: clamp(12rem, 34vh, 18rem);
    flex: 0 0 clamp(12rem, 34vh, 18rem);
    border-radius: clamp(1.25rem, 2.5vw, 2rem);
  }

  @media (max-width: 47.9375rem) {
    height: clamp(8.25rem, 21vh, 10rem);
    flex-basis: clamp(8.25rem, 21vh, 10rem);
    border-radius: 1.25rem;
  }
`

export const DDay = styled.span`
  position: absolute;
  top: 1.3125rem;
  left: 2.75rem;
  display: inline-flex;
  min-width: 7.125rem;
  height: 2.3125rem;
  align-items: center;
  justify-content: center;
  border: 0.0625rem solid rgb(255 255 255 / 62%);
  border-radius: 999rem;
  background: rgb(26 61 92 / 45%);
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: -0.025rem;
  line-height: 1;

  @media (max-width: 47.9375rem) {
    top: 0.875rem;
    left: 1rem;
    min-width: 5rem;
    height: 1.75rem;
    font-size: 0.875rem;
  }
`

export const Destination = styled.h1`
  position: absolute;
  bottom: 2rem;
  left: 2.75rem;
  margin: 0;
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: -0.125rem;
  line-height: 1;

  @media (max-width: 47.9375rem) {
    bottom: 1rem;
    left: 1rem;
    font-size: 1.75rem;
  }
`

export const ChangeButton = styled.button`
  position: absolute;
  right: 2.75rem;
  bottom: 2rem;
  min-width: 6.6875rem;
  height: 2rem;
  border: 0;
  border-radius: 999rem;
  padding-inline: 0.625rem;
  background: #ffffff;
  color: #1a3d5c;
  cursor: pointer;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 700;

  @media (max-width: 47.9375rem) {
    right: 1rem;
    bottom: 1rem;
  }
`
