import React, { useState, useEffect } from 'react'
import InputMask from 'react-input-mask';
import Select from 'react-select';
import {
    Container,
    LeftPane,
    ProductList,
    RightPane,
    TableSelector,
    PdvButton,
    Wrapper,
    SwitchContainer,
    ToggleSwitch,
    Slider,
    Input,
    Title,
    Top
} from '../PDVmesa/styles';
import {
    ProdutoProps,
    useGetProdutosQuery,
    useLazyGetClientesByPhoneQuery,
    useAddVendaMutation,
    useCriarOuReutilizarMesaMutation,
    ClienteProps,
    useFinalizarMesaMutation,
    useAdicionarPedidoMutation,
    useSairParaEntregaMutation,
} from '../../services/api';
import NfContainer from '../NotaFiscal'
import plus from '../../assets/image/plus.svg'

type ItemVenda = {
    produtoId: number;
    nomeProduto: string;
    precoUnitario: number;
    quantidade: number;
    totalItem: number;
};

type Pagamento = {
    formaPagamento: string;
    valorPago: number;
    valorRestante: number;
    dataPagamento: string;
    status: string;
    numeroParcelas: number;
    totalVenda: number;
    totalDesconto: number;
    totalPagamento: number;
};

type VendaData = {
    emitirNotaFiscal: boolean;
    vendaAnonima: boolean;
    documentoCliente: string | null;
    cliente: any | null;
    emitenteId: number | null;
    modelo: string | null;
    itens: ItemVenda[];
    pagamento: Pagamento;
    dataVenda: string;
    status: string;
};



const VendaBalcao: React.FC = () => {
    const [showNf, setShowNf] = useState(false);
    const [showEnt, setShowEnt] = useState(false);
    const [clienteBusca, setClienteBusca] = useState('');
    const [produtoBusca, setProdutoBusca] = useState('');
    const [addVenda, { isLoading: enviandoVenda, error: erroVenda }] = useAddVendaMutation();
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [selectedValuePag, setSelectedValuePag] = useState<string | null>(null);
    const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionado[]>([]);
    const [setClienteEncontrado] = useState<ClienteProps | null>(null);
    const [dadosEntrega, setDadosEntrega] = useState<{ clienteBusca: string; produtosSelecionados: ProdutoSelecionado[] } | null>(null);
    const [addPedidoEntrega, { isLoading: enviandoPedido }] = useFinalizarMesaMutation();
    const [bloqueado, setBloqueado] = React.useState(false);
    const [criarOuReutilizarMesa] = useCriarOuReutilizarMesaMutation();
    const [adicionarPedido] = useAdicionarPedidoMutation();
    const [tipoAtendimento, setTipoAtendimento] = useState<'mesa' | 'entrega' | 'balcao'>('mesa');
    const [sairParaEntrega] = useSairParaEntregaMutation()

    type ProdutoSelecionado = ProdutoProps & { quantidade: number };

    const formatarApenasNumeros = (valor: string) => valor.replace(/\D/g, '');


    const gerarPayloadVenda = (
        clienteEncontrado: ClienteProps | null,
        produtosSelecionados: ProdutoSelecionado[],
        pagamento: Pagamento,
        somaProdutos: number,
        showNf: boolean,
    ): VendaData => {
        const agora = new Date().toISOString();

        return {
            emitirNotaFiscal: showNf,
            vendaAnonima: !clienteEncontrado,
            documentoCliente: clienteEncontrado?.documento || null,
            cliente: clienteEncontrado?.nome || null,
            emitenteId: 1,
            modelo: 'NFE',
            itens: produtosSelecionados.map((p) => ({
                produtoId: p.id,
                nomeProduto: p.nome,
                precoUnitario: p.precoUnitario,
                quantidade: p.quantidade,
                totalItem: p.precoUnitario * p.quantidade,
            })),
            pagamento: {
                formaPagamento: selectedValuePag || 'DINHEIRO',
                valorPago: somaProdutos,
                valorRestante: 0.00,
                dataPagamento: agora,
                status: 'PAGO',
                numeroParcelas: Number(selectedValue) || 1,
                totalVenda: somaProdutos,
                totalDesconto: totalComDesconto,
                totalPagamento: somaProdutos,
            },
            dataVenda: agora,
            status: 'EM_PREPARO',
        };
    };

    const pagamento: Pagamento = {
        formaPagamento: '',
        valorPago: 0,
        valorRestante: 0,
        dataPagamento: '',
        status: '',
        numeroParcelas: 0,
        totalVenda: 0,
        totalDesconto: 0,
        totalPagamento: 0,
    }

    const { data: produtos = [], isLoading, error } = useGetProdutosQuery();
    const [buscarCliente, { data: clienteEncontrado, isFetching: buscandoCliente, error: erroCliente }] =
        useLazyGetClientesByPhoneQuery();
    const [totalDesconto, setTotalDesconto] = React.useState(pagamento?.totalDesconto || '');



    const somaProdutos = produtosSelecionados.reduce(
        (total, p) => total + p.precoUnitario * p.quantidade,
        0
    );
    useEffect(() => {
        adicionarPedido
        const delayDebounce = setTimeout(() => {
            if (clienteBusca.trim().length >= 3) {
                buscarCliente(clienteBusca);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [clienteBusca, buscarCliente]);

    useEffect(() => {
        if (showEnt) {
            const clienteSalvo = localStorage.getItem('clienteBusca');
            const produtosSalvos = localStorage.getItem('produtosSelecionados');

            if (clienteSalvo && produtosSalvos) {
                setDadosEntrega({
                    clienteBusca: clienteSalvo,
                    produtosSelecionados: JSON.parse(produtosSalvos),
                });
            }
        }
    }, [showEnt]);

    useEffect(() => {
        if (clienteEncontrado) {
            localStorage.setItem('clienteEncontrado', JSON.stringify(clienteEncontrado));
        }
    }, [clienteEncontrado]);

    useEffect(() => {
        localStorage.setItem('clienteBusca', clienteBusca);
    }, [clienteBusca]);

    useEffect(() => {
        localStorage.setItem('produtosSelecionados', JSON.stringify(produtosSelecionados));
    }, [produtosSelecionados]);

    const agora = new Date().toISOString().slice(0, 16);
    useEffect(() => {
        const clienteSalvo = localStorage.getItem('clienteBusca');
        const produtosSalvos = localStorage.getItem('produtosSelecionados');

        if (clienteSalvo) setClienteBusca(clienteSalvo);
        if (produtosSalvos) setProdutosSelecionados(JSON.parse(produtosSalvos));
    }, []);

    const mesas = Array.from({ length: 20 }, (_, i) => i + 1);


    const handleFinalizarVenda = async () => {
        if (produtosSelecionados.length === 0) {
            alert('Adicione pelo menos um produto antes de finalizar a venda.');
            return;
        }

        if (!clienteBusca && !clienteEncontrado?.id) {
            alert('Informe o telefone ou selecione um cliente.');
            return;
        }

        const payload = gerarPayloadVenda(
            clienteEncontrado ?? null,
            produtosSelecionados,
            pagamento,
            somaProdutos,
            showNf,
        )
        try {
            console.log('payload final enviado:', JSON.stringify(payload, null, 2));
            await addVenda(payload).unwrap();
            alert('Venda finalizada com sucesso!');

            // NÃO limpar o estado, comentado:
            // setVendasPorMesa((prev) => {
            //     const copy = { ...prev };
            //     delete copy[mesaAtual];
            //     return copy;
            // });
            // setClienteBusca('');
            // setProdutosSelecionados([]);
            // setMesaAtual(null);
        } catch (error) {
            alert('Erro ao finalizar venda.');
        }
    }

    const handleAdicionarProduto = async (produto: ProdutoProps) => {
        setProdutosSelecionados((prev) => {
            const existente = prev.find(p => p.id === produto.id);
            if (existente) {
                return prev.map(p =>
                    p.id === produto.id ? { ...p, quantidade: p.quantidade + 1 } : p
                );
            } else {
                return [...prev, { ...produto, quantidade: 1 }];
            }
        });

        try {
            await adicionarPedido({
                itens: [{ produtoId: produto.id, quantidade: 1 }]
            }).unwrap();
        } catch (err) {
            console.error('Erro ao adicionar produto:');
        }
    }

    const opcoesPagamento = [
        { value: 'PIX', label: 'Pix' },
        { value: 'DINHEIRO', label: 'Dinheiro' },
        { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
        { value: 'CARTAO_DEBITO', label: 'Cartão de Débito' },
        { value: 'PARCELADO_LOJA', label: 'Parcelado Loja' },
        { value: 'CARTAO', label: 'Cartão Genérico' }
    ]

    const parcelas = [
        { value: '1', label: '1x' },
        { value: '2', label: '2x' },
        { value: '3', label: '3x' },
        { value: '4', label: '4x' },
        { value: '5', label: '5x' },
        { value: '6', label: '6x' }
    ]

    let descontoNumerico = 0;

    if (typeof totalDesconto === 'string') {
        descontoNumerico = parseFloat(totalDesconto.replace(',', '.')) || 0;
    } else {
        descontoNumerico = totalDesconto;
    }

    const totalComDesconto = somaProdutos - (isNaN(descontoNumerico) ? 0 : descontoNumerico);

    const limparEstado = () => {
        setClienteBusca('');
        setProdutosSelecionados([]);
    }

    return (
        <>
            {tipoAtendimento === 'mesa' && (
                <>
                    <Top>
                        <Title>Venda por Mesa</Title>
                    </Top>
                    <Container>
                        <LeftPane>
                            <div>
                                <InputMask
                                    mask="(99) 99999-9999"
                                    value={(clienteBusca)}
                                    onChange={(e) => setClienteBusca(formatarApenasNumeros(e.target.value))}
                                >
                                    {(inputProps: any) => (
                                        <Input
                                            {...inputProps}
                                            type="text"
                                            placeholder="Buscar cliente por telefone"
                                        />
                                    )}
                                </InputMask>
                                {buscandoCliente && <p>Buscando cliente...</p>}
                                {Boolean(erroCliente) && <p>Erro ao buscar cliente.</p>}

                                {clienteBusca.trim().length >= 3 && !buscandoCliente && (
                                    clienteEncontrado ? (
                                        <>
                                            <div>
                                                <Input
                                                    type="text"
                                                    id="nome"
                                                    value={clienteEncontrado?.pessoaFisica?.nome || ''}
                                                    readOnly
                                                    placeholder='Nome'
                                                />
                                            </div>
                                            <div>
                                                <InputMask
                                                    mask="999.999.999-99"
                                                    value={clienteEncontrado?.pessoaFisica?.cpf || ''}
                                                    onChange={(e) => setClienteBusca(formatarApenasNumeros(e.target.value))}
                                                >
                                                    {(inputProps: any) => (
                                                        <Input
                                                            {...inputProps}
                                                            type="text"
                                                            placeholder="telefone"
                                                        />
                                                    )}
                                                </InputMask>
                                            </div>
                                            <div>
                                                <InputMask
                                                    mask="(99) 99999-9999"
                                                    value={clienteEncontrado?.pessoaFisica?.telefone || ''}
                                                    onChange={(e) => setClienteBusca(formatarApenasNumeros(e.target.value))}
                                                >
                                                    {(inputProps: any) => (
                                                        <Input
                                                            {...inputProps}
                                                            type="text"
                                                            placeholder="telefone"
                                                        />
                                                    )}
                                                </InputMask>
                                                <div>
                                                    <Select
                                                        options={opcoesPagamento}
                                                        value={opcoesPagamento.find(op => op.value === selectedValue)}
                                                        onChange={option => setSelectedValuePag(option ? option.value : null)}
                                                        placeholder="Selecione uma forma de pagamento"
                                                    />
                                                </div>
                                                <div>
                                                    <Select
                                                        options={parcelas}
                                                        value={opcoesPagamento.find(op => op.value === selectedValue)}
                                                        onChange={option => setSelectedValue(option ? option.value : null)}
                                                        placeholder="Selecione parcelamento"
                                                    />

                                                </div>
                                                <div>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={totalDesconto}
                                                        placeholder="Valor desconto"
                                                        onChange={e => setTotalDesconto(e.target.value)}
                                                    />

                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <p>Nenhum cliente encontrado.</p>
                                    )
                                )}
                            </div>

                            <PdvButton onClick={() => alert('Cadastrar cliente')}>Cadastrar Cliente</PdvButton>

                            <div>
                                <h4>Produtos Selecionados:</h4>
                                <ul>
                                    {produtosSelecionados.map((produto, index) => (
                                        <li key={index}>
                                            {produto.nome} - R$ {produto.precoUnitario.toFixed(2)} x {produto.quantidade} = R$ {(produto.precoUnitario * produto.quantidade).toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <strong>Total:</strong> R$ {somaProdutos.toFixed(2)}
                            </div>
                            <div>
                                <strong>Desconto:</strong> R$ {(isNaN(descontoNumerico) ? 0 : descontoNumerico).toFixed(2)}
                            </div>
                            <div>
                                <strong>Total com desconto:</strong> R$ {totalComDesconto.toFixed(2)}
                            </div>
                            <PdvButton onClick={handleFinalizarVenda} disabled={enviandoVenda}>
                                {enviandoVenda ? 'Enviando...' : 'Finalizar Venda'}
                            </PdvButton>
                            <PdvButton onClick={limparEstado}>Limpar mesa</PdvButton>
                        </LeftPane>

                        <RightPane>
                            <Input
                                type="text"
                                placeholder="Buscar produto"
                                value={produtoBusca}
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setProdutoBusca(e.target.value)}
                            />

                            <ProductList>
                                {isLoading && <p>Carregando produtos...</p>}
                                {Boolean(error) && <p>Erro ao carregar produtos.</p>}
                                {!isLoading &&
                                    !error &&
                                    produtos
                                        .filter((produto: ProdutoProps) =>
                                            produto.nome.toLowerCase().includes(produtoBusca.toLowerCase())
                                        )
                                        .map((produto: ProdutoProps) => (
                                            <div key={produto.id} onClick={() => handleAdicionarProduto(produto)}>
                                                {produto.nome} - R$ {produto.precoUnitario.toFixed(2)}{' '}
                                                <span>
                                                    <img src={plus} alt="Adicionar" style={{ width: 20, height: 20 }} />
                                                </span>
                                            </div>
                                        ))}
                            </ProductList>
                        </RightPane>
                    </Container>
                </>
            )}
            <Wrapper>
                <SwitchContainer>
                    <span>Emitir Nota Fiscal</span>
                    <ToggleSwitch>
                        <input
                            type="checkbox"
                            checked={showNf}
                            onChange={() => setShowNf((prev) => !prev)}
                        />
                        <Slider />
                    </ToggleSwitch>
                </SwitchContainer>
            </Wrapper>
            {showNf && <NfContainer />}
        </>
    );
}

export default VendaBalcao;
