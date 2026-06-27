import { css } from 'styled-components'

export const dashboardCard = css`
  overflow: hidden;
  border: 0.0625rem solid #e7edf7;
  border-radius: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: 0 0.5rem 1rem rgb(13 31 64 / 8%);
`

export const dashboardCardTitle = css`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 1.375rem;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1.2;
`

export const dashboardBodyText = css`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.45;
`

export const dashboardMutedText = css`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1.3;
`

export const dashboardActionText = css`
  border: 0;
  padding: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.strong};
  cursor: pointer;
  font: inherit;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1.2;

  &:focus-visible {
    outline: 0.1875rem solid ${({ theme }) => theme.colors.shadow.focus};
    outline-offset: 0.25rem;
  }
`
