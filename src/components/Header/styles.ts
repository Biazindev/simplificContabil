import styled from "styled-components";


interface SidebarProps {
  isOpen: boolean;
}

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 8px 1fr;
  grid-template-rows: 60px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  height: 100vh;
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-columns: 60px 1fr;
  }
`;
export const ToggleSidebarButton = styled.button`
  background: none;
  border: none;
  color: #000;
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 110;

  @media (min-width: 769px) {
    display: none;
  }
`;


export const SidebarOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 99;

  @media (min-width: 781px) {
    display: none;
  }
`;

export const Sidebar = styled.nav<SidebarProps>`
  grid-area: sidebar;
  background-color: #b2bec3;
  color: #000;
  padding: 1rem 0.5rem;
  transition: width 0.3s ease-in-out;
  width: ${({ isOpen }) => (isOpen ? "240px" : "48px")};
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  z-index: 100;

  h2 {
    font-size: 1.2rem;
    text-align: center;
    margin-bottom: 2rem;
    transition: opacity 0.3s ease;
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  }

  @media (max-width: 768px) {
    width: ${({ isOpen }) => (isOpen ? "240px" : "65px")};
  }

  &:hover {
    width: 220px;
  }
`;


export const SidebarItem = styled.a`
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0.75rem;
  color: #000;
  text-decoration: none;
  border-radius: 8px;
  margin: 0.25rem 0;
  transition: background 0.2s, color 0.2s;
  font-size: 0.9rem;

  svg {
    flex-shrink: 0;
    font-size: 1.25rem;
  }

  span {
    transition: opacity 0.2s;
    opacity: 0;
  }

  &:hover {
    background: #2c2c44;
    color: #fff;
  }

  ${Sidebar}:hover & span {
    opacity: 1;
  }

`;

export const HeaderContainer = styled.header`
  grid-area: header;
  width: 100%;
  background-color: #b2bec3;
  color: #000;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 10;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

export const UserProfile = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2c2c44;
  }
`;

export const UserName = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;
  white-space: nowrap;
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background-color: #2c2c44;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const Main = styled.main`
  grid-area: main;
  padding: 2rem;
  background: #f7f7f7;
  overflow-y: auto;

   @media (max-width: 523px) {
        padding: 0;
  }
`;
