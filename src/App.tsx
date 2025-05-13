import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import Rotas from './routes'
import { store } from './store/reducers'
import AuthInitializer from './store/reducers/authInitialize'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from './styles'
import { usePrefersDark } from './hooks/usePrefersDark'
import { darkTheme, lightTheme } from './theme'
import { useState } from 'react'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };
  return (
    <ThemeProvider theme={usePrefersDark() ? darkTheme : lightTheme}>
    <Provider store={store}>
      <BrowserRouter>
        <GlobalStyle />
        <AuthInitializer />
        <Rotas toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      </BrowserRouter>
    </Provider>
    </ThemeProvider>
  )
}

export default App
