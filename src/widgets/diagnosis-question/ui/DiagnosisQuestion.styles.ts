import styled from 'styled-components'

export const Container = styled.section`
  display: flex;
  width: min(31.25rem, 100%);
  flex-direction: column;
  align-items: center;
`

export const ProgressHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.875rem;

  strong {
    color: ${({ theme }) => theme.colors.brand.strong};
  }
`

export const ProgressTrack = styled.div`
  width: 100%;
  height: 0.5rem;
  margin-bottom: 3rem;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.background.subtle};
`

export const ProgressBar = styled.span<{ $value: number }>`
  display: block;
  width: ${({ $value }) => `${$value}%`};
  height: 100%;
  border-radius: inherit;
  background: ${({ theme }) => theme.colors.brand.primary};
  transition: width 180ms ease;
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

export const Actions = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 0.7fr 1.3fr;
  gap: 0.75rem;
  margin-top: 3.5rem;
`

const ActionButton = styled.button`
  min-height: 3.125rem;
  padding: 0.625rem 2.125rem;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.button};
  cursor: pointer;
  font: inherit;
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: -0.0375rem;
  line-height: 1.5;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:focus-visible {
    outline: 0.1875rem solid ${({ theme }) => theme.colors.shadow.focus};
    outline-offset: 0.125rem;
  }
`

export const PreviousButton = styled(ActionButton)`
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.muted};
`

export const NextButton = styled(ActionButton)`
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.brand.primaryHover};
  }
`
