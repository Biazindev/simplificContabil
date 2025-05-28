import { useState, useEffect } from "react";
import { MdPersonAddAlt } from "react-icons/md";
import { MdProductionQuantityLimits } from "react-icons/md";
import { useNavigate, Outlet } from "react-router-dom";
import {
  RxAvatar, RxDashboard, RxBox, RxPerson, RxExit
} from "react-icons/rx";
import {
  PiCodesandboxLogoLight, PiSuitcaseSimpleLight
} from "react-icons/pi";
import { IoReceiptOutline } from "react-icons/io5";
import { FaMotorcycle, FaFileInvoiceDollar } from "react-icons/fa6";
import { useTheme } from "styled-components";
import { FaSun, FaMoon, FaBars } from "react-icons/fa";
import {
  Layout, Sidebar, SidebarItem, HeaderContainer, Main, Avatar,
  UserProfile, UserName, HeaderRight, ToggleSidebarButton, SidebarOverlay
} from "./styles";
import {
  useBuscarUsuarioPorIdQuery,
  useLogoutMutation
} from "../../services/api";
import KeyboardShortcutHandler from "../shortcuts/KeyboardShortcutHandler";
import Footer from "../Footer";

interface HeaderProps {
  toggleTheme: () => void;
  isLightTheme: boolean;
}

const Header = ({ toggleTheme, isLightTheme }: HeaderProps) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [showUserInfo, setShowUserInfo] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [vendasAberto, setVendasAberto] = useState(false);
  const [relatorioAberto, setRelatorioAberto] = useState(false);


  const [logout] = useLogoutMutation();

  const userId = Number(localStorage.getItem("USER_ID"));

  const {
    data: usuario,
    isLoading,
    error,
  } = useBuscarUsuarioPorIdQuery(userId);

  useEffect(() => {
    if (!userId || isNaN(userId) || userId <= 0) {
      navigate("/login");
    }
  }, [userId, navigate]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      localStorage.removeItem("ACCESS_TOKEN");
      localStorage.removeItem("USER_ID");
      navigate("/login");
    }
  };

  const toggleUserInfo = () => {
    setShowUserInfo((prev) => !prev);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleMenu = (menu: string) => {
    setCadastroAberto(menu === "cadastro" ? !cadastroAberto : false);
    setVendasAberto(menu === "vendas" ? !vendasAberto : false);
    setRelatorioAberto(menu === "relatorio" ? !relatorioAberto : false);
  };


  return (
    <>
      <Layout>
      <KeyboardShortcutHandler closeSidebar={closeSidebar} />
      {/* Botão de hambúrguer visível apenas em telas pequenas */}
      <ToggleSidebarButton onClick={toggleSidebar}>
        <FaBars />
      </ToggleSidebarButton>

      {/* Overlay quando sidebar está aberto */}
      {isSidebarOpen && <SidebarOverlay onClick={closeSidebar} />}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen}>
        <h2 style={{ marginBottom: "2rem", color: theme.colors.text }}>ERP</h2>

        <SidebarItem href="/dashboard" onClick={closeSidebar}>
          <RxDashboard /> Dashboard
        </SidebarItem>

        {/* Cadastro com submenu */}
        <SidebarItem onClick={() => toggleMenu("cadastro")}>
          <RxPerson /> Cadastro
        </SidebarItem>

        {cadastroAberto && (
          <div style={{ marginLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <SidebarItem href="/cadastro-clientes" onClick={closeSidebar}>
              <MdPersonAddAlt /> Clientes
            </SidebarItem>
            <SidebarItem href="/produtos-cadastrar" onClick={closeSidebar}>
              <MdProductionQuantityLimits /> Produtos
            </SidebarItem>
          </div>
        )}

        <SidebarItem onClick={() => toggleMenu("vendas")}>
          <RxBox /> Vendas
        </SidebarItem>

        {vendasAberto && (
          <div style={{ marginLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <SidebarItem href="/pdv-mesa" onClick={closeSidebar}>
              <PiSuitcaseSimpleLight /> PDV
            </SidebarItem>
            <SidebarItem href="/vendas-loja" onClick={closeSidebar}>
              <PiSuitcaseSimpleLight /> Ordem de Serviço
            </SidebarItem>
            <SidebarItem href="/ordem-list" onClick={closeSidebar}>
              <PiSuitcaseSimpleLight /> Lista Ordem de Serviço
            </SidebarItem>
          </div>
        )}

        <SidebarItem href="/stock" onClick={closeSidebar}>
          <PiCodesandboxLogoLight /> Estoque
        </SidebarItem>

        <SidebarItem onClick={() => toggleMenu("relatorio")}>
          <IoReceiptOutline /> Relatório
        </SidebarItem>

        {relatorioAberto && (
          <div style={{ marginLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <SidebarItem href="/sale-list" onClick={closeSidebar}>
              <PiSuitcaseSimpleLight /> Relatório de Vendas
            </SidebarItem>
            <SidebarItem href="/get" onClick={closeSidebar}>
              <PiSuitcaseSimpleLight /> Relação de Clientes
            </SidebarItem>
          </div>
        )}

        <SidebarItem href="/delivery" onClick={closeSidebar}>
          <FaMotorcycle /> Entregas
        </SidebarItem>

        <SidebarItem href="/recibo" onClick={closeSidebar}>
          <IoReceiptOutline /> Recibo
        </SidebarItem>

        <SidebarItem href="/nota-fiscal" onClick={closeSidebar}>
          <FaFileInvoiceDollar /> Nota fiscal
        </SidebarItem>

        <SidebarItem href="/#" onClick={closeSidebar}>
          <FaFileInvoiceDollar /> Suporte
        </SidebarItem>

        <SidebarItem
          onClick={() => {
            closeSidebar();
            handleLogout();
          }}
          style={{ cursor: "pointer" }}
        >
          <RxExit /> Sair
        </SidebarItem>
      </Sidebar>

      {/* Cabeçalho */}
      <HeaderContainer>
        <HeaderRight onClick={toggleUserInfo} style={{ cursor: "pointer", position: "relative" }}>
          <UserProfile>
            <UserName>
              {isLoading
                ? "Carregando..."
                : error
                  ? "Erro ao carregar usuário"
                  : usuario?.nome ?? "Usuário"}
            </UserName>
            <Avatar>
              <RxAvatar size={24} />
            </Avatar>
          </UserProfile>

          {/* Alternar tema */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleTheme();
            }}
            style={{
              marginLeft: "1rem",
              background: "transparent",
              border: "none",
              color: theme.colors.text,
              cursor: "pointer",
            }}
            aria-label="Alternar tema"
          >
            {isLightTheme ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>

          {/* Informações do usuário */}
          {showUserInfo && usuario && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                background: theme.colors.surface,
                padding: "1rem",
                boxShadow: `0px 4px 10px ${theme.colors.glassShadow}`,
                borderRadius: "8px",
                zIndex: 10,
                minWidth: "250px",
                color: theme.colors.text,
              }}
            >
              <p><strong>ID:</strong> {usuario.id}</p>
              <p><strong>Username:</strong> {usuario.username}</p>
              <p><strong>Nome:</strong> {usuario.nome}</p>
              <p><strong>Email:</strong> {usuario.email}</p>
              <p><strong>Perfil:</strong> {usuario.perfil}</p>
              <SidebarItem onClick={handleLogout} style={{ cursor: "pointer" }}>
                <RxExit /> Sair
              </SidebarItem>
            </div>
          )}
        </HeaderRight>
      </HeaderContainer>
      <Main>
        <Outlet />
      </Main>
    </Layout>
    <Footer />
    </>
  );
};

export default Header;
