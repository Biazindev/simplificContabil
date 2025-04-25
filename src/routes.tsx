import { Routes, Route} from 'react-router-dom'
import Credentials from './components/Credentials'
import DashboardPizzaria from './pages/dashboardpizzaria/DashboardPizzaria'
import CriarPedido from './pages/dashboardpizzaria/pedido/novo/CriarPedido'
import CriarCliente from './pages/dashboardpizzaria/cliente/novo/CadastroCliente'
import Stock from './components/Stock'


const Rotas = () => (
  <Routes>
        <Route path="/" element={<Credentials />} />
        <Route path="/dashboard" element={<DashboardPizzaria />} />
        <Route path="/dashboard/pizzaria/pedidos/novo" element={<CriarPedido />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/cadastro-cliente" element={<CriarCliente />} />
      </Routes>
)


export default Rotas
