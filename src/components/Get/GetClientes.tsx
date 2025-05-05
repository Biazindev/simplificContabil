import React from 'react'
import { useGetClientesQuery } from '../../services/api'

const GetClientes = () => {
  const { data: clientes, error, isLoading } = useGetClientesQuery()

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (error) {
    return <div>Erro ao carregar clientes</div>
  }

  // Função para filtrar clientes válidos
  const filtrarClientesValidos = (clientes: any[]) => {
    return clientes.filter((cliente) => {
      if (!cliente.valid) return false

      if (cliente.pessoaFisica) {
        const { cpf, nome, telefone } = cliente.pessoaFisica
        return cpf && nome && telefone
      }

      if (cliente.pessoaJuridica) {
        const { cnpj, nomeFantasia } = cliente.pessoaJuridica
        return cnpj && nomeFantasia
      }

      return false
    })
  }

  const clientesValidos = clientes ? filtrarClientesValidos(clientes) : []

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lista de Clientes Válidos</h1>
      {clientesValidos.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Nome</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Email</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Telefone</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>CPF/CNPJ</th>
            </tr>
          </thead>
          <tbody>
            {clientesValidos.map((cliente) => (
              <tr key={cliente.id}>
                <td style={{ padding: '8px' }}>{cliente.nome}</td>
                <td style={{ padding: '8px' }}>{cliente.email}</td>
                <td style={{ padding: '8px' }}>
                  {cliente.pessoaFisica?.telefone ?? 'N/A'}
                </td>
                <td style={{ padding: '8px' }}>
                  {cliente.pessoaFisica
                    ? `CPF: ${cliente.pessoaFisica.cpf}`
                    : cliente.pessoaJuridica
                    ? `CNPJ: ${cliente.pessoaJuridica.cnpj}`
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Não há clientes válidos cadastrados</p>
      )}
    </div>
  )
}

export default GetClientes
