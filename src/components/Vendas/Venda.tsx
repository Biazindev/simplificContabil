import React, { useState } from 'react'
import {
  useGetVendasQuery,
  useAddVendaMutation,
  useUpdateVendaMutation,
  useDeleteVendaMutation
} from '../../services/api'

const Vendas = () => {
  const { data: vendas, error, isLoading } = useGetVendasQuery()
  const [addVenda] = useAddVendaMutation()
  const [updateVenda] = useUpdateVendaMutation()
  const [deleteVenda] = useDeleteVendaMutation()

  const [novaVenda, setNovaVenda] = useState({
    cliente: '', produtos: [{ id: 1, quantidade: 1 }],
    metodoPagamento: 'cartao', valorPago: 0,
    totalVenda: 0, dataVenda: new Date().toISOString()
  })

  // ... handlers (sem alterações) ...

  return (
    <div>
      <h2>Vendas</h2>
      {/* renderização corrigida */}
      {isLoading ? (
        <p>Carregando...</p>
      ) : !!error ? (
        <p>Erro ao carregar vendas</p>
      ) : null}

      <ul>
        {vendas?.map((venda) => (
          <li key={venda.id}>
            <p>Cliente: {venda.cliente}</p>
            <p>Total: R${venda.totalVenda}</p>
            <p>Data: {venda.dataVenda}</p>
            <button onClick={() => updateVenda({ ...venda })}>Atualizar</button>
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
      <button onClick={() => addVenda(novaVenda)}>Adicionar Venda</button>
    </div>
  )
}

export default Vendas
