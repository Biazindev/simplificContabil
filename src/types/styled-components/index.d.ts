import 'styled-components'

export interface Theme {
  colors: {
    bg: string;
    surface: string;
    primary: string;
    primaryAccent: string;
    secondary: string;
    text: string;
    textLight: string;
    error: string;
    glassShadow: string;
    neoShadowLight: string;
    neoShadowDark: string;
  };
  radii: {
    sm: string;
    md: string;
    lg: string;
  };
  spacing: (factor: number) => string;
}

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
