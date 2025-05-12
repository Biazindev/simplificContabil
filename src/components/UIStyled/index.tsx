import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Card = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  backdrop-filter: blur(12px);
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow:
    8px 8px 16px ${({ theme }) => theme.colors.neoShadowDark},
   -8px -8px 16px ${({ theme }) => theme.colors.neoShadowLight};
  padding: ${({ theme }) => theme.spacing(6)};
  width: 100%;
  max-width: 900px;
  animation: ${fadeIn} 0.4s ease-out;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;
