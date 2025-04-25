import styled from 'styled-components';

export const ModalInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 1rem;

  input {
    padding: 0.5rem;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  .add {
    background: #10b981;
    border: none;
    padding: 0.6rem;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    cursor: pointer;
  }
`;
