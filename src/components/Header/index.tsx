import { useNavigate } from "react-router-dom";
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
import { useBuscarUsuarioPorIdQuery, useLogoutMutation } from "../../services/api";
import { useEffect } from "react";

const Header = () => {
    const navigate = useNavigate();
    const [logout] = useLogoutMutation();

    const userId = Number(localStorage.getItem('USER_ID'));

    const handleLogout = async () => {
        try {
            await logout().unwrap()
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        } finally {
            localStorage.removeItem('ACCESS_TOKEN');
            localStorage.removeItem('USER_ID');
            navigate('/login');
        }
    };

    useEffect(() => {
        if (!userId || isNaN(Number(userId)) || Number(userId) <= 0) {
            navigate("/login");
        }
    }, [userId, navigate]);

    const {
        data: usuario,
        isLoading,
        error,
    } = useBuscarUsuarioPorIdQuery(Number(userId));

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
                <SidebarItem href="/sale-list">
                    <IoReceiptOutline /> Relatório de vendas
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
                <SidebarItem onClick={handleLogout} style={{ cursor: "pointer" }}>
                    <RxExit /> Sair
                </SidebarItem>
            </Sidebar>

            <HeaderContainer>
                <UserProfile>
                    <UserName>
                        {isLoading
                            ? "Carregando..."
                            : error
                                ? "Erro ao carregar usuário"
                                : usuario?.nome ?? "Usuário"}
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
