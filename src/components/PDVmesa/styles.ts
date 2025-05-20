import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
`;

export const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

export const LeftPane = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  box-shadow: 0 2px 6px ${({ theme }) => theme.colors.neoShadowDark};
  font-size: 0.875rem; // menor
`;

export const RightPane = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: 0 2px 8px ${({ theme }) => theme.colors.neoShadowDark};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const TableSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(1)};
  
  button {
    background: ${({ theme }) => theme.colors.primaryAccent};
    color: #fff;
    padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
    border: none;
    border-radius: ${({ theme }) => theme.radii.sm};
    font-size: 0.75rem; // menor
    min-width: 80px;

    &:hover {
      background: ${({ theme }) => theme.colors.secondary};
    }

    &[style*="background-color: #ccc"] {
      background-color: #ccc !important;
      color: ${({ theme }) => theme.colors.text};
    }
  }
`;


export const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  max-height: 320px;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing(2)};
  background: ${({ theme }) => theme.colors.surface || '#fff'};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.primary} transparent;

  /* Estilo para scrollbar WebKit */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: content-box;
    transition: background-color 0.3s ease;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.colors.neoShadowLight || '#0053ba'};
  }

  div {
    background: ${({ theme }) => theme.colors.bg};
    border-radius: ${({ theme }) => theme.radii.lg};
    padding: ${({ theme }) => theme.spacing(2)};
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text || '#222'};
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.07);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.3s ease, background-color 0.3s ease;

    &:hover {
      background-color: ${({ theme }) => theme.colors.surface || '#e6f0ff'};
      box-shadow: 0 6px 15px rgba(0, 83, 186, 0.3);
      transform: translateY(-4px);
    }

    &:active {
      transform: translateY(-2px);
      box-shadow: 0 3px 10px rgba(0, 83, 186, 0.2);
    }

    button {
      background: ${({ theme }) => theme.colors.surface || '#0053ba'};
      color: white;
      border: none;
      border-radius: ${({ theme }) => theme.radii.sm};
      padding: ${({ theme }) => theme.spacing(0.75)} ${({ theme }) => theme.spacing(2)};
      font-size: 0.875rem;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(0, 83, 186, 0.4);
      transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.15s ease;
      cursor: pointer;
      user-select: none;

      &:hover {
        background-color: ${({ theme }) => theme.colors.primary || '#003f8a'};
        box-shadow: 0 6px 18px rgba(0, 138, 34, 0.6);
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.95);
        box-shadow: 0 3px 8px rgba(0, 63, 138, 0.4);
      }

      &:focus-visible {
        outline: 3px solid ${({ theme }) => theme.colors.neoShadowLight || '#a8c7ff'};
        outline-offset: 2px;
      }
    }
  }
`;


export const PdvButton = styled.button`
    background: ${({ theme }) => theme.colors.primaryAccent};
    color: #fff;
    padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
    border: none;
    border-radius: ${({ theme }) => theme.radii.sm};
    font-size: 1rem; // menor
    font-weight: bold;
    min-width: 80px;

    &:hover {
      background: ${({ theme }) => theme.colors.secondary};
    }

    &[style*="background-color: #ccc"] {
      background-color: #ccc !important;
      color: ${({ theme }) => theme.colors.text};
`
export const Input = styled.input`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: ${({ theme }) => theme.spacing(2)};
  font-size: 1rem;
  width: 100%;
  border: 1px solid transparent;
  box-shadow:
    inset 2px 2px 5px ${({ theme }) => theme.colors.neoShadowDark},
    inset -2px -2px 5px ${({ theme }) => theme.colors.neoShadowLight};
  transition: all 0.25s ease-in-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow:
      0 0 0 2px ${({ theme }) => theme.colors.primaryAccent},
      inset 2px 2px 5px ${({ theme }) => theme.colors.neoShadowDark},
      inset -2px -2px 5px ${({ theme }) => theme.colors.neoShadowLight};
  }`

export const Wrapper = styled.div`
  padding: 1rem;
`;

export const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 42px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + span {
      background-color: #4caf50;
    }

    &:checked + span:before {
      transform: translateX(18px);
    }
  }
`;

export const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;
export const Top = styled.div`
margin: 0 auto;
width: 100%;
display: flex;
justify-content: center;
align-items: center;

h1 {
margin: 0 auto;
width: 100%;
display: flex;
justify-content: center;
align-items: center;
}
`