import styled from "styled-components";

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 60px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  height: 100vh;
`;

export const Sidebar = styled.nav`
  grid-area: sidebar;
  background-color: #1e1e2f;
  color: white;
  padding: 1rem;
`;

export const SidebarItem = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  color: #ccc;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: background 0.2s;

  &:hover {
    background: #2c2c44;
    color: #fff;
  }
`;

export const HeaderContainer = styled.header`
  grid-area: header;
  background-color: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Main = styled.main`
  grid-area: main;
  padding: 2rem;
  background: #f7f7f7;
  overflow-y: auto;
`;

export const Title = styled.h1`
  font-size: 1.25rem;
  color: #333;
`;

export const Avatar = styled.div`
  background-color: #e4e4e4;
  border-radius: 50%;
  padding: 0.5rem;
`;
