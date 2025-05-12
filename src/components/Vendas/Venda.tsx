import React, { useState } from 'react'
import {
  useGetVendasQuery,
  useAddVendaMutation,
  useUpdateVendaMutation,
  useDeleteVendaMutation
} from '../../services/api'
import { Venda } from './types' 
import { VendaProps } from '../SaleList'
export type Produto = {
  id: number
  nome: string
  precoUnitario: number
  quantidade: number
}

const Vendas = () => {
  const { data: vendas, error, isLoading } = useGetVendasQuery()
  const [addVenda] = useAddVendaMutation()
  const [updateVenda] = useUpdateVendaMutation()
  const [deleteVenda] = useDeleteVendaMutation()

  const [novaVenda, setNovaVenda] = useState<Omit<Venda, 'id'>>({
    cliente: '',
    produtos: [{ id: 1, quantidade: 1 }],
    metodoPagamento: 'cartao',
    valorPago: 0,
    totalVenda: 0,
    dataVenda: new Date().toISOString()
  })

  const handleAddVenda = () => {
    addVenda(novaVenda)
    setNovaVenda({
      cliente: '',
      produtos: [{ id: 1, quantidade: 1 }],
      metodoPagamento: 'cartao',
      valorPago: 0,
      totalVenda: 0,
      dataVenda: new Date().toISOString()
    })
  }

  return (
    <div>
      <h2>Vendas</h2>

      {isLoading && <p>Carregando...</p>}
      {Boolean(error) && <p>Erro ao carregar vendas</p>}

      <ul>
        {vendas?.map((venda: VendaProps) => (
          <li key={venda.id}>
            <p><strong>Cliente:</strong> {venda.clienteId}</p>
            <p><strong>Total:</strong> R$ {venda.totalVenda.toFixed(2)}</p>
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
  )
}

export default Vendas
