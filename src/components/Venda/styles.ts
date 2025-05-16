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
export const Form = styled.form`
  margin-top: 1rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.6rem 0.8rem;
  margin-bottom: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #4f46e5;
    outline: none;
  }
`;

export const CheckboxContainer = styled.div`
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: end;

  label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1rem;
    color: #333;
    cursor: pointer;
  }

  .switch {
    position: relative;
    width: 48px;
    height: 24px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.3s;
    border-radius: 999px;
  }

  .slider::before {
    content: "";
    position: absolute;
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #4f46e5;
  }

  input:checked + .slider::before {
    transform: translateX(24px);
  }
`;
