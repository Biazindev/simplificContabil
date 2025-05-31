import { Routes, Route } from "react-router-dom"
import Credentials from "./components/Credentials"
import Header from "./components/Header"
import Stock from "./components/Stock"
import Produtos from "./components/Produtos"
import Cliente from "./components/PDV"
import Dashboard from "./components/Dashboard"
import { ForgotPassword } from './components/Credentials/ForgotPassword'
import { ResetPassword } from './components/Credentials/ResetPassword'
import GetClientes from "./components/Get"
import { PrivateRoute } from '../src/PrivateRoute'
import Venda from "./components/Venda"
import User from "./components/User/User"
import SaleList from "./components/SaleList"
import Delivery from "./components/Delivery"
import NfContainer from "./components/NotaFiscal"
import VendaMesa from "./components/PDVmesa/index"
import VendaBalcao from "./components/PDVbalcao"
import ProdutosCadastrar from "./components/Produtos/ProdutosCadastrar"
import CadastroCliente from "./components/Cadastro/Clientes"
import OrdemServicoForm from "./components/OrderList"
import OrdemServicoList from "./components/OrderList/OrderServiceList"
import Suporte from "./components/Support"

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
        <Route path="/produtos-cadastrar" element={<ProdutosCadastrar />} />
        <Route path="/vendas-loja" element={<Cliente />} />
        <Route path="/cadastro-clientes" element={<CadastroCliente />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/get" element={<GetClientes />} />
        <Route path="/venda" element={<Venda vendaId={""} statusVenda={"pendente"} />} />
        <Route path="/user" element={<User />} />
        <Route path="/sale-list" element={<SaleList/>} />
        <Route path="/delivery" element={<Delivery/>} />
        <Route path="/nf" element={<NfContainer />} />
        <Route path="/pdv-mesa" element={<VendaMesa />} />
        <Route path="/pdv-balcao" element={<VendaBalcao />} />
        <Route path="/ordem-servico" element={<OrdemServicoForm />} />
        <Route path="/ordem-list" element={<OrdemServicoList/>} />
        <Route path="/support" element={<Suporte/>} />
      </Route>
    </Route>
  </Routes>
)


export default Rotas