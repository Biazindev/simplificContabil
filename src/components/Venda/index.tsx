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


export interface EmitirNotaPayload {
  emitirNotaFiscal: boolean;
  documentoCliente: string;
  cliente: ClientePayload | null;
  emitente: Emitente;
  modelo: string | null;
  itens: ItemVenda[];
  totalVenda: number;
  totalDesconto: number;
  totalPagamento: number;
  formaPagamento: string;
  dataVenda: string; // ISO: ex. "2025-05-17T17:06:20.770Z"
  status: string;    // ex. "PAGO"
  numeroParcelas: number;
  pagamento: Pagamento;
}
export interface ClientePayload {
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
}

export interface Endereco {
  logradouro: string;
  numero: string;
  bairro: string;
  cep: string;
  codigoIbge?: string;
  uf: string;
}

export interface ItemVenda {
  produtoId: number;
  nomeProduto: string;
  precoUnitario: number;
  quantidade: number;
}

export interface Pagamento {
  formaPagamento: string;
  valorPago: number;
  valorRestante: number;
  status: string;         // ex. "PAGO"
  numeroParcelas: number;
}

export interface Emitente {
  razaoSocial: string;
  nomeFantasia: string;
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
  const [dataNascimento, setDataNascimento] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cep, setCep] = useState('');
  const [uf, setUf] = useState('');
  const [enviarNota, { isLoading: isLoadingNota, isSuccess: isSuccessNota, isError: isErrorNota, error: errorNota }] = useAddNfeMutation();
  const [respostaNota, setRespostaNota] = useState<string | null>(null);

  const emitente = {
    nome: "Biazin Sistemas LTDA",
    nomeFantasia: "Biazin Sistemas",
    cnpj: "47397316000122",
    razaoSocial: 'Biazin&Biazin',
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
        setDataNascimento(parsedCliente.dataNascimento || '');

        const end = parsedCliente.endereco || {};
        setLogradouro(end.logradouro || '');
        setNumero(end.numero || '');
        setBairro(end.bairro || '');
        setCep(end.cep || '');
        setUf(end.uf || '');
      }

      if (parsedCliente?.pessoaJuridica) {
        setRazaoSocial(parsedCliente.pessoaJuridica.razaoSocial)
        setNomeFantasia(parsedCliente.nomeFantasia)
        setCnpj(parsedCliente.pessoaJuridica.cnpj)
        setEmail(parsedCliente.pessoaJuridica.email)
        setTelefone(parsedCliente.pessoaJuridica.telefone)

        const end = parsedCliente.endereco || {};
        setLogradouro(end.logradouro || '');
        setNumero(end.numero || '');
        setBairro(end.bairro || '');
        setCep(end.cep || '');
        setUf(end.uf || '');
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

    const payload: EmitirNotaPayload = {
      emitirNotaFiscal: false,
      documentoCliente,
      cliente: cliente && {
        pessoaFisica: cliente.pessoaFisica && {
          nome: cliente.pessoaFisica.nome,
          cpf: cliente.pessoaFisica.cpf,
          email: cliente.pessoaFisica.email,
          telefone: cliente.pessoaFisica.telefone,
          dataNascimento: cliente.pessoaFisica.dataNascimento,
          endereco: {
            logradouro: cliente.pessoaFisica.endereco.logradouro,
            numero: cliente.pessoaFisica.endereco.numero,
            bairro: cliente.pessoaFisica.endereco.bairro,
            cep: cliente.pessoaFisica.endereco.cep,
            codigoIbge: "4127205",
            uf: cliente.pessoaFisica.endereco.uf
          }
        },
        pessoaJuridica: cliente.pessoaJuridica && {
          razaoSocial: cliente.pessoaJuridica.razaoSocial,
          nomeFantasia: cliente.pessoaJuridica.nomeFantasia,
          cnpj: cliente.pessoaJuridica.cnpj,
          email: cliente.pessoaJuridica.email,
          telefone: cliente.pessoaJuridica.telefone,
          endereco: {
            logradouro: cliente.pessoaJuridica.endereco.logradouro,
            numero: cliente.pessoaJuridica.endereco.numero,
            bairro: cliente.pessoaJuridica.endereco.bairro,
            cep: cliente.pessoaJuridica.endereco.cep,
            codigoIbge: "4127205",
            uf: cliente.pessoaJuridica.endereco.uf
          }
        }
      },
      modelo: "NFCE", // ou "NFE", dependendo da sua configuração
      itens: produtos.map((p) => ({
        produtoId: p.id,
        nomeProduto: p.nome,
        precoUnitario: p.precoUnitario,
        quantidade: p.quantidade
      })),
      totalVenda: total,
      totalDesconto: 0.00,
      totalPagamento: total,
      formaPagamento: "DINHEIRO",
      dataVenda: new Date().toISOString(),
      status: "PAGO",
      numeroParcelas: 1,
      pagamento: {
        formaPagamento: "DINHEIRO",
        valorPago: total,
        valorRestante: 0,
        status: "PAGO",
        numeroParcelas: 1
      },
      emitenteId: 1,
    }
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
  emitirNotaFiscal: false,
  documentoCliente,
  cliente: cliente && {
    pessoaFisica: cliente.pessoaFisica && {
      nome: cliente.pessoaFisica.nome,
      cpf: cliente.pessoaFisica.cpf,
      email: cliente.pessoaFisica.email,
      telefone: cliente.pessoaFisica.telefone,
      dataNascimento: cliente.pessoaFisica.dataNascimento,
      endereco: {
        logradouro: cliente.pessoaFisica.endereco.logradouro,
        numero: cliente.pessoaFisica.endereco.numero,
        bairro: cliente.pessoaFisica.endereco.bairro,
        cep: cliente.pessoaFisica.endereco.cep,
        codigoIbge: "4127205",
        uf: cliente.pessoaFisica.endereco.uf
      }
    },
    pessoaJuridica: cliente.pessoaJuridica && {
      razaoSocial: cliente.pessoaJuridica.razaoSocial,
      nomeFantasia: cliente.pessoaJuridica.nomeFantasia,
      cnpj: cliente.pessoaJuridica.cnpj,
      email: cliente.pessoaJuridica.email,
      telefone: cliente.pessoaJuridica.telefone,
      endereco: {
        logradouro: cliente.pessoaJuridica.endereco.logradouro,
        numero: cliente.pessoaJuridica.endereco.numero,
        bairro: cliente.pessoaJuridica.endereco.bairro,
        cep: cliente.pessoaJuridica.endereco.cep,
        codigoIbge: "4127205",
        uf: cliente.pessoaJuridica.endereco.uf
      }
    }
  },
  itens: produtos.map((p) => ({
    produtoId: p.id,
    nomeProduto: p.nome,
    precoUnitario: p.precoUnitario,
    quantidade: p.quantidade
  })),
  totalVenda: total,
  totalDesconto: 0.0,
  totalPagamento: total,
  formaPagamento: "DINHEIRO",
  dataVenda: new Date().toISOString(),
  status: "PAGO",
  numeroParcelas: 1,
  emitente: { id: 1 } // Se `emitente` é uma entidade, ou só: emitenteId: 1
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
              <Label>Data de Nascimento</Label>
              <Input
                type="date"
                value={dataNascimento || ''}
                onChange={(e) => setDataNascimento(e.target.value)}
              />
            </>
          )}

          {cliente?.pessoaJuridica && (
            <>
              <Label>Razão Social</Label>
              <Input value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} />
              <Label>Nome Fantasia</Label>
              <Input
                value={nomeFantasia}
                onChange={(e) => setNomeFantasia(e.target.value)}
              />
              <Label>CNPJ</Label>
              <Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
            </>
          )}

          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />

          <Label>Telefone</Label>
          <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} />

          {/* Endereço (comum a ambos tipos) */}
          <Label>Logradouro</Label>
          <Input value={logradouro} onChange={(e) => setLogradouro(e.target.value)} />

          <Label>Número</Label>
          <Input value={numero} onChange={(e) => setNumero(e.target.value)} />

          <Label>Bairro</Label>
          <Input value={bairro} onChange={(e) => setBairro(e.target.value)} />

          <Label>CEP</Label>
          <Input value={cep} onChange={(e) => setCep(e.target.value)} />

          <Label>UF</Label>
          <Input value={uf} onChange={(e) => setUf(e.target.value)} />

          {/* Emitente - dados fixos, mas pode adicionar se quiser */}
          <SectionTitle>Emitente</SectionTitle>
          <Label>Razão Social</Label>
          <Input value={emitente.razaoSocial} readOnly />

          <Label>Nome Fantasia</Label>
          <Input value={emitente.nomeFantasia} readOnly />

          <Label>CNPJ</Label>
          <Input value={emitente.cnpj} readOnly />

          <Label>Inscrição Estadual</Label>
          <Input value={emitente.inscricaoEstadual} readOnly />
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
