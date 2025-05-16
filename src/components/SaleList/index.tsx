import React, { useState, useEffect } from 'react';
import {
  useGetVendasQuery,
  useGetTotalPorPeriodoQuery,
  useDeleteVendaMutation,
} from '../../services/api';

import {
  Label,
  Input,
  InfoText,
  TableContainer,
  Table,
  Th,
  EmptyMessage,
  Td,
  PageContainer,
  Card,
  Button
} from './styles'

export type VendaProps = {
  id: number;
  documentoCliente: string;
  itens: {
    id: number;
    quantidade: number;
    produtoId: number;
    nomeProduto?: string;
  }[];
  totalVenda: number;
  totalDesconto: number;
  totalPagamento: number;
  formaPagamento: 'DINHEIRO' | 'CARTAO' | 'PIX' | string;
  dataVenda: string;
  status: string;
  clienteId: number;
  numeroParcelas: number;
};

type VendaRowProps = {
  venda: VendaProps;
  onDelete: (id: number) => void | Promise<void>;
};

const VendaRow = ({ venda, onDelete }: VendaRowProps) => (
  <tr>
    <Td>{venda.id}</Td>
    <Td>{venda.documentoCliente}</Td>
    <Td>{/* Nome ou razão social aqui, se quiser */}</Td>
    <Td>R$ {venda.totalVenda.toFixed(2)}</Td>
    <Td>R$ {venda.totalDesconto.toFixed(2)}</Td>
    <Td>R$ {venda.totalPagamento.toFixed(2)}</Td>
    <Td>{venda.formaPagamento}</Td>
    <Td>{venda.status}</Td>
    <Td>{new Date(venda.dataVenda).toLocaleString('pt-BR')}</Td>
    <Td>
      <Button onClick={() => onDelete(venda.id)}>Excluir</Button>
    </Td>
  </tr>
);

const SaleList = () => {
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [filter, setFilter] = useState<{ inicio: string; fim: string } | undefined>(undefined);

  useEffect(() => {
    const hoje = new Date();
    const trintaDiasAtras = new Date(hoje);
    trintaDiasAtras.setDate(hoje.getDate() - 30);

    const formatDate = (date: Date) => date.toISOString().slice(0, 10);

    const dataInicio = formatDate(trintaDiasAtras);
    const dataFim = formatDate(hoje);

    setInicio(dataInicio);
    setFim(dataFim);
    setFilter({ inicio: dataInicio, fim: dataFim });
  }, []);

  const {
    data: vendas,
    error: errorVendas,
    isLoading: loadingVendas,
    refetch: refetchVendas,
  } = useGetVendasQuery(filter, {
    skip: !filter,
  });

  const {
    data: total,
    error: errorTotal,
    isLoading: loadingTotal,
  } = useGetTotalPorPeriodoQuery(filter!, { skip: !filter });

  const [deleteVenda] = useDeleteVendaMutation();

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta venda?')) {
      try {
        await deleteVenda(id).unwrap();
        alert('Venda excluída com sucesso!');
        refetchVendas();
      } catch (err) {
        console.error('Erro ao excluir venda:', err);
        alert('Erro ao excluir venda.');
      }
    }
  };

  const aplicarFiltro = () => {
    if (!inicio || !fim) {
      alert('Selecione as duas datas para filtrar');
      return;
    }
    setFilter({ inicio, fim });
  };

  return (
    <PageContainer>
      <Card>
        <Label>
          Início:
          <Input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
        </Label>

        <Label>
          Fim:
          <Input type="date" value={fim} onChange={(e) => setFim(e.target.value)} />
        </Label>

        <Button onClick={aplicarFiltro}>Buscar</Button>
      </Card>

      {!loadingTotal && !errorTotal && total !== undefined && (
        <InfoText>
          Total de vendas no período: <strong>R$ {total.toFixed(2)}</strong>
        </InfoText>
      )}

      {loadingVendas && <InfoText>Carregando vendas...</InfoText>}

      {!loadingVendas && !errorVendas && (
        <>
          {vendas && vendas.length > 0 ? (
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <Th>ID</Th>
                    <Th>Documento Cliente</Th>
                    <Th>Nome/Razão Social</Th>
                    <Th>Valor Total</Th>
                    <Th>Desconto</Th>
                    <Th>Valor Pago</Th>
                    <Th>Forma Pagamento</Th>
                    <Th>Status</Th>
                    <Th>Data</Th>
                    <Th>Ações</Th>
                  </tr>
                </thead>
                <tbody>
                  {vendas.map((venda: VendaProps) => (
                    <VendaRow key={venda.id} venda={venda} onDelete={handleDelete} />
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          ) : (
            <EmptyMessage>Não há vendas cadastradas no período selecionado.</EmptyMessage>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default SaleList;
