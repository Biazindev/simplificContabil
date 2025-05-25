import { useState, useEffect } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';


import {
  useGetVendasPorPeriodoQuery,
  useGetTotalPorPeriodoQuery,
  useDeleteVendaMutation,
} from '../../services/api';

import {
  Label,
  Input,
  InfoText,
  Table,
  Th,
  EmptyMessage,
  PageContainer,
  Card,
  Button,
} from './styles';
import DraggableTableContainer from '../DraggableTableContainer';
import VendaRow from '../Utils/VendaRow';

export type ItemVenda = {
  id: number;
  quantidade: number;
  produtoId: number | null;
  nomeProduto?: string;
  produto?: {
    id: number;
    nome: string;
    precoUnitario: number
  };
  precoUnitario?: number
  totalItem?: number;
};

export type VendaProps = {
  id: number;
  documentoCliente: string | null;
  itens: ItemVenda[];
  totalVenda: number;
  totalDesconto?: number;
  totalPagamento?: number;
  formaPagamento: 'DINHEIRO' | 'CARTAO' | 'PIX' | string;
  dataVenda: string;
  status: string;
  clienteId?: number | null;
  numeroParcelas?: number;
  pagamento?: {
    formaPagamento?: string;
    totalVenda?: number;
    totalDesconto?: number;
    totalPagamento?: number;
  };
}

const SaleList = () => {
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 1. Set initial date range (last 30 days)
  useEffect(() => {
    const hoje = new Date();
    const trintaDiasAtras = new Date(hoje);
    trintaDiasAtras.setDate(hoje.getDate() - 5);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    setInicio(formatDate(trintaDiasAtras));
    setFim(formatDate(hoje));
  }, []);

  // 2. Fetch sales data
  const {
    data: vendas = [],
    isLoading: loadingVendas,
    error: errorVendas,
    refetch: refetchVendas
  } = useGetVendasPorPeriodoQuery(
    inicio && fim ? { inicio, fim } : skipToken
  );

  const {
    data: total = 0,
    isLoading: loadingTotal,
    error: errorTotal,
    refetch: refetchTotal
  } = useGetTotalPorPeriodoQuery(
    inicio && fim ? { inicio, fim } : skipToken
  );

  // 4. Mark initial load as complete after first fetch
  useEffect(() => {
    if (inicio && fim && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [inicio, fim, isInitialLoad]);

  // 5. Format items with product names
  const formatItems = (items: ItemVenda[]) => {
    return items.map(item => ({
      ...item,
      nomeProduto: item.produto?.nome || item.nomeProduto || 'Produto não informado',
      precoUnitario: item.produto?.precoUnitario || item.precoUnitario || 0,
      totalItem: item.totalItem || (item.quantidade * (item.produto?.precoUnitario || item.precoUnitario || 0))
    }));
  };

  // 6. Delete mutation
  const [deleteVenda] = useDeleteVendaMutation();

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta venda?')) {
      try {
        await deleteVenda(id).unwrap();
        refetchVendas();
        refetchTotal();
        alert('Venda excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir venda:', error);
        alert('Erro ao excluir venda.');
      }
    }
  };

  const handleEdit = (venda: VendaProps) => {
    alert(`Editar venda ID: ${venda.id}`);
  };

  const aplicarFiltro = () => {
    if (!inicio || !fim) {
      alert('Selecione ambas as datas (início e fim) para filtrar');
      return;
    }
    refetchVendas();
    refetchTotal();
  };

  // 7. Debug log
  useEffect(() => {
    if (vendas.length > 0) {
      console.log('Dados das vendas recebidos:', vendas);
      console.log('Total recebido:', total);
    }
  }, [vendas, total]);

  return (
    <PageContainer>
      <Card>
        <Label>
          Início:
          <Input
            type="date"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
          />
        </Label>

        <Label>
          Fim:
          <Input
            type="date"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
          />
        </Label>
      </Card>
      {/* Display area */}
      {!isInitialLoad && (
        <>
          {/* Total sales */}
          {!loadingTotal && !errorTotal && (
            <InfoText>
              Total no período: <strong>R$ {Number(total).toFixed(2)}</strong>
            </InfoText>
          )}

          {/* Loading/error states */}
          {loadingVendas ? (
            <InfoText>Carregando vendas...</InfoText>
          ) : errorVendas ? (
            <InfoText className={errorVendas ? 'error' : ''}>
              Erro ao carregar vendas
            </InfoText>
          ) : (
            /* Sales table */
            <>
              {vendas.length > 0 ? (
                <DraggableTableContainer>
                  <Table>
                    <thead>
                      <tr>
                        <Th>ID</Th>
                        <Th>Documento Cliente</Th>
                        <Th>Itens</Th>
                        <Th>Valor Total</Th>
                        <Th>Desconto</Th>
                        <Th>Valor Pago</Th>
                        <Th>Pagamento</Th>
                        <Th>Status</Th>
                        <Th>Data</Th>
                        <Th>Ações</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendas.map(venda => (
                        <VendaRow
                          key={venda.id}
                          venda={{
                            ...venda,
                            itens: formatItems(venda.itens)
                          }}
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                        />
                      ))}
                    </tbody>
                  </Table>
                </DraggableTableContainer>
              ) : (
                <EmptyMessage>Nenhuma venda encontrada no período selecionado</EmptyMessage>
              )}
            </>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default SaleList;