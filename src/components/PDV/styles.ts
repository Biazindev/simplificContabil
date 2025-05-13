import styled, { keyframes } from 'styled-components';

export interface ThemeColor {
  colors: {
    bg: string;
    surface: string;
    primary: string;
    primaryAccent: string;
    secondary: string;
    text: string;
    textLight: string;
    error: string;
    glassShadow: string;
    neoShadowLight: string;
    neoShadowDark: string;
  };
  radii: {
    sm: string;
    md: string;
    lg: string;
  };
  spacing: (factor: number) => string;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  width: 100%;
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
  max-width: 600px;
  animation: ${fadeIn} 0.4s ease-out;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing(4)};
    width: 100%;
  }
    @media (max-width: 400px) {
    padding: ${({ theme }) => theme.spacing(4)};
    width: 100%;
    margin: 4px;
  }
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

export const Subtitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  text-align: center;
  letter-spacing: -0.5px;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

export const FormGrid = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing(3)};
  width: 100%;
`;

export const Fieldset = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
  width: 100%;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

export const Input = styled.input`
  background: ${({ theme }) => theme.colors.surface};
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: ${({ theme }) => theme.spacing(2)};
  font-size: 1rem;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  box-shadow:
    inset 4px 4px 8px ${({ theme }) => theme.colors.neoShadowDark},
    inset -4px -4px 8px ${({ theme }) => theme.colors.neoShadowLight};
  transition: box-shadow 0.2s ease;

  &:focus {
    outline: none;
    box-shadow:
      0 0 0 3px ${({ theme }) => theme.colors.primaryAccent},
      inset 4px 4px 8px ${({ theme }) => theme.colors.neoShadowDark},
      inset -4px -4px 8px ${({ theme }) => theme.colors.neoShadowLight};
  }
        @media (max-width: 523px) {
        max-width: 230px;
  }
`;


export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing(2)};
  border: none;
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  transition: transform 0.15s, box-shadow 0.15s;

  background: ${({ theme, variant }) =>
    variant === 'secondary'
      ? theme.colors.secondary
      : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryAccent})`};
  color: #fff;

  box-shadow:
    4px 4px 12px ${({ theme }) => theme.colors.neoShadowDark},
   -4px -4px 12px ${({ theme }) => theme.colors.neoShadowLight};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow:
      6px 6px 16px ${({ theme }) => theme.colors.neoShadowDark},
     -6px -6px 16px ${({ theme }) => theme.colors.neoShadowLight};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

   @media (max-width: 444px) {
       width: 230px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};
  width: 100%;
  justify-content: flex-end;

  & > button {
    flex: 1 1 200px;
    min-width: 0;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    justify-content: center;

    & > button {
      flex: 1 1 100%;
      width: 100%;
    }

    @media (max-width: 444px) {
       width: 230px;
  }
  }
`;

export const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.85rem;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-wrap: wrap;

  > h3 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};

    @media (max-width: 480px) {
      font-size: 1.5rem;
    }
  }
`;
