import { cores } from '../../styles'
import styled from 'styled-components'

export const Container = styled.div`
  font-family: 'Roboto', sans-serif;
  color: ${cores.cinza};
  padding: 32px;
  margin: 0 auto;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 24px;

  > div {
    flex: 1;
  }

  > div:first-child {
    justify-content: flex-start;
    display: flex;
  }

  > div:last-child {
    justify-content: flex-end;
    display: flex;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;

    > div {
      justify-content: center;
    }
  }
`



export const GridContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

export const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
`;

    export const Total = styled.div`
    margin:0 auto;
    `

export const Form = styled.form`
  background-color: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3b82f6;
    outline: none;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  resize: vertical;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 100px;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3b82f6;
    outline: none;
  }
`;

export const Label = styled.label`
  font-size: 1rem;
  color: #374151;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;

  th,
  td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background-color: #f3f4f6;
    color: #111827;
    font-weight: 500;
    font-size: 0.95rem;
  }

  td {
    background-color: #fff;
    font-size: 0.95rem;
  }

  tr:hover td {
    background-color: #f9fafb;
  }

  button {
    background-color: #ef4444;
    color: white;
    padding: 6px 10px;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    cursor: pointer;

    &:hover {
      background-color: #dc2626;
    }
  }
`;

export const ImgPreview = styled.img`
  max-width: 120px;
  margin-top: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

export const Button = styled.button`
  background-color: #10b981;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  width: fit-content;
  transition: background-color 0.3s;

  &:hover {
    background-color: #059669;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const SearchResults = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 16px;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
  }

  button {
    padding: 8px 16px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
      background-color: #2563eb;
    }
  }
`;

