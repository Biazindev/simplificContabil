import styled from 'styled-components';

export const TableContainer = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow:
    8px 8px 16px ${({ theme }) => theme.colors.neoShadowDark},
   -8px -8px 16px ${({ theme }) => theme.colors.neoShadowLight};
`;

export const Thead = styled.thead`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
`;

export const TableActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  justify-content: center;
`;


export const Th = styled.th`
  padding: ${({ theme }) => theme.spacing(2)};
  text-align: left;
  font-weight: 600;
  font-size: 0.95rem;
`;

export const Tr = styled.tr`
  &:nth-child(even) {
    background: ${({ theme }) => theme.colors.bg};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primaryAccent}22;
  }
`;

export const Td = styled.td`
  padding: ${({ theme }) => theme.spacing(2)};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  vertical-align: middle;
  max-width: 180px;
`;

export const DeleteButton = styled.button`
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(3)};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.error};
  color: white;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.error}cc;
  }
`;

export const EmptyMessage = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1rem;
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

export const Header = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;
