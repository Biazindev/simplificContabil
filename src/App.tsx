import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import Rotas from './routes'
import { store } from './store/reducers'
import { GlobalCss } from './styles'
import AuthInitializer from './store/reducers/authInitialize'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <GlobalCss />
        <AuthInitializer />
        <Rotas />
      </BrowserRouter>
    </Provider>
  )
}

export default App
