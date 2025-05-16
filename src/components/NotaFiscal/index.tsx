import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
    PageContainer,
    Card,
    Title,
    Label,
    SectionHeader,
} from './styles';

const NotaWrapper = styled.div`
  font-family: 'Courier New', Courier, monospace;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px dashed #aaa;
  padding: ${({ theme }) => theme.spacing(4)};
  line-height: 1.6;
  font-size: 0.9rem;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px dashed ${({ theme }) => theme.colors.textLight};
  margin: ${({ theme }) => theme.spacing(2)} 0;
`;

const FieldRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const FieldBlock = styled.div`
  flex: 1 1 45%;
  min-width: 220px;
`;

const TotalBlock = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  text-align: right;
`;

const parseJSON = (key: string, fallback: any) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const Recibo = () => {
    const location = useLocation();
    const state = location.state || {};

    const cliente = state.cliente || parseJSON('cliente', {});
    const produtos = state.produtos || parseJSON('produtos', []);
    const venda = state.venda || parseJSON('venda', {});

    const tipo = (cliente.tipo || '').toLowerCase();
    const isPF = tipo === 'pf';

    console.log('cliente:', cliente);
    console.log('produtos:', produtos);
    console.log('venda:', venda);

    return (
        <PageContainer>
            <Card>
                <Title>Nota Fiscal</Title>
                <NotaWrapper>
                    <SectionHeader>
                        <h3>Dados do Cliente</h3>
                    </SectionHeader>
                    <Divider />

                    <FieldRow>
                        <FieldBlock><Label>Tipo de Pessoa:</Label> {isPF ? 'Pessoa Física' : 'Pessoa Jurídica'}</FieldBlock>
                        <FieldBlock><Label>Email:</Label> {cliente.email || 'N/A'}</FieldBlock>
                    </FieldRow>
                    <FieldRow>
                        <FieldBlock><Label>Telefone:</Label> {cliente.telefone || 'N/A'}</FieldBlock>

                        {isPF ? (
                            <>
                                <FieldBlock><Label>Nome:</Label> {cliente.nome || 'N/A'}</FieldBlock>
                                <FieldBlock><Label>CPF:</Label> {cliente.cpf || 'N/A'}</FieldBlock>
                                <FieldBlock><Label>Data de Nascimento:</Label> {cliente.dataNascimento || 'N/A'}</FieldBlock>
                            </>
                        ) : (
                            <>
                                <FieldBlock><Label>Razão Social:</Label> {cliente.razaoSocial || 'N/A'}</FieldBlock>
                                <FieldBlock><Label>Nome Fantasia:</Label> {cliente.nomeFantasia || 'N/A'}</FieldBlock>
                                <FieldBlock><Label>CNPJ:</Label> {cliente.cnpj || 'N/A'}</FieldBlock>
                            </>
                        )}
                    </FieldRow>

                    <SectionHeader>
                        <h3>Produtos</h3>
                    </SectionHeader>
                    <Divider />

                    {produtos.length > 0 ? produtos.map((produto: any, index: number) => {
                        const preco = parseFloat(produto.preco ?? '0') || 0;
                        const quantidade = parseInt(produto.quantidade ?? '0') || 0;
                        const total = preco * quantidade;

                        return (
                            <FieldRow key={index}>
                                <FieldBlock><Label>Produto:</Label> {produto.nome || 'N/A'}</FieldBlock>
                                <FieldBlock><Label>Qtd:</Label> {quantidade}</FieldBlock>
                                <FieldBlock><Label>Preço Unitário:</Label> R$ {preco.toFixed(2)}</FieldBlock>
                                <FieldBlock><Label>Total:</Label> R$ {total.toFixed(2)}</FieldBlock>
                            </FieldRow>
                        );
                    }) : <p>Nenhum produto informado.</p>}

                    <SectionHeader>
                        <h3>Resumo da Venda</h3>
                    </SectionHeader>
                    <Divider />

                    <FieldRow>
                        <FieldBlock><Label>Data da Venda:</Label> {venda.data || 'N/A'}</FieldBlock>
                        <FieldBlock><Label>Forma de Pagamento:</Label> {venda.formaPagamento || 'N/A'}</FieldBlock>
                    </FieldRow>

                    <Divider />
                    <TotalBlock>
                        Total: R$ {produtos.reduce((acc: number, produto: any) => {
                            const preco = parseFloat(produto.preco ?? '0') || 0;
                            const quantidade = parseInt(produto.quantidade ?? '0') || 0;
                            return acc + preco * quantidade;
                        }, 0).toFixed(2)}
                    </TotalBlock>
                </NotaWrapper>
            </Card>
        </PageContainer>
    );
};

export default Recibo;
