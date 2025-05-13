import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RxAvatar, RxDashboard, RxBox, RxPerson, RxExit } from "react-icons/rx";
import { PiCodesandboxLogoLight } from "react-icons/pi";
import { IoReceiptOutline } from "react-icons/io5";
import { FaMotorcycle } from "react-icons/fa6";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import {
  Layout,
  Sidebar,
  SidebarItem,
  HeaderContainer,
  Main,
  Avatar,
  UserProfile,
  UserName,
  HeaderRight,
} from "./styles";
import { useBuscarUsuarioPorIdQuery, useLogoutMutation } from "../../services/api";
import { useTheme } from "styled-components";
import { FaSun, FaMoon } from "react-icons/fa";

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Header = ({ toggleTheme, isDarkMode }: HeaderProps) => {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const [showUserInfo, setShowUserInfo] = useState(false);

  const userId = Number(localStorage.getItem("USER_ID"));

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

  useEffect(() => {
    if (!userId || isNaN(userId) || userId <= 0) {
      navigate("/login");
    }
  }, [userId, navigate]);

  const {
    data: usuario,
    isLoading,
    error,
  } = useBuscarUsuarioPorIdQuery(userId);

  const toggleUserInfo = () => {
    setShowUserInfo((prev) => !prev);
  };

  const theme = useTheme();

  return (
    <Layout>
      <Sidebar>
        <h2 style={{ marginBottom: "2rem", color: theme.colors.text }}>ERP</h2>
        <SidebarItem href="/dashboard"><RxDashboard /> Dashboard</SidebarItem>
        <SidebarItem href="/clientes"><RxPerson /> Vendas</SidebarItem>
        <SidebarItem href="/produtos"><RxBox /> Produtos</SidebarItem>
        <SidebarItem href="/clientes"><RxPerson /> Clientes</SidebarItem>
        <SidebarItem href="/stock"><PiCodesandboxLogoLight /> Estoque</SidebarItem>
        <SidebarItem href="/sale-list"><IoReceiptOutline /> Relatório de vendas</SidebarItem>
        <SidebarItem href="/delivery"><FaMotorcycle /> Entregas</SidebarItem>
        <SidebarItem href="/#"><IoReceiptOutline /> Recibo</SidebarItem>
        <SidebarItem href="/#"><FaFileInvoiceDollar /> Nota fiscal</SidebarItem>
        <SidebarItem onClick={handleLogout} style={{ cursor: "pointer" }}>
          <RxExit /> Sair
        </SidebarItem>
      </Sidebar>

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

          <button
            onClick={(e) => {
              e.stopPropagation(); // evitar fechar modal do usuário
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
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>

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
  );
};

export default Header;
