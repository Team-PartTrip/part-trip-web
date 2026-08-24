import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  :root {
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
