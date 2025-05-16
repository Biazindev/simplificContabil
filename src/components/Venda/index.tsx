import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/reducers';
import { useEffect, useState } from 'react';
import { setCliente, setProdutos } from '../../store/reducers/vendaSlice';
import { useAddVendaMutation, useAddNfeMutation } from '../../services/api';
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
import { ItemVenda } from '../../types';

export interface EmitirNotaPayload {
  emitirNotaFiscal: boolean;
  documentoCliente: string;
  cliente: {
    tipoPessoa: 'FISICA' | 'JURIDICA';
    pessoaFisica?: {
      nome: string;
      cpf: string;
      email: string;
      telefone: string;
      dataNascimento: string;
      endereco: Endereco;
    };
    pessoaJuridica?: {
      razaoSocial: string;
      nomeFantasia: string;
      cnpj: string;
      email: string;
      telefone: string;
      endereco: Endereco;
    };
  };
  emitente: {
    razaoSocial: string;
    nomeFantasia: string;
    cnpj: string;
    inscricaoEstadual: string;
    endereco: Endereco;
  };
  itens: ItemVenda[];
  totalVenda: number;
  totalDesconto: number;
  totalPagamento: number;
  formaPagamento: string;
  dataVenda: string;
  status: string;
  numeroParcelas: number;
}

export interface Endereco {
  logradouro: string;
  numero: string;
  bairro: string;
  cep: string;
  codigoIbge?: string;
  uf: string;
}

export interface Emitente {
  nome: string;
  nomeFantasia?: string;
  cnpj: string;
  inscricaoEstadual: string;
  endereco: Endereco;
}

const Venda = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const cliente: Cliente | null = useSelector((state: RootState) => state.venda.cliente);
  const produtos: Produto[] = useSelector((state: RootState) => state.venda.produtos);

  const [enviarVenda, { isLoading, isSuccess, isError, error }] = useAddVendaMutation();
  const [emitirNotaFiscal, setEmitirNotaFiscal] = useState(false);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [enviarNota, { isLoading: isLoadingNota, isSuccess: isSuccessNota, isError: isErrorNota, error: errorNota }] = useAddNfeMutation();
  const [respostaNota, setRespostaNota] = useState<string | null>(null);

  const emitente = {
    nome: "Biazin Sistemas LTDA",
    nomeFantasia: "Biazin Sistemas",
    cnpj: "47397316000122",
    inscricaoEstadual: "ISENTO",
    endereco: {
      logradouro: "Rua Belluno",
      numero: "50",
      bairro: "Tartarelli",
      cep: "87240000",
      codigoIbge: "4127205",
      uf: "PR"
    }
  };

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
    if (!cliente) {
      console.error("Cliente não informado.");
      return;
    }

    if (produtos.length === 0) {
      console.error("Nenhum produto adicionado.");
      return;
    }

    const documentoCliente = cliente.pessoaFisica?.cpf ?? cliente.pessoaJuridica?.cnpj;

    if (!documentoCliente) {
      console.error("Documento do cliente está ausente.");
      return;
    }

    const dataVenda = new Date().toISOString();

    const totalVenda = produtos.reduce(
      (total, produto) => total + produto.precoUnitario * produto.quantidade,
      0
    );

    const payload = {
      emitirNotaFiscal: false,
      documentoCliente,
      cliente: null,
      emitenteId: null,
      modelo: null,
      itens: produtos.map((p) => ({
        produtoId: p.id,
        nomeProduto: p.nome,
        precoUnitario: p.precoUnitario,
        quantidade: p.quantidade
      })),
      pagamento: {
        formaPagamento: "DINHEIRO",
        valorPago: totalVenda,
        valorRestante: 0.00,
        status: "PAGO",
        numeroParcelas: 1
      },
      totalVenda,
      totalDesconto: 0.00,
      totalPagamento: totalVenda,
      formaPagamento: "DINHEIRO",
      dataVenda,
      status: "PAGO",
      numeroParcelas: 1
    };

    try {
      const response: any = await enviarVenda(payload).unwrap();
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (e) {
      console.error("Erro ao enviar venda:", e);
    }
  };


  const handleAbrirEntrega = () => {
    if (cliente && produtos.length > 0) {
      navigate('/delivery', {
        state: { cliente, produtos, total }
      });
    }
  };

  const handleEmitirNotaFiscal = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!cliente || produtos.length === 0) return;

    const dataVenda = new Date().toISOString();
    const documentoCliente = cliente.pessoaFisica?.cpf ?? cliente.pessoaJuridica?.cnpj ?? '';

    const payload: EmitirNotaPayload = {
      emitirNotaFiscal,
      documentoCliente,
      cliente: {
        tipoPessoa: cliente.pessoaFisica ? 'FISICA' : 'JURIDICA',
        ...(cliente.pessoaFisica && {
          pessoaFisica: {
            nome: cliente.pessoaFisica.nome,
            cpf: cliente.pessoaFisica.cpf,
            email: cliente.pessoaFisica.email,
            telefone: cliente.pessoaFisica.telefone,
            dataNascimento: cliente.pessoaFisica.dataNascimento,
            endereco: {
              logradouro: cliente.pessoaFisica.endereco.logradouro,
              numero: cliente.pessoaFisica.endereco.numero,
              bairro: cliente.pessoaFisica.endereco.bairro,
              cep: "87240000",
              codigoIbge: "4127205",
              uf: "PR"
            }
          }
        }),
        ...(cliente.pessoaJuridica && {
          pessoaJuridica: {
            razaoSocial: cliente.pessoaJuridica.razaoSocial,
            nomeFantasia: cliente.pessoaJuridica.nomeFantasia,
            cnpj: cliente.pessoaJuridica.cnpj,
            email: cliente.pessoaJuridica.email,
            telefone: cliente.pessoaJuridica.telefone,
            endereco: {
              logradouro: "Rua Exemplo",
              numero: "100",
              bairro: "Centro",
              cep: "87240000",
              codigoIbge: "4127205",
              uf: "PR"
            }
          }
        })
      },
      emitente: {
        razaoSocial: emitente.nome,
        nomeFantasia: emitente.nomeFantasia ?? emitente.nome,
        cnpj: emitente.cnpj,
        inscricaoEstadual: emitente.inscricaoEstadual,
        endereco: emitente.endereco
      },
      itens: produtos.map((p) => ({
        produto: {
          id: p.id,
          nome: p.nome,
          descricao: p.nome,
          ncm: "21069090",
          precoUnitario: p.precoUnitario
        },
        nomeProduto: p.nome,
        precoUnitario: p.precoUnitario,
        quantidade: p.quantidade,
        totalItem: p.precoUnitario * p.quantidade
      })),
      totalVenda: total,
      totalDesconto: 0.00,
      totalPagamento: total,
      formaPagamento: "DINHEIRO",
      dataVenda,
      status: "PAGO",
      numeroParcelas: 1
    };

    try {
      const resposta = await enviarNota(payload).unwrap();
      setRespostaNota(JSON.stringify(resposta, null, 2));
    } catch (e) {
      console.error('Erro ao emitir nota fiscal:', e);
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
        <label htmlFor="emitirNotaFiscal">
          <div className="switch">
            <input
              type="checkbox"
              id="emitirNotaFiscal"
              checked={emitirNotaFiscal}
              onChange={() => setEmitirNotaFiscal(!emitirNotaFiscal)}
            />
            <span className="slider" />
          </div>
          Emitir Nota Fiscal
        </label>
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
            <Button type="button" onClick={handleEmitirNotaFiscal}>Emitir Nota</Button>
            {isLoadingNota && <Text>Emitindo nota...</Text>}
            {isSuccessNota && respostaNota && (
              <SuccessMessage>Nota emitida com sucesso: <pre>{respostaNota}</pre></SuccessMessage>
            )}
            {isErrorNota && (
              <ErrorMessage>Erro ao emitir nota: {JSON.stringify(errorNota)}</ErrorMessage>
            )}
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
