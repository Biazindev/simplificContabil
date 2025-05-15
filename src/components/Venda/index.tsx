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
  ContainerSpace,
  Form,
  Label,
  Input,
  CheckboxContainer
} from './styles';

const Venda = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cliente: Cliente | null = useSelector((state: RootState) => state.venda.cliente);
  const produtos: Produto[] = useSelector((state: RootState) => state.venda.produtos);

  const [enviarVenda, { isLoading, isSuccess, isError, error }] = useAddVendaMutation();
  const [mostrarEntrega, setMostrarEntrega] = useState(false);
  const [emitirNotaFiscal, setEmitirNotaFiscal] = useState(false);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    const clienteString = localStorage.getItem('clienteSelecionado');
    const produtosString = localStorage.getItem('produtosSelecionados');

    if (clienteString) {
      const parsedCliente = JSON.parse(clienteString);
      dispatch(setCliente(parsedCliente));

      if (parsedCliente?.pessoaFisica) {
        setNome(parsedCliente.pessoaFisica.nome);
        setCpf(parsedCliente.pessoaFisica.cpf);
        setEmail(parsedCliente.pessoaFisica.email);
        setTelefone(parsedCliente.pessoaFisica.telefone);
      }

      if (parsedCliente?.pessoaJuridica) {
        setRazaoSocial(parsedCliente.pessoaJuridica.razaoSocial);
        setCnpj(parsedCliente.pessoaJuridica.cnpj);
        setEmail(parsedCliente.pessoaJuridica.email);
        setTelefone(parsedCliente.pessoaJuridica.telefone);
      }
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

  const handleEmitirNotaFiscal = () => {
    const dataAtual = new Date().toLocaleDateString();

    const clienteNota = {
      tipo: cliente?.pessoaFisica ? 'pf' : 'pj',
      nome,
      cpf,
      dataNascimento: cliente?.pessoaFisica?.dataNascimento ?? '',
      razaoSocial,
      nomeFantasia: cliente?.pessoaJuridica?.nomeFantasia ?? '',
      cnpj,
      email,
      telefone
    };

    const produtosNota = produtos.map(p => ({
      nome: p.nome,
      preco: p.precoUnitario,
      quantidade: p.quantidade
    }));

    const vendaNota = {
      data: dataAtual,
      formaPagamento: 'DINHEIRO',
      total: produtosNota.reduce((acc, p) => acc + p.preco * p.quantidade, 0)
    };

    localStorage.setItem('cliente', JSON.stringify(clienteNota));
    localStorage.setItem('produtos', JSON.stringify(produtosNota));
    localStorage.setItem('venda', JSON.stringify(vendaNota));

    navigate('/nfe', {
      state: {
        cliente: clienteNota,
        produtos: produtosNota,
        venda: vendaNota
      }
    });
  };

  return (
    <Container>
      <Title>Resumo da Venda</Title>

      <SectionTitle>Cliente</SectionTitle>

      {/* Dados do cliente - igual ao original */}
      {cliente?.pessoaFisica && (
        <div>
          <Text><strong>Nome:</strong> {cliente.pessoaFisica.nome}</Text>
          <Text><strong>CPF:</strong> {cliente.pessoaFisica.cpf}</Text>
          <Text><strong>Email:</strong> {cliente.pessoaFisica.email}</Text>
          <Text><strong>Telefone:</strong> {cliente.pessoaFisica.telefone}</Text>
        </div>
      )}

      {cliente?.pessoaJuridica && (
        <div>
          <Text><strong>Razão Social:</strong> {cliente.pessoaJuridica.razaoSocial}</Text>
          <Text><strong>CNPJ:</strong> {cliente.pessoaJuridica.cnpj}</Text>
          <Text><strong>Email:</strong> {cliente.pessoaJuridica.email}</Text>
          <Text><strong>Telefone:</strong> {cliente.pessoaJuridica.telefone}</Text>
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

      <CheckboxContainer>
        <input
          type="checkbox"
          id="emitirNotaFiscal"
          checked={emitirNotaFiscal}
          onChange={() => setEmitirNotaFiscal(!emitirNotaFiscal)}
        />
        <label htmlFor="emitirNotaFiscal">Emitir Nota Fiscal</label>
      </CheckboxContainer>

      {emitirNotaFiscal && (
        <Form>
          <SectionTitle>Nota Fiscal</SectionTitle>

          {cliente?.pessoaFisica && (
            <>
              <Label>Nome</Label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} />
              <Label>CPF</Label>
              <Input value={cpf} onChange={(e) => setCpf(e.target.value)} />
            </>
          )}

          {cliente?.pessoaJuridica && (
            <>
              <Label>Razão Social</Label>
              <Input value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} />
              <Label>CNPJ</Label>
              <Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
            </>
          )}

          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />

          <Label>Telefone</Label>
          <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} />

          <ContainerButton>
            <Button onClick={handleEmitirNotaFiscal}>Emitir Nota</Button>
          </ContainerButton>
        </Form>
      )}

      <ContainerSpace>
        <ContainerButton>
          <Button onClick={handleEnviarVenda} disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Finalizar Venda'}
          </Button>
        </ContainerButton>
        <ContainerButton>
          <Button onClick={handleAbrirEntrega}>Entrega</Button>
        </ContainerButton>
      </ContainerSpace>

      {isSuccess && <SuccessMessage>Venda enviada com sucesso!</SuccessMessage>}
      {isError && <ErrorMessage>Erro: {JSON.stringify(error)}</ErrorMessage>}
    </Container>
  );
};

export default Venda;
