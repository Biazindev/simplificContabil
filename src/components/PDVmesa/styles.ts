import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
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
  max-width: 650px;
  width: 100%;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  box-shadow: 0 2px 6px ${({ theme }) => theme.colors.neoShadowDark};
  font-size: 0.875rem; // menor

  .container {
  display: flex;
  justify-content: start;
  align-items: center;

  span {
  margin: 0 8px 0 8px;
  font-size: 24px;
  align-items: center;

  h3 {
  position: relative:
  top: -2px;
  font-size: 24px;
  }
  }
  }
`;

export const RightPane = styled.div`
  flex: 1;
  border-radius: ${({ theme }) => theme.radii.lg};
  display: flex;
  width: 1000px;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const TableSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  overflow-y: auto;
  flex-wrap: wrap;
  gap: 16px;
  padding: ${({ theme }) => theme.spacing(2)};

  button {
    all: unset;
    cursor: pointer;
    padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(3)};
    border-radius: ${({ theme }) => theme.radii.md};
    max-width: 40x;
    text-align: center;
    font-size: 0.85rem;
    font-weight: 600;
    background: ${({ theme }) => theme.colors.primaryAccent};
    color: white;
    box-shadow: ${({ theme }) => theme.colors.neoShadowDark};
    transition: all 0.25s ease;

    &:hover {
      transform: translateY(-2px);
      background: ${({ theme }) => theme.colors.secondary};
    }

    &:active {
      transform: scale(0.98);
    }

    &.ocupada {
      background: #e74c3c !important; /* vermelho vibrante */
      color: white;
      box-shadow: inset 0 0 0 2px rgba(0,0,0,0.1);
    }

    &.disponivel {
      background: ${({ theme }) => theme.colors.primaryAccent};
    }

    &.desabilitada {
      background-color: #ccc !important;
      color: ${({ theme }) => theme.colors.text};
      pointer-events: none;
      opacity: 0.6;
    }
  }
`;



export const ProductList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  margin: 0 auto;
  justify-content: center;
  gap: 8px;
  max-height: 930px;
  position: relative;
  width: 100%;
  overflow-y: auto;
  padding: 8px;
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
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: content-box;
    transition: background-color 0.3s ease;
  }

  >div {
    position: relative;
    background-color: #57606f;
    border-radius: 8px;
    padding: ${({ theme }) => theme.spacing(2)};
    justify-content: space-between;
    font-size: 1rem;
    font-weight: 600;
    height: 300px;
    width: 220px;
    color: ${({ theme }) => theme.colors.textLight || '#222'};
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.07);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.3s ease, background-color 0.3s ease;

    &:hover {
      background-color: ${({ theme }) => theme.colors.surface || '#e6f0ff'};
      color: ${({ theme }) => theme.colors.text};
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

export const Titulo = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

export const FiltroContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const InputBusca = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

export const Filtros = styled.div`
  display: flex;
  gap: 1rem;
`;

export const FiltroBotao = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  background-color: '#007bff';
  color: '#fff';
  cursor: pointer;

  &:hover {
    background-color: #007bff;
    color: white;
  }
`;

export const ListaCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
`;

export const HeaderCard = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

export const Mesa = styled.div`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #555;
`;

export const Produto = styled.div`
  font-size: 0.95rem;
  color: #333;
  margin-left: 1rem;
`;

export const FinalizarBotao = styled.button`
  margin-top: 1rem;
  background-color: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

export const Legend = styled.p`
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;

    .container {
    background-color: #b33939;
    }

    span {
    margin-left: 8px;

    
    
    div {
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 16px;
    background-color: #218c74;
  }

    }
`

export const ImgContainer = styled.div`
    width: 100%;
    height: 150px;
    margin-bottom: 16px;

    img {
    width: 100%;
    height: 100%;
    }
`

export const Description = styled.span`
    
    p{
      font-size: 12px;
      font-weight: 400;
    }
`

export const Icon = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  
  

  span {
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #5f27cd;
    color: #fff;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 18px;
    z-index: 1000;
  }
`