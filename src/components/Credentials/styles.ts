import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const CredentialsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  height: 100vh;
  align-items: center;
  margin: 0 auto;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bg};
  overflow: hidden;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    margin: 0 auto;
      justify-content: center;
      align-items: center;
  }

  @media (max-width: 768px) {
    background: #1e272e;
  }
`;



export const CredentialsImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%; 
  height: 100%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;

    @media (max-width: 1024px) {
      height: 300px;
      object-fit: contain;
      display: none;
      margin: 0 auto;
      justify-content: center;
      align-items: center; 
    }
  }

  @media (max-width: 1024px) {
    height: auto;
  }
`;

export const CredentialsForm = styled.section`
  background: #1e272e;
  padding: ${({ theme }) => theme.spacing(6)};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow:
    8px 8px 16px ${({ theme }) => theme.colors.neoShadowDark},
   -8px -8px 16px ${({ theme }) => theme.colors.neoShadowLight};
  display: flex;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  height: 500px;
  animation: ${fadeIn} 0.4s ease-out;
  overflow: hidden;

  img {
  width: 180px;
  height: 180px;
  }

  @media (max-width: 768px) {
    max-width: 90%;
    box-shadow: none;
    border-radius: 24px;
  }

  h1 {
    font-size: 1.75rem;
    font-weight: 600;
    text-align: center;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing(4)};
  }

  button {
    width: 100%;
  }

  p {
    font-size: 0.875rem;
    margin-top: ${({ theme }) => theme.spacing(2)};
    color: ${({ theme }) => theme.colors.error};
    text-align: center;
  }
`;

export const InputField = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};

  input {
    background: ${({ theme }) => theme.colors.surface};
    border: none;
    width: 100%;
    border-radius: ${({ theme }) => theme.radii.sm};
    padding: ${({ theme }) => theme.spacing(2)};
    font-size: 1rem;
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
  }
`;

export const ForgotButton = styled.button`
  background: #7158e2;
  height: 100%;
  border: none;
  border-radius: 24px;
  color: #fff;
  width: 100%;
  cursor: pointer;
  font-size: 0.9rem;
  text-align: center;
  transition: opacity 0.2s;
  min-width: 160px;
  gap: 12px;   
  min-height: 44px;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
