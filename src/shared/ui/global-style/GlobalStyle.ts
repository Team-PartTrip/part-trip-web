import { createGlobalStyle } from 'styled-components'

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
    min-width: 320px;
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
    outline: 3px solid ${({ theme }) => theme.colors.shadow.focus};
    outline-offset: 2px;
  }

  #root {
    min-height: 100vh;
  }

  .page {
    min-height: 100vh;
  }
`
