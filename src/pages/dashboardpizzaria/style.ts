import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const Sidebar = styled.aside`
  width: 250px;
  background-color: #0f172a;
  color: #fff;
  padding: 1rem;

  h1 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    a {
      color: #fff;
      text-decoration: none;
      padding: 0.5rem;
      border-radius: 0.375rem;
      transition: background 0.2s;

      &:hover {
        background-color: #1e293b;
      }
    }
  }
`;

export const Main = styled.main`
  flex: 1;
  background-color: #f8fafc;
  padding: 2rem;
`;

export const Header = styled.header`
  text-align: right;
  font-size: 0.875rem;
  color: #334155;
  margin-bottom: 2rem;
`;

export const Section = styled.section`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

export const Titulo = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #0f172a;
`;

export const MesasGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;

  button {
    padding: 0.5rem 1rem;
    background-color: #e2e8f0;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    color: #1e293b;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background-color: #cbd5e1;
    }
  }
`;

export const PedidoCard = styled.div`
  background: #f1f5f9;
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  h3 {
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: #0f172a;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 0.5rem;

    th, td {
      padding: 0.5rem;
      border-bottom: 1px solid #e2e8f0;
      text-align: left;
      font-size: 0.875rem;
    }

    th {
      background-color: #f1f5f9;
      font-weight: 600;
    }
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  position: relative; 
  width: 700px;
  max-width: 95%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease;

  h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
  }

  .modal-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .add-btn {
      background-color: #3b82f6;
      color: white;

      &:hover {
        background-color: #2563eb;
      }
    }

    .close-btn {
      background-color: #ef4444;
      color: white;

      &:hover {
        background-color: #dc2626;
      }
    }

    .finalizar-btn {
      background-color: #10b981;
      color: white;

      &:hover {
        background-color: #059669;
      }
    }
  }

  @keyframes fadeIn {
    from {
      transform: translateY(-10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
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

export const ModalInputWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;

  input {
    flex: 1;
    padding: 0.5rem;
    border-radius: 0.375rem;
    border: 1px solid #cbd5e1;
  }

  input[type="number"] {
    width: 100px;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-weight: 600;

    &:hover {
      background-color: #2563eb;
    }
  }
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
    cursor: pointer;
    background-color: #10b981;
    color: white;

    &:hover {
      background-color: #059669;
    }
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

export const PedidosContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  padding-right: 0.5rem;

  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 10px;
  }
`;

export const AddProdutoWrapper = styled.div`
  margin-top: 1rem;

  h4 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .produto-row,
  .form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;

    label {
      font-size: 0.75rem;
      color: #334155;
      margin-bottom: 0.25rem;
    }

    input,
    select {
      padding: 0.5rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.375rem;
      min-width: 100px;
    }
  }

  button {
    background-color: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;

    &:hover {
      background-color: #2563eb;
    }
  }
`;
