import styled from 'styled-components';

export const Container = styled.div`
  font-family: 'Roboto', sans-serif;
  padding: 20px;
  margin: 0 auto;
  max-width: 1200px;
`;

export const Title = styled.h2`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  color: #333;
  font-size: 2rem;
  margin-bottom: 20px;
`;

export const Form = styled.form`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

export const Input = styled.input`
  width: 100%;
  justify-content: start;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s;

  &:focus {
    border-color: #0066cc;
    outline: none;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  resize: none;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s;

  &:focus {
    border-color: #0066cc;
    outline: none;
  }
`;

export const Label = styled.label`
  font-size: 1rem;
  color: #333;
  display: block;
  margin-bottom: 8px;

  div {
  display: flex;
  

  >input {
    display: flex;
    width: 18px;
    height: 18px;
  }
  }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th,
  td {
    padding: 4px;
    text-align: left;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f0f0f0;
    color: #333;
  }

  td {
    background-color: #fff;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;
  }

  button {
    background-color: #3c6382;
    color: white;
    padding: 6px 12px;
    margin-left: 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #60a3bc;
    }
  }
`;

export const ImgPreview = styled.img`
  max-width: 100px;
  margin-top: 8px;
  display: block;
`

export const Button = styled.button`
  background-color: #10b981;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 400;
  font-size: 18px;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;

  &:hover {
  background-color: #0be881;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`