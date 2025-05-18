import { useEffect, useState } from 'react'
import {
    Button,
    Container,
    ContainerButton,
    ErrorMessage,
    Form,
    Input,
    Label,
    SectionTitle,
    SuccessMessage,
} from '../Venda/styles';
import { RootState } from '../../store/reducers';
import { Message, Navbar, NavItem } from './styles'
import { useAddNfeMutation } from '../../services/api'
import { useDispatch, useSelector } from 'react-redux'
import { Produto, setCliente, setProdutos } from '../../store/reducers/vendaSlice'
import { Cliente, EmitirNotaPayload } from '../Venda/types';

const NfContainer = () => {
    const [selectedType, setSelectedType] = useState<'Nota Fiscal de Serviço' | 'Nota Fiscal' | 'Cupom Fiscal'>('Nota Fiscal de Serviço');
    const [enviarNota, { isLoading, isSuccess, isError, error, data: resposta }] = useAddNfeMutation();
    const cliente: Cliente | null = useSelector((state: RootState) => state.venda.cliente);
    const produtos: Produto[] = useSelector((state: RootState) => state.venda.produtos);
    const dispatch = useDispatch();

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
    }

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

    const handleEmitirNotaFiscal = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!cliente || produtos.length === 0) return;

        const payload: EmitirNotaPayload = {
            cpfCnpjTomador: cpf || cnpj,
            nomeTomador: nome || razaoSocial,
            telefone,
            email,
            endereco: {
                cep,
                bairro,
                municipio: 'Terra Boa',
                logradouro,
                numero,
                uf,
                complemento: null,
                codigoIbge: '4127205',
            },
            servico: {
                descricao: 'Programação de sistemas sob demanda',
                valor: 7284.13,
                codigoTributacaoMunicipal: '103',
                codigoTributacaoNacional: '103',
                cnae: '6209100',
                nbs: '123456000',
                informacoesComplementares:
                    'Sistema ERP desenvolvido sob demanda e entregue via repositório Git privado.',
                locPrest: {
                    cLocPrestacao: '4127205',
                    cPaisPrestacao: 'BR',
                },
                cServ: {
                    cTribNac: '103',
                    cTribMun: '103',
                    CNAE: '6209100',
                    xDescServ: 'Programação de sistemas sob demanda',
                    cNBS: '123456000',
                },
                infoCompl: {
                    xInfComp: 'Sistema ERP desenvolvido sob demanda e entregue via repositório Git privado.',
                    idDocTec: null,
                    docRef: null,
                },
            },
        };

        try {
            await enviarNota(payload).unwrap();
        } catch (e) {
            console.error('Erro ao emitir nota fiscal:', e);
        }
    };

    return (
        <Container>
            <Navbar>
                {['Nota Fiscal de Serviço', 'Nota Fiscal', 'Cupom Fiscal'].map((type) => (
                    <NavItem
                        key={type}
                        active={selectedType === type}
                        onClick={() => setSelectedType(type as 'Nota Fiscal de Serviço' | 'Nota Fiscal' | 'Cupom Fiscal')}
                    >
                        {type}
                    </NavItem>
                ))}
            </Navbar>

            {selectedType === 'Nota Fiscal de Serviço' && (
                <Form>
                    <SectionTitle>Nota Fiscal</SectionTitle>

                    {cliente?.pessoaFisica && (
                        <>
                            <Label>Nome</Label>
                            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
                            <Label>CPF</Label>
                            <Input value={cpf} onChange={(e) => setCpf(e.target.value)} />
                            <Label>Data de Nascimento</Label>
                            <Input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
                        </>
                    )}

                    {cliente?.pessoaJuridica && (
                        <>
                            <Label>Razão Social</Label>
                            <Input value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} />
                            <Label>Nome Fantasia</Label>
                            <Input value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} />
                            <Label>CNPJ</Label>
                            <Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
                        </>
                    )}

                    <Label>Email</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} />

                    <Label>Telefone</Label>
                    <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} />

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
                        <Button type="button" onClick={handleEmitirNotaFiscal}>
                            Emitir Nota
                        </Button>
                    </ContainerButton>

                    {isLoading && <Message>Emitindo nota...</Message>}
                    {isSuccess && resposta && <SuccessMessage>Nota emitida com sucesso</SuccessMessage>}
                    {isError && <ErrorMessage>Erro ao emitir nota: {JSON.stringify(error)}</ErrorMessage>}
                </Form>
            )}

            {selectedType === 'Nota Fiscal' && <Message>Formulário de NF será implementado aqui.</Message>}
            {selectedType === 'Cupom Fiscal' && <Message>Formulário de CF será implementado aqui.</Message>}
        </Container>
    );
};

export default NfContainer;
