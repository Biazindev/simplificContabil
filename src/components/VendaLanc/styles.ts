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
  gap: ${({ theme }) => theme.spacing(2)};
  max-height: 300px;
  overflow-y: auto;

  div {
    background: ${({ theme }) => theme.colors.bg};
    border-radius: ${({ theme }) => theme.radii.sm};
    padding: ${({ theme }) => theme.spacing(1.5)};
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;

    button {
      padding: ${({ theme }) => theme.spacing(0.5)} ${({ theme }) => theme.spacing(1.5)};
      font-size: 0.75rem;
    }
  }
`;

export const PdvButton = styled.button`
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
`

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
