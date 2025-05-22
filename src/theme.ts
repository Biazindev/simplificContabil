import { DefaultTheme } from 'styled-components'

export const lightTheme: DefaultTheme = {
  colors: {
    bg: '#F3F4F6',
    surface: 'rgba(255, 255, 255, 0.8)',
    primary: '#5A4AE3',
    primaryAccent: '#7C6EF6',
    secondary: '#10B981',
    text: '#1F2937',
    textLight: '#f1f2f6',
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
  spacing: (factor) => `${factor * 0.5}rem`
}

export const darkTheme: DefaultTheme = {
  colors: {
    bg: '#121212',
    surface: 'rgba(255, 255, 255, 0.8)',
    primary: '#5A4AE3',
    primaryAccent: '#A78BFA',
    secondary: '#10B981',
    text: '#E5E7EB',
    textLight: '#9CA3AF',
    error: '#F87171',
    glassShadow: 'rgba(255, 255, 255, 0.25)',
    neoShadowLight: 'rgba(255, 255, 255, 0.7)',
    neoShadowDark: 'rgba(0, 0, 0, 0.1)',
  },
  radii: lightTheme.radii,
  spacing: lightTheme.spacing
}
