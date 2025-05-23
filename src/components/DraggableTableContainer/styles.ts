import { styled } from "styled-components";

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto; /* Habilita scroll horizontal se necessário */
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 1rem;
  padding: 1.5rem;
`;