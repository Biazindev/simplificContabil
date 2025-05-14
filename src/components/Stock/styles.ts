import styled from "styled-components";

// Container geral responsivo
export const Container = styled.div`
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// Título centralizado e responsivo
export const Title = styled.h2`
  font-size: clamp(1.5rem, 2vw, 2rem);
  margin-bottom: 1.5rem;
  text-align: center;
  color: #111827;
`;

// Container das tabs
export const TabContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  max-width: 800px;
  margin-bottom: 2rem;
`;

// Botão de aba com estilo dinâmico
export const TabButton = styled.button<{ active?: boolean }>`
  flex: 1;
  min-width: 120px;
  padding: 0.75rem 1rem;
  border: none;
  background-color: ${({ active }) => (active ? "#3b82f6" : "#f3f4f6")};
  color: ${({ active }) => (active ? "#ffffff" : "#1f2937")};
  font-weight: 500;
  font-size: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ active }) => (active ? "#2563eb" : "#e5e7eb")};
  }
`;

// Formulário com gap e adaptação de largura
export const Form = styled.form`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// Input com visual limpo e acessível
export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
`;

// Botão com contraste forte e bom feedback visual
export const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #10b981;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #059669;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

// Container de imagem ou upload
export const Img = styled.div`
  width: 100%;
  max-width: 600px;
  height: 140px;
  border: 2px dashed #10b981;
  border-radius: 1rem;
  display: grid;
  place-items: center;
  color: #10b981;
  background-color: #f0fdf4;
  font-size: 1rem;
  transition: background 0.3s ease;

  &:hover {
    background-color: #ecfdf5;
  }
`;
