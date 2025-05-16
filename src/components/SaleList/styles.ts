import styled from 'styled-components';


export const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.neoShadowLight || '#f5f5f5'};
  padding: 2rem;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
`;

export const FilterCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 2rem;
  border-radius: 2rem;
  box-shadow: 8px 8px 20px ${({ theme }) => theme.colors.neoShadowDark}, -8px -8px 20px ${({ theme }) => theme.colors.neoShadowLight};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
  max-width: 500px;
`;

export const Label = styled.label`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.25rem;
`;

export const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.neoShadowDark || '#ccc'};
  border-radius: 0.5rem;
  width: 100%;
`;

export const SearchButton = styled.button`
  margin-top: 1rem;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 999px;
  background: linear-gradient(90deg, #6b46ff, #7e5bef);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #5a3ee7, #6f4cf1);
  }
`;

export const TableContainer = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 2rem;
  box-shadow: 8px 8px 20px ${({ theme }) => theme.colors.neoShadowDark}, -8px -8px 20px ${({ theme }) => theme.colors.neoShadowLight};
  padding: 2rem;
  overflow-x: auto;
`;

export const Header = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
  text-align: center;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 1rem;
  overflow: hidden;
`;

export const Thead = styled.thead`
  background: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
`;

export const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
`;

export const Tr = styled.tr`
  &:hover {
    background: ${({ theme }) => theme.colors.primaryAccent}22;
    transition: background 0.2s ease-in-out;
  }
`;

export const Td = styled.td`
  padding: 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  vertical-align: middle;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TableActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
`;

export const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.error};
  color: white;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.error}cc;
  }
`;

export const EmptyMessage = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1rem;
  margin-top: 2rem;
  text-align: center;
`;
export const InfoText = styled.div`
  margin: 0 auto;
`
export const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.neoShadowDark || '#eef1f5'};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface || '#fff'};
  border-radius: 2rem;
  box-shadow: 8px 8px 20px ${({ theme }) => theme.colors.neoShadowDark}, -8px -8px 20px ${({ theme }) => theme.colors.neoShadowLight};
  padding: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  max-width: 800px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const Button = styled.button`
  background: linear-gradient(90deg, #6b46ff, #7e5bef);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 999px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #5a3ee7, #6f4cf1);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;
