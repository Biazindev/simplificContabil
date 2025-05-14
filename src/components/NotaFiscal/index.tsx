import { useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
    PageContainer,
    Card,
    Title,
    Label,
    SectionHeader,
} from './styles'

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

const NotaFiscal = () => {
    const location = useLocation();
    const { cliente, produtos, venda } = location.state || {};

    if (!cliente || !produtos || !venda) {
        return <p>Dados da nota fiscal não foram fornecidos.</p>;
    }

    const isPF = cliente.tipo === 'pf';
    const pessoa = cliente;

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
                        <FieldBlock><Label>Email:</Label> {pessoa.email}</FieldBlock>
                    </FieldRow>
                    <FieldRow>
                        <FieldBlock><Label>Telefone:</Label> {pessoa.telefone}</FieldBlock>
                        {isPF ? (
                            <>
                                <FieldBlock><Label>Nome:</Label> {pessoa.nome}</FieldBlock>
                                <FieldBlock><Label>CPF:</Label> {pessoa.cpf}</FieldBlock>
                                <FieldBlock><Label>Data de Nascimento:</Label> {pessoa.dataNascimento}</FieldBlock>
                            </>
                        ) : (
                            <>
                                <FieldBlock><Label>Razão Social:</Label> {pessoa.razaoSocial}</FieldBlock>
                                <FieldBlock><Label>Nome Fantasia:</Label> {pessoa.nomeFantasia}</FieldBlock>
                                <FieldBlock><Label>CNPJ:</Label> {pessoa.cnpj}</FieldBlock>
                            </>
                        )}
                    </FieldRow>

                    <SectionHeader>
                        <h3>Produtos</h3>
                    </SectionHeader>
                    <Divider />

                    {produtos.map((produto: any, index: number) => {
                        const preco = parseFloat(produto.preco) || 0;
                        const quantidade = parseInt(produto.quantidade) || 0;
                        const total = preco * quantidade;

                        return (
                            <FieldRow key={index}>
                                <FieldBlock><Label>Produto:</Label> {produto.nome}</FieldBlock>
                                <FieldBlock><Label>Qtd:</Label> {quantidade}</FieldBlock>
                                <FieldBlock><Label>Preço Unitário:</Label> R$ {preco.toFixed(2)}</FieldBlock>
                                <FieldBlock><Label>Total:</Label> R$ {total.toFixed(2)}</FieldBlock>
                            </FieldRow>
                        );
                    })}

                    <SectionHeader>
                        <h3>Resumo da Venda</h3>
                    </SectionHeader>
                    <Divider />

                    <FieldRow>
                        <FieldBlock><Label>Data da Venda:</Label> {venda.data}</FieldBlock>
                        <FieldBlock><Label>Forma de Pagamento:</Label> {venda.formaPagamento}</FieldBlock>
                    </FieldRow>

                    <Divider />
                    <TotalBlock>R$ {produtos.reduce((acc: number, produto: any) => {
                        const preco = parseFloat(produto.preco) || 0;
                        const quantidade = parseInt(produto.quantidade) || 0;
                        return acc + preco * quantidade;
                    }, 0).toFixed(2)}</TotalBlock>
                </NotaWrapper>
            </Card>
        </PageContainer>
    );
};

export default NotaFiscal;
