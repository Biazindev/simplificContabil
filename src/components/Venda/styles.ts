import styled from 'styled-components'

export const Container = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing(6)};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: 0 4px 14px ${({ theme }) => theme.colors.neoShadowDark};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  font-family: 'Roboto', sans-serif;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

export const Text = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.5;
`;

export const ProdutoItem = styled.li`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing(1)} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.textLight};
`;

export const Total = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  text-align: right;
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

export const Button = styled.button`
  background: ${({ theme }) => theme.colors.secondary};
  color: #fff;
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(5)};
  border: none;
  width: 180px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryAccent};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.textLight};
    cursor: not-allowed;
  }
`;

export const ContainerSpace = styled.div`
  display: flex;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  gap: 16px;
`

export const SuccessMessage = styled.p`
  color: green;
  font-weight: bold;
`;

export const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
`;

export const ContainerButton = styled.div`
    display: flex;
    margin: 0 auto;
    width: 100%;
    justify-content: end;
    align-items: center;
`
