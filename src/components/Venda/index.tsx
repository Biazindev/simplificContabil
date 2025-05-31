import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/reducers';
import { useEffect, useState } from 'react';
import { setCliente, setProdutos } from '../../store/reducers/vendaSlice';
import { useAddVendaMutation } from '../../services/api';
import { Cliente, EmitirNotaPayloadPf } from './types';
import { Produto } from '../../store/reducers/vendaSlice';
import {
  Container,
  SectionTitle,
  Title,
  TextForm,
  ProdutoItem,
  Total,
  Button,
  SuccessMessage,
  ErrorMessage,
  ContainerButton,
  ContainerSpace,
  CheckboxContainer
} from './styles';
import NfContainer from '../NotaFiscal';
import Loader from '../Loader';

interface EmitirNotaButtonProps {
  vendaId: string;
  statusVenda: 'pendente' | 'concluida' | 'cancelada';
}

const Venda = ({ vendaId, statusVenda }: EmitirNotaButtonProps) => {
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
  const [vendaConcluida, setVendaConcluida] = useState(statusVenda === 'concluida');
  const isVendaConcluida = vendaConcluida;


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
        setRazaoSocial(parsedCliente.pessoaJuridica.razaoSocial);
        setNomeFantasia(parsedCliente.nomeFantasia);
        setCnpj(parsedCliente.pessoaJuridica.cnpj);
        setEmail(parsedCliente.pessoaJuridica.email);
        setTelefone(parsedCliente.pessoaJuridica.telefone);

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

  const total = produtos.reduce(
    (acc, p) => acc + p.precoUnitario * p.quantidade,
    0
  );


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

    const payload: EmitirNotaPayloadPf = {
      emitirNotaFiscal: true,
      documentoCliente: "60648632573",
      cliente: {
        tipoPessoa: "FISICA",
        pessoaFisica: {
          nome: "Lucas Cliente",
          cpf: "60648632573",
          email: "lucas@email.com",
          telefone: "44999999999",
          dataNascimento: "1990-01-01",
          endereco: {
            cep: "87240000",
            bairro: "Centro",
            municipio: "Terra Boa",
            logradouro: "Rua das Rosas",
            numero: "123",
            uf: "PR",
            complemento: "Apto 101",
            codigoIbge: "4127205"
          }
        },
        pessoaJuridica: null
      },
      emitenteId: 1,
      modelo: "NFE",
      itens: [
        {
          produtoId: 1,
          nomeProduto: "Pizza Calabresa",
          precoUnitario: 40.0,
          quantidade: 1,
          totalItem: 40.0
        },
        {
          produtoId: 2,
          nomeProduto: "Coca-Cola 2L",
          precoUnitario: 10.0,
          quantidade: 1,
          totalItem: 10.0
        }
      ],
      pagamento: {
        formaPagamento: "DINHEIRO",
        valorPago: 50.0,
        valorRestante: 0.0,
        dataPagamento: "2025-05-17",
        status: "PAGO",
        numeroParcelas: 5,
        totalVenda: 50.0,
        totalDesconto: 0.0,
        totalPagamento: 50.0
      },
      dataVenda: "2025-05-17T23:45:00",
      status: "CONCLUIDO",
      vendaAnonima: false
    };

    try {
      const response: any = await enviarVenda(payload).unwrap();
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (e) {
      console.error("Erro ao enviar venda:", e);
    }

    try {
      const response: any = await enviarVenda(payload).unwrap();
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");

      setVendaConcluida(true);
    } catch (e) {
      console.error("Erro ao enviar venda:", e);
    }
  }

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
          <TextForm><strong>Nome:</strong> {cliente.pessoaFisica.nome}</TextForm>
          <TextForm><strong>CPF:</strong> {cliente.pessoaFisica.cpf}</TextForm>
          <TextForm><strong>Email:</strong> {cliente.pessoaFisica.email}</TextForm>
          <TextForm><strong>Telefone:</strong> {cliente.pessoaFisica.telefone}</TextForm>
        </div>
      )}

      {cliente?.pessoaJuridica && (
        <div>
          <TextForm><strong>Razão Social:</strong> {cliente.pessoaJuridica.razaoSocial}</TextForm>
          <TextForm><strong>CNPJ:</strong> {cliente.pessoaJuridica.cnpj}</TextForm>
          <TextForm><strong>Email:</strong> {cliente.pessoaJuridica.email}</TextForm>
          <TextForm><strong>Telefone:</strong> {cliente.pessoaJuridica.telefone}</TextForm>
        </div>
      )}

      <SectionTitle>Produtos</SectionTitle>
      <ul>
        {produtos.map((p) => {
          const preco = parseFloat(p.precoUnitario.toString().replace(',', '.'));
          const total = preco * p.quantidade;

          return (
            <ProdutoItem key={p.id}>
              {p.nome} - {p.quantidade} x R$ {preco.toFixed(2)} = R$ {total.toFixed(2)}
            </ProdutoItem>
          );
        })}
      </ul>
      <Total>Total: R$ {total.toFixed(2)}</Total>

      <ContainerSpace>
        <ContainerButton>
          <Button onClick={handleEnviarVenda} disabled={isLoading}>
            {isLoading ? <Loader /> : 'Finalizar Venda'}
          </Button>
        </ContainerButton>
        <ContainerButton>
          <Button onClick={handleAbrirEntrega}>Entrega</Button>
        </ContainerButton>
      </ContainerSpace>

      {isSuccess && <SuccessMessage>Venda enviada com sucesso!</SuccessMessage>}
      {isError && <ErrorMessage>Erro: {JSON.stringify(error)}</ErrorMessage>}

      <CheckboxContainer>
        <div style={{ display: 'block' }}>
          <label
            htmlFor="emitirNotaFiscal"
            onClick={(e) => {
              if (!isVendaConcluida) {
                e.preventDefault();
                alert('Conclua a venda antes de emitir a nota fiscal.');
              }
            }}
            style={{ cursor: !isVendaConcluida ? 'not-allowed' : 'pointer' }}
          >
            <div className="switch">
              <input
                type="checkbox"
                id="emitirNotaFiscal"
                checked={emitirNotaFiscal}
                onChange={() => setEmitirNotaFiscal(!emitirNotaFiscal)}
                disabled={!isVendaConcluida || isLoading}
              />
              <span className="slider" />
            </div>
            <span style={{ marginLeft: '8px' }}>
              {isLoading ? <Loader /> : 'Emitir Nota Fiscal'}
            </span>
          </label>

          {emitirNotaFiscal && <NfContainer />}
        </div>
      </CheckboxContainer>

    </Container>
  );
};

export default Venda;
