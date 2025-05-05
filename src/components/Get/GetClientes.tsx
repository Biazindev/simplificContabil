import {
  useGetClientesQuery,
  useDeleteClienteMutation,
} from '../../services/api'

const GetClientes = () => {
  const { data: clientes, error, isLoading, refetch } = useGetClientesQuery();
  const [deleteCliente] = useDeleteClienteMutation();

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteCliente(id).unwrap();
        alert('Cliente excluído com sucesso!');
        refetch(); // Atualiza a lista
      } catch (err) {
        console.error('Erro ao excluir cliente:', err);
        alert('Erro ao excluir cliente.');
      }
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro ao carregar clientes</div>;
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
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td style={{ padding: '8px' }}>{cliente.id}</td>
                <td style={{ padding: '8px' }}>{cliente.nome || 'N/A'}</td>
                <td style={{ padding: '8px' }}>{cliente.email || 'N/A'}</td>
                <td style={{ padding: '8px' }}>
                  {cliente.pessoaFisica?.telefone ||
                   cliente.pessoaJuridica?.telefone || 'N/A'}
                </td>
                <td style={{ padding: '8px' }}>
                  {cliente.pessoaFisica?.cpf ||
                   cliente.pessoaJuridica?.cnpj || 'N/A'}
                </td>
                <td style={{ padding: '8px' }}>
                  <button
                    onClick={() => handleDelete(cliente.id)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Não há clientes cadastrados.</p>
      )}
    </div>
  );
};

export default GetClientes;
