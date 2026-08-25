export const appTheme = {
  colors: {
    background: {
      default: '#ffffff',
      muted: '#ebf4fc',
      soft: '#f7f9fb',
      subtle: '#f7fafd',
    },
    border: {
      default: '#d5dee6',
      interactive: '#1a6ebf',
      soft: '#d8dddd',
      subtle: '#e3ebf2',
    },
    brand: {
      primary: '#1a6ebf',
      primaryHover: '#0d4a84',
      accent: '#0d4a84',
      strong: '#0d4a84',
      secondary: '#536579',
      success: '#087f5b',
      successStrong: '#1baa75',
    },
    shadow: {
      focus: 'rgb(85 135 246 / 48%)',
      soft: 'rgb(16 42 66 / 8%)',
      subtle: 'rgb(16 42 66 / 8%)',
    },
    status: {
      error: '#dc2626',
      success: '#087f5b',
    },
    text: {
      default: '#1a3d5c',
      inverse: '#ffffff',
      muted: '#536579',
      placeholder: '#91a2b5',
      strong: '#1a3d5c',
    },
  },
  radii: {
    button: '12px',
    input: '12px',
    md: '12px',
    xl: '28px',
    round: '999px',
  },
  shadows: {
    input: 'none',
    inputFocus: '0 0 0 3px rgb(85 135 246 / 48%)',
    subtle: '0 2px 12px rgb(16 42 66 / 8%)',
  },
  typography: {
    fontFamily:
      'Inter, Pretendard, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
} as const

export type AppTheme = typeof appTheme
