import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

export const ContentContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const PageTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 1.5rem;
`;

export const PrimaryButton = styled.button`
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  &:hover {
    background-color: #40a9ff;
  }
`;

export const DangerButton = styled.button`
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #ff7875;
  }
`;

export const FiltersContainer = styled.div`
  background-color: #fafafa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

export const ActionSpace = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

export const StatusTag = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
  background-color: ${props => {
    switch (props.status) {
      case 'ABERTA': return '#e6f7ff';
      case 'EM_ANDAMENTO': return '#fff7e6';
      case 'CONCLUIDA': return '#f6ffed';
      case 'CANCELADA': return '#fff1f0';
      default: return '#fafafa';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'ABERTA': return '#1890ff';
      case 'EM_ANDAMENTO': return '#fa8c16';
      case 'CONCLUIDA': return '#52c41a';
      case 'CANCELADA': return '#f5222d';
      default: return '#333';
    }
  }};
`;

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

export const TableHeader = styled.thead`
  background-color: #fafafa;
`;

export const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 500;
  color: #333;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #f0f0f0;

  &:hover {
    background-color: #fafafa;
  }
`;

export const TableCell = styled.td`
  padding: 1rem;
  vertical-align: middle;
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  color: #1890ff;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(24, 144, 255, 0.1);
  }
`;

export const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  min-width: 200px;
`;

export const DateInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
`;

export const CenteredSpin = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.5rem;
  color: #1890ff;
`;

export const PopconfirmContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const PopconfirmContent = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  min-width: 200px;
`;

export const PopconfirmButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export const PopconfirmButton = styled.button`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
`;