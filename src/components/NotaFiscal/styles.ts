import styled from 'styled-components';

export const Navbar = styled.nav`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  gap: ${({ theme }) => theme.spacing(3)};
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing(2)} 0;
  border-radius: ${({ theme }) => theme.radii.md};
`;

export const NavItem = styled.button<{ active?: boolean }>`
  background: ${({ active, theme }) =>
    active ? theme.colors.secondary : 'transparent'};
  color: ${({ active, theme }) =>
    active ? '#fff' : theme.colors.text};
  border: none;
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    color: #fff;
  }
`;

export const Message = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.5;
`