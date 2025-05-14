import { useState } from 'react';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'

import {
  useGetVendasQuery,
  useAddVendaMutation,
  useDeleteVendaMutation,
  useUpdateVendaMutation
} from '../../services/api';
import { VendaProps } from '../../types' // Certifique-se que esse caminho importa o tipo correto

// Tipo do Produto usado dentro de VendaProps
type Produto = {
  id: number;
  nome?: string;
  precoUnitario?: number;
  quantidade: number;
};

const Vendas = () => {
  const { data: vendas, error, isLoading } = useGetVendasQuery();
  const [addVenda] = useAddVendaMutation();
  const [updateVenda] = useUpdateVendaMutation();
  const [deleteVenda] = useDeleteVendaMutation();
  const typedError = error as FetchBaseQueryError | SerializedError

  // Nova venda (omitindo 'id', pois será gerado no backend)
  const [novaVenda, setNovaVenda] = useState<Omit<VendaProps, 'id'>>({
    cliente: '',
    produtos: [{ id: 1, quantidade: 1 }],
    metodoPagamento: 'cartao',
    valorPago: 0,
    totalVenda: 0,
    dataVenda: new Date().toISOString()
  });

  const handleAddVenda = async () => {
    try {
      await addVenda(novaVenda).unwrap();
      setNovaVenda({
        cliente: '',
        produtos: [{ id: 1, quantidade: 1 }],
        metodoPagamento: 'cartao',
        valorPago: 0,
        totalVenda: 0,
        dataVenda: new Date().toISOString()
      });
    } catch (err) {
      console.error('Erro ao adicionar venda:', err);
    }
  };

  return (
    <div>
      <h2>Vendas</h2>

      {isLoading && <p>Carregando...</p>}
      {'status' in typedError || 'message' in typedError ? (
        <p>
          Erro ao carregar vendas:{' '}
          {'status' in typedError
            ? `Status ${typedError.status}`
            : typedError.message ?? 'Erro desconhecido'}
        </p>
      ) : null}
      <ul>
        {Array.isArray(vendas) && vendas.map((venda) => (
          <li key={venda.id}>
            <p><strong>Cliente:</strong> {venda.clienteId}</p>
            <p><strong>Total:</strong> R$ {venda.totalVenda?.toFixed(2)}</p>
            <p><strong>Data:</strong> {new Date(venda.dataVenda).toLocaleDateString()}</p>
            <button onClick={() => updateVenda(venda)}>Atualizar</button>
            <button onClick={() => deleteVenda(venda.id)}>Deletar</button>
          </li>
        ))}
      </ul>

      <h3>Adicionar Nova Venda</h3>
      <input
        type="text"
        value={novaVenda.cliente}
        onChange={(e) => setNovaVenda({ ...novaVenda, cliente: e.target.value })}
        placeholder="Nome do cliente"
      />
      <button onClick={handleAddVenda}>Adicionar Venda</button>
    </div>
  );
};

export default Vendas;
