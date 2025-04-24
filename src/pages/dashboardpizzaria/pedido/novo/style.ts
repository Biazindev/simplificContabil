import styled from "styled-components";

export const Titulo = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #0f172a;
`;

export const Topo = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;

  button {
    background-color: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-weight: 600;

    &:hover {
      background-color: #2563eb;
    }
  }
`;

export const AddProdutoWrapper = styled.div`
  margin-top: 1rem;

  h4 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .produto-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1rem;

    .input-group {
      display: flex;
      flex-direction: column;

      label {
        font-size: 0.75rem;
        color: #334155;
        margin-bottom: 0.25rem;
      }

      input, select {
        padding: 0.5rem;
        border: 1px solid #cbd5e1;
        border-radius: 0.375rem;
        min-width: 120px;
      }
    }

    button {
      background-color: #3b82f6;
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      font-weight: 600;
      align-self: flex-end;

      &:hover {
        background-color: #2563eb;
      }
    }
  }
    textarea {
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 60px;
}

`;

export const Tabela = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.95rem;
  background-color: #f1f5f9;

  th {
    background-color: #e2e8f0;
    text-align: left;
    padding: 0.75rem;
    font-weight: 600;
    color: #1e293b;
    border-bottom: 2px solid #cbd5e1;
  }

  td {
    padding: 0.75rem;
    border-bottom: 1px solid #e2e8f0;
  }

  tr:nth-child(even) {
    background-color: #f8fafc;
  }
`;

export const BotoesAcoes = styled.div`
  display: flex;
  gap: 0.5rem;

  button {
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    border: none;
    font-weight: 600;
    cursor: pointer;
    background-color: #e2e8f0;

    &:hover {
      background-color: #cbd5e1;
    }
  }
`;
export const ModalClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
`;
