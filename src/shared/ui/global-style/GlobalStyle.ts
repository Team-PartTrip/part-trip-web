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

  [data-accessibility-root] {
    min-height: 100vh;
    background: #fff;
  }

  [data-accessibility-root][data-text-size='large'] { zoom: 1.125; }
  [data-accessibility-root][data-text-size='larger'] { zoom: 1.25; }

  @media (pointer: coarse) {
    [data-accessibility-root] :is(button, [role='button'], [role='tab'], input, select, textarea) {
      min-height: 48px;
      min-width: 48px;
    }
  }

  [data-accessibility-root][data-high-contrast='true'] {
    --pt-bg-default: #ffffff;
    --pt-bg-error: #ffffff;
    --pt-bg-info: #ffffff;
    --pt-bg-muted: #f2f2f2;
    --pt-bg-soft: #ffffff;
    --pt-bg-subtle: #ffffff;
    --pt-bg-warning: #ffffff;
    --pt-brand-primary: #0056b3;
    --pt-brand-strong: #003366;
    --pt-border-default: #555555;
    --pt-border-soft: #555555;
    --pt-border-subtle: #555555;
    --pt-status-error: #a40000;
    --pt-status-warning: #744200;
    --pt-text-inverse: #ffffff;
    --pt-text-muted: #333333;
    --pt-text-placeholder: #333333;
    --pt-text-strong: #000000;
    color: #000;
    background: #fff;
  }

  [data-accessibility-root][data-high-contrast='true'] :is(p, span, small, label, li, dt, dd, h1, h2, h3, h4, strong, b):not(button *):not(a *) {
    color: #111 !important;
  }

  [data-accessibility-root][data-high-contrast='true'] :is(button, input, select, textarea) {
    border-color: #555 !important;
  }

  [data-accessibility-root][data-high-contrast='true'] input::placeholder {
    color: #333 !important;
    opacity: 1;
  }

  [data-accessibility-root][data-high-contrast='true'] a {
    text-decoration: underline;
  }

  [data-accessibility-root][data-high-contrast='true'] :is(button, a, input, select, textarea):focus-visible {
    outline-color: #000 !important;
  }
`
