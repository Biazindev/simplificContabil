import {
  useGetClientesQuery,
  useDeleteClienteMutation,
} from '../../services/api'

const GetClientes = () => {
  const { data: clientes, error, isLoading, refetch } = useGetClientesQuery()
  const [deleteCliente] = useDeleteClienteMutation()

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteCliente(id).unwrap()
        alert('Cliente excluído com sucesso!')
        refetch()
      } catch (err) {
        console.error('Erro ao excluir cliente:', err)
        alert('Erro ao excluir cliente.')
      }
    }
  }

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (error) {
    return <div>Erro ao carregar clientes</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Todos os Clientes (incluindo inválidos)</h1>
      {clientes && clientes.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>ID</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Nome</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Email</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Telefone</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>CPF/CNPJ</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => {
              if (cliente.tipoPessoa === 'FISICA' && cliente.pessoaFisica) {
                const { nome, email, telefone, cpf } = cliente.pessoaFisica;
                return (
                  <tr key={cliente.id}>
                    <td>{cliente.id}</td>
                    <td>{nome}</td>
                    <td>{email}</td>
                    <td>{telefone}</td>
                    <td>{cpf}</td>
                    <td>
                      <button
                        onClick={() => {
                          if (cliente.id !== undefined) {
                            handleDelete(cliente.id);
                          }
                        }}
                      >
                        Excluir
                      </button>

                    </td>
                  </tr>
                );
              }

              if (cliente.tipoPessoa === 'JURIDICA' && cliente.pessoaJuridica) {
                const {
                  razaoSocial,
                  email,
                  telefone,
                  cnpj,
                } = cliente.pessoaJuridica;
                return (
                  <tr key={cliente.id}>
                    <td>{cliente.id}</td>
                    <td>{razaoSocial}</td>
                    <td>{email}</td>
                    <td>{telefone}</td>
                    <td>{cnpj}</td>
                    <td>
                      <button
                        onClick={() => {
                          if (cliente.id !== undefined) {
                            handleDelete(cliente.id);
                          }
                        }}
                      >
                        Excluir
                      </button>

                    </td>
                  </tr>
                );
              }

              return null
            })}
          </tbody>

        </table>
      ) : (
        <p>Não há clientes cadastrados.</p>
      )}
    </div>
  )
}

export default GetClientes
