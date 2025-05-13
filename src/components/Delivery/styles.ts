import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const DeliveryContainer = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  width: 100%;
  background: ${({ theme }) => theme.colors.bg};
  overflow-x: auto; /* Permite rolagem horizontal se necessário */
`;

export const DeliveryCard = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  backdrop-filter: blur(12px);
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow:
    8px 8px 16px ${({ theme }) => theme.colors.neoShadowDark},
    -8px -8px 16px ${({ theme }) => theme.colors.neoShadowLight};
  padding: ${({ theme }) => theme.spacing(6)};
  width: 100%;
  animation: ${fadeIn} 0.4s ease-out;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const DeliveryTitle = styled.h2`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const DeliveryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* Garante que a tabela tenha um layout fixo */
  overflow: hidden;
`;

export const TableHeader = styled.tr`
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;

  th {
    padding: ${({ theme }) => theme.spacing(2)};
    text-align: left;
    font-size: 1rem;
    word-wrap: break-word; /* Garante que o conteúdo longo não estoure */
  }
`;

export const TableRow = styled.tr`
  background-color: ${({ theme }) => theme.colors.surface};

  td {
    padding: ${({ theme }) => theme.spacing(2)};
    border-bottom: 1px solid ${({ theme }) => theme.colors.neoShadowDark};
    font-size: 0.9rem;
    word-wrap: break-word; /* Garante que o conteúdo longo não estoure */
    overflow: hidden; /* Impede overflow de conteúdo */
  }

  td:last-child {
    text-align: center;
  }
`;

export const StatusSelect = styled.select`
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  option {
    padding: ${({ theme }) => theme.spacing(2)};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primaryAccent};
  }
`;

export const StatusLabel = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

export const DeliveryStatus = styled.span<{ status: 'Pendente' | 'Concluída' }>`
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.radii.sm};
  background-color: ${({ status, theme }) =>
    status === 'Concluída' ? theme.colors.primaryAccent : theme.colors.secondary};
  color: #fff;
  text-transform: capitalize;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(2)};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(4)};

  & > button {
    min-width: 150px;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    justify-content: center;

    & > button {
      width: 100%;
    }
  }
`;

