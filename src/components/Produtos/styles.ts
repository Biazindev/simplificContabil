import styled from 'styled-components';

export const Container = styled.div`
  font-family: 'Roboto', sans-serif;
  color: #000;
  padding: ${({ theme }) => theme.spacing(6)};
  margin: 0 auto;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
`;

export const Img = styled.div`
  width: 100%;
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
`

export const VideoScanner = styled.video`
  width: 100%;
  max-height: 300px;
  margin: 10px 0;
  border: 2px dashed #ccc;
  border-radius: 8px;
  background: #000;
  
  &:focus {
    outline: none;
    border-color: #5f27cd;
  }
`;

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

export const TabContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
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

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: ${({ theme }) => theme.spacing(6)};

  & > div {
    flex: 1;
  }
  & > div:first-child {
    display: flex;
    justify-content: flex-start;
  }
  & > div:last-child {
    display: flex;
    justify-content: flex-end;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    & > div {
      justify-content: center;
    }
  }
`;

export const GridContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing(6)};
`;

export const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

export const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};

  span {
    font-size: 3.5rem;
  }
`;

export const Total = styled.div`
  margin: 0 auto;
  font-size: 1.25rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

export const Form = styled.form`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: 0 4px 14px ${({ theme }) => theme.colors.neoShadowDark};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(3)};
  resize: vertical;
  border: 1px solid ${({ theme }) => theme.colors.textLight};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 1rem;
  min-height: 120px;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

export const Label = styled.label`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: ${({ theme }) => theme.radii.sm};
  overflow: hidden;

  th,
  td {
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.textLight};
  }

  th {
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 0.95rem;
  }

  td {
    background: ${({ theme }) => theme.colors.surface};
    font-size: 0.95rem;
  }

  tr:hover td {
    background: ${({ theme }) => theme.colors.glassShadow};
  }

  >button {
    background: transparent;
    color: #000;
    padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
    border: none;
    border-radius: ${({ theme }) => theme.radii.sm};
    font-size: 0.875rem;
    cursor: pointer;
  }
`;

export const ImgPreview = styled.img`
  max-width: 120px;
  margin-top: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.radii.sm};
  box-shadow: 0 2px 6px ${({ theme }) => theme.colors.neoShadowDark};
`;

export const Button = styled.button`
  background: ${({ theme }) => theme.colors.primaryAccent};
  color: #fff;
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 400;
  font-size: 14px;
  height: 100%;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 200px;
  max-width: 100%;
  align-self: flex-end;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.secondary};
  }

  &:disabled {
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    align-self: stretch;
  }
`;


export const SearchResults = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.sm};
  box-shadow: 0 2px 12px ${({ theme }) => theme.colors.neoShadowDark};
  padding: ${({ theme }) => theme.spacing(4)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};

  & > div {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 80px;
    align-items: center;
    gap: ${({ theme }) => theme.spacing(3)};

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      gap: ${({ theme }) => theme.spacing(2)};
    }
  }

  input {
    width: 100%;
    padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(3)};
    border: 1px solid ${({ theme }) => theme.colors.textLight};
    border-radius: ${({ theme }) => theme.radii.sm};
    font-size: 1rem;
  }

  button {
    background: ${({ theme }) => theme.colors.primary};
    width: 100%;
    height: 40px;
    color: #fff;
    border: none;
    border-radius: ${({ theme }) => theme.radii.sm};
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background: ${({ theme }) => theme.colors.primaryAccent};
    }
  }
`;


export const IconButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: none;
  cursor: pointer;
  padding: 4px;
  font-size: 1rem;

  &:hover {
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
  }
`;
