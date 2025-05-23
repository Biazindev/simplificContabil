import { Button, DeleteButton, Td } from "../../SaleList/styles";
import { VendaProps } from "../../SaleList/index";
import { PencilLine, Trash2 } from "lucide-react";

type VendaRowProps = {
  venda: VendaProps;
  onDelete: (id: number) => void | Promise<void>;
  onEdit: (venda: VendaProps) => void;
};

const VendaRow = ({ venda, onDelete, onEdit }: VendaRowProps) => {
  const totalVenda = venda.pagamento?.totalVenda ?? venda.totalVenda ?? 0;
  const totalDesconto = venda.pagamento?.totalDesconto ?? venda.totalDesconto ?? 0;
  const totalPagamento = venda.pagamento?.totalPagamento ?? venda.totalPagamento ?? 0;
  const formaPagamento = venda.pagamento?.formaPagamento ?? venda.formaPagamento ?? 'N/A';
  const documentoCliente = venda.documentoCliente ?? 'Venda Anônima';

  return (
    <tr>
      <Td>{venda.id}</Td>
      <Td>{documentoCliente}</Td>
      <Td>{/* Nome do cliente, se necessário */}</Td>
      <Td>R$ {totalVenda.toFixed(2)}</Td>
      <Td>R$ {totalDesconto.toFixed(2)}</Td>
      <Td>R$ {totalPagamento.toFixed(2)}</Td>
      <Td>{formaPagamento}</Td>
      <Td>{venda.status}</Td>
      <Td>{new Date(venda.dataVenda).toLocaleString('pt-BR')}</Td>
      <Td style={{ display: 'flex', gap: '0.5rem' }}>
        <Button onClick={() => onEdit(venda)}>
          <PencilLine size={16} />
        </Button>
        <DeleteButton onClick={() => onDelete(venda.id)}>
          <Trash2 size={16} />
        </DeleteButton>
      </Td>
    </tr>
  );
};

export default VendaRow