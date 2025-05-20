import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Cliente, Produto } from '../Venda/types';

import {
  DeliveryCard,
  DeliveryContainer,
  DeliveryTable,
  DeliveryTitle,
  StatusSelect,
  TableHeader,
  TableRow
} from './styles';

interface LocationState {
  cliente: Cliente;
  produtos: Produto[];
  total: number;
}

export type DadosEntregaProps = {
  clienteBusca: string;
  produtosSelecionados: Produto[];
};
type Props = {
  dadosEntrega: DadosEntregaProps;
};

const Delivery = () => {
  const location = useLocation();

  const { cliente, produtos, total } = (location.state as LocationState) || {
    cliente: {} as Cliente,
    produtos: [],
    total: 0
  };

  const [status, setStatus] = useState<'Pendente' | 'Concluída'>('Pendente');

  const entrega = {
    id: 1,
    cliente,
    produtos,
    total,
    status
  };

  const renderClienteInfo = () => {
    if (entrega.cliente.pessoaFisica) {
      const endereco = entrega.cliente.pessoaFisica.endereco;
      return (
        <>
          <td>{entrega.cliente.pessoaFisica.nome}</td>
          <td>{endereco?.logradouro || '-'}</td>
          <td>{endereco?.bairro || '-'}</td>
          <td>{endereco?.numero || '-'}</td>
          <td>{endereco?.municipio || '-'}</td>
        </>
      );
    } else if (entrega.cliente.pessoaJuridica) {
      const endereco = entrega.cliente.pessoaJuridica.endereco;
      return (
        <>
          <td>{entrega.cliente.pessoaJuridica.razaoSocial}</td>
          <td>{endereco?.logradouro || '-'}</td>
          <td>{endereco?.bairro || '-'}</td>
          <td>{endereco?.numero || '-'}</td>
          <td>{endereco?.municipio || '-'}</td>
        </>
      );
    }
    return (
      <>
        <td colSpan={5}>Cliente desconhecido</td>
      </>
    );
  };

  if (!cliente || !produtos.length) {
    return <div>Informações não disponíveis.</div>;
  }

  return (
    <DeliveryContainer>
      <DeliveryCard>
        <DeliveryTitle>Entregas</DeliveryTitle>

        <DeliveryTable>
          <thead>
            <TableHeader>
              <th>#</th>
              <th>Cliente</th>
              <th>Rua</th>
              <th>Bairro</th>
              <th>Número</th>
              <th>Cidade</th>
              <th>Produtos</th>
              <th>Total (R$)</th>
              <th>Status</th>
            </TableHeader>
          </thead>
          <tbody>
            <TableRow>
              <td>{entrega.id}</td>
              {renderClienteInfo()}
              <td>
                <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                  {entrega.produtos.map((produto) => (
                    <li key={produto.id}>
                      {produto.nome} ({produto.quantidade} x R$ {produto.precoUnitario.toFixed(2)})
                    </li>
                  ))}
                </ul>
              </td>
              <td>R$ {entrega.total.toFixed(2)}</td>
              <td>
                <StatusSelect
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Pendente' | 'Concluída')}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Concluída">Concluída</option>
                </StatusSelect>
              </td>
            </TableRow>
          </tbody>
        </DeliveryTable>
      </DeliveryCard>
    </DeliveryContainer>
  );
};

export default Delivery;
