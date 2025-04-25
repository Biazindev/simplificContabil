import React, { useState } from 'react'
import { useGetVendasQuery, useAddVendaMutation, useUpdateVendaMutation, useDeleteVendaMutation } from '../../services/api'

const Vendas = () => {
  const { data: vendas, error, isLoading } = useGetVendasQuery()
  const [addVenda] = useAddVendaMutation()
  const [updateVenda] = useUpdateVendaMutation()
  const [deleteVenda] = useDeleteVendaMutation()

  const [novaVenda, setNovaVenda] = useState({
    cliente: '',
    produtos: [{ id: 1, quantidade: 1 }], 
    metodoPagamento: 'cartao',
    valorPago: 0,
    totalVenda: 0,
    dataVenda: new Date().toISOString()
  })

  const handleAddVenda = async () => {
    try {
      await addVenda(novaVenda)
    } catch (err) {
      console.error('Erro ao adicionar venda:', err)
    }
  }

  const handleUpdateVenda = async (vendaId: number) => {
    try {
      const vendaAtualizada = { ...novaVenda, id: vendaId }
      await updateVenda(vendaAtualizada)
    } catch (err) {
      console.error('Erro ao atualizar venda:', err)
    }
  }

  const handleDeleteVenda = async (vendaId: number) => {
    try {
      await deleteVenda(vendaId)
    } catch (err) {
      console.error('Erro ao deletar venda:', err)
    }
  }

  return (
    <div>
      <h2>Vendas</h2>
      {isLoading && <p>Carregando...</p>}
      {error && <p>Erro ao carregar vendas</p>}
      <ul>
        {vendas && vendas.map((venda) => (
          <li key={venda.id}>
            <p>Cliente: {venda.cliente}</p>
            <p>Total: R${venda.totalVenda}</p>
            <p>Data: {venda.dataVenda}</p>
            <button onClick={() => handleUpdateVenda(venda.id)}>Atualizar</button>
            <button onClick={() => handleDeleteVenda(venda.id)}>Deletar</button>
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
