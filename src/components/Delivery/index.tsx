import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Cliente, Produto } from '../Venda/types';
import { DeliveryCard, DeliveryContainer, DeliveryTable, DeliveryTitle, StatusSelect, TableHeader, TableRow } from './styles';

interface LocationState {
  cliente: Cliente;
  produtos: Produto[];
  total: number;
}

const Delivery = () => {
  const location = useLocation();
  
  // Verifica se 'location.state' existe antes de tentar acessar 'cliente', 'produtos' e 'total'
  const { cliente, produtos, total } = location.state as LocationState || { cliente: {}, produtos: [], total: 0 };

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
      return (
        <>
          <td>{entrega.cliente.pessoaFisica.nome}</td>
          <td>{entrega.cliente.pessoaFisica.endereco.logradouro}</td>
          <td>{entrega.cliente.pessoaFisica.endereco.bairro}</td>
          <td>{entrega.cliente.pessoaFisica.endereco.numero}</td>
          <td>{entrega.cliente.pessoaFisica.endereco.municipio}</td>
        </>
      );
    } else if (entrega.cliente.pessoaJuridica) {
      return (
        <>
          <td>{entrega.cliente.pessoaJuridica.razaoSocial}</td>
          <td>{entrega.cliente.pessoaJuridica.endereco}</td>
          <td>-</td> {/* Não aplicável a PJ */}
          <td>-</td> {/* Não aplicável a PJ */}
          <td>-</td> {/* Não aplicável a PJ */}
        </>
      );
    }
    return null;
  };

  // Verifica se o cliente existe antes de renderizar o componente
  if (!cliente || !produtos.length) {
    return <div>Informações não disponíveis.</div>; // Você pode redirecionar ou exibir uma mensagem de erro aqui
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
