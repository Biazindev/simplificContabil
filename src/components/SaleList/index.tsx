import {
  useGetVendasQuery,
  useDeleteVendaMutation,
  useGetClienteByDocumentoQuery,
} from '../../services/api';
import {
  Button,
  Card,
  PageContainer,
  Title,
} from '../PDV/styles';

import {
  Table,
  Th,
  Td,
  EmptyMessage,
  TableContainer,
  TableActions,
} from './styles';

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
  onDelete: (id: number) => void;
};

const VendaRow = ({ venda, onDelete }: VendaRowProps) => {
  const { data: cliente } = useGetClienteByDocumentoQuery(venda.documentoCliente);

  const nomeOuRazaoSocial =
    cliente?.pessoaFisica?.nome ??
    cliente?.pessoaJuridica?.razaoSocial ??
    '—';

  return (
    <tr key={venda.id}>
      <Td>{venda.id}</Td>
      <Td>{venda.documentoCliente}</Td>
      <Td>{nomeOuRazaoSocial}</Td>
      <Td>R$ {venda.totalVenda?.toFixed(2)}</Td>
      <Td>R$ {venda.totalDesconto?.toFixed(2)}</Td>
      <Td>R$ {venda.totalPagamento?.toFixed(2)}</Td>
      <Td>{venda.formaPagamento}</Td>
      <Td>{venda.status}</Td>
      <Td>{new Date(venda.dataVenda).toLocaleString('pt-BR')}</Td>
    </tr>
  );
};

const SaleList = () => {
  const { data: vendas, error, isLoading, refetch } = useGetVendasQuery();
  const [deleteVenda] = useDeleteVendaMutation();

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta venda?')) {
      try {
        await deleteVenda(id).unwrap();
        alert('Venda excluída com sucesso!');
        refetch();
      } catch (err) {
        console.error('Erro ao excluir venda:', err);
        alert('Erro ao excluir venda.');
      }
    }
  };

  return (
    <PageContainer>
      {isLoading && <p>Carregando...</p>}
      {!isLoading && !error && (
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
                  </tr>
                </thead>
                <tbody>
                  {vendas?.map((venda: VendaProps) => (
                    <VendaRow key={venda.id} venda={venda} onDelete={handleDelete} />
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          ) : (
            <EmptyMessage>Não há vendas cadastradas.</EmptyMessage>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default SaleList;
