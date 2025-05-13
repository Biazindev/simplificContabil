import styled from 'styled-components';
import { fadeIn } from './sharedStyles'; // ou defina o fadeIn nesse arquivo se preferir reaproveitar

export const ClienteBuscaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  animation: ${fadeIn} 0.4s ease-out;
`;

export const BuscaHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const BuscaForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-wrap: wrap;
  align-items: center;
`;

export const ResultadoContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow:
    4px 4px 12px ${({ theme }) => theme.colors.neoShadowDark},
   -4px -4px 12px ${({ theme }) => theme.colors.neoShadowLight};
  padding: ${({ theme }) => theme.spacing(4)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const InfoLinha = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(1)};
  
  > span {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const EditSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

export const EmptyState = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textLight};
  text-align: center;
`;

export const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
`;
