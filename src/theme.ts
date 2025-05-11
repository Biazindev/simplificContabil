import { DefaultTheme } from 'styled-components'

export const theme: DefaultTheme = {
  colors: {
    bg: '#F3F4F6',
    surface: 'rgba(255, 255, 255, 0.8)',
    primary: '#5A4AE3',
    primaryAccent: '#7C6EF6',
    secondary: '#10B981',
    text: '#1F2937',
    textLight: '#6B7280',
    error: '#EF4444',
    glassShadow: 'rgba(255, 255, 255, 0.25)',
    neoShadowLight: 'rgba(255, 255, 255, 0.7)',
    neoShadowDark: 'rgba(0, 0, 0, 0.1)',
  },
  radii: {
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
  spacing: (factor: number) => `${factor * 0.5}rem`,
}
