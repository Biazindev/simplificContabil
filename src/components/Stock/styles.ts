import styled from "styled-components";

export const Container = styled.div`
  max-width: 1400px;  // Aumentei a largura máxima
  width: 100%;
  margin: 0 auto;
  padding: 0 1.5rem;  // Adicionei padding lateral
`;

export const Title = styled.h2`
  font-size: clamp(1.8rem, 2.5vw, 2.5rem);
  margin: 2rem 0;
  text-align: center;
  color: #111827;
  font-weight: 600;
`;

export const TabContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;  // Aumentei o gap
  margin-bottom: 2.5rem;
`;

export const TabButton = styled.button<{ active?: boolean }>`
  min-width: 160px;  // Largura maior
  padding: 1rem 1.25rem;
  border: none;
  background-color: ${({ active }) => (active ? "#3b82f6" : "#f3f4f6")};
  color: ${({ active }) => (active ? "#ffffff" : "#1f2937")};
  font-weight: 600;  // Mais negrito
  font-size: 1.05rem;
  border-radius: 0.75rem;  // Bordas mais arredondadas
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${({ active }) => active ? "0 4px 6px rgba(59, 130, 246, 0.2)" : "none"};

  &:hover {
    background-color: ${({ active }) => (active ? "#2563eb" : "#e5e7eb")};
    transform: translateY(-2px);
  }
`;

export const Form = styled.form`
  width: 100%;
  max-width: 800px;  // Largura máxima definida
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.85rem 1.25rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-size: 1.05rem;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #10b981;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  &:hover {
    background-color: #059669;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const Img = styled.div`
  width: 100%;
  height: 180px;  // Altura maior
  border: 2px dashed #10b981;
  border-radius: 1rem;
  display: grid;
  place-items: center;
  color: #10b981;
  background-color: #f0fdf4;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background-color: #ecfdf5;
    transform: translateY(-2px);
  }
`;

export const ProdutosList = styled.div`
  width: 100%;
  margin: 2rem 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));  // Cards mais largos
  gap: 1.5rem;  // Mais espaçamento
  padding: 1.5rem;
  background-color: #f8fafc;
  border-radius: 1rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const ProdutoItem = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
  }

  div {
    margin-bottom: 0.75rem;
    font-size: 1rem;
    
    &:first-child {
      font-weight: 700;
      color: #1e293b;
      font-size: 1.1rem;
    }
    
    &:last-child {
      margin-bottom: 0;
      color: #047857;
      font-weight: 600;
      font-size: 1.15rem;
    }
  }
`;

// Novo componente para o container de câmera
export const CameraContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 1rem auto;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

// Novo componente para mensagens
export const Mensagem = styled.p<{ tipo?: 'sucesso' | 'erro' }>`
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.75rem;
  font-weight: 500;
  text-align: center;
  background-color: ${({ tipo }) => 
    tipo === 'sucesso' ? '#ecfdf5' : 
    tipo === 'erro' ? '#fee2e2' : '#eff6ff'};
  color: ${({ tipo }) => 
    tipo === 'sucesso' ? '#047857' : 
    tipo === 'erro' ? '#b91c1c' : '#1e40af'};
  border: 1px solid ${({ tipo }) => 
    tipo === 'sucesso' ? '#a7f3d0' : 
    tipo === 'erro' ? '#fecaca' : '#bfdbfe'};
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const ActionButton = styled.button<{ color?: string }>`
  flex: 1;
  padding: 0.5rem;
  background-color: ${({ color }) => color || '#3b82f6'};
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;