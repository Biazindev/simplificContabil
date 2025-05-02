import { PiCodesandboxLogoLight } from "react-icons/pi"
import { MdOutlineTableBar } from "react-icons/md"
import { TfiAgenda } from "react-icons/tfi"
import { FaMotorcycle } from "react-icons/fa6"
import { IoReceiptOutline } from "react-icons/io5"
import { FaFileInvoiceDollar } from "react-icons/fa"

import {
    Layout,
    Sidebar,
    SidebarItem,
    HeaderContainer,
    Main,
    Avatar,
    UserProfile,
    UserName
} from "./styles";

import { Outlet, useNavigate } from "react-router-dom";
import { RxAvatar, RxDashboard, RxBox, RxPerson, RxExit } from "react-icons/rx";

const Header = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <Sidebar>
                <h2 style={{ marginBottom: "2rem" }}>ERP</h2>
                <SidebarItem href="/dashboard">
                    <RxDashboard /> Dashboard
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
                    <UserName>User</UserName>
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
