import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import Rotas from './routes'
import { store } from './store/reducers'
import AuthInitializer from './store/reducers/authInitialize'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from './styles'
import { usePrefersDark } from './menu/usePrefersDark'
import { darkTheme, lightTheme } from './theme'
import { useState } from 'react'

function App() {
  const [isLightTheme, setIsLightTheme] = useState(false);

  const toggleTheme = () => {
    setIsLightTheme((prev) => !prev);
  };
  return (
    <ThemeProvider theme={usePrefersDark() ? darkTheme : lightTheme}>
    <Provider store={store}>
      <BrowserRouter>
        <GlobalStyle />
        <AuthInitializer />
        <Rotas toggleTheme={toggleTheme} isLightTheme={isLightTheme} />
      </BrowserRouter>
    </Provider>
    </ThemeProvider>
  )
}

export default App
