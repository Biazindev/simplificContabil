import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/reducers';
import { useEffect, useState } from 'react';
import { setCliente, setProdutos } from '../../store/reducers/vendaSlice';
import { useAddVendaMutation } from '../../services/api';
import { Cliente, Produto } from './types';
import {
  Container,
  SectionTitle,
  Title,
  Text,
  ProdutoItem,
  Total,
  Button,
  SuccessMessage,
  ErrorMessage,
  ContainerButton,
  ContainerSpace
} from './styles';
import Delivery from '../Delivery';

const Venda = () => {
  const dispatch = useDispatch();

  const cliente: Cliente | null = useSelector((state: RootState) => state.venda.cliente);
  const produtos: Produto[] = useSelector((state: RootState) => state.venda.produtos);

  const [enviarVenda, { isLoading, isSuccess, isError, error }] = useAddVendaMutation();
  const [mostrarEntrega, setMostrarEntrega] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const clienteString = localStorage.getItem('clienteSelecionado');
    const produtosString = localStorage.getItem('produtosSelecionados');

    if (clienteString) {
      dispatch(setCliente(JSON.parse(clienteString)));
    }

    if (produtosString) {
      dispatch(setProdutos(JSON.parse(produtosString)));
    }
  }, [dispatch]);

  const total = produtos.reduce((acc, p) => acc + p.precoUnitario * p.quantidade, 0);

  const handleEnviarVenda = async () => {
    if (!cliente || produtos.length === 0) return;

    const dataAtual = new Date().toISOString();

    const payload = {
      venda: {
        documentoCliente: cliente.pessoaFisica?.cpf ?? cliente.pessoaJuridica?.cnpj ?? '',
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
  };

  const handleAbrirEntrega = () => {
    if (cliente && produtos.length > 0) {
      navigate('/delivery', {
        state: { cliente, produtos, total }
      });
    }
  };
  return (
    <Container>
      <Title>Resumo da Venda</Title>

      <SectionTitle>Cliente</SectionTitle>

      {cliente?.pessoaFisica && (
        <div>
          <Text><strong>Nome:</strong> {cliente.pessoaFisica.nome}</Text>
          <Text><strong>CPF:</strong> {cliente.pessoaFisica.cpf}</Text>
          <Text><strong>Email:</strong> {cliente.pessoaFisica.email}</Text>
          <Text><strong>Telefone:</strong> {cliente.pessoaFisica.telefone}</Text>
          <Text>
            <strong>Endereço:</strong>{' '}
            {`${cliente.pessoaFisica.endereco.logradouro}, nº ${cliente.pessoaFisica.endereco.numero} – ${cliente.pessoaFisica.endereco.bairro}, ${cliente.pessoaFisica.endereco.municipio} - ${cliente.pessoaFisica.endereco.uf} – CEP: ${cliente.pessoaFisica.endereco.cep}`}
          </Text>
        </div>
      )}

      {cliente?.pessoaJuridica && (
        <div>
          <Text><strong>Razão Social:</strong> {cliente.pessoaJuridica.razaoSocial}</Text>
          <Text><strong>CNPJ:</strong> {cliente.pessoaJuridica.cnpj}</Text>
          <Text><strong>Email:</strong> {cliente.pessoaJuridica.email}</Text>
          <Text><strong>Telefone:</strong> {cliente.pessoaJuridica.telefone}</Text>
          <Text>
            <strong>Endereço:</strong>{' '}
            {`${cliente.pessoaJuridica.endereco.logradouro}, nº ${cliente.pessoaJuridica.endereco.numero} – ${cliente.pessoaJuridica.endereco.bairro}, ${cliente.pessoaJuridica.endereco.municipio} - ${cliente.pessoaJuridica.endereco.uf} – CEP: ${cliente.pessoaJuridica.endereco.cep}`}
          </Text>
        </div>
      )}

      <SectionTitle>Produtos</SectionTitle>
      <ul>
        {produtos.map((p) => (
          <ProdutoItem key={p.id}>
            {p.nome} - {p.quantidade} x R$ {p.precoUnitario.toFixed(2)} = R$ {(p.quantidade * p.precoUnitario).toFixed(2)}
          </ProdutoItem>
        ))}
      </ul>

      <Total>Total: R$ {total.toFixed(2)}</Total>
      <ContainerSpace>
        <ContainerButton>
          <Button onClick={handleEnviarVenda} disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Finalizar Venda'}
          </Button>
        </ContainerButton>
        <ContainerButton>
          <Button onClick={handleEnviarVenda} disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Nota Fiscal'}
          </Button>
        </ContainerButton>
        <ContainerButton>
          <Button onClick={handleAbrirEntrega}>
            Entrega
          </Button>
        </ContainerButton>
      </ContainerSpace>

      {isSuccess && <SuccessMessage>Venda enviada com sucesso!</SuccessMessage>}
      {isError && <ErrorMessage>Erro: {JSON.stringify(error)}</ErrorMessage>}

      {mostrarEntrega && cliente && produtos.length > 0 && (
        navigate('/delivery', {
          state: {
            cliente,
            produtos,
            total,
          },
        })
      )}

    </Container>
  );
};

export default Venda;
