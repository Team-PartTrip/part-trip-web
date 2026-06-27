import styled from 'styled-components'

export const Container = styled.section`
  display: flex;
  width: min(31.25rem, 100%);
  flex-direction: column;
  align-items: center;
`

export const Title = styled.h1`
  margin: 0 0 3.875rem;
  color: #1a3d5c;
  font-size: 1.875rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.09375rem;
  text-align: center;

  @media (max-width: 40rem) {
    margin-bottom: 2.5rem;
    font-size: clamp(1.25rem, 5vw, 1.875rem);
    line-height: 1.25;
  }
`

export const Options = styled.div`
  display: flex;
  width: min(30.25rem, 100%);
  flex-direction: column;
  gap: 1.1875rem;
`

export const OptionButton = styled.button<{ $selected: boolean }>`
  width: 100%;
  min-height: 3.25rem;
  padding: 0.5625rem 1rem;
  border: 0.0625rem solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.brand.strong : theme.colors.border.soft};
  border-radius: 1rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.input};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.brand.strong : theme.colors.text.placeholder};
  cursor: pointer;
  font: inherit;
  font-size: 1.4375rem;
  font-weight: 600;
  letter-spacing: -0.071875rem;
  line-height: 1.35;
  text-align: center;

  &:focus-visible {
    outline: 0.1875rem solid ${({ theme }) => theme.colors.shadow.focus};
    outline-offset: 0.125rem;
  }

  @media (max-width: 40rem) {
    font-size: clamp(1rem, 4vw, 1.4375rem);
  }
`

export const NextButton = styled.button`
  width: 100%;
  min-height: 3.125rem;
  margin-top: 3.5rem;
  padding: 0.625rem 2.125rem;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.button};
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  cursor: pointer;
  font: inherit;
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: -0.0375rem;
  line-height: 1.5;

  &:hover {
    background: ${({ theme }) => theme.colors.brand.primaryHover};
  }

  &:focus-visible {
    outline: 0.1875rem solid ${({ theme }) => theme.colors.shadow.focus};
    outline-offset: 0.125rem;
  }
`
