import { createGlobalStyle } from 'styled-components'
import "@b1nd/dodam-design-system/colors/colors.css";

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
  }

  #root {
    min-height: 100vh;
  }

  .page {
    min-height: 100vh;
  }
`
