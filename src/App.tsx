import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import Rotas from './routes'
import { store } from './store/reducers'
import AuthInitializer from './store/reducers/authInitialize'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle, theme } from './styles'

function App() {
  return (
    <ThemeProvider theme={theme}>
    <Provider store={store}>
      <BrowserRouter>
        <GlobalStyle />
        <AuthInitializer />
        <Rotas />
      </BrowserRouter>
    </Provider>
    </ThemeProvider>
  )
}

export default App
