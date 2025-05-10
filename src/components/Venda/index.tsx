import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/reducers'
import { useEffect } from 'react'
import { setCliente, setProdutos } from '../../store/reducers/vendaSlice'
import { useAddVendaMutation } from '../../services/api'
import { Cliente, Produto } from './types'

const Venda = () => {
  const dispatch = useDispatch()

  const cliente: Cliente | null = useSelector((state: RootState) => state.venda.cliente)
  const produtos: Produto[] = useSelector((state: RootState) => state.venda.produtos)

  const [enviarVenda, { isLoading, isSuccess, isError, error }] = useAddVendaMutation()

  useEffect(() => {
    const clienteString = localStorage.getItem('clienteSelecionado')
    const produtosString = localStorage.getItem('produtosSelecionados')

    if (clienteString) {
      dispatch(setCliente(JSON.parse(clienteString)))
    }

    if (produtosString) {
      dispatch(setProdutos(JSON.parse(produtosString)))
    }
  }, [dispatch])

  const total = produtos.reduce((acc, p) => acc + p.precoUnitario * p.quantidade, 0)

  const handleEnviarVenda = async () => {
  if (!cliente || produtos.length === 0) return;

  const dataAtual = new Date().toISOString();

  const payload = {
    venda: {
      documentoCliente: cliente.pessoaFisica?.cpf ?? '',
      itens: produtos.map(p => ({
        produtoId: p.id,
        nomeProduto: p.nome,
        precoUnitario: p.precoUnitario,
        quantidade: p.quantidade,
        totalItem: p.precoUnitario * p.quantidade,
      })),
      totalVenda: total,
      totalDesconto: 0,
      totalPagamento: total,
      formaPagamento: 'DINHEIRO',
      status: 'PAGO',
      numeroParcelas: 1,
    },
    pagamento: {
      formaPagamento: 'DINHEIRO',
      valorPago: total,
      valorRestante: 0,
      dataPagamento: dataAtual,
      status: 'PAGO',
      numeroParcelas: 1,
    },
  };

  try {
    const response: any = await enviarVenda(payload).unwrap();

    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  } catch (e) {
    console.error('Erro ao enviar venda:', e);
  }
}

    return (
      <div>
        <h1>Resumo da Venda</h1>

        <h2>Cliente:</h2>
        {cliente?.pessoaFisica && (
          <div>
            <p><strong>Nome:</strong> {cliente.pessoaFisica.nome}</p>
            <p><strong>CPF:</strong> {cliente.pessoaFisica.cpf}</p>
            <p><strong>Email:</strong> {cliente.pessoaFisica.email}</p>
            <p><strong>Telefone:</strong> {cliente.pessoaFisica.telefone}</p>
            <p><strong>Endereço:</strong> {`${cliente.pessoaFisica.endereco.logradouro}, nº ${cliente.pessoaFisica.endereco.numero} – ${cliente.pessoaFisica.endereco.bairro}, ${cliente.pessoaFisica.endereco.municipio} - ${cliente.pessoaFisica.endereco.uf} – CEP: ${cliente.pessoaFisica.endereco.cep}`}</p>
          </div>
        )}

        <h2>Produtos:</h2>
        <ul>
          {produtos.map((p) => (
            <li key={p.id}>
              {p.nome} - {p.quantidade} x R$ {p.precoUnitario.toFixed(2)} = R$ {(p.quantidade * p.precoUnitario).toFixed(2)}
            </li>
          ))}
        </ul>

        <h3>Total: R$ {total.toFixed(2)}</h3>

        <button onClick={handleEnviarVenda} disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Finalizar Venda'}
        </button>

        {isSuccess && <p style={{ color: 'green' }}>Venda enviada com sucesso!</p>}
        {isError && <p style={{ color: 'red' }}>Erro: {JSON.stringify(error)}</p>}
      </div>
    )
  }

  export default Venda
