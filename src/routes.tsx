import { Routes, Route } from "react-router-dom"
import Credentials from "./components/Credentials"
import Header from "./components/Header"
import CriarPedido from "./pages/dashboardpizzaria/pedido/novo/CriarPedido"
import Stock from "./components/Stock"
import Produtos from "./components/Produtos"
import Vendas from "./components/Vendas/Venda"
import Cliente from "./components/PDV/Cliente"
import Dashboard from "./components/Dashboard"
import DashboardPizzaria from "./pages/dashboardpizzaria/DashboardPizzaria"
import { ForgotPassword } from './components/Credentials/ForgotPassword'
import { ResetPassword } from './components/Credentials/ResetPassword'
import GetClientes from "./components/Get/GetClientes"
import { PrivateRoute } from '../src/PrivateRoute'
import Venda from "./components/Venda"
import User from "./components/User/User"
import SaleList from "./components/SaleList"

const Rotas = () => (
  <Routes>
    <Route path="/" element={<Credentials />} />
    <Route path="/recuperar-senha" element={<ForgotPassword />} />
    <Route path="/resetar-senha" element={<ResetPassword />} />
    <Route path="/login" element={<Credentials />} />

    <Route element={<PrivateRoute />}>
      <Route element={<Header />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/pizzaria/pedidos/novo" element={<CriarPedido />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/clientes" element={<Cliente />} />
        <Route path="/pdv" element={<Vendas />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/dashboard/pizzaria" element={<DashboardPizzaria />} />
        <Route path="/get" element={<GetClientes />} />
        <Route path="/venda" element={<Venda />} />
        <Route path="/user" element={<User />} />
        <Route path="/sale-list" element={<SaleList/>} />
      </Route>
    </Route>
  </Routes>
)


export default Rotas