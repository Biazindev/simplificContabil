import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RxAvatar, RxDashboard, RxBox, RxPerson, RxExit } from "react-icons/rx";
import { PiCodesandboxLogoLight } from "react-icons/pi";
import { MdOutlineTableBar } from "react-icons/md";
import { TfiAgenda } from "react-icons/tfi";
import { FaMotorcycle } from "react-icons/fa6";
import { IoReceiptOutline } from "react-icons/io5";
import { FaFileInvoiceDollar } from "react-icons/fa";

import {
  Layout,
  Sidebar,
  SidebarItem,
  HeaderContainer,
  Main,
  Avatar,
  UserProfile,
  UserName,
} from "./styles";

import { Outlet } from "react-router-dom";
import { useBuscarUsuarioQuery } from "../../services/api"; // ajuste o path se necessário

interface Usuario {
  nome: string;
  cpf: string;
}

const Header = () => {
  const navigate = useNavigate();

  // Exemplo: obtendo o CPF do localStorage para buscar usuário
  const cpf = localStorage.getItem("cpf") || "";

  const {
    data: usuario,
    isLoading,
    error,
  } = useBuscarUsuarioQuery({ cpf } as Usuario);

  return (
    <Layout>
      <Sidebar>
        <h2 style={{ marginBottom: "2rem" }}>ERP</h2>
        <SidebarItem href="/dashboard">
          <RxDashboard /> Dashboard
        </SidebarItem>
        <SidebarItem href="/clientes">
          <RxPerson /> Vendas
        </SidebarItem>
        <SidebarItem href="/produtos">
          <RxBox /> Produtos
        </SidebarItem>
        <SidebarItem href="/clientes">
          <RxPerson /> Clientes
        </SidebarItem>
        <SidebarItem href="/stock">
          <PiCodesandboxLogoLight /> Estoque
        </SidebarItem>
        <SidebarItem href="/dashboard/pizzaria">
          <MdOutlineTableBar /> Mesas
        </SidebarItem>
        <SidebarItem href="/dashboard/pizzaria/pedidos/novo">
          <TfiAgenda /> Pedidos
        </SidebarItem>
        <SidebarItem href="/#">
          <FaMotorcycle /> Entregas
        </SidebarItem>
        <SidebarItem href="/#">
          <IoReceiptOutline /> Recibo
        </SidebarItem>
        <SidebarItem href="/#">
          <FaFileInvoiceDollar /> Nota fiscal
        </SidebarItem>
        <SidebarItem onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <RxExit /> Sair
        </SidebarItem>
      </Sidebar>

      <HeaderContainer>
        <UserProfile>
          <UserName>
           {isLoading ? "Carregando..." : error ? "Usuário" : usuario}
          </UserName>
          <Avatar>
            <RxAvatar size={32} />
          </Avatar>
        </UserProfile>
      </HeaderContainer>

      <Main>
        <Outlet />
      </Main>
    </Layout>
  );
};

export default Header;
