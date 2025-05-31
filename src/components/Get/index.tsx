import Loader from '../Loader/index';
import {
  useGetClientesQuery,
  useDeleteClienteMutation,
} from '../../services/api'
import { Container, Title, Table, Th, Td, DeleteButton,   } from './styles'

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
    return <div><Loader /></div>
  }

  if (error) {
    return <div>Erro ao carregar clientes</div>
  }

  return (
  <Container>
    <Title>Clientes</Title>
    {clientes && clientes.length > 0 ? (
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Nome</Th>
            <Th>Email</Th>
            <Th>Telefone</Th>
            <Th>CPF/CNPJ</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => {
            if (cliente.tipoPessoa === 'FISICA' && cliente.pessoaFisica) {
              const { nome, email, telefone, cpf } = cliente.pessoaFisica;
              return (
                <tr key={cliente.id}>
                  <Td>{cliente.id}</Td>
                  <Td>{nome}</Td>
                  <Td>{email}</Td>
                  <Td>{telefone}</Td>
                  <Td>{cpf}</Td>
                  <Td>
                    <DeleteButton
                      onClick={() => {
                        if (cliente.id !== undefined) {
                          handleDelete(cliente.id);
                        }
                      }}
                    >
                      Excluir
                    </DeleteButton>
                  </Td>
                </tr>
              );
            }

            if (cliente.tipoPessoa === 'JURIDICA' && cliente.pessoaJuridica) {
              const { razaoSocial, email, telefone, cnpj } = cliente.pessoaJuridica;
              return (
                <tr key={cliente.id}>
                  <Td>{cliente.id}</Td>
                  <Td>{razaoSocial}</Td>
                  <Td>{email}</Td>
                  <Td>{telefone}</Td>
                  <Td>{cnpj}</Td>
                  <Td>
                    <DeleteButton
                      onClick={() => {
                        if (cliente.id !== undefined) {
                          handleDelete(cliente.id);
                        }
                      }}
                    >
                      Excluir
                    </DeleteButton>
                  </Td>
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </Table>
    ) : (
      <p>Não há clientes cadastrados.</p>
    )}
  </Container>
)
}

export default GetClientes
