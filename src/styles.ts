import { createGlobalStyle, DefaultTheme } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    transition: background 0.3s ease, color 0.3s ease;
    -webkit-font-smoothing: antialiased;
  }

  input, button {
    font-family: inherit;
  }

  :root {
  --bg-color: #ffffff;
  --text-color: #000000;
}

.dark {
  --bg-color: #1e1e2f;
  --text-color: #ffffff;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}

`
