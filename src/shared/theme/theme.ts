export const appTheme = {
  colors: {
    background: {
      default: '#ffffff',
      error: '#fff1f2',
      info: '#e8f2ff',
      muted: '#ebf4fc',
      soft: '#f7f9fb',
      subtle: '#f8fbfd',
      warning: '#fff3e8',
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
      accent: '#ff7a35',
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
      warning: '#b65300',
    },
    text: {
      default: '#1a3d5c',
      inverse: '#ffffff',
      muted: '#63788c',
      placeholder: '#63788c',
      strong: '#17334d',
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

type ColorTokens = {
  [Group in keyof typeof appTheme.colors]: {
    [Token in keyof (typeof appTheme.colors)[Group]]: string
  }
}

export type AppTheme = Omit<typeof appTheme, 'colors'> & { colors: ColorTokens }

export const highContrastTheme: AppTheme = {
  ...appTheme,
  colors: {
    ...appTheme.colors,
    background: {
      default: '#ffffff',
      error: '#ffffff',
      info: '#ffffff',
      muted: '#f2f2f2',
      soft: '#ffffff',
      subtle: '#ffffff',
      warning: '#ffffff',
    },
    border: {
      default: '#555555',
      interactive: '#003d80',
      soft: '#555555',
      subtle: '#555555',
    },
    brand: {
      primary: '#0056b3',
      primaryHover: '#003d80',
      accent: '#8a2f00',
      strong: '#003366',
      secondary: '#333333',
      success: '#005c43',
      successStrong: '#006b4f',
    },
    status: {
      error: '#a40000',
      success: '#005c43',
      warning: '#744200',
    },
    text: {
      default: '#111111',
      inverse: '#ffffff',
      muted: '#333333',
      placeholder: '#333333',
      strong: '#000000',
    },
  },
}
