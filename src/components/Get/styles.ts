import { styled } from "styled-components";

export const Container = styled.div`
  padding: 32px;
`;

export const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 24px;
  color: #333;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

export const Th = styled.th`
  background: #f0f0f5;
  color: #333;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #e0e0e0;
`;

export const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  color: #555;
`;

export const Tr = styled.tr`
  &:hover {
    background-color: #f9f9f9;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
`

export const DeleteButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c0392b;
  }
`;

export const Message = styled.p`
  color: #666;
`;
