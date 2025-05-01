import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import Rotas from './routes'
import { store } from './store/reducers'
import { GlobalCss } from './styles'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
      <GlobalCss />
        <Rotas />
      </BrowserRouter>
    </Provider>
  )
}

export default App
