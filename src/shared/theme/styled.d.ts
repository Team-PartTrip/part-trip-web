import 'styled-components'

import type { AppTheme } from './theme'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: AppTheme['colors']
    radii: AppTheme['radii']
    shadows: AppTheme['shadows']
    typography: AppTheme['typography']
  }
}
