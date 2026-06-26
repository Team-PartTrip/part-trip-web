export const appTheme = {
  colors: {
    background: {
      default: '#ffffff',
      muted: '#f8fbff',
      soft: '#f5f5f5',
      subtle: '#f0f0f0',
    },
    border: {
      default: '#e6e6e6',
      interactive: '#5587f6',
      soft: '#D8DDDD',
      subtle: '#eeeeee',
    },
    brand: {
      primary: '#5587f6',
      primaryHover: '#4b79df',
      accent: '#0c96f5',
      strong: '#1a6ebf',
      secondary: '727780',
      success: '#17b978',
      successStrong: '#16d382',
    },
    shadow: {
      focus: 'rgb(85 135 246 / 18%)',
      soft: 'rgb(0 0 0 / 5%)',
      subtle: 'rgb(0 0 0 / 6%)',
    },
    status: {
      error: '#dc2626',
      success: '#5587f6',
    },
    text: {
      default: '#1b1b1b',
      inverse: '#fafafa',
      muted: '#777777',
      placeholder: '#adadad',
      strong: '#222222',
    },
  },
  radii: {
    button: '10px',
    input: '14px',
    md: '8px',
    round: '999px',
  },
  shadows: {
    input: '0 1px 5px 1px rgb(0 0 0 / 5%)',
    inputFocus:
      '0 1px 5px 1px rgb(0 0 0 / 5%), 0 0 0 3px rgb(85 135 246 / 18%)',
    subtle: '0 1px 5px 1px rgb(0 0 0 / 6%)',
  },
  typography: {
    fontFamily:
      'Pretendard, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
} as const

export type AppTheme = typeof appTheme
