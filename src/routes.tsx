import { Routes, Route } from "react-router-dom"
import Credentials from "./components/Credentials"
import Header from "./components/Header"
import Stock from "./components/Stock"
import Produtos from "./components/Produtos"
import Cliente from "./components/PDV/Cliente"
import Dashboard from "./components/Dashboard"
import { ForgotPassword } from './components/Credentials/ForgotPassword'
import { ResetPassword } from './components/Credentials/ResetPassword'
import GetClientes from "./components/Get/GetClientes"
import { PrivateRoute } from '../src/PrivateRoute'
import Venda from "./components/Venda"
import User from "./components/User/User"
import SaleList from "./components/SaleList"
import Delivery from "./components/Delivery"
import CriarPedido from "./pages/dashboardpizzaria/pedido/novo/CriarPedido"
import DashboardPizzaria from "./pages/dashboardpizzaria/DashboardPizzaria"
import PedidosEntrega from "./pages/dashboardpizzaria/PedidosEntrega"
import NfContainer from "./components/NotaFiscal"
import ServiceOrder from "./components/ServiceOrder"
import VendaMesa from "./components/PDVmesa/index"
import VendaEntrega from "./components/PDVentrega"
import VendaBalcao from "./components/PDVbalcao"

interface AppRoutesProps {
  toggleTheme: () => void;
  isLightTheme: boolean;
}

const Rotas = ({ toggleTheme, isLightTheme }: AppRoutesProps) => (
  <Routes>
    <Route path="/" element={<Credentials />} />
    <Route path="/recuperar-senha" element={<ForgotPassword />} />
    <Route path="/resetar-senha" element={<ResetPassword />} />
    <Route path="/login" element={<Credentials />} />

    <Route element={<PrivateRoute />}>
      <Route element={<Header toggleTheme={toggleTheme} isLightTheme={isLightTheme} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/clientes" element={<Cliente />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/get" element={<GetClientes />} />
        <Route path="/venda" element={<Venda vendaId={""} statusVenda={"pendente"} />} />
        <Route path="/user" element={<User />} />
        <Route path="/sale-list" element={<SaleList/>} />
        <Route path="/delivery" element={<Delivery/>} />
        <Route path="/criar-pedido" element={<CriarPedido />} />
        <Route path="/pizzariadash" element={<DashboardPizzaria />} />
        <Route path="/pedidos-entrega" element={<PedidosEntrega />} />
        <Route path="/nf" element={<NfContainer />} />
        <Route path="/service-order" element={<ServiceOrder />} />
        <Route path="/pdv-mesa" element={<VendaMesa />} />
        <Route path="/pdv-entrega" element={<VendaEntrega />} />
        <Route path="/pdv-entrega" element={<VendaBalcao />} />
      </Route>
    </Route>
  </Routes>
)


export default Rotas