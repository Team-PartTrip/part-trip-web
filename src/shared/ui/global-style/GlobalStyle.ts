import { createGlobalStyle } from 'styled-components'
import { highContrastTheme } from '@/shared/theme'

export const GlobalStyle = createGlobalStyle`
  :root {
    --pt-bg-default: ${({ theme }) => theme.colors.background.default};
    --pt-bg-error: ${({ theme }) => theme.colors.background.error};
    --pt-bg-info: ${({ theme }) => theme.colors.background.info};
    --pt-bg-muted: ${({ theme }) => theme.colors.background.muted};
    --pt-bg-soft: ${({ theme }) => theme.colors.background.soft};
    --pt-bg-subtle: ${({ theme }) => theme.colors.background.subtle};
    --pt-bg-warning: ${({ theme }) => theme.colors.background.warning};
    --pt-brand-primary: ${({ theme }) => theme.colors.brand.primary};
    --pt-brand-strong: ${({ theme }) => theme.colors.brand.strong};
    --pt-border-default: ${({ theme }) => theme.colors.border.default};
    --pt-border-soft: ${({ theme }) => theme.colors.border.soft};
    --pt-border-subtle: ${({ theme }) => theme.colors.border.subtle};
    --pt-status-error: ${({ theme }) => theme.colors.status.error};
    --pt-status-warning: ${({ theme }) => theme.colors.status.warning};
    --pt-text-inverse: ${({ theme }) => theme.colors.text.inverse};
    --pt-text-muted: ${({ theme }) => theme.colors.text.muted};
    --pt-text-placeholder: ${({ theme }) => theme.colors.text.placeholder};
    --pt-text-strong: ${({ theme }) => theme.colors.text.strong};
    color: ${({ theme }) => theme.colors.text.default};
    background: ${({ theme }) => theme.colors.background.default};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  body {
    min-width: min(20rem, 100%);
    min-height: 100vh;
    margin: 0;
    background: ${({ theme }) => theme.colors.background.subtle};
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible {
    outline: 0.1875rem solid ${({ theme }) => theme.colors.shadow.focus};
    outline-offset: 0.125rem;
  }

  #root {
    min-height: 100vh;
  }

  .page {
    min-height: 100vh;
  }

  [data-accessibility-root] {
    min-height: 100vh;
    background: #fff;
  }

  [data-accessibility-root][data-text-size='large'] { zoom: 1.125; }
  [data-accessibility-root][data-text-size='larger'] { zoom: 1.25; }

  @media (pointer: coarse) {
    [data-accessibility-root] :is(button, [role='button'], [role='tab'], input, select, textarea) {
      min-height: 3rem;
      min-width: 3rem;
    }
  }

  [data-accessibility-root][data-high-contrast='true'] {
    --pt-bg-default: ${highContrastTheme.colors.background.default};
    --pt-bg-error: ${highContrastTheme.colors.background.error};
    --pt-bg-info: ${highContrastTheme.colors.background.info};
    --pt-bg-muted: ${highContrastTheme.colors.background.muted};
    --pt-bg-soft: ${highContrastTheme.colors.background.soft};
    --pt-bg-subtle: ${highContrastTheme.colors.background.subtle};
    --pt-bg-warning: ${highContrastTheme.colors.background.warning};
    --pt-brand-primary: ${highContrastTheme.colors.brand.primary};
    --pt-brand-strong: ${highContrastTheme.colors.brand.strong};
    --pt-border-default: ${highContrastTheme.colors.border.default};
    --pt-border-soft: ${highContrastTheme.colors.border.soft};
    --pt-border-subtle: ${highContrastTheme.colors.border.subtle};
    --pt-status-error: ${highContrastTheme.colors.status.error};
    --pt-status-warning: ${highContrastTheme.colors.status.warning};
    --pt-text-inverse: ${highContrastTheme.colors.text.inverse};
    --pt-text-muted: ${highContrastTheme.colors.text.muted};
    --pt-text-placeholder: ${highContrastTheme.colors.text.placeholder};
    --pt-text-strong: ${highContrastTheme.colors.text.strong};
    color: ${highContrastTheme.colors.text.default};
    background: ${highContrastTheme.colors.background.default};
  }

  [data-accessibility-root][data-high-contrast='true'] :is(p, span, small, label, li, dt, dd, h1, h2, h3, h4, strong, b):not(button *):not(a *) {
    color: ${highContrastTheme.colors.text.default} !important;
  }

  [data-accessibility-root][data-high-contrast='true'] :is(button, input, select, textarea) {
    border-color: ${highContrastTheme.colors.border.default} !important;
  }

  [data-accessibility-root][data-high-contrast='true'] input::placeholder {
    color: ${highContrastTheme.colors.text.muted} !important;
    opacity: 1;
  }

  [data-accessibility-root][data-high-contrast='true'] a {
    text-decoration: underline;
  }

  [data-accessibility-root][data-high-contrast='true'] :is(button, a, input, select, textarea):focus-visible {
    outline-color: ${highContrastTheme.colors.text.strong} !important;
  }
`
